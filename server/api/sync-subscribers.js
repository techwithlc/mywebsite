// Synchronize subscribers between Netlify and local server
import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to subscribers file
const subscribersPath = path.join(__dirname, '../subscribers.json');

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
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email address required' 
      });
    }
    
    // Read current subscribers
    const subscribers = readSubscribers();
    
    // Check if already subscribed
    if (subscribers.some(sub => sub.email === email)) {
      return res.json({ 
        success: true, 
        message: 'This email is already subscribed!'
      });
    }
    
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
      return res.json({ 
        success: true, 
        message: 'Subscription successful!' 
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to save subscription'
      });
    }
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
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

export default router;
