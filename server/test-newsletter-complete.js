import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'latest-ai-news.html');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Email configuration - REPLACE THESE VALUES
const EMAIL_CONFIG = {
  // Use your Gmail address
  email: process.env.EMAIL_USER || 'your.email@gmail.com', 
  // Use an app password: https://myaccount.google.com/apppasswords
  appPassword: process.env.EMAIL_PASS || 'your-16-character-app-password', 
  // Email to send the test newsletter to
  recipient: 'kuanlunlawrence.chen@gmail.com'
};

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

// Function to send email
async function sendEmail(htmlContent, config) {
  try {
    // Configure Gmail transporter
    console.log('\nConfiguring Gmail transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email,
        pass: config.appPassword
      }
    });
    
    // Verify connection
    console.log('Verifying connection to Gmail...');
    await transporter.verify();
    console.log('Gmail connection successful!');
    
    // Setup email data
    const mailOptions = {
      from: `"TechwithLC Newsletter" <${config.email}>`,
      to: config.recipient,
      subject: `Latest AI News from TechwithLC - ${new Date().toLocaleDateString()}`,
      html: htmlContent
    };
    
    // Send email
    console.log(`Sending test email to ${config.recipient}...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    
    // Update .env file
    updateEnvFile({
      EMAIL_HOST: 'smtp.gmail.com',
      EMAIL_PORT: 587,
      EMAIL_USER: config.email,
      EMAIL_PASS: config.appPassword,
      EMAIL_FROM: config.email
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Function to update .env file
function updateEnvFile(emailConfig) {
  try {
    const envPath = path.join(__dirname, '.env');
    
    // Create new .env file with all configuration
    const envContent = `# Server Configuration
PORT=3001

# Email Configuration
EMAIL_HOST=${emailConfig.EMAIL_HOST}
EMAIL_PORT=${emailConfig.EMAIL_PORT}
EMAIL_USER=${emailConfig.EMAIL_USER}
EMAIL_PASS=${emailConfig.EMAIL_PASS}
EMAIL_FROM=${emailConfig.EMAIL_FROM}

# API Keys
OPENAI_API_KEY=${process.env.OPENAI_API_KEY}
NEWS_API_KEY=${process.env.NEWS_API_KEY}
`;
    
    // Write .env file
    fs.writeFileSync(envPath, envContent);
    console.log('\n.env file updated with email configuration!');
    
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Complete Test =====');
  console.log('This script will generate a newsletter and send it via email.');
  
  // Check if user has updated the email config
  if (EMAIL_CONFIG.email === 'your.email@gmail.com' || 
      EMAIL_CONFIG.appPassword === 'your-16-character-app-password') {
    console.log('\nIMPORTANT: Before running this script, please:');
    console.log('1. Edit this file to set your Gmail address and app password');
    console.log('2. For Gmail, you need to create an "App Password":');
    console.log('   - Go to https://myaccount.google.com/apppasswords');
    console.log('   - Sign in with your Google account');
    console.log('   - Select "Mail" and "Other (Custom name)"');
    console.log('   - Enter "TechwithLC Newsletter" and click "Generate"');
    console.log('   - Use the 16-character password generated');
    
    console.error('\nERROR: Please edit this file first to set your Gmail address and app password!');
    process.exit(1);
  }
  
  try {
    // Step 1: Fetch latest AI news
    const articles = await fetchLatestAINews();
    
    // Print article titles
    console.log('\nArticles that would be sent to subscribers:');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.source.name})`);
    });
    
    // Step 2: Summarize news with OpenAI
    const htmlContent = await summarizeNewsWithOpenAI(articles);
    
    // Step 3: Save to file
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`\nNewsletter HTML saved to: ${outputPath}`);
    
    // Step 4: Send email
    console.log('\nSending newsletter via email...');
    const success = await sendEmail(htmlContent, EMAIL_CONFIG);
    
    if (success) {
      console.log('\n===== Newsletter Test Complete =====');
      console.log('Your email configuration has been saved to the .env file.');
      console.log('\nNext steps:');
      console.log('1. Start your server:');
      console.log('   npm start');
      console.log('\n2. Send a newsletter to all subscribers:');
      console.log('   curl -X POST http://localhost:3001/api/send-newsletter');
    }
  } catch (error) {
    console.error('\nError in newsletter test:', error);
    process.exit(1);
  }
}

// Run the script
main();
