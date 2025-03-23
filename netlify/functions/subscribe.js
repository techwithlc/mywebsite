// Simple subscription handler with basic file storage
const fs = require('fs');
const path = require('path');

// Helper function to safely read subscribers
function readSubscribers() {
  try {
    // Try multiple paths for greater compatibility between environments
    const possiblePaths = [
      '/tmp/subscribers.json', // Netlify Functions writable directory
      path.join(__dirname, '../../server/subscribers.json'), // Local development
      path.join(__dirname, '../../../server/subscribers.json') // Another possible path
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
  // Always write to /tmp for Netlify Functions
  try {
    const tmpPath = '/tmp/subscribers.json';
    fs.writeFileSync(tmpPath, JSON.stringify(subscribers, null, 2));
    console.log(`Updated subscribers in ${tmpPath}`);
  } catch (tmpError) {
    console.error('Error writing to /tmp:', tmpError);
  }
  
  // Also try to write to server directory for local development
  try {
    const serverPath = path.join(__dirname, '../../server/subscribers.json');
    fs.writeFileSync(serverPath, JSON.stringify(subscribers, null, 2));
    console.log(`Updated subscribers in ${serverPath}`);
  } catch (serverError) {
    // This might fail in Netlify environment, which is expected
    console.log('Note: Could not write to server path (expected in production)');
  }
  
  // Try alternative path as well
  try {
    const altPath = path.join(__dirname, '../../../server/subscribers.json');
    fs.writeFileSync(altPath, JSON.stringify(subscribers, null, 2));
    console.log(`Updated subscribers in ${altPath}`);
  } catch (altError) {
    // Also might fail, which is expected
  }
  
  return true;
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
