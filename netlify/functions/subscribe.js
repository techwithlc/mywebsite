// Simple subscription handler with basic file storage
const fs = require('fs');
const path = require('path');
const axios = require('axios');

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

// Helper function to sync with main server
async function syncWithMainServer(email) {
  try {
    console.log('SYNC ATTEMPT - Starting sync for:', email);
    
    // Define multiple server endpoints to try (both direct and API gateway)
    const endpoints = [
      { url: 'http://localhost:3001/api/sync-subscribers/add', type: 'local' },
      { url: 'https://techwithlc.com/api/sync-subscribers/add', type: 'production' },
      { url: 'https://api.techwithlc.com/sync-subscribers/add', type: 'alt-production' },
      { url: process.env.SERVER_URL ? `${process.env.SERVER_URL}/api/sync-subscribers/add` : null, type: 'env' }
    ].filter(endpoint => endpoint.url); // Filter out null URLs
    
    console.log(`SYNC ATTEMPT - Will try ${endpoints.length} endpoints`);
    
    // Also make a local request to the server via direct HTTP
    let succeeded = false;
    let firstError = null;
    
    // Try all endpoints with short timeouts
    for (const endpoint of endpoints) {
      try {
        console.log(`SYNC ATTEMPT - Trying endpoint: ${endpoint.url} (${endpoint.type})`);
        
        const response = await axios.post(endpoint.url, { email }, {
          headers: { 
            'Content-Type': 'application/json',
            'X-Source': 'netlify-function',
            'X-Subscription-Time': new Date().toISOString()
          },
          timeout: 3000 // 3 second timeout to avoid hanging
        });
        
        if (response.data && response.data.success) {
          console.log(`SYNC SUCCESS - ${endpoint.type} endpoint succeeded:`, response.data);
          succeeded = true;
          break; // Exit after first success
        } else {
          console.log(`SYNC WARNING - ${endpoint.type} endpoint returned non-success:`, response.data);
        }
      } catch (err) {
        if (!firstError) firstError = err;
        console.log(`SYNC ERROR - ${endpoint.type} endpoint failed:`, err.message);
      }
    }
    
    // If all endpoints failed, try a last-resort direct server call
    if (!succeeded) {
      try {
        console.log('SYNC ATTEMPT - All endpoints failed, trying direct server API call...');
        // This is a special direct call that attempts to bypass any networking issues
        const specialResponse = await axios.post('https://techwithlc.com/.netlify/functions/direct-subscriber-add', {
          email,
          secret: process.env.SYNC_SECRET || 'techwithlc-subscriber-sync',
          timestamp: Date.now()
        }, { timeout: 5000 });
        
        if (specialResponse.data && specialResponse.data.success) {
          console.log('SYNC SUCCESS - Direct API call succeeded:', specialResponse.data);
          succeeded = true;
        }
      } catch (finalError) {
        console.log('SYNC ERROR - Even direct API call failed:', finalError.message);
      }
    }
    
    return succeeded;
  } catch (error) {
    console.error('SYNC FATAL - Unexpected error in syncWithMainServer:', error.message);
    return false;
  }
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

    // Try to sync with main server
    const syncResult = await syncWithMainServer(email);
    
    // Return success response with debug information
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Subscription successful!',
        debug: {
          subscriberCount: subscribers.length,
          writeResults: writeResults,
          syncWithMainServer: syncResult
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
