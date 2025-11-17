import React, { useState, useMemo, useEffect } from 'react';
import { Search, Clock, Calendar, Tag, ExternalLink } from 'lucide-react';
import { BlogPost, BlogCategory, BlogFilter } from '../types/blog';
import { useLanguage } from '../contexts/LanguageContext';
import BLOG_API from '../utils/api';

interface BlogListProps {
  posts?: BlogPost[];
  showSearch?: boolean;
  maxPosts?: number;
}

const BlogList: React.FC<BlogListProps> = ({ 
  posts: propsPosts, 
  showSearch = true, 
  maxPosts 
}) => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<BlogFilter>({
    category: 'all',
    searchTerm: ''
  });
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from API
  useEffect(() => {
    // If posts are provided via props, use them (for backward compatibility)
    if (propsPosts && propsPosts.length > 0) {
      setAllPosts(propsPosts);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch from API
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch posts without language filter to get all posts
        // We'll filter by language on the frontend
        const posts = await BLOG_API.getPosts({
          // Don't filter by language - get all posts
          limit: maxPosts || 100, // Fetch enough posts for filtering
        });
        
        // Transform API response to match BlogPost interface
        const transformedPosts: BlogPost[] = posts
          .map((post: any) => ({
            id: post.id.toString(),
            title: post.title,
            excerpt: post.excerpt,
            content: post.content || '',
            author: post.author,
            publishedAt: post.published_at || post.publishedAt,
            updatedAt: post.updated_at || post.updatedAt,
          readTime: post.read_time || post.readTime || 5,
            category: post.category as BlogCategory,
            tags: post.tags || [],
            featured: post.featured || false,
            language: post.language as 'en' | 'zh',
            slug: post.slug,
            coverImage: post.cover_image || post.coverImage,
          }))
          // Filter by current language on frontend
          .filter((post: BlogPost) => post.language === language);
        
        if (transformedPosts.length === 0) {
          setError(null); // No error, just no posts
        }
        setAllPosts(transformedPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to load blog posts';
        
        // More user-friendly error messages
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
          setError(language === 'zh' 
            ? '無法連接到伺服器。請確認後端服務器是否正在運行。' 
            : 'Cannot connect to server. Please check if the backend server is running.');
        } else {
          setError(errorMessage);
        }
        // Fallback to empty array
        setAllPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [language, maxPosts, propsPosts]);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    let result = filter.category === 'all' 
      ? allPosts 
      : allPosts.filter(post => post.category === filter.category);

    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply max posts limit if specified
    if (maxPosts) {
      result = result.slice(0, maxPosts);
    }

    return result.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [allPosts, filter, maxPosts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categories: { key: BlogCategory; label: string }[] = [
    { key: 'all', label: t.blog.categories.all },
    { key: 'ai', label: t.blog.categories.ai },
    { key: 'cloud', label: t.blog.categories.cloud },
    { key: 'career', label: t.blog.categories.career },
    { key: 'tutorials', label: t.blog.categories.tutorials }
  ];

  return (
    <div className="w-full">
      {/* Search and Filter Section */}
      {showSearch && (
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t.blog.search.placeholder}
              value={filter.searchTerm}
              onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-10 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setFilter(prev => ({ ...prev, category: category.key }))}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  filter.category === category.key
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/70 shadow-[0_0_18px_rgba(56,189,248,0.4)]'
                    : 'bg-slate-950/60 text-slate-300 border border-slate-700 hover:border-cyan-400/60 hover:bg-slate-900'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {filter.searchTerm && (
            <p className="text-sm text-slate-400">
              {filteredPosts.length} {t.blog.search.results}
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-700">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          </div>
          <p className="text-sm text-slate-400">Loading blog posts...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-900/20 border border-red-700/50">
            <Search className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-red-200">
            Error loading posts
          </h3>
          <p className="text-sm text-red-300/80">{error}</p>
          <p className="mt-2 text-xs text-slate-400">
            {language === 'zh' 
              ? '請確認後端服務器是否運行（在 server 目錄執行 npm start）' 
              : 'Please check if the backend server is running (run npm start in server directory)'}
          </p>
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && !error && filteredPosts.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-slate-700">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-slate-200">
            {t.blog.search.noResults}
          </h3>
          <p className="text-sm text-slate-400">
            {language === 'zh' ? '嘗試調整搜尋條件或分類篩選' : 'Try adjusting your search terms or category filter'}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-card hover:border-cyan-400/70 hover:shadow-[0_0_28px_rgba(56,189,248,0.45)] transition-all duration-300"
            >
              {/* Cover Image */}
              {post.coverImage ? (
                <div className="h-40 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-700">
                      <ExternalLink className="h-6 w-6 text-cyan-300" />
                    </div>
                    <p className="text-xs font-medium text-slate-300">Blog Post</p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex flex-grow flex-col p-5">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block rounded-full border border-cyan-400/70 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    {categories.find(cat => cat.key === post.category)?.label || post.category}
                  </span>
                </div>

                {/* Title */}
                <a 
                  href={`#blog/${post.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = `blog/${post.slug}`;
                    window.dispatchEvent(new HashChangeEvent('hashchange'));
                  }}
                  className="mb-2 cursor-pointer text-lg font-semibold text-slate-50 hover:text-cyan-300 transition-colors block"
                >
                  {post.title}
                </a>

                {/* Excerpt */}
                <p className="mb-4 flex-grow text-sm leading-relaxed text-slate-300/85">
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="space-y-3 mt-auto">
                  {/* Date and Read Time */}
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} {t.blog.readTime}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900/80 px-2 py-1 text-[0.7rem] text-slate-200"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-slate-500">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Read More Button */}
                  <a
                    href={`#blog/${post.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = `blog/${post.slug}`;
                      window.dispatchEvent(new HashChangeEvent('hashchange'));
                    }}
                    className="mt-4 block w-full rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 px-4 py-2 text-center text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.55)] hover:shadow-[0_0_26px_rgba(236,72,153,0.6)] transition-all"
                  >
                    {t.blog.readMore}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList; 