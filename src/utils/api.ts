// API configuration for blog endpoints
// In production, if the API is on the same domain, use relative URLs
// Otherwise, use the configured URL or default to localhost for dev
const getApiBaseUrl = () => {
  // If explicitly set via env var, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }
  
  // In production, try to use same origin (if API is on same domain)
  // Otherwise fallback to relative path (if API is proxied)
  // You can also set this to your actual server URL if different domain
  return window.location.origin;
};

const API_BASE_URL = getApiBaseUrl();

export const BLOG_API = {
  // Get all published posts
  getPosts: async (params?: {
    language?: string;
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.language) queryParams.append('language', params.language);
      if (params?.category && params.category !== 'all') queryParams.append('category', params.category);
      if (params?.featured) queryParams.append('featured', 'true');
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const url = `${API_BASE_URL}/api/blog/posts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.posts || [];
      }
      throw new Error(data.message || 'Failed to fetch blog posts');
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Return empty array on error so UI doesn't break
      return [];
    }
  },

  // Get single post by slug
  getPostBySlug: async (slug: string) => {
    try {
      const url = `${API_BASE_URL}/api/blog/posts/${slug}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.post;
      }
      throw new Error(data.message || 'Failed to fetch blog post');
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },
};

export default BLOG_API;

