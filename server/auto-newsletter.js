import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'latest-ai-news.html');
const envPath = path.join(__dirname, '.env');

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

// Function to create test email account and send email
async function setupEmailAndSend(htmlContent) {
  try {
    console.log('\nCreating test email account with Ethereal...');
    // Create a test account at Ethereal
    const testAccount = await nodemailer.createTestAccount();
    console.log(`Test email account created: ${testAccount.user}`);
    
    // Configure transporter with test account
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    // Verify connection
    console.log('Verifying connection to test email server...');
    await transporter.verify();
    console.log('Test email server connection successful!');
    
    // Setup email data
    const mailOptions = {
      from: `"TechwithLC Newsletter" <${testAccount.user}>`,
      to: "kuanlunlawrence.chen@gmail.com",
      subject: `Latest AI News from TechwithLC - ${new Date().toLocaleDateString()}`,
      html: htmlContent
    };
    
    // Send email
    console.log(`Sending test email to kuanlunlawrence.chen@gmail.com...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    
    // Get the preview URL
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    console.log('You can view the test email by opening the preview URL in your browser.');
    
    // Update .env file with test account credentials
    updateEnvFile({
      EMAIL_HOST: 'smtp.ethereal.email',
      EMAIL_PORT: 587,
      EMAIL_USER: testAccount.user,
      EMAIL_PASS: testAccount.pass,
      EMAIL_FROM: testAccount.user
    });
    
    return {
      success: true,
      previewUrl: nodemailer.getTestMessageUrl(info),
      credentials: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error };
  }
}

// Function to update .env file
function updateEnvFile(emailConfig) {
  try {
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
NEWS_API_KEY=25e8435230ef4d64a53427191cf78c78
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

// Function to restart the server
async function restartServer() {
  try {
    // Kill existing server process if running
    console.log('\nChecking for existing server process...');
    const { exec } = await import('child_process');
    
    exec('lsof -i :3001', (error, stdout, stderr) => {
      if (stdout) {
        const lines = stdout.trim().split('\n');
        if (lines.length > 1) {
          const pidMatch = lines[1].match(/\s+(\d+)\s+/);
          if (pidMatch && pidMatch[1]) {
            const pid = pidMatch[1];
            console.log(`Found server process with PID ${pid}, stopping it...`);
            exec(`kill ${pid}`, (killError) => {
              if (killError) {
                console.error(`Error stopping server: ${killError}`);
              } else {
                console.log('Server stopped successfully');
                startServer();
              }
            });
          } else {
            startServer();
          }
        } else {
          startServer();
        }
      } else {
        startServer();
      }
    });
  } catch (error) {
    console.error('Error restarting server:', error);
  }
}

// Function to start the server
function startServer() {
  try {
    console.log('\nStarting server...');
    const { spawn } = require('child_process');
    
    const server = spawn('npm', ['start'], {
      cwd: __dirname,
      detached: true,
      stdio: 'ignore'
    });
    
    server.unref();
    
    console.log('Server started successfully');
    console.log('Waiting for server to initialize...');
    
    // Wait for server to start
    setTimeout(() => {
      sendNewsletterToSubscribers();
    }, 5000);
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

// Function to send newsletter to subscribers
function sendNewsletterToSubscribers() {
  try {
    console.log('\nSending newsletter to all subscribers...');
    const { exec } = require('child_process');
    
    exec('curl -X POST http://localhost:3001/api/send-newsletter', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error sending newsletter: ${error}`);
        return;
      }
      
      console.log('Newsletter sent to all subscribers!');
      console.log('Response:', stdout);
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
  }
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Automatic Setup =====');
  console.log('This script will automatically set up and test your newsletter system.');
  
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
    
    // Step 4: Update subscribers list
    updateSubscribersList();
    
    // Step 5: Set up email and send test
    console.log('\nSetting up email service and sending test newsletter...');
    const result = await setupEmailAndSend(htmlContent);
    
    if (result.success) {
      console.log('\n===== Newsletter Setup Complete =====');
      console.log('\nTest Email Credentials:');
      console.log(`User: ${result.credentials.user}`);
      console.log(`Password: ${result.credentials.pass}`);
      console.log('\nView the test email here:');
      console.log(result.previewUrl);
      
      // Step 6: Restart server and send newsletter to all subscribers
      await restartServer();
    }
  } catch (error) {
    console.error('\nError in newsletter setup:', error);
    process.exit(1);
  }
}

// Run the script
main();
