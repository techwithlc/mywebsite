import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Netlify Functions environment doesn't support import.meta.url
// Use __dirname instead with CommonJS
const __dirname = path.dirname(
  fileURLToPath(import.meta.url || 'file:///netlify/functions/subscribe.js')
);

// Path to subscribers file - use a path that works in Netlify Functions
const subscribersPath = path.join(__dirname, '..', '..', 'server', 'subscribers.json');

export async function handler(event) {
  try {
    // Enable CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Preflight request successful' })
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Method not allowed' })
      };
    }

    // Parse body
    const body = JSON.parse(event.body);
    const email = body.email;

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Valid email address required' })
      };
    }

    // Load existing subscribers
    let subscribers = [];
    try {
      if (fs.existsSync(subscribersPath)) {
        const data = fs.readFileSync(subscribersPath, 'utf8');
        subscribers = JSON.parse(data);
      }
    } catch (err) {
      // If file doesn't exist or can't be read, start with empty array
      console.log('Starting with empty subscribers list:', err);
    }

    // Check if already subscribed
    const existingSubscriber = subscribers.find(sub => sub.email === email);
    if (existingSubscriber) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'You are already subscribed!' })
      };
    }

    // Add new subscriber
    const newSubscriber = {
      email,
      active: true,
      createdAt: new Date().toISOString()
    };
    subscribers.push(newSubscriber);

    // Save to file
    try {
      fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
    } catch (writeErr) {
      console.error('Error writing subscribers file:', writeErr);
      // Try creating directory if it doesn't exist
      const dir = path.dirname(subscribersPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
      } else {
        throw writeErr;
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Subscription successful!' })
    };
  } catch (error) {
    console.error('Error in subscribe API:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Server error, please try again later' })
    };
  }
}
