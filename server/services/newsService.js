import axios from 'axios';
import dotenv from 'dotenv';
// Remove OpenAI import
// import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Google SDK
import fs from 'fs'; // Import fs module
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Import url module

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Define __dirname

// --- Initialize Google Generative AI Client ---
let genAI;
let geminiModel;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing.');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Attempting to use gemini-2.0-flash-lite as requested. API might reject this ID.
  geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
} catch (error) {
  console.warn(`Warning: Google Generative AI initialization failed: ${error.message}. News feed generation may not work.`);
  // Create a mock client for build process or if API key is missing
  geminiModel = {
    generateContent: async () => ({
      response: {
        text: () => '<h1>AI News Placeholder (Gemini)</h1><p>This content will be replaced with real AI news summaries in production.</p>'
      }
    })
  };
}
// --- End Google Generative AI Client Initialization ---

/**
 * Fetch the latest AI news from News API
 */
export async function fetchLatestAINews(count = 5, forceRefresh = true) {
  try {
    if (!process.env.NEWS_API_KEY) {
      console.warn('NEWS_API_KEY is missing. Using mock data.');
      // Return consistent mock data structure
      return Array(count).fill().map((_, i) => ({
        title: `Mock AI News Article ${i+1}`,
        source: { name: 'TechWithLC' },
        publishedAt: new Date().toISOString(),
        url: 'https://techwithlc.com',
        description: 'This is placeholder content for building purposes only.',
        content: 'This is placeholder content for building purposes only.'
      }));
    }

    // Add a timestamp to prevent caching if needed (NewsAPI might ignore this)
    const timestampParam = forceRefresh ? `&_t=${Date.now()}` : '';

    const response = await axios.get(`https://newsapi.org/v2/everything?q=artificial%20intelligence&language=en&sortBy=publishedAt&pageSize=${count}&apiKey=${process.env.NEWS_API_KEY}${timestampParam}`, {
      // It's generally better to let axios handle params, but NewsAPI caching can be aggressive.
      // Using URL params directly might be more reliable for cache busting.
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

    if (response.data.status !== 'ok') {
      throw new Error(`Failed to fetch news: ${response.data.message || 'Unknown NewsAPI error'}`);
    }

    console.log(`Fetched ${response.data.articles.length} fresh news articles`);
    // Ensure articles have consistent structure
    return response.data.articles.map(article => ({
      ...article,
      description: article.description || article.content || 'No description available',
      content: article.content || article.description || 'No content available'
    }));
  } catch (error) {
    console.error('Error fetching AI news:', error.message);
    // Return mock data on error with consistent structure
    return Array(count).fill().map((_, i) => ({
      title: `Latest AI News Article ${i+1} - Error Fetching`,
      source: { name: 'TechWithLC' },
      publishedAt: new Date().toISOString(),
      url: 'https://techwithlc.com',
      description: `Failed to fetch real news. Error: ${error.message}`,
      content: `Failed to fetch real news. Error: ${error.message}`
    }));
  }
}

/**
 * Use Google Gemini to summarize news articles
 */
export async function summarizeNewsWithGemini(articles) {
  try {
    // Format articles for Gemini
    const articlesText = articles.map((article, index) => {
      // Ensure consistent data structure before using
      const safeArticle = {
        title: article.title || 'Untitled Article',
        sourceName: article.source?.name || 'Unknown Source',
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A',
        url: article.url || '#',
        content: article.content || article.description || 'No content available'
      };
      return `Article ${index + 1}: "${safeArticle.title}"
Source: ${safeArticle.sourceName}
Published: ${safeArticle.publishedAt}
URL: ${safeArticle.url}
Content Snippet: ${safeArticle.content.substring(0, 300)}${safeArticle.content.length > 300 ? '...' : ''}
`;
    }).join('\n---\n'); // Use a separator

    const currentTime = new Date().toLocaleString();

    // --- Load prompt from file ---
    let promptTemplate = '';
    try {
      promptTemplate = fs.readFileSync(path.join(__dirname, '../prompts/newsletter_prompt.txt'), 'utf8');
    } catch (readError) {
      console.error('Error reading prompt template file:', readError);
      throw new Error('Could not load prompt template.');
    }

    // Replace placeholders in the template
    const prompt = promptTemplate
      .replace('{currentTime}', currentTime)
      .replace('{articleCount}', articles.length.toString())
      .replace('{articlesText}', articlesText);
    // --- End Load prompt from file ---

    // The original inline prompt block has been removed to fix syntax errors.

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    let summaryHtml = response.text();

    // --- Post-processing: Remove markdown fences ---
    summaryHtml = summaryHtml.replace(/^```html\s*/, '').replace(/\s*```$/, '');
    // --- End Post-processing ---

    // Process articles again for consistency in the returned object
    const processedArticles = articles.map(article => ({
      ...article,
      freshness: `Retrieved at ${new Date().toLocaleTimeString()}`,
      title: article.title || 'Untitled Article',
      url: article.url || '#',
      source: article.source || { name: 'Unknown Source' },
      publishedAt: article.publishedAt || new Date().toISOString(),
      description: article.description || article.content || 'No description available',
      content: article.content || article.description || 'No content available'
    }));

    return {
      htmlContent: summaryHtml,
      articles: processedArticles, // Return the original (processed) articles
      timestamp: Date.now(),
      generated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error summarizing news with Gemini:', error);
    // Fallback HTML generation
    const fallbackHtml = `
      <h1>AI News Roundup - ${new Date().toLocaleDateString()} (Error)</h1>
      <p>Generated at ${new Date().toLocaleTimeString()}. Failed to generate summary with Gemini. Error: ${error.message}</p>
      <h2>Original Articles:</h2>
      <ul>
        ${articles.map((article, i) => `
          <li>
            <strong>${article.title || `Article ${i+1}`}</strong> (Source: ${article.source?.name || 'Unknown'})<br/>
            ${article.description || article.content || 'No content available'}
            ${article.url ? `<br/><a href="${article.url}" target="_blank">Read more</a>` : ''}
          </li>
        `).join('')}
      </ul>
    `;

    return {
      htmlContent: fallbackHtml,
      articles: articles, // Return original articles on error
      timestamp: Date.now(),
      generated: new Date().toISOString()
    };
  }
}


/**
 * Fetch and summarize news articles using Gemini
 */
export async function fetchAndSummarizeNews() {
  try {
    const articles = await fetchLatestAINews(5, true); // Fetch 5 articles, force refresh
    if (!articles || articles.length === 0) {
      throw new Error("No articles fetched.");
    }
    // Use the new Gemini summarization function
    const summarizedContent = await summarizeNewsWithGemini(articles);

    return {
      title: `AI News Roundup - ${new Date().toLocaleDateString()}`, // Use title from summary
      date: new Date().toLocaleDateString(),
      content: summarizedContent.htmlContent,
      articles: summarizedContent.articles // Pass along the original articles
    };
  } catch (error) {
    console.error('Error in fetchAndSummarizeNews:', error);
    // Provide a more informative error object
    return {
       title: `AI News Error - ${new Date().toLocaleDateString()}`,
       date: new Date().toLocaleDateString(),
       content: `<p>Could not generate AI news summary. Error: ${error.message}</p>`,
       articles: []
    }
    // Or rethrow if the caller should handle it: throw error;
  }
}

// --- Remove Old OpenAI Function ---
// export async function summarizeNewsWithOpenAI(articles) { ... }
