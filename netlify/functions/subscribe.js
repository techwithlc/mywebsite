// Simple subscription handler with basic file storage
const fs = require('fs');

// Helper function to safely read subscribers
function readSubscribers() {
  try {
    // In Netlify Functions, /tmp is the only writable directory
    const filePath = '/tmp/subscribers.json';
    
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading subscribers:', error);
    return [];
  }
}

// Helper function to safely write subscribers
function writeSubscribers(subscribers) {
  try {
    const filePath = '/tmp/subscribers.json';
    fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing subscribers:', error);
    return false;
  }
}

exports.handler = async function(event, context) {
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  }
  
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Method not allowed' 
      })
    };
  }
  
  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const email = body.email;
    
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Valid email address required' 
        })
      };
    }
    
    // Read current subscribers
    const subscribers = readSubscribers();
    
    // Check if already subscribed
    if (subscribers.some(sub => sub.email === email)) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'You are already subscribed!' 
        })
      };
    }
    
    // Add new subscriber
    subscribers.push({
      email,
      subscribeDate: new Date().toISOString(),
      active: true
    });
    
    // Save to file
    writeSubscribers(subscribers);
    
    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Subscription successful!' 
      })
    };
    
  } catch (error) {
    console.error('Error in subscription:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Server error, please try again later' 
      })
    };
  }
};
