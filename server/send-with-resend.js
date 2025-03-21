import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'latest-ai-news.html');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to prompt for Resend API key
function promptForResendApiKey() {
  return new Promise((resolve) => {
    console.log('\n===== Resend.com API Key Setup =====');
    console.log('To send real emails, you need to set up a Resend.com account:');
    console.log('1. Go to https://resend.com and sign up for a free account');
    console.log('2. Verify your email address');
    console.log('3. Go to https://resend.com/api-keys and create a new API key');
    console.log('4. Copy the API key');
    
    rl.question('\nEnter your Resend API key: ', (apiKey) => {
      resolve(apiKey);
    });
  });
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

// Function to send emails with Resend
async function sendWithResend(htmlContent, resendApiKey) {
  try {
    console.log('\nSetting up Resend API...');
    
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
        // Setup email data for Resend API
        const emailData = {
          from: 'TechwithLC Newsletter <onboarding@resend.dev>',
          to: subscriber.email,
          subject: `Latest AI News from TechwithLC - ${new Date().toLocaleDateString()}`,
          html: htmlContent
        };
        
        // Send email using Resend API
        console.log(`Sending email to ${subscriber.email}...`);
        const response = await axios.post('https://api.resend.com/emails', emailData, {
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`Email sent to ${subscriber.email}`);
        console.log(`Response:`, response.data);
        
        successCount++;
        
        // Update subscriber with last email sent date
        subscriber.lastEmailSent = new Date().toISOString();
      } catch (error) {
        console.error(`Error sending to ${subscriber.email}:`, error.response?.data || error.message);
        failCount++;
      }
    }
    
    // Save updated subscribers
    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    
    console.log(`\nNewsletter sending complete: ${successCount} successful, ${failCount} failed`);
    
    // Update .env file with Resend API key
    console.log('\nUpdating .env file with Resend API key...');
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Add or update RESEND_API_KEY
      if (envContent.includes('RESEND_API_KEY=')) {
        envContent = envContent.replace(/RESEND_API_KEY=.*/g, `RESEND_API_KEY=${resendApiKey}`);
      } else {
        envContent += `\nRESEND_API_KEY=${resendApiKey}`;
      }
    } else {
      envContent = `# Server Configuration
PORT=3001

# Email Configuration
RESEND_API_KEY=${resendApiKey}

# API Keys
OPENAI_API_KEY=${process.env.OPENAI_API_KEY}
NEWS_API_KEY=${process.env.NEWS_API_KEY}
`;
    }
    
    fs.writeFileSync(envPath, envContent);
    
    return {
      success: true,
      successCount,
      failCount
    };
  } catch (error) {
    console.error('Error in Resend setup:', error);
    return { success: false, error };
  }
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter with Resend =====');
  
  try {
    // Step 1: Get Resend API key
    const resendApiKey = await promptForResendApiKey();
    
    // Step 2: Fetch latest AI news
    const articles = await fetchLatestAINews();
    
    // Print article titles
    console.log('\nArticles that will be sent:');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.source.name})`);
    });
    
    // Step 3: Summarize news with OpenAI
    const htmlContent = await summarizeNewsWithOpenAI(articles);
    
    // Step 4: Save to file
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`\nNewsletter HTML saved to: ${outputPath}`);
    
    // Step 5: Send with Resend
    console.log('\nSending newsletter with Resend...');
    const result = await sendWithResend(htmlContent, resendApiKey);
    
    if (result.success) {
      console.log('\n===== Newsletter Sending Complete =====');
      console.log(`\nSuccessfully sent newsletters to ${result.successCount} subscribers!`);
      console.log('Check your inbox (and spam folder) for the newsletter.');
      console.log('\nYour Resend API key has been saved to your .env file.');
      console.log('You can now restart your server and the newsletter system will work with real emails.');
    }
    
    rl.close();
  } catch (error) {
    console.error('\nError in newsletter sending:', error);
    rl.close();
    process.exit(1);
  }
}

// Run the script
main();
