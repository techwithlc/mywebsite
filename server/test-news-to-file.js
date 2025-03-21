import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'latest-ai-news.html');

// Initialize OpenAI client with the provided API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Fetch the latest AI news from News API
 */
async function fetchLatestAINews(count = 5) {
  try {
    console.log("Fetching latest AI news from News API...");
    
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'artificial intelligence',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: count,
        apiKey: "25e8435230ef4d64a53427191cf78c78"
      }
    });

    if (response.data.status !== 'ok') {
      throw new Error('Failed to fetch news');
    }

    console.log(`Successfully fetched ${response.data.articles.length} articles!`);
    
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching AI news:', error);
    throw error;
  }
}

/**
 * Use OpenAI to summarize news articles
 */
async function summarizeNewsWithOpenAI(articles) {
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

    console.log("Calling OpenAI API to summarize news articles...");
    
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

    console.log("Successfully received response from OpenAI!");
    
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
 * Create HTML email template for newsletter
 */
function createNewsletterTemplate(newsContent) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsContent.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(to right, #3b82f6, #06b6d4);
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 0 0 5px 5px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #6b7280;
    }
    .btn {
      display: inline-block;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 15px;
    }
    .unsubscribe {
      color: #6b7280;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TechwithLC</h1>
      <p>AI News Digest - ${newsContent.date}</p>
    </div>
    <div class="content">
      <h2>Latest in AI Technology</h2>
      
      ${newsContent.content}
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://techwithlc.com" class="btn">Visit Our Website</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} TechwithLC. All rights reserved.</p>
      <p>
        <a href="https://techwithlc.com/unsubscribe?email=kuanlunlawrence.chen@gmail.com" class="unsubscribe">
          Unsubscribe
        </a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Test the news fetching and summarization functionality
 */
async function testNewsletterGeneration() {
  try {
    console.log("Starting newsletter generation test...");
    
    // Fetch real AI news articles
    const articles = await fetchLatestAINews();
    
    // Summarize the news articles
    const summarizedContent = await summarizeNewsWithOpenAI(articles);
    
    // Create the newsletter content
    const newsContent = {
      title: "Latest AI News from TechwithLC",
      date: new Date().toLocaleDateString(),
      content: summarizedContent.htmlContent,
      articles: summarizedContent.articles
    };
    
    // Generate the complete HTML email
    const emailHtml = createNewsletterTemplate(newsContent);
    
    // Save the HTML to a file
    fs.writeFileSync(outputPath, emailHtml);
    
    console.log(`Newsletter HTML saved to: ${outputPath}`);
    console.log("Newsletter generation test completed successfully!");
    
    // Print information about the articles
    console.log("\nArticles that would be sent to kuanlunlawrence.chen@gmail.com:");
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.source.name})`);
    });
    
    return newsContent;
  } catch (error) {
    console.error('Error in testNewsletterGeneration:', error);
  }
}

// Run the test
testNewsletterGeneration();
