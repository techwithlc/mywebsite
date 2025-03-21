import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subscribersFilePath = path.join(__dirname, '..', 'subscribers.json');

// Helper functions for file-based storage
const readSubscribers = () => {
  try {
    const data = fs.readFileSync(subscribersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscribers file:', error);
    return [];
  }
};

const writeSubscribers = (subscribers) => {
  try {
    fs.writeFileSync(subscribersFilePath, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to subscribers file:', error);
    return false;
  }
};

// Get all active subscribers
router.get('/', async (req, res) => {
  try {
    const subscribers = readSubscribers().filter(sub => sub.subscribed);
    res.status(200).json({ success: true, subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subscribers', error: error.message });
  }
});

// Add a new subscriber
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }
    
    // Get current subscribers
    const subscribers = readSubscribers();
    
    // Check if email already exists
    const existingSubscriberIndex = subscribers.findIndex(sub => sub.email === email);
    
    if (existingSubscriberIndex !== -1) {
      if (subscribers[existingSubscriberIndex].subscribed) {
        return res.status(400).json({ success: false, message: 'Email is already subscribed' });
      } else {
        // Reactivate subscription
        subscribers[existingSubscriberIndex].subscribed = true;
        writeSubscribers(subscribers);
        return res.status(200).json({ success: true, message: 'Subscription reactivated successfully' });
      }
    }
    
    // Create new subscriber
    const newSubscriber = {
      email,
      subscribed: true,
      subscribedAt: new Date().toISOString(),
      lastEmailSent: null
    };
    
    subscribers.push(newSubscriber);
    writeSubscribers(subscribers);
    
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe', error: error.message });
  }
});

// Unsubscribe (soft delete)
router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Get current subscribers
    const subscribers = readSubscribers();
    
    // Find subscriber by email
    const subscriberIndex = subscribers.findIndex(sub => sub.email === email);
    
    if (subscriberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }
    
    // Update subscription status
    subscribers[subscriberIndex].subscribed = false;
    writeSubscribers(subscribers);
    
    res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ success: false, message: 'Failed to unsubscribe', error: error.message });
  }
});

export { router };