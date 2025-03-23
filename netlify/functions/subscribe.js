const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Path to subscribers file - Netlify Functions have a writable /tmp directory
const SUBSCRIBERS_FILE = '/tmp/subscribers.json';

// Helper to read subscribers
const readSubscribers = () => {
  try {
    // Check if file exists
    if (!fs.existsSync(SUBSCRIBERS_FILE)) {
      return [];
    }
    
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    
    // Handle empty file case
    if (!data || !data.trim()) {
      return [];
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers:', error);
    return []; // Return empty array on error
  }
};

// Helper to write subscribers
const writeSubscribers = (subscribers) => {
  try {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing subscribers:', error);
    return false;
  }
};

// Send confirmation email (non-blocking)
const sendConfirmationEmail = async (email) => {
  // Skip if no email credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email credentials not found, skipping confirmation email');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

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
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

exports.handler = async (event, context) => {
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight request successful' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  // Parse and validate request body
  let email;
  try {
    const body = JSON.parse(event.body || '{}');
    email = body.email;
    
    // Basic email validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Valid email is required' })
      };
    }
  } catch (error) {
    console.error('Error parsing request body:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: 'Invalid request body' })
    };
  }

  try {
    // Read existing subscribers
    const subscribers = readSubscribers();
    
    // Check if already subscribed
    if (subscribers.some(sub => sub.email === email)) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'You are already subscribed!' })
      };
    }

    // Add new subscriber
    subscribers.push({
      email,
      subscribeDate: new Date().toISOString(),
      active: true
    });
    
    // Save subscribers
    const saveResult = writeSubscribers(subscribers);
    if (!saveResult) {
      throw new Error('Failed to save subscription data');
    }
    
    // Send confirmation email (no await - non-blocking)
    sendConfirmationEmail(email).catch(error => {
      console.error('Error in confirmation email:', error);
    });
    
    // Return success
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Subscription successful!' })
    };
  } catch (error) {
    console.error('Error processing subscription:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Server error processing subscription' })
    };
  }
};
