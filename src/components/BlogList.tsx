import React, { useMemo } from 'react';
import { Clock, Calendar, Tag } from 'lucide-react';
import { BlogCategory, BlogFilter } from '../types/blog';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllPosts } from '../utils/posts';

interface BlogListProps {
  maxPosts?: number;
}

const BlogList: React.FC<BlogListProps> = ({ maxPosts }) => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = React.useState<BlogFilter>({ category: 'all', searchTerm: '' });

  const allPosts = useMemo(() => getAllPosts().filter(p => p.language === language), [language]);

  const filteredPosts = useMemo(() => {
    let result = filter.category === 'all'
      ? allPosts
      : allPosts.filter(p => p.category === filter.category);

    if (filter.searchTerm) {
      const q = filter.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    result = result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return maxPosts ? result.slice(0, maxPosts) : result;
  }, [allPosts, filter, maxPosts]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  const categories: { key: BlogCategory; label: string }[] = [
    { key: 'all', label: t.blog.categories.all },
    { key: 'ai', label: t.blog.categories.ai },
    { key: 'cloud', label: t.blog.categories.cloud },
    { key: 'career', label: t.blog.categories.career },
    { key: 'tutorials', label: t.blog.categories.tutorials },
  ];

  const navigate = (slug: string) => {
    window.location.hash = `blog/${slug}`;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  if (allPosts.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        {language === 'en' ? 'No posts yet — check back soon.' : '目前還沒有文章，請稍後再來。'}
      </p>
    );
  }

  return (
    <div className="w-full">
      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.filter(c => c.key === 'all' || allPosts.some(p => p.category === c.key)).map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilter(f => ({ ...f, category: cat.key }))}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              filter.category === cat.key
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="space-y-0">
        {filteredPosts.map((post, i) => (
          <div key={post.id}>
            {i > 0 && <hr className="border-gray-100" />}
            <article
              className="group cursor-pointer py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
              onClick={() => navigate(post.slug)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(post.slug)}
              tabIndex={0}
              role="button"
              aria-label={post.title}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
                      {categories.find(c => c.key === post.category)?.label || post.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime} {t.blog.readTime}
                    </span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="inline-flex items-center gap-0.5 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                          <Tag className="h-2.5 w-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="mt-1 text-gray-300 group-hover:text-emerald-400 transition-colors flex-shrink-0 text-lg">→</span>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
