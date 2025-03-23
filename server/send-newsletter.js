import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'latest-ai-news.html');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

// Function to summarize news with OpenAI
async function summarizeNewsWithOpenAI(articles) {
  console.log('Calling OpenAI API to summarize news articles...');
  
  // Create a prompt with the articles
  const articlesText = articles.map((article, index) => {
    return `Article ${index + 1}: ${article.title}
Source: ${article.source.name}
URL: ${article.url}
Published: ${new Date(article.publishedAt).toLocaleString()}
Content: ${article.content || article.description || 'No content available'}
`;
  }).join('\n\n');

  const prompt = `Please summarize the following AI news articles in a newsletter format:

${articlesText}

For each article:
1. Create a concise summary (2-3 sentences)
2. Highlight key points or implications
3. Use professional and engaging language

Format the newsletter with:
- A brief introduction about AI trends this week
- Each article summary with its title and source
- A brief conclusion

Make it visually appealing with proper HTML formatting, including:
- Responsive design
- Professional color scheme
- Clear section headers
- Proper spacing and alignment

The newsletter should be ready to send via email.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert AI news analyst helping to create a professional newsletter. Your output should be complete, valid HTML that can be directly used in an email newsletter. IMPORTANT: Do NOT include any markdown code block markers like ```html or ``` in your response - just output the pure HTML directly."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    console.log('Successfully received response from OpenAI!');
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing news with OpenAI:', error);
    throw error;
  }
}

// Function to convert HTML to plain text
function htmlToPlainText(html) {
  // Remove HTML tags
  let text = html.replace(/<style[^>]*>.*?<\/style>/gs, '')
    .replace(/<script[^>]*>.*?<\/script>/gs, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  
  // Replace common HTML entities
  text = text.replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Add line breaks for readability
  text = text.replace(/\. /g, '.\n');
  
  // Clean up multiple line breaks
  text = text.replace(/\n\s*\n/g, '\n\n');
  
  return text;
}

// Function to send emails with Gmail
async function sendWithGmail(htmlContent) {
  console.log('Setting up Gmail transport...');
  
  // Create plain text version of the newsletter
  const plainTextContent = htmlToPlainText(htmlContent);
  
  // Save plain text version to file for reference
  fs.writeFileSync(path.join(__dirname, 'latest-ai-news.txt'), plainTextContent);
  console.log(`Plain text newsletter saved to: ${path.join(__dirname, 'latest-ai-news.txt')}`);
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  // Verify connection
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully!');
  } catch (error) {
    console.error('SMTP verification failed:', error);
    throw new Error(`Email configuration error: ${error.message}`);
  }
  
  // Get subscribers from multiple possible locations
  const possiblePaths = [
    path.join(__dirname, 'subscribers.json'), // Original location
    '/tmp/subscribers.json', // Netlify Functions location
    path.join(__dirname, '../netlify/functions/subscribers.json') // Another possible path
  ];
  
  let subscribers = [];
  let subscribersFound = false;
  
  // Try each possible path
  for (const subscribersPath of possiblePaths) {
    if (fs.existsSync(subscribersPath)) {
      try {
        const data = fs.readFileSync(subscribersPath, 'utf8');
        const parsedData = JSON.parse(data);
        
        // Merge with existing subscribers, avoiding duplicates
        for (const sub of parsedData) {
          if (!subscribers.some(existing => existing.email === sub.email)) {
            subscribers.push(sub);
          }
        }
        
        console.log(`Found ${parsedData.length} subscribers in ${subscribersPath}`);
        subscribersFound = true;
      } catch (error) {
        console.error(`Error reading from ${subscribersPath}:`, error.message);
      }
    }
  }
  
  if (!subscribersFound) {
    console.warn('No subscribers file found in any location. Creating new one.');
    fs.writeFileSync(path.join(__dirname, 'subscribers.json'), JSON.stringify([]));
    return { success: true, sent: 0, message: 'No subscribers' };
  }
  
  // Filter active subscribers
  const activeSubscribers = subscribers.filter(sub => sub.subscribed !== false);
  console.log(`Found ${activeSubscribers.length} active subscribers`);
  
  if (activeSubscribers.length === 0) {
    console.log('No subscribers to send to.');
    return { success: true, sent: 0, message: 'No subscribers' };
  }
  
  // Prepare email with both HTML and plain text versions
  const mailOptions = {
    from: `"TechwithLC" <${process.env.EMAIL_FROM}>`,
    subject: `TechwithLC AI News Update - ${new Date().toLocaleDateString()}`,
    text: plainTextContent, // Plain text version
    html: htmlContent // HTML version
  };
  
  // Send to each subscriber
  let successCount = 0;
  let failCount = 0;
  
  console.log('Sending emails to subscribers...');
  for (const subscriber of activeSubscribers) {
    try {
      mailOptions.to = subscriber.email;
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${subscriber.email}: ${info.messageId}`);
      successCount++;
    } catch (error) {
      console.error(`Failed to send to ${subscriber.email}:`, error.message);
      failCount++;
    }
  }
  
  console.log(`Newsletter sent: ${successCount} successful, ${failCount} failed`);
  return { success: true, sent: successCount, failed: failCount };
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Sender =====');
  
  try {
    // Step 1: Fetch latest AI news
    const articles = await fetchLatestAINews();
    
    // Print article titles
    console.log('\nArticles that will be sent:');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.source.name})`);
    });
    
    // Step 2: Summarize news with OpenAI
    const htmlContent = await summarizeNewsWithOpenAI(articles);
    
    // Step 3: Save to file
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`\nNewsletter HTML saved to: ${outputPath}`);
    
    // Step 4: Send with Gmail
    console.log('\nSending newsletter with Gmail...');
    const result = await sendWithGmail(htmlContent);
    
    if (result.success) {
      console.log('\n===== Newsletter Sending Complete =====');
      console.log(`\nSuccessfully sent newsletters to ${result.sent} subscribers!`);
      console.log('Check your inbox (and spam folder) for the newsletter.');
    }
  } catch (error) {
    console.error('\nError in newsletter sending:', error);
    process.exit(1);
  }
}

// Run the script
main();
