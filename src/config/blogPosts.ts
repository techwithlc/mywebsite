import { BlogPost } from '../types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with AWS CloudFormation Infrastructure as Code',
    excerpt: 'Learn how to automate your AWS infrastructure deployment using CloudFormation templates and best practices for scalable cloud architecture.',
    content: `# Getting Started with AWS CloudFormation Infrastructure as Code

AWS CloudFormation is a service that helps you model and set up your Amazon Web Services resources so that you can spend less time managing those resources and more time focusing on your applications that run in AWS.

## What is Infrastructure as Code?

Infrastructure as Code (IaC) is the process of managing and provisioning computing infrastructure through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools.

## Benefits of CloudFormation

1. **Consistency**: Templates ensure consistent resource configuration
2. **Version Control**: Infrastructure changes can be tracked
3. **Rollback**: Easy rollback to previous infrastructure states
4. **Cost Management**: Better understanding of resource costs

## Basic Template Structure

\`\`\`yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'My first CloudFormation template'

Resources:
  MyS3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-unique-bucket-name
\`\`\`

This is just the beginning of your CloudFormation journey. In upcoming posts, we'll dive deeper into advanced features like nested stacks, custom resources, and deployment strategies.`,
    author: 'Lawrence Chen',
    publishedAt: '2024-01-15',
    readTime: 8,
    category: 'cloud',
    tags: ['AWS', 'CloudFormation', 'Infrastructure', 'DevOps'],
    featured: true,
    language: 'en',
    slug: 'aws-cloudformation-getting-started',
    coverImage: '/images/blog/cloudformation-cover.jpg'
  },
  {
    id: '2',
    title: 'AI 時代的軟體工程師職涯規劃',
    excerpt: '探討在人工智慧快速發展的時代，軟體工程師如何調整職涯方向，掌握新技能並保持競爭力。',
    content: `# AI 時代的軟體工程師職涯規劃

人工智慧技術的快速發展正在改變軟體開發的格局。作為軟體工程師，我們需要重新思考職涯規劃，以適應這個變化快速的時代。

## 核心技能的轉變

### 1. 從純開發到 AI 協作
- 學會與 AI 工具協作
- 掌握 Prompt Engineering
- 理解 AI 的局限性

### 2. 系統思維的重要性
- 架構設計能力
- 性能優化
- 安全性考量

## 新興技能需求

### Machine Learning 基礎
即使不是 ML 工程師，理解基本的機器學習概念也變得重要：
- 數據預處理
- 模型評估
- MLOps 流程

### 雲原生技術
- 容器化部署
- 微服務架構
- 無伺服器計算

## 實用建議

1. **持續學習**：保持對新技術的敏感度
2. **實作項目**：將學習轉化為實際項目
3. **社群參與**：加入技術社群，分享經驗
4. **跨領域合作**：與不同背景的專家合作

記住，AI 是工具，不是替代品。專注於提升解決問題的能力，而不只是技術本身。`,
    author: '陳冠倫',
    publishedAt: '2024-01-10',
    readTime: 6,
    category: 'career',
    tags: ['AI', '職涯規劃', '軟體工程', '技能發展'],
    featured: true,
    language: 'zh',
    slug: 'ai-era-software-engineer-career',
    coverImage: '/images/blog/ai-career-cover.jpg'
  },
  {
    id: '3',
    title: 'Building Scalable React Applications with TypeScript',
    excerpt: 'Best practices for structuring large-scale React applications using TypeScript, including component architecture, state management, and testing strategies.',
    content: `# Building Scalable React Applications with TypeScript

Creating maintainable and scalable React applications requires careful planning and adherence to best practices. TypeScript adds an extra layer of type safety that becomes invaluable as your application grows.

## Project Structure

\`\`\`
src/
├── components/
│   ├── common/
│   └── pages/
├── hooks/
├── services/
├── types/
├── utils/
└── contexts/
\`\`\`

## Component Design Principles

### 1. Single Responsibility
Each component should have one clear purpose and responsibility.

### 2. Composition over Inheritance
Use component composition to build complex UIs from simpler parts.

### 3. Props Interface Design
\`\`\`typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
\`\`\`

## State Management Strategies

### Local State with useState
For component-specific state that doesn't need to be shared.

### Context API
For state that needs to be shared across multiple components in a subtree.

### External Libraries
Consider Redux Toolkit or Zustand for complex global state management.

## Performance Optimization

1. **React.memo**: Prevent unnecessary re-renders
2. **useMemo and useCallback**: Memoize expensive calculations
3. **Code Splitting**: Load components lazily with React.lazy

Building scalable applications is an iterative process. Start simple and refactor as your application grows.`,
    author: 'Lawrence Chen',
    publishedAt: '2024-01-05',
    readTime: 10,
    category: 'tutorials',
    tags: ['React', 'TypeScript', 'Frontend', 'Architecture'],
    featured: false,
    language: 'en',
    slug: 'scalable-react-typescript-applications',
    coverImage: '/images/blog/react-typescript-cover.jpg'
  },
  {
    id: '4',
    title: 'Docker 容器化部署完整指南',
    excerpt: '從基礎概念到實際應用，學習如何使用 Docker 容器化你的應用程式，包含 Dockerfile 編寫、映像檔優化和部署策略。',
    content: `# Docker 容器化部署完整指南

Docker 已經成為現代應用程式部署的標準工具。本文將帶你從零開始學習 Docker 的使用。

## 什麼是 Docker？

Docker 是一個開源的容器化平台，讓開發者可以將應用程式及其依賴項目打包到一個可移植的容器中。

## 核心概念

### 映像檔 (Image)
唯讀的模板，用來創建容器。

### 容器 (Container)
映像檔的執行實例，包含應用程式和所有依賴項目。

### Dockerfile
用來建構映像檔的腳本檔案。

## 實際範例

### 簡單的 Node.js 應用程式 Dockerfile

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
\`\`\`

## 最佳實踐

### 1. 多階段建構
減小最終映像檔大小：

\`\`\`dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
CMD ["npm", "start"]
\`\`\`

### 2. 使用 .dockerignore
避免將不必要的檔案複製到容器中：

\`\`\`
node_modules
npm-debug.log
.git
.gitignore
README.md
\`\`\`

## Docker Compose

對於多服務應用程式，使用 Docker Compose：

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: password
\`\`\`

掌握 Docker 將大大提升你的開發和部署效率。`,
    author: '陳冠倫',
    publishedAt: '2023-12-28',
    readTime: 12,
    category: 'tutorials',
    tags: ['Docker', '容器化', 'DevOps', '部署'],
    featured: false,
    language: 'zh',
    slug: 'docker-containerization-guide',
    coverImage: '/images/blog/docker-cover.jpg'
  }
];

// Helper function to get posts by language
export const getPostsByLanguage = (language: 'en' | 'zh'): BlogPost[] => {
  return blogPosts.filter(post => post.language === language);
};

// Helper function to get featured posts
export const getFeaturedPosts = (language: 'en' | 'zh'): BlogPost[] => {
  return blogPosts.filter(post => post.language === language && post.featured);
};

// Helper function to get posts by category
export const getPostsByCategory = (category: string, language: 'en' | 'zh'): BlogPost[] => {
  if (category === 'all') {
    return getPostsByLanguage(language);
  }
  return blogPosts.filter(post => post.language === language && post.category === category);
}; 