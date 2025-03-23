import { updateFeeds } from '../services/rssFeedService.js';
import { fetchLatestAINews, summarizeNewsWithOpenAI } from '../services/newsService.js';
import { sendNewsletterToAllSubscribers } from '../services/emailService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle local environment for development
const isLocal = process.argv.includes('--local');
if (isLocal) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.resolve(__dirname, '../../.env');
    dotenv.config({ path: envPath });
    console.log('Loaded environment variables for local development');
  } catch (error) {
    console.error('Error loading environment variables:', error);
  }
}

/**
 * Handler function for the newsletter serverless function
 * Fetches latest AI news, updates content, and sends newsletter to subscribers
 */
export async function handler(event) {
  try {
    // For local testing
    if (isLocal) {
      return await generateAndSendNewsletter();
    }

    // Handle Netlify webhook event
    if (event.httpMethod === 'POST') {
      return await generateAndSendNewsletter();
    }

    // Return error for other HTTP methods
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Error in newsletter function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message
      })
    };
  }
}

/**
 * Generate newsletter content and send to subscribers
 */
async function generateAndSendNewsletter() {
  try {
    console.log('Webhook triggered: Generating AI news newsletter');

    // Fetch and prepare news content
    console.log('Fetching latest AI news for newsletter...');
    const articles = await fetchLatestAINews(5);
    
    if (!articles || articles.length === 0) {
      throw new Error('No articles fetched');
    }
    
    console.log(`Fetched ${articles.length} fresh news articles`);
    
    // Generate summaries with OpenAI
    const newsContent = await summarizeNewsWithOpenAI(articles);
    
    // Update the internal content feeds (used for both RSS and email)
    await updateFeeds(newsContent);
    
    // Send newsletter to subscribers
    console.log('Sending newsletter to subscribers...');
    const emailResults = await sendNewsletterToAllSubscribers(newsContent);
    
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Newsletter generated and emails sent successfully',
        results: {
          success: true,
          emailResults,
          articleCount: articles.length
        }
      })
    };
  } catch (error) {
    console.error('Error generating newsletter:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Error generating newsletter',
        error: error.message
      })
    };
  }
}

// Execute handler if running locally
if (isLocal) {
  handler({ httpMethod: 'POST' })
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(error => console.error('Error:', error));
}
