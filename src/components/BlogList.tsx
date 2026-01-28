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
  maxPosts,
}) => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<BlogFilter>({
    category: 'all',
    searchTerm: '',
  });
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from API
  useEffect(() => {
    if (propsPosts && propsPosts.length > 0) {
      setAllPosts(propsPosts);
      setIsLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const posts = await BLOG_API.getPosts({
          limit: maxPosts || 100,
        });

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
          .filter((post: BlogPost) => post.language === language);

        if (transformedPosts.length === 0) {
          setError(null);
        }
        setAllPosts(transformedPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        const errorMessage =
          err instanceof Error ? err.message : t.blog.loadError;

        if (
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('NetworkError')
        ) {
          setError(t.serverHint[language]);
        } else {
          setError(errorMessage);
        }
        setAllPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [language, maxPosts, propsPosts, t]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let result =
      filter.category === 'all'
        ? allPosts
        : allPosts.filter((post) => post.category === filter.category);

    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (maxPosts) {
      result = result.slice(0, maxPosts);
    }

    return result.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [allPosts, filter, maxPosts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const categories: { key: BlogCategory; label: string }[] = [
    { key: 'all', label: t.blog.categories.all },
    { key: 'ai', label: t.blog.categories.ai },
    { key: 'cloud', label: t.blog.categories.cloud },
    { key: 'career', label: t.blog.categories.career },
    { key: 'tutorials', label: t.blog.categories.tutorials },
  ];

  return (
    <div className="w-full">
      {/* Search and Filter Section */}
      {showSearch && (
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 transform h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.blog.search.placeholder}
              value={filter.searchTerm}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
              className="w-full rounded-full border border-gray-200 bg-white px-12 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() =>
                  setFilter((prev) => ({ ...prev, category: category.key }))
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filter.category === category.key
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {filter.searchTerm && (
            <p className="text-sm text-gray-500">
              {filteredPosts.length} {t.blog.search.results}
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
          <p className="text-sm text-gray-500">{t.blog.loading}</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Search className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-red-600">
            {t.blog.errorTitle}
          </h3>
          <p className="text-sm text-red-500">{error}</p>
          <p className="mt-2 text-xs text-gray-500">{t.serverHint[language]}</p>
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && !error && filteredPosts.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-gray-700">
            {t.blog.search.noResults}
          </h3>
          <p className="text-sm text-gray-500">{t.blog.tryAdjust}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              {/* Cover Image */}
              {post.coverImage ? (
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                      <ExternalLink className="h-6 w-6 text-emerald-500" />
                    </div>
                    <p className="text-xs font-medium text-gray-500">
                      {t.blog.blogPostPlaceholder}
                    </p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex flex-grow flex-col p-5">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    {categories.find((cat) => cat.key === post.category)
                      ?.label || post.category}
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
                  className="mb-2 cursor-pointer text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors block"
                >
                  {post.title}
                </a>

                {/* Excerpt */}
                <p className="mb-4 flex-grow text-sm leading-relaxed text-gray-600">
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="space-y-3 mt-auto">
                  {/* Date and Read Time */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {post.readTime} {t.blog.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{post.tags.length - 3} {t.blog.moreTags}
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
                    className="mt-4 block w-full rounded-full bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
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
