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

// Function to create test email account and send email
async function setupEtherealAndSend(htmlContent) {
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
    
    // Send emails to all subscribers
    console.log(`Sending newsletter to ${subscribers.length} subscribers...`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const subscriber of subscribers) {
      if (!subscriber.subscribed) continue;
      
      try {
        // Setup email data
        const mailOptions = {
          from: `"TechwithLC Newsletter" <${testAccount.user}>`,
          to: subscriber.email,
          subject: `Latest AI News from TechwithLC - ${new Date().toLocaleDateString()}`,
          html: htmlContent
        };
        
        // Send email
        console.log(`Sending test email to ${subscriber.email}...`);
        const info = await transporter.sendMail(mailOptions);
        
        console.log(`Email sent to ${subscriber.email}`);
        console.log(`Message ID: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        
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
    
    // Update .env file with test account credentials
    console.log('\nUpdating .env file with Ethereal credentials...');
    const envPath = path.join(__dirname, '.env');
    const envContent = `# Server Configuration
PORT=3001

# Email Configuration
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=${testAccount.user}
EMAIL_PASS=${testAccount.pass}
EMAIL_FROM=${testAccount.user}

# API Keys
OPENAI_API_KEY=${process.env.OPENAI_API_KEY}
NEWS_API_KEY=${process.env.NEWS_API_KEY}
`;
    
    fs.writeFileSync(envPath, envContent);
    
    return {
      success: true,
      successCount,
      failCount,
      previewUrl: nodemailer.getTestMessageUrl(info),
      credentials: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    };
  } catch (error) {
    console.error('Error in Ethereal email setup:', error);
    return { success: false, error };
  }
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Test with Ethereal =====');
  
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
    
    // Step 4: Set up Ethereal email and send test
    console.log('\nSetting up Ethereal email and sending test newsletter...');
    const result = await setupEtherealAndSend(htmlContent);
    
    if (result.success) {
      console.log('\n===== Newsletter Test Complete =====');
      console.log('\nEthereal Email Credentials (saved to .env):');
      console.log(`User: ${result.credentials.user}`);
      console.log(`Password: ${result.credentials.pass}`);
      console.log('\nView the test email here:');
      console.log(result.previewUrl);
      console.log('\nThese credentials have been saved to your .env file.');
      console.log('You can now restart your server and the newsletter system will work.');
    }
  } catch (error) {
    console.error('\nError in newsletter test:', error);
    process.exit(1);
  }
}

// Run the script
main();
