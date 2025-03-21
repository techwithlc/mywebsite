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
          content: "You are an expert AI news analyst helping to create a professional newsletter. Your output should be complete, valid HTML that can be directly used in an email newsletter."
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

// Function to send emails with Gmail
async function sendWithGmail(htmlContent) {
  try {
    console.log('\nSetting up Gmail transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Verify connection
    console.log('Verifying connection to Gmail...');
    await transporter.verify();
    console.log('Gmail connection successful!');
    
    // Get subscribers
    const subscribersPath = path.join(__dirname, 'subscribers.json');
    let subscribers = [];
    
    if (fs.existsSync(subscribersPath)) {
      subscribers = JSON.parse(fs.readFileSync(subscribersPath, 'utf8'));
    } else {
      // Add default subscriber if file doesn't exist
      subscribers = [
        {
          email: 'kuanlunlawrence.chen@gmail.com',
          name: 'Lawrence Chen',
          subscribed: true
        }
      ];
      fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    }
    
    // Make sure your own email is in the subscribers list
    const yourEmail = process.env.EMAIL_USER;
    if (!subscribers.some(sub => sub.email === yourEmail)) {
      subscribers.push({
        email: yourEmail,
        name: 'Newsletter Admin',
        subscribed: true,
        createdAt: new Date().toISOString()
      });
      fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    }
    
    // Send emails to all subscribers
    console.log(`Sending newsletter to ${subscribers.length} subscribers...`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const subscriber of subscribers) {
      if (!subscriber.subscribed) continue;
      
      try {
        // Setup email data
        const mailOptions = {
          from: `"TechwithLC Newsletter" <${process.env.EMAIL_FROM}>`,
          to: subscriber.email,
          subject: `Latest AI News from TechwithLC - ${new Date().toLocaleDateString()}`,
          html: htmlContent
        };
        
        // Send email
        console.log(`Sending email to ${subscriber.email}...`);
        const info = await transporter.sendMail(mailOptions);
        
        console.log(`Email sent to ${subscriber.email}`);
        console.log(`Message ID: ${info.messageId}`);
        
        successCount++;
        
        // Update subscriber with last email sent date
        subscriber.lastEmailSent = new Date().toISOString();
      } catch (error) {
        console.error(`Error sending to ${subscriber.email}:`, error);
        failCount++;
      }
    }
    
    // Save updated subscribers
    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    
    console.log(`\nNewsletter sending complete: ${successCount} successful, ${failCount} failed`);
    
    return {
      success: true,
      successCount,
      failCount
    };
  } catch (error) {
    console.error('Error in Gmail setup:', error);
    return { success: false, error };
  }
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
      console.log(`\nSuccessfully sent newsletters to ${result.successCount} subscribers!`);
      console.log('Check your inbox (and spam folder) for the newsletter.');
    }
  } catch (error) {
    console.error('\nError in newsletter sending:', error);
    process.exit(1);
  }
}

// Run the script
main();
