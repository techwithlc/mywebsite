export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: number; // in minutes
  category: BlogCategory;
  tags: string[];
  featured: boolean;
  language: 'en' | 'zh';
  slug: string;
  coverImage?: string;
}

export type BlogCategory = 'ai' | 'cloud' | 'career' | 'tutorials' | 'all';

export interface BlogFilter {
  category: BlogCategory;
  searchTerm: string;
}

export interface BlogMetrics {
  totalPosts: number;
  totalViews: number;
  averageReadTime: number;
} 