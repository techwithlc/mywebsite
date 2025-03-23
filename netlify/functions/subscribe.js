// Simple subscription handler with basic file storage
const fs = require('fs');
const path = require('path');

// Helper function to safely read subscribers
function readSubscribers() {
  try {
    // Try multiple paths for greater compatibility between environments
    const possiblePaths = [
      '/tmp/subscribers.json', // Netlify Functions writable directory
      path.resolve(__dirname, '../../server/subscribers.json'), // Local development - relative to netlify/functions
      path.resolve(__dirname, '../../../server/subscribers.json'), // Another possible path
      path.resolve('/Users/lawrencechen/Desktop/mywebsite/server/subscribers.json') // Direct absolute path
    ];
    
    // Use the first file that exists
    let subscribersData = [];
    let foundFile = false;
    
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        console.log(`Reading subscribers from ${filePath}`);
        const data = fs.readFileSync(filePath, 'utf8');
        subscribersData = data ? JSON.parse(data) : [];
        foundFile = true;
        break;
      }
    }
    
    if (!foundFile) {
      console.log('No existing subscribers file found');
    }
    
    return subscribersData;
  } catch (error) {
    console.error('Error reading subscribers:', error);
    return [];
  }
}

// Helper function to safely write subscribers
function writeSubscribers(subscribers) {
  const results = {
    tmp: false,
    server: false,
    serverAlt: false,
    direct: false
  };

  // Always write to /tmp for Netlify Functions
  try {
    const tmpPath = '/tmp/subscribers.json';
    fs.writeFileSync(tmpPath, JSON.stringify(subscribers, null, 2));
    console.log(`Updated subscribers in ${tmpPath}`);
    results.tmp = true;
  } catch (tmpError) {
    console.error('Error writing to /tmp:', tmpError);
  }
  
  // Try to write to server directory for local development
  try {
    const serverPath = path.resolve(__dirname, '../../server/subscribers.json');
    fs.writeFileSync(serverPath, JSON.stringify(subscribers, null, 2));
    console.log(`Updated subscribers in ${serverPath}`);
    results.server = true;
  } catch (serverError) {
    console.log('Note: Could not write to relative server path 1:', serverError.message);
  }
  
  // Try alternative path as well
  try {
    const altPath = path.resolve(__dirname, '../../../server/subscribers.json');
    fs.writeFileSync(altPath, JSON.stringify(subscribers, null, 2));
    console.log(`Updated subscribers in ${altPath}`);
    results.serverAlt = true;
  } catch (altError) {
    console.log('Note: Could not write to relative server path 2:', altError.message);
  }
  
  // Last resort - try direct absolute path
  try {
    const directPath = '/Users/lawrencechen/Desktop/mywebsite/server/subscribers.json';
    fs.writeFileSync(directPath, JSON.stringify(subscribers, null, 2));
    console.log(`Updated subscribers in ${directPath}`);
    results.direct = true;
  } catch (directError) {
    console.log('Note: Could not write to direct path:', directError.message);
  }
  
  return results;
}

exports.handler = async function(event, context) {
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Content-Type': 'application/json'
  };

  // Special debug endpoint
  if (event.httpMethod === 'GET' && event.path.includes('/debug')) {
    // Read current subscribers for debugging
    const subscribers = readSubscribers();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Debug info',
        subscriberCount: subscribers.length,
        subscribers: subscribers,
        environment: process.env.NODE_ENV || 'unknown',
        netlifyContext: !!process.env.NETLIFY || false,
        paths: {
          dirname: __dirname,
          resolved: {
            server1: path.resolve(__dirname, '../../server/subscribers.json'),
            server2: path.resolve(__dirname, '../../../server/subscribers.json'),
            direct: '/Users/lawrencechen/Desktop/mywebsite/server/subscribers.json'
          }
        }
      })
    };
  }
  
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
    
    // Add new subscriber with the correct field structure to match existing subscribers.json
    subscribers.push({
      email,
      subscribed: true,
      subscribedAt: new Date().toISOString(),
      lastEmailSent: null
    });
    
    // Save to file
    const writeResults = writeSubscribers(subscribers);
    
    // Return success response with debug information
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Subscription successful!',
        debug: {
          subscriberCount: subscribers.length,
          writeResults: writeResults
        }
      })
    };
    
  } catch (error) {
    console.error('Error in subscription:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Server error, please try again later',
        error: error.message
      })
    };
  }
};
