# TechwithLC — Personal Website

Personal site for Lawrence Chen. Built with React + Vite + Tailwind.

Live: [techwithLC.com](https://techwithLC.com)

## Stack

- **React + TypeScript** — UI
- **Vite** — build tool
- **Tailwind CSS** — styling
- **Netlify** — hosting + serverless functions (newsletter subscribe)

## Local Dev

```bash
pnpm install
pnpm dev
```

## Writing a Blog Post

Add a `.md` file to `src/posts/`:

```markdown
---
title: "Your Post Title"
excerpt: "One-line summary shown in the list"
publishedAt: "2025-03-11"
readTime: 5
category: cloud        # ai | cloud | career | tutorials
tags: [AWS, SRE]
language: en           # en | zh
slug: your-post-slug
---

Post content in markdown...
```

That's it — no backend, no CMS. Just push to main and Netlify deploys it.

## Project Structure

```
src/
  posts/          ← blog posts (markdown)
  components/     ← BlogList, BlogPostDetail, EmbedFacade, SponsorSection
  contexts/       ← LanguageContext (en/zh toggle, persisted to localStorage)
  utils/          ← posts.ts (markdown loader)
  i18n/           ← translations
netlify/
  functions/      ← subscribe (newsletter)
public/           ← static assets
```
