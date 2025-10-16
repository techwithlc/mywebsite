import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { summarizeNewsWithPerplexity } from './services/newsService.js'; // Import Perplexity summarizer
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'latest-ai-news.html');

// Function to fetch latest AI news
async function fetchLatestAINews(count = 5) {
  console.log('Fetching latest AI news from News API...');
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

    if (response.data && response.data.articles) {
      console.log(`Successfully fetched ${response.data.articles.length} articles!`);
      return response.data.articles;
    } else {
      throw new Error('No articles found in the response');
    }
  } catch (error) {
    console.error('Error fetching news:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Generation (Perplexity) =====');

  try {
    // Step 1: Fetch latest AI news
    const articles = await fetchLatestAINews();

    // Print article titles
    console.log('\nFetched Articles:');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.source.name})`);
    });

    // Step 2: Summarize news with Perplexity
    console.log('\nSummarizing news with Perplexity...');
    const summaryResult = await summarizeNewsWithPerplexity(articles);
    const htmlContent = summaryResult.htmlContent; // Extract HTML content

    // Step 3: Save to file
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`\nNewsletter HTML saved to: ${outputPath}`);

    // Step 4: No sending logic in this script
    console.log('\n===== Newsletter Generation Complete =====');
    console.log('Newsletter content generated using Perplexity and saved.');

  } catch (error) {
    console.error('\nError in newsletter generation:', error);
    process.exit(1);
  }
}

// Run the script
main();
