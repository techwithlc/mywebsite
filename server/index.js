import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import { router as subscriberRoutes } from './routes/subscribers.js';
import { feedsRouter } from './routes/feeds.js';
import { webhookRouter } from './routes/webhooks.js';
import { fetchAndSummarizeNews } from './services/newsService.js';
import { sendNewsletterToAllSubscribers } from './services/emailService.js';
import { updateFeeds } from './services/rssFeedService.js';
import nodemailer from 'nodemailer';
import syncSubscribersRouter from './api/sync-subscribers.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8888', 'https://techwithlc.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Create public directory for static files if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Serve static files from public directory
app.use('/public', express.static(publicDir));

// Routes
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/feeds', feedsRouter);
app.use('/api/webhook', webhookRouter);

// Direct subscription endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email address required' 
      });
    }

    // Setup file path
    const subscribersPath = path.join(__dirname, 'subscribers.json');
    
    // Load existing subscribers
    let subscribers = [];
    if (fs.existsSync(subscribersPath)) {
      const data = fs.readFileSync(subscribersPath, 'utf8');
      subscribers = JSON.parse(data);
    }

    // Check if already subscribed
    const existingSubscriber = subscribers.find(sub => sub.email === email);
    if (existingSubscriber) {
      return res.status(200).json({ 
        success: true, 
        message: 'You are already subscribed!' 
      });
    }

    // Add new subscriber
    const newSubscriber = {
      email,
      active: true,
      createdAt: new Date().toISOString()
    };
    subscribers.push(newSubscriber);

    // Save to file
    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    
    // Send confirmation email if enabled
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
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
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the subscription if email sending fails
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Subscription successful!' 
    });
  } catch (error) {
    console.error('Error in subscribe API:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error, please try again later' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Setup file-based storage instead of MongoDB
const subscribersFilePath = path.join(__dirname, 'subscribers.json');

// Initialize subscribers file if it doesn't exist
if (!fs.existsSync(subscribersFilePath)) {
  fs.writeFileSync(subscribersFilePath, JSON.stringify([]));
  console.log('Created subscribers.json file for storage');
}

console.log('Using file-based storage instead of MongoDB');

// Schedule weekly newsletter (every Monday at 9:00 AM)
cron.schedule('0 9 * * 1', async () => {
  try {
    console.log('Running scheduled newsletter task');
    
    // First update the feeds
    await updateFeeds();
    console.log('RSS and JSON feeds updated');
    
    // Then send the newsletter
    const newsContent = await fetchAndSummarizeNews();
    await sendNewsletterToAllSubscribers(newsContent);
    console.log('Newsletter sent successfully');
  } catch (error) {
    console.error('Error sending scheduled newsletter:', error);
  }
});

// Manual trigger endpoint for newsletter (protected in production)
app.post('/api/send-newsletter', async (req, res) => {
  try {
    // First update the feeds
    await updateFeeds();
    
    // Then send the newsletter
    const newsContent = await fetchAndSummarizeNews();
    await sendNewsletterToAllSubscribers(newsContent);
    res.status(200).json({ success: true, message: 'Newsletter sent successfully' });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ success: false, message: 'Failed to send newsletter', error: error.message });
  }
});

// Sync subscribers endpoint
app.use('/api/sync-subscribers', syncSubscribersRouter);

// Generate initial RSS and JSON feeds on server start
updateFeeds().then(() => {
  console.log('Initial RSS and JSON feeds generated');
}).catch(error => {
  console.error('Error generating initial feeds:', error);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`RSS feed available at: http://localhost:${PORT}/api/feeds/rss`);
  console.log(`JSON feed available at: http://localhost:${PORT}/api/feeds/json`);
  console.log(`Subscription API available at: http://localhost:${PORT}/api/subscribe`);
});