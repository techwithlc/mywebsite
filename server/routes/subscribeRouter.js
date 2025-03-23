import express from 'express';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subscribersFilePath = path.join(__dirname, '..', 'subscribers.json');

/**
 * Helper function to read subscribers from JSON file
 */
const readSubscribers = () => {
  try {
    if (!fs.existsSync(subscribersFilePath)) {
      // Create file if it doesn't exist
      fs.writeFileSync(subscribersFilePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(subscribersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers file:', error);
    return [];
  }
};

/**
 * Helper function to write subscribers to JSON file
 */
const writeSubscribers = (subscribers) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(subscribersFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(subscribersFilePath, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to subscribers file:', error);
    return false;
  }
};

/**
 * Create SMTP transporter
 */
const createTransporter = () => {
  // Check if email configuration is available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Missing email configuration, transporter will be unavailable');
    return null;
  }

  // Create transporter with Gmail SMTP
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true, // SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
};

/**
 * POST /api/subscribe - Handle new subscription requests
 */
router.post('/', async (req, res) => {
  try {
    // Validate email
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    // Read existing subscribers
    const subscribers = readSubscribers();
    
    // Check if already subscribed
    if (subscribers.some(sub => sub.email === email)) {
      return res.status(200).json({ success: true, message: 'You are already subscribed' });
    }

    // Add new subscriber
    subscribers.push({
      email,
      subscribeDate: new Date().toISOString(),
      active: true
    });
    
    // Save updated subscribers list
    const saveSuccess = writeSubscribers(subscribers);
    if (!saveSuccess) {
      return res.status(500).json({ success: false, message: 'Failed to save subscription' });
    }

    // Send confirmation email
    try {
      const transporter = createTransporter();
      if (transporter) {
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
      } else {
        console.log('Email transport not available, skipping confirmation email');
      }
    } catch (emailError) {
      // Log error but don't fail the request
      console.error('Failed to send confirmation email:', emailError);
    }

    // Return success
    return res.status(200).json({ success: true, message: 'Subscription successful! Check your email for confirmation.' });
  } catch (error) {
    console.error('Error processing subscription:', error);
    return res.status(500).json({ success: false, message: 'Server error processing subscription' });
  }
});

export default router;
