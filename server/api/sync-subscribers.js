// Synchronize subscribers between Netlify and local server
import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import cors from 'cors';

const router = express.Router();

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to subscribers file
const subscribersPath = path.join(__dirname, '../subscribers.json');

// Enable CORS for all routes in this router
router.use(cors({
  origin: '*', // Allow all origins for this API
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Source', 'X-Subscription-Time']
}));

// Helper function to read subscribers from file
function readSubscribers() {
  try {
    if (fs.existsSync(subscribersPath)) {
      console.log('Reading subscribers from:', subscribersPath);
      const data = fs.readFileSync(subscribersPath, 'utf8');
      return JSON.parse(data);
    }
    console.log('Subscribers file not found, creating empty array');
    return [];
  } catch (error) {
    console.error('Error reading subscribers file:', error);
    return [];
  }
}

// Helper function to write subscribers to file
function writeSubscribers(subscribers) {
  try {
    console.log('Writing subscribers to file, count:', subscribers.length);
    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing subscribers file:', error);
    return false;
  }
}

// Simple status endpoint to check if the API is up
router.get('/status', (req, res) => {
  console.log('Status check requested');
  res.json({ 
    success: true, 
    message: 'Sync subscribers API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all subscribers
router.get('/', (req, res) => {
  console.log('Get all subscribers requested');
  const subscribers = readSubscribers();
  res.json({ subscribers });
});

// Add a new subscriber
router.post('/add', async (req, res) => {
  console.log('Add subscriber request received');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  const { email } = req.body;
  
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    console.log('Invalid email provided:', email);
    return res.status(400).json({
      success: false,
      message: 'Valid email address required'
    });
  }

  console.log('Processing subscription for email:', email);
  
  // Read existing subscribers
  const subscribers = readSubscribers();
  
  // Check if already subscribed
  const existingSubscriber = subscribers.find(sub => sub.email === email);
  if (existingSubscriber) {
    console.log('Email already exists in subscribers:', email);
    return res.json({
      success: true,
      message: 'Email already subscribed',
      alreadyExists: true
    });
  }
  
  // Add new subscriber
  const newSubscriber = {
    email,
    subscribed: true,
    subscribedAt: new Date().toISOString(),
    lastEmailSent: null
  };
  
  subscribers.push(newSubscriber);
  console.log('New subscriber added:', email);
  
  // Save updated subscribers
  const success = writeSubscribers(subscribers);
  
  if (success) {
    console.log('Successfully saved updated subscribers list');
    res.json({
      success: true,
      message: 'Subscription successful',
      subscriberCount: subscribers.length
    });
  } else {
    console.error('Failed to save updated subscribers list');
    res.status(500).json({
      success: false,
      message: 'Failed to save subscriber data'
    });
  }
});

export default router;
