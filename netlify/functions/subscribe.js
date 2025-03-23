import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define path to subscribers file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subscribersPath = path.join(__dirname, '../../server/subscribers.json');

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Helper function to read subscribers
const readSubscribers = () => {
  try {
    if (!fs.existsSync(subscribersPath)) {
      fs.writeFileSync(subscribersPath, JSON.stringify([], null, 2));
      return [];
    }
    
    const data = fs.readFileSync(subscribersPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers:', error);
    return [];
  }
};

// Helper function to write subscribers
const writeSubscribers = (subscribers) => {
  try {
    const dir = path.dirname(subscribersPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing subscribers:', error);
    return false;
  }
};

// Handler for subscription requests
export async function handler(event) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { email } = JSON.parse(event.body);
    
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Valid email is required' })
      };
    }

    // Read current subscribers
    const subscribers = readSubscribers();
    
    // Check if already subscribed
    if (subscribers.some(sub => sub.email === email)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'You are already subscribed' })
      };
    }
    
    // Add new subscriber
    subscribers.push({
      email,
      subscribeDate: new Date().toISOString(),
      active: true
    });
    
    // Save updated subscribers list
    writeSubscribers(subscribers);
    
    // Send confirmation email
    await transporter.sendMail({
      from: `"TechwithLC" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to TechwithLC Newsletter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
            <h1>TechwithLC Newsletter</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e9ecef; border-top: none;">
            <h2>Thank you for subscribing!</h2>
            <p>You will now receive the latest AI news and updates from TechwithLC.</p>
            <p>We're excited to have you join our community!</p>
            <div style="margin-top: 30px;">
              <p>Best regards,<br>The TechwithLC Team</p>
            </div>
          </div>
        </div>
      `
    });

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Subscription successful! Check your email for confirmation.' 
      })
    };
    
  } catch (error) {
    console.error('Error processing subscription:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to process subscription. Please try again later.' 
      })
    };
  }
}
