// Direct subscriber addition function
// This function is a special emergency endpoint that writes directly to the subscribers.json file
// when the normal sync mechanism fails

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Path to subscribers file (using relative path from netlify functions)
const subscribersPath = path.join(__dirname, '../../server/subscribers.json');

// Function to read subscribers from JSON file
const readSubscribers = () => {
  try {
    if (fs.existsSync(subscribersPath)) {
      console.log('DIRECT SYNC - Found subscribers file at:', subscribersPath);
      const data = fs.readFileSync(subscribersPath, 'utf8');
      return JSON.parse(data);
    }
    console.log('DIRECT SYNC - Subscribers file not found at:', subscribersPath);
    return [];
  } catch (error) {
    console.error('DIRECT SYNC - Error reading subscribers:', error);
    return [];
  }
};

// Function to write subscribers to JSON file
const writeSubscribers = (subscribers) => {
  try {
    console.log('DIRECT SYNC - Attempting to write to subscribers file');
    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    console.log('DIRECT SYNC - Successfully wrote to subscribers file');
    return true;
  } catch (error) {
    console.error('DIRECT SYNC - Error writing subscribers:', error);
    return false;
  }
};

// Handler function
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const payload = JSON.parse(event.body);
    const { email, secret, timestamp } = payload;
    
    console.log('DIRECT SYNC - Received request for:', email);
    
    // Basic validation
    if (!email || !email.includes('@')) {
      console.log('DIRECT SYNC - Invalid email format:', email);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Valid email address required' })
      };
    }
    
    // Simple security check
    const validSecret = process.env.SYNC_SECRET || 'techwithlc-subscriber-sync';
    if (secret !== validSecret) {
      console.log('DIRECT SYNC - Invalid secret provided');
      return {
        statusCode: 403,
        body: JSON.stringify({ success: false, message: 'Invalid authentication' })
      };
    }
    
    // Read current subscribers
    const subscribers = readSubscribers();
    console.log('DIRECT SYNC - Current subscriber count:', subscribers.length);
    
    // Check if already subscribed
    if (subscribers.some(sub => sub.email === email)) {
      console.log('DIRECT SYNC - Email already exists:', email);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Email already subscribed' })
      };
    }
    
    // Add new subscriber
    const newSubscriber = {
      email,
      subscribed: true,
      subscribedAt: new Date().toISOString(),
      lastEmailSent: null
    };
    
    subscribers.push(newSubscriber);
    console.log('DIRECT SYNC - Added new subscriber:', email);
    
    // Save to file
    const success = writeSubscribers(subscribers);
    
    if (success) {
      console.log('DIRECT SYNC - Successfully added subscriber to file');
      
      // Try to notify the main server as well (but don't wait for response)
      try {
        axios.post('http://localhost:3001/api/sync-subscribers/add', { email })
          .then(() => console.log('DIRECT SYNC - Notified local server'))
          .catch(() => console.log('DIRECT SYNC - Failed to notify local server'));
      } catch (e) {
        console.log('DIRECT SYNC - Error notifying local server:', e.message);
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: 'Subscription successful!',
          subscriberCount: subscribers.length
        })
      };
    } else {
      console.log('DIRECT SYNC - Failed to write subscribers file');
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: 'Failed to save subscriber data'
        })
      };
    }
  } catch (error) {
    console.error('DIRECT SYNC - Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Server error',
        error: error.message
      })
    };
  }
};
