import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subscribersFilePath = path.join(__dirname, '..', 'subscribers.json');

// Helper function to read subscribers from file
const readSubscribers = () => {
  try {
    const data = fs.readFileSync(subscribersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers file:', error);
    return [];
  }
};

// Helper function to write subscribers to file
const writeSubscribers = (subscribers) => {
  try {
    fs.writeFileSync(subscribersFilePath, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to subscribers file:', error);
    return false;
  }
};

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

/**
 * Send email to a single subscriber
 */
export async function sendEmail(to, subject, htmlContent) {
  try {
    const mailOptions = {
      from: `"TechwithLC" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
}

/**
 * Create HTML email template for newsletter
 */
function createNewsletterTemplate(newsContent) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsContent.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(to right, #3b82f6, #06b6d4);
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 0 0 5px 5px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #6b7280;
    }
    .btn {
      display: inline-block;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 15px;
    }
    .unsubscribe {
      color: #6b7280;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TechwithLC</h1>
      <p>AI News Digest - ${newsContent.date}</p>
    </div>
    <div class="content">
      <h2>Latest in AI Technology</h2>
      
      ${newsContent.content}
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://techwithlc.com" class="btn">Visit Our Website</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} TechwithLC. All rights reserved.</p>
      <p>
        <a href="https://techwithlc.com/unsubscribe?email={{email}}" class="unsubscribe">
          Unsubscribe
        </a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send newsletter to all active subscribers
 */
export async function sendNewsletterToAllSubscribers(newsContent) {
  try {
    const subscribers = readSubscribers().filter(sub => sub.subscribed);
    
    if (subscribers.length === 0) {
      console.log('No active subscribers found');
      return;
    }
    
    console.log(`Sending newsletter to ${subscribers.length} subscribers`);
    
    const emailTemplate = createNewsletterTemplate(newsContent);
    const subject = `${newsContent.title} - ${newsContent.date}`;
    
    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        // Replace placeholder with actual email
        const personalizedHtml = emailTemplate.replace('{{email}}', encodeURIComponent(subscriber.email));
        
        await sendEmail(subscriber.email, subject, personalizedHtml);
        
        // Update last email sent date
        const allSubscribers = readSubscribers();
        const subscriberIndex = allSubscribers.findIndex(sub => sub.email === subscriber.email);
        
        if (subscriberIndex !== -1) {
          allSubscribers[subscriberIndex].lastEmailSent = new Date().toISOString();
          writeSubscribers(allSubscribers);
        }
        
        return { email: subscriber.email, status: 'success' };
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        return { email: subscriber.email, status: 'failed', error: error.message };
      }
    });
    
    const results = await Promise.all(emailPromises);
    
    const successCount = results.filter(r => r.status === 'success').length;
    const failureCount = results.filter(r => r.status === 'failed').length;
    
    console.log(`Newsletter sent: ${successCount} successful, ${failureCount} failed`);
    
    return {
      totalSubscribers: subscribers.length,
      successCount,
      failureCount,
      results
    };
  } catch (error) {
    console.error('Error sending newsletter to subscribers:', error);
    throw error;
  }
}
