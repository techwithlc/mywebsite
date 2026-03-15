# TechwithLC — Personal Website

Personal site for Lawrence Chen. Built with React + Vite + Tailwind.

Live: [techwithLC.com](https://techwithLC.com)

## Stack

- **React + TypeScript** — UI
- **Vite** — build tool
- **Tailwind CSS** — styling
- **Netlify** — hosting
- **DOMPurify** — HTML sanitization for blog content

## Local Dev

```bash
npm install
npm run dev
```

## Writing a Blog Post

Add a `.md` file to `src/posts/`:

```markdown
---
title: "Your Post Title"
excerpt: "One-line summary shown in the list"
publishedAt: "2026-03-15"
readTime: 5
category: cloud        # ai | cloud | career | tutorials
tags: [AWS, SRE]
language: en           # en | zh
slug: your-post-slug
---

Post content in markdown...
```

Push to `main` → Netlify auto-deploys. No backend, no CMS, no database.

## Adding Daily News Digest

Edit `src/data/dailyNews.ts` — add a new entry at the top of the `digests` array:

```ts
{
  date: "2026-03-15",
  items: [
    {
      title: "中文標題",
      titleEn: "English title",
      summary: "中文摘要",
      summaryEn: "English summary",
      why: "為何重要",
      whyEn: "Why it matters",
      source: "Source Name",
      url: "https://...",
      time: "10:00 TST",
    },
  ],
  market: "市場快訊",
  marketEn: "Market pulse in English",
},
```

## Project Structure

```
src/
  posts/          ← blog posts (markdown)
  components/     ← UI components
  contexts/       ← LanguageContext (en/zh toggle)
  data/           ← dailyNews.ts (daily digest data)
  utils/          ← posts.ts (markdown loader)
  i18n/           ← translations
public/           ← static assets (hero image, favicon)
netlify.toml      ← build config + security headers
```

## Dark Mode

Toggle via the 🌙/☀️ button in the nav. Preference persisted to `localStorage`.
Light mode: clean minimal. Dark mode: Godfather/Sherlock — ink black + gold.
