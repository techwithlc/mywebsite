import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

// Initialize OpenAI client with fallback for CI environment
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build-process',
  });
} catch (error) {
  console.warn('Warning: OpenAI initialization failed. News feed generation may not work.');
  // Create a mock client for build process
  openai = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{
            message: {
              content: '<h1>AI News Placeholder</h1><p>This content will be replaced with real AI news summaries in production.</p>'
            }
          }]
        })
      }
    }
  };
}

/**
 * Fetch the latest AI news from News API
 */
export async function fetchLatestAINews(count = 5, forceRefresh = true) {
  try {
    if (!process.env.NEWS_API_KEY) {
      console.warn('NEWS_API_KEY is missing. Using mock data for build process.');
      return Array(count).fill().map((_, i) => ({
        title: `Mock AI News Article ${i+1}`,
        source: { name: 'TechWithLC' },
        publishedAt: new Date().toISOString(),
        url: 'https://techwithlc.com',
        content: 'This is placeholder content for building purposes only.'
      }));
    }
    
    // Add a timestamp to prevent caching
    const timestamp = forceRefresh ? `&_t=${Date.now()}` : '';
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'artificial intelligence',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: count,
        apiKey: process.env.NEWS_API_KEY
      },
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (response.data.status !== 'ok') {
      throw new Error('Failed to fetch news');
    }

    console.log(`Fetched ${response.data.articles.length} fresh news articles`);
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching AI news:', error);
    // Return mock data on error
    return Array(count).fill().map((_, i) => ({
      title: `Latest AI News Article ${i+1} - ${new Date().toLocaleTimeString()}`,
      source: { name: 'TechWithLC' },
      publishedAt: new Date().toISOString(),
      url: 'https://techwithlc.com',
      content: 'This is fresh placeholder content when API calls fail. Generated at ' + new Date().toLocaleTimeString()
    }));
  }
}

/**
 * Use OpenAI to summarize news articles
 */
export async function summarizeNewsWithOpenAI(articles) {
  try {
    // Format articles for OpenAI
    const articlesText = articles.map((article, index) => {
      return `Article ${index + 1}: "${article.title}"
Source: ${article.source.name}
Published: ${new Date(article.publishedAt).toLocaleDateString()}
URL: ${article.url}
Content: ${article.content || article.description || 'No content available'}
`;
    }).join('\n\n');

    const currentTime = new Date().toLocaleString();
    const prompt = `You are an AI news summarization service for TechwithLC, a technology blog. 
The current time is ${currentTime}.
Please summarize the following ${articles.length} AI-related news articles in a concise but informative way. 
Focus on the key technological advancements, business implications, and societal impacts.
Format your response in HTML with proper headings, paragraphs, and bullet points if needed.
Start with an h1 heading that says "AI News Roundup - ${new Date().toLocaleDateString()}" and include the publication date.

${articlesText}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a skilled technology journalist specializing in AI. Create summaries that are insightful, accurate, and easy to understand." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    // Process each article to ensure we have consistent data structure
    const processedArticles = articles.map(article => {
      return {
        ...article,
        // Add timestamp to ensure freshness indication
        freshness: `Retrieved at ${new Date().toLocaleTimeString()}`,
        // Ensure we have consistent fields
        title: article.title || 'Untitled Article',
        url: article.url || '#',
        source: article.source || { name: 'Unknown Source' },
        publishedAt: article.publishedAt || new Date().toISOString(),
        description: article.description || article.content || 'No description available',
        content: article.content || article.description || 'No content available'
      };
    });

    return {
      htmlContent: response.choices[0].message.content,
      articles: processedArticles,
      timestamp: Date.now(),
      generated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error summarizing news with OpenAI:', error);
    // Return a basic HTML template with the original articles
    const fallbackHtml = `
      <h1>AI News Roundup - ${new Date().toLocaleDateString()}</h1>
      <p>Generated at ${new Date().toLocaleTimeString()}</p>
      ${articles.map((article, i) => `
        <h2>${article.title || `Article ${i+1}`}</h2>
        <p><em>Source: ${article.source?.name || 'Unknown'}</em></p>
        <p>${article.description || article.content || 'No content available'}</p>
      `).join('')}
    `;
    
    return {
      htmlContent: fallbackHtml,
      articles: articles,
      timestamp: Date.now(),
      generated: new Date().toISOString()
    };
  }
}

/**
 * Fetch and summarize news articles
 */
export async function fetchAndSummarizeNews() {
  try {
    const articles = await fetchLatestAINews();
    const summarizedContent = await summarizeNewsWithOpenAI(articles);
    
    return {
      title: "Latest AI News from TechwithLC",
      date: new Date().toLocaleDateString(),
      content: summarizedContent.htmlContent,
      articles: summarizedContent.articles
    };
  } catch (error) {
    console.error('Error in fetchAndSummarizeNews:', error);
    throw error;
  }
}
