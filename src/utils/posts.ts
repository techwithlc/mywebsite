import { BlogPost, BlogCategory } from '../types/blog';

// Load all markdown files from src/posts/
const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function parseFrontmatter(raw: string): { meta: Record<string, any>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta: Record<string, any> = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: any = line.slice(colonIdx + 1).trim();

    // arrays: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s: string) => s.trim());
    }
    // booleans
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    // numbers
    else if (!isNaN(Number(value)) && value !== '') value = Number(value);
    // strip surrounding quotes
    else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    meta[key] = value;
  }

  return { meta, content: match[2].trim() };
}

// Minimal markdown → HTML (enough for blog posts)
function mdToHtml(md: string): string {
  return md
    // headings
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-gray-900">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-gray-900">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h1>')
    // bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // inline code
    .replace(/`([^`]+)`/g, '<code class="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">$1</code>')
    // bullet lists — group consecutive lines
    .replace(/((?:^- .+\n?)+)/gm, (block) => {
      const items = block.trim().split('\n').map(l => `<li class="ml-4 list-disc">${l.slice(2)}</li>`).join('');
      return `<ul class="my-3 space-y-1 text-gray-700">${items}</ul>`;
    })
    // numbered lists
    .replace(/((?:^\d+\. .+\n?)+)/gm, (block) => {
      const items = block.trim().split('\n').map(l => `<li class="ml-4 list-decimal">${l.replace(/^\d+\. /, '')}</li>`).join('');
      return `<ol class="my-3 space-y-1 text-gray-700">${items}</ol>`;
    })
    // paragraphs (lines not already wrapped)
    .replace(/^(?!<[houlab]|$)(.+)$/gm, '<p class="my-3 leading-relaxed text-gray-700">$1</p>')
    // horizontal rule
    .replace(/^---$/gm, '<hr class="my-6 border-gray-200" />');
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getAllPosts(): BlogPost[] {
  return Object.entries(modules).map(([path, raw]) => {
    const { meta, content } = parseFrontmatter(raw);
    const slug = meta.slug || path.replace(/.*\/(.+)\.md$/, '$1');
    return {
      id: slug,
      slug,
      title: meta.title || slug,
      excerpt: meta.excerpt || content.slice(0, 120) + '…',
      content: mdToHtml(content),
      author: 'Lawrence Chen',
      publishedAt: meta.publishedAt || '2024-01-01',
      readTime: meta.readTime || estimateReadTime(content),
      category: (meta.category || 'cloud') as BlogCategory,
      tags: meta.tags || [],
      featured: meta.featured || false,
      language: (meta.language || 'en') as 'en' | 'zh',
      coverImage: meta.coverImage,
    };
  });
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug);
}
