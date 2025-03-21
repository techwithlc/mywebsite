import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Fetch the latest AI news from News API
 */
export async function fetchLatestAINews(count = 5) {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'artificial intelligence',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: count,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    if (response.data.status !== 'ok') {
      throw new Error('Failed to fetch news');
    }

    return response.data.articles;
  } catch (error) {
    console.error('Error fetching AI news:', error);
    throw error;
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

    // Prompt for OpenAI
    const prompt = `I have the following 5 recent news articles about artificial intelligence. 
Please summarize each article in 2-3 concise sentences that capture the key points.
After summarizing each article individually, please provide a brief overview of the current AI landscape based on these articles.
Format your response in HTML that can be directly included in an email newsletter.
Use a clean, professional design with proper headings and spacing.

Here are the articles:

${articlesText}`;

    // Call OpenAI API using GPT-4o model
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert AI news analyst helping to create a professional newsletter. Provide concise, insightful summaries of AI news articles. Format your response in clean HTML suitable for an email newsletter."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return {
      htmlContent: response.choices[0].message.content,
      articles: articles
    };
  } catch (error) {
    console.error('Error summarizing news with OpenAI:', error);
    throw error;
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
