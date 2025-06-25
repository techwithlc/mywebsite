import React, { useState, useMemo } from 'react';
import { Search, Clock, Calendar, Tag, ExternalLink } from 'lucide-react';
import { BlogPost, BlogCategory, BlogFilter } from '../types/blog';
import { getPostsByLanguage, getPostsByCategory } from '../config/blogPosts';
import { useLanguage } from '../contexts/LanguageContext';

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

  // Use provided posts or get from config
  const allPosts = propsPosts || getPostsByLanguage(language);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    let result = filter.category === 'all' 
      ? allPosts 
      : getPostsByCategory(filter.category, language);

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
  }, [allPosts, filter, language, maxPosts]);

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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.blog.search.placeholder}
              value={filter.searchTerm}
              onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setFilter(prev => ({ ...prev, category: category.key }))}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter.category === category.key
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {filter.searchTerm && (
            <p className="text-sm text-gray-600">
              {filteredPosts.length} {t.blog.search.results}
            </p>
          )}
        </div>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {t.blog.search.noResults}
          </h3>
          <p className="text-gray-500">
            {language === 'zh' ? '嘗試調整搜尋條件或分類篩選' : 'Try adjusting your search terms or category filter'}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full group"
            >
              {/* Cover Image */}
              {post.coverImage ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <ExternalLink className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-indigo-600 font-medium">Blog Post</p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full border border-indigo-200 font-medium">
                    {categories.find(cat => cat.key === post.category)?.label || post.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold mb-3 text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className="space-y-3 mt-auto">
                  {/* Date and Read Time */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
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
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Read More Button */}
                  <button className="w-full mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all duration-300 font-medium">
                    {t.blog.readMore}
                  </button>
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