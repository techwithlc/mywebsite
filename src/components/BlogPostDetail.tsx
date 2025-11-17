import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Tag, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BLOG_API from '../utils/api';
import ReactMarkdown from 'react-markdown';

interface BlogPostDetailProps {
  slug: string;
  onBack: () => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ slug, onBack }) => {
  const { t, language } = useLanguage();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const postData = await BLOG_API.getPostBySlug(slug);
        setPost(postData);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-950 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Blog</span>
          </button>
          <div className="rounded-2xl border border-red-800/50 bg-red-950/20 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-200">Error</h2>
            <p className="text-red-300/80">{error || 'Post not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="mx-auto max-w-4xl px-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-slate-300 hover:border-cyan-400/70 hover:text-cyan-300 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{language === 'zh' ? '返回文章列表' : 'Back to Blog'}</span>
        </button>

        {/* Article Header */}
        <article className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-card overflow-hidden">
          {/* Cover Image */}
          {post.cover_image && (
            <div className="h-64 w-full overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block rounded-full border border-cyan-400/70 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-200">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-50 md:text-5xl">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at || post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="h-4 w-4" />
                <span>{post.read_time || post.readTime} {t.blog.readTime}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-200"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article Content (Markdown) */}
            <div className="prose prose-invert prose-slate max-w-none">
              <ReactMarkdown
                components={{
                  // Custom styling for markdown elements
                  h1: ({ node, ...props }) => (
                    <h1 className="mb-4 mt-8 text-3xl font-bold text-slate-50" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="mb-3 mt-6 text-2xl font-semibold text-slate-100" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="mb-2 mt-4 text-xl font-semibold text-slate-100" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-4 leading-relaxed text-slate-300" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-cyan-400 hover:text-cyan-300 underline" {...props} />
                  ),
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code
                        className="rounded bg-slate-900 px-1.5 py-0.5 text-sm text-cyan-300"
                        {...props}
                      />
                    ) : (
                      <code
                        className="block rounded-lg bg-slate-900 p-4 text-sm text-slate-200"
                        {...props}
                      />
                    ),
                  pre: ({ node, ...props }) => (
                    <pre className="mb-4 overflow-x-auto rounded-lg bg-slate-900 p-4" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="mb-4 ml-6 list-disc text-slate-300" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="mb-4 ml-6 list-decimal text-slate-300" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-2 text-slate-300" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="my-4 border-l-4 border-cyan-400/50 bg-slate-900/50 pl-4 italic text-slate-300"
                      {...props}
                    />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostDetail;

