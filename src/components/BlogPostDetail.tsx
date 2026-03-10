import React, { useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Tag, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getPostBySlug } from '../utils/posts';

interface BlogPostDetailProps {
  slug: string;
  onBack: () => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ slug, onBack }) => {
  const { t, language } = useLanguage();
  const post = getPostBySlug(slug);

  useEffect(() => {
    const prev = document.title;
    document.title = post ? `${post.title} — TechwithLC` : 'TechwithLC';
    return () => { document.title = prev; };
  }, [post]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  if (!post) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="mx-auto max-w-2xl px-6">
          <button onClick={onBack} className="mb-8 flex items-center gap-2 text-emerald-600 hover:text-emerald-500 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>{language === 'zh' ? '返回' : 'Back'}</span>
          </button>
          <p className="text-sm text-gray-500">{t.blogDetail.notFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <button
          onClick={onBack}
          className="mb-10 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === 'zh' ? '返回' : 'Back'}
        </button>

        <article>
          {/* Category */}
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400 border-b border-gray-100 pb-6">
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime} {t.blog.readTime}</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  <Tag className="h-2.5 w-2.5" />{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="mt-8 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
};

export default BlogPostDetail;
