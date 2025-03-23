import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchAndSummarizeNews } from './newsService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rssFilePath = path.join(__dirname, '..', 'public', 'ai-news-feed.xml');
const jsonFeedPath = path.join(__dirname, '..', 'public', 'ai-news-feed.json');

/**
 * Generate RSS feed from news content
 */
function generateRSSFeed(newsContent, articles) {
  const items = articles.map((article, index) => {
    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(article.url)}</link>
      <guid>${escapeXml(article.url)}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <source url="${escapeXml(article.source.url || '')}">${escapeXml(article.source.name)}</source>
      <description><![CDATA[${article.description || ''}]]></description>
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TechwithLC AI News</title>
    <link>https://techwithlc.com/ai-news</link>
    <description>Latest AI news curated and summarized by TechwithLC</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://techwithlc.com/ai-news-feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>https://techwithlc.com/logo.png</url>
      <title>TechwithLC AI News</title>
      <link>https://techwithlc.com/ai-news</link>
    </image>
${items}
  </channel>
</rss>`;

  return rss;
}

/**
 * Generate JSON Feed (modern alternative to RSS)
 */
function generateJSONFeed(newsContent, articles) {
  const items = articles.map(article => {
    return {
      id: article.url,
      url: article.url,
      title: article.title,
      content_html: article.description || '',
      summary: article.description || '',
      date_published: article.publishedAt,
      author: {
        name: article.source.name
      }
    };
  });

  const jsonFeed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "TechwithLC AI News",
    home_page_url: "https://techwithlc.com/ai-news",
    feed_url: "https://techwithlc.com/ai-news-feed.json",
    description: "Latest AI news curated and summarized by TechwithLC",
    authors: [
      {
        name: "TechwithLC",
        url: "https://techwithlc.com"
      }
    ],
    language: "en-US",
    items: items
  };

  return JSON.stringify(jsonFeed, null, 2);
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Create directory if it doesn't exist
 */
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

/**
 * Update RSS and JSON feeds with latest AI news
 */
export async function updateFeeds() {
  try {
    console.log('Updating RSS and JSON feeds with latest AI news...');
    
    // Ensure public directory exists
    ensureDirectoryExists(rssFilePath);
    
    // Fetch and summarize news
    const newsContent = await fetchAndSummarizeNews();
    
    // Generate RSS feed
    const rssFeed = generateRSSFeed(newsContent, newsContent.articles);
    fs.writeFileSync(rssFilePath, rssFeed);
    
    // Generate JSON feed
    const jsonFeed = generateJSONFeed(newsContent, newsContent.articles);
    fs.writeFileSync(jsonFeedPath, jsonFeed);
    
    console.log('RSS and JSON feeds updated successfully');
    return {
      success: true,
      rssPath: rssFilePath,
      jsonPath: jsonFeedPath,
      articleCount: newsContent.articles.length
    };
  } catch (error) {
    console.error('Error updating feeds:', error);
    
    // Create placeholder feeds in case of error
    createPlaceholderFeeds();
    
    return {
      success: false,
      error: error.message,
      fallback: true
    };
  }
}

/**
 * Create placeholder feeds when API calls fail
 */
function createPlaceholderFeeds() {
  try {
    ensureDirectoryExists(rssFilePath);
    
    // Create placeholder RSS feed
    const placeholderRSS = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>TechwithLC AI News</title>
    <link>https://techwithlc.com/ai-news</link>
    <description>Latest AI news curated and summarized by TechwithLC</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <item>
      <title>AI News Coming Soon</title>
      <link>https://techwithlc.com</link>
      <guid>https://techwithlc.com/placeholder</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description><![CDATA[Stay tuned for the latest AI news and insights.]]></description>
    </item>
  </channel>
</rss>`;
    
    fs.writeFileSync(rssFilePath, placeholderRSS);
    
    // Create placeholder JSON feed
    const placeholderJSON = {
      version: "https://jsonfeed.org/version/1.1",
      title: "TechwithLC AI News",
      home_page_url: "https://techwithlc.com/ai-news",
      feed_url: "https://techwithlc.com/ai-news-feed.json",
      description: "Latest AI news curated and summarized by TechwithLC",
      items: [{
        id: "https://techwithlc.com/placeholder",
        url: "https://techwithlc.com",
        title: "AI News Coming Soon",
        content_html: "Stay tuned for the latest AI news and insights.",
        date_published: new Date().toISOString()
      }]
    };
    
    fs.writeFileSync(jsonFeedPath, JSON.stringify(placeholderJSON, null, 2));
    console.log('Created placeholder feeds successfully');
  } catch (error) {
    console.error('Error creating placeholder feeds:', error);
  }
}

/**
 * Get the latest RSS feed content
 */
export function getRSSFeed() {
  try {
    if (fs.existsSync(rssFilePath)) {
      return fs.readFileSync(rssFilePath, 'utf8');
    }
    return null;
  } catch (error) {
    console.error('Error reading RSS feed:', error);
    return null;
  }
}

/**
 * Get the latest JSON feed content
 */
export function getJSONFeed() {
  try {
    if (fs.existsSync(jsonFeedPath)) {
      return fs.readFileSync(jsonFeedPath, 'utf8');
    }
    return null;
  } catch (error) {
    console.error('Error reading JSON feed:', error);
    return null;
  }
}
