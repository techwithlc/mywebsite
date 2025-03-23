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

// Configure CORS for all routes in this router
router.use(cors({
  origin: '*', // Allow all origins for testing
  methods: 'POST, GET, OPTIONS',
  credentials: true
}));

// Add OPTIONS handling for preflight requests
router.options('*', cors());

// Read subscribers from JSON file
const readSubscribers = () => {
  try {
    if (fs.existsSync(subscribersPath)) {
      const data = fs.readFileSync(subscribersPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading subscribers:', error);
    return [];
  }
};

// Write subscribers to JSON file
const writeSubscribers = (subscribers) => {
  try {
    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing subscribers:', error);
    return false;
  }
};

// POST endpoint to add a new subscriber
router.post('/add', async (req, res) => {
  console.log('✅ Sync request received with body:', JSON.stringify(req.body));
  console.log('✅ Headers:', JSON.stringify(req.headers));
  
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email address required' 
      });
    }
    
    console.log('✅ Valid email received:', email);
    
    // Read current subscribers
    const subscribers = readSubscribers();
    console.log('📋 Current subscriber count:', subscribers.length);
    
    // Check if already subscribed
    if (subscribers.some(sub => sub.email === email)) {
      console.log('⚠️ Email already exists:', email);
      return res.json({ 
        success: true, 
        message: 'This email is already subscribed!'
      });
    }
    
    console.log('✅ Adding new subscriber:', email);
    
    // Add new subscriber
    subscribers.push({
      email,
      subscribed: true,
      subscribedAt: new Date().toISOString(),
      lastEmailSent: null
    });
    
    // Save to file
    const success = writeSubscribers(subscribers);
    
    if (success) {
      console.log('✅ Successfully added subscriber:', email);
      console.log('📋 New subscriber count:', subscribers.length);
      return res.json({ 
        success: true, 
        message: 'Subscription successful!' 
      });
    } else {
      console.log('❌ Failed to write subscribers file');
      return res.status(500).json({
        success: false,
        message: 'Failed to save subscriber data'
      });
    }
  } catch (error) {
    console.error('❌ Error in sync-subscribers API:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing subscription',
      error: error.message
    });
  }
});

// GET endpoint to retrieve all subscribers (protected)
router.get('/', async (req, res) => {
  try {
    // Read current subscribers
    const subscribers = readSubscribers();
    
    return res.json({
      success: true,
      subscribers
    });
  } catch (error) {
    console.error('Error getting subscribers:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Simple GET endpoint to check if API is responsive
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Sync subscribers API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
