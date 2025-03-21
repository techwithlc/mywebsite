import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import axios from 'axios';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'latest-ai-news.html');
const envPath = path.join(__dirname, '.env');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to prompt for app password
function promptForAppPassword() {
  return new Promise((resolve) => {
    console.log('\n===== Gmail App Password Setup =====');
    console.log('Please follow these steps to get your Gmail app password:');
    console.log('1. Go to https://myaccount.google.com/apppasswords');
    console.log('2. Sign in with your Google account');
    console.log('3. Select "Mail" and "Other (Custom name)"');
    console.log('4. Enter "TechwithLC Newsletter" and click "Generate"');
    console.log('5. Copy the 16-character password generated');
    
    rl.question('\nEnter your Gmail app password: ', (password) => {
      resolve(password);
    });
  });
}

// Function to update .env file
function updateEnvFile(appPassword) {
  try {
    // Read existing .env file if it exists
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update email configuration lines
      const envLines = envContent.split('\n');
      const updatedLines = envLines.map(line => {
        if (line.startsWith('EMAIL_USER=')) {
          return `EMAIL_USER=kuanlunlawrence.chen@gmail.com`;
        } else if (line.startsWith('EMAIL_PASS=')) {
          return `EMAIL_PASS=${appPassword}`;
        } else if (line.startsWith('EMAIL_FROM=')) {
          return `EMAIL_FROM=kuanlunlawrence.chen@gmail.com`;
        } else {
          return line;
        }
      });
      
      envContent = updatedLines.join('\n');
    } else {
      // Create new .env file with all configuration
      envContent = `# Server Configuration
PORT=3001

# Email Configuration
EMAIL_USER=kuanlunlawrence.chen@gmail.com
EMAIL_PASS=${appPassword}
EMAIL_FROM=kuanlunlawrence.chen@gmail.com

# API Keys
OPENAI_API_KEY=${process.env.OPENAI_API_KEY}
NEWS_API_KEY=25e8435230ef4d64a53427191cf78c78
`;
    }
    
    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
    console.log('.env file updated with Gmail configuration!');
    
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error);
    return false;
  }
}

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

// Function to send test email
async function sendTestEmail(htmlContent, appPassword) {
  try {
    console.log('\nSetting up Gmail transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kuanlunlawrence.chen@gmail.com',
        pass: appPassword
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
      from: '"TechwithLC Newsletter" <kuanlunlawrence.chen@gmail.com>',
      to: "kuanlunlawrence.chen@gmail.com",
      subject: `Latest AI News from TechwithLC - ${new Date().toLocaleDateString()}`,
      html: htmlContent
    };
    
    // Send email
    console.log(`Sending test email to kuanlunlawrence.chen@gmail.com...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    return false;
  }
}

// Function to update subscribers list
function updateSubscribersList() {
  try {
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
    
    return true;
  } catch (error) {
    console.error('Error updating subscribers list:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Setup =====');
  console.log('This script will help you set up and test your newsletter system.');
  
  try {
    // Step 1: Get app password
    const appPassword = await promptForAppPassword();
    
    // Step 2: Update .env file
    updateEnvFile(appPassword);
    
    // Step 3: Fetch latest AI news
    const articles = await fetchLatestAINews();
    
    // Print article titles
    console.log('\nArticles that will be sent:');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.source.name})`);
    });
    
    // Step 4: Summarize news with OpenAI
    const htmlContent = await summarizeNewsWithOpenAI(articles);
    
    // Step 5: Save to file
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`\nNewsletter HTML saved to: ${outputPath}`);
    
    // Step 6: Update subscribers list
    updateSubscribersList();
    
    // Step 7: Send test email
    console.log('\nSending test newsletter via email...');
    const success = await sendTestEmail(htmlContent, appPassword);
    
    if (success) {
      console.log('\n===== Newsletter Setup Complete =====');
      console.log('Check your inbox (and spam folder) for the newsletter email.');
      console.log('\nNext steps:');
      console.log('1. Restart your server:');
      console.log('   npm start');
      console.log('\n2. Send a newsletter to all subscribers:');
      console.log('   curl -X POST http://localhost:3001/api/send-newsletter');
    }
    
    rl.close();
  } catch (error) {
    console.error('\nError in newsletter setup:', error);
    rl.close();
    process.exit(1);
  }
}

// Run the script
main();
