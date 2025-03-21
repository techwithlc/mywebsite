import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subscribersPath = path.join(__dirname, '..', 'subscribers.json');

/**
 * Create a newsletter HTML template
 * @param {Object} newsContent - The content for the newsletter
 * @returns {string} HTML template
 */
function createNewsletterTemplate(newsContent) {
  return newsContent.html || `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${newsContent.title}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        color: #2c3e50;
        border-bottom: 2px solid #3498db;
        padding-bottom: 10px;
      }
      h2 {
        color: #2980b9;
        margin-top: 30px;
      }
      .article {
        margin-bottom: 30px;
        padding: 15px;
        background-color: #f9f9f9;
        border-left: 4px solid #3498db;
      }
      .source {
        font-style: italic;
        color: #7f8c8d;
      }
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 0.9em;
        color: #7f8c8d;
      }
      a {
        color: #3498db;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <h1>${newsContent.title}</h1>
    <p>${newsContent.content}</p>
    <div class="footer">
      <p>TechwithLC Newsletter - Stay updated with the latest in AI</p>
      <p>If you no longer wish to receive these emails, you can <a href="https://techwithlc.com/unsubscribe">unsubscribe here</a>.</p>
    </div>
  </body>
  </html>
  `;
}

/**
 * Send an email using Resend API
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email HTML content
 * @returns {Promise} - Promise resolving to the email info
 */
async function sendEmail(to, subject, htmlContent) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not set in environment variables');
    }
    
    const emailData = {
      from: 'TechwithLC Newsletter <onboarding@resend.dev>',
      to,
      subject,
      html: htmlContent
    };
    
    const response = await axios.post('https://api.resend.com/emails', emailData, {
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Send newsletter to all subscribers
 * @param {Object} newsContent - The content for the newsletter
 * @returns {Promise<Object>} - Object with success count and fail count
 */
async function sendNewsletterToSubscribers(newsContent) {
  try {
    // Create HTML template
    const htmlContent = createNewsletterTemplate(newsContent);
    
    // Get subscribers
    let subscribers = [];
    if (fs.existsSync(subscribersPath)) {
      subscribers = JSON.parse(fs.readFileSync(subscribersPath, 'utf8'));
    } else {
      console.warn('No subscribers.json file found');
      return { successCount: 0, failCount: 0 };
    }
    
    // Send emails to all subscribers
    console.log(`Sending newsletter to ${subscribers.length} subscribers...`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const subscriber of subscribers) {
      if (!subscriber.subscribed) continue;
      
      try {
        // Send email
        console.log(`Sending email to ${subscriber.email}...`);
        await sendEmail(
          subscriber.email,
          `Latest AI News from TechwithLC - ${new Date().toLocaleDateString()}`,
          htmlContent
        );
        
        console.log(`Email sent to ${subscriber.email}`);
        
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
    
    console.log(`Newsletter sending complete: ${successCount} successful, ${failCount} failed`);
    
    return { successCount, failCount };
  } catch (error) {
    console.error('Error sending newsletter:', error);
    throw error;
  }
}

export {
  createNewsletterTemplate,
  sendEmail,
  sendNewsletterToSubscribers
};
