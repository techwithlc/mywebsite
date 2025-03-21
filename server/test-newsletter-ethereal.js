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

// Function to create test email account and send email
async function sendTestEmail(htmlContent) {
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

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Complete Test with Ethereal Email =====');
  console.log('This script will generate a newsletter and send it via a test email service.');
  console.log('No real email credentials required - we will use Ethereal for testing.');
  
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
    
    // Step 4: Send test email
    console.log('\nSending newsletter via test email service...');
    const result = await sendTestEmail(htmlContent);
    
    if (result.success) {
      console.log('\n===== Newsletter Test Complete =====');
      console.log('Your email configuration has been saved to the .env file.');
      console.log('\nTest Email Credentials:');
      console.log(`User: ${result.credentials.user}`);
      console.log(`Password: ${result.credentials.pass}`);
      console.log('\nView the test email here:');
      console.log(result.previewUrl);
      
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
