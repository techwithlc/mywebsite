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
        apiKey: "25e8435230ef4d64a53427191cf78c78"
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

// Function to send email directly
async function sendDirectEmail(htmlContent) {
  // IMPORTANT: Replace these with your actual Gmail credentials
  const EMAIL = 'kuanlunlawrence.chen@gmail.com';
  const APP_PASSWORD = 'REPLACE_WITH_YOUR_APP_PASSWORD'; // Get this from https://myaccount.google.com/apppasswords
  
  // Check if APP_PASSWORD has been replaced
  if (APP_PASSWORD === 'REPLACE_WITH_YOUR_APP_PASSWORD') {
    console.error('\nERROR: Please edit this file to add your Gmail app password!');
    console.error('Replace "REPLACE_WITH_YOUR_APP_PASSWORD" with your actual app password');
    console.error('You can get an app password from: https://myaccount.google.com/apppasswords');
    return false;
  }
  
  try {
    console.log('\nSetting up Gmail transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Verify connection
    console.log('Verifying connection to Gmail...');
    await transporter.verify();
    console.log('Gmail connection successful!');
    
    // Setup email data
    const mailOptions = {
      from: `"TechwithLC Newsletter" <${EMAIL}>`,
      to: EMAIL, // Sending to yourself for testing
      subject: `Latest AI News from TechwithLC - ${new Date().toLocaleDateString()}`,
      html: htmlContent
    };
    
    // Send email
    console.log(`Sending newsletter to ${EMAIL}...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Direct Email Test =====');
  
  // Check if APP_PASSWORD has been updated
  const currentFilePath = fileURLToPath(import.meta.url);
  const fileContent = fs.readFileSync(currentFilePath, 'utf8');
  if (fileContent.includes('REPLACE_WITH_YOUR_APP_PASSWORD')) {
    console.log('\nIMPORTANT: Before running this script, you need to:');
    console.log('1. Edit this file to replace "REPLACE_WITH_YOUR_APP_PASSWORD" with your Gmail app password');
    console.log('   (Get an app password from: https://myaccount.google.com/apppasswords)');
    console.log('\nFollow these steps to get an app password:');
    console.log('1. Go to https://myaccount.google.com/apppasswords');
    console.log('2. Sign in with your Google account');
    console.log('3. Select "Mail" and "Other (Custom name)"');
    console.log('4. Enter "TechwithLC Newsletter" and click "Generate"');
    console.log('5. Copy the 16-character password generated');
    console.log('6. Edit this file and replace "REPLACE_WITH_YOUR_APP_PASSWORD" with that password');
    process.exit(1);
  }
  
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
    
    // Step 4: Send direct email
    console.log('\nSending newsletter via direct email...');
    const success = await sendDirectEmail(htmlContent);
    
    if (success) {
      console.log('\n===== Newsletter Test Complete =====');
      console.log('Check your inbox (and spam folder) for the newsletter email.');
      
      // Update subscribers.json to ensure your email is in the list
      const subscribersPath = path.join(__dirname, 'subscribers.json');
      let subscribers = [];
      
      if (fs.existsSync(subscribersPath)) {
        subscribers = JSON.parse(fs.readFileSync(subscribersPath, 'utf8'));
      }
      
      // Check if your email is already in the list
      const yourEmail = 'kuanlunlawrence.chen@gmail.com';
      const existingSubscriber = subscribers.find(sub => sub.email === yourEmail);
      
      if (!existingSubscriber) {
        subscribers.push({
          email: yourEmail,
          name: 'Lawrence Chen',
          subscribed: true,
          createdAt: new Date().toISOString(),
          lastEmailSent: new Date().toISOString()
        });
        
        fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
        console.log(`\nAdded your email to subscribers list: ${yourEmail}`);
      }
    }
  } catch (error) {
    console.error('\nError in newsletter test:', error);
    process.exit(1);
  }
}

// Run the script
main();
