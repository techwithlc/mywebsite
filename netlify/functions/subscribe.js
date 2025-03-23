// Simple subscription handler with direct file handling
const fs = require('fs');
const path = require('path');

// Absolute paths for more reliability
const MAIN_SUBSCRIBERS_PATH = '/Users/lawrencechen/Desktop/mywebsite/server/subscribers.json';
const TEMP_SUBSCRIBERS_PATH = '/tmp/subscribers.json';

// Helper function to safely read subscribers from the main file
function readMainSubscribers() {
  try {
    console.log('Reading from main subscribers file:', MAIN_SUBSCRIBERS_PATH);
    
    if (fs.existsSync(MAIN_SUBSCRIBERS_PATH)) {
      const data = fs.readFileSync(MAIN_SUBSCRIBERS_PATH, 'utf8');
      return JSON.parse(data);
    } else {
      console.log('Main subscribers file not found');
      return [];
    }
  } catch (error) {
    console.error('Error reading main subscribers file:', error);
    return [];
  }
}

// Helper function to safely write subscribers to the main file
function writeMainSubscribers(subscribers) {
  try {
    const dirPath = path.dirname(MAIN_SUBSCRIBERS_PATH);
    if (!fs.existsSync(dirPath)) {
      console.log('Creating directory:', dirPath);
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    console.log('Writing to main subscribers file:', MAIN_SUBSCRIBERS_PATH);
    fs.writeFileSync(MAIN_SUBSCRIBERS_PATH, JSON.stringify(subscribers, null, 2));
    console.log('Successfully wrote to main subscribers file');
    return true;
  } catch (error) {
    console.error('Error writing to main subscribers file:', error);
    return false;
  }
}

// Helper function to safely read temp subscribers
function readTempSubscribers() {
  try {
    if (fs.existsSync(TEMP_SUBSCRIBERS_PATH)) {
      console.log('Reading from temp subscribers file');
      const data = fs.readFileSync(TEMP_SUBSCRIBERS_PATH, 'utf8');
      return JSON.parse(data);
    } else {
      console.log('Temp subscribers file not found');
      return [];
    }
  } catch (error) {
    console.error('Error reading temp subscribers file:', error);
    return [];
  }
}

// Helper function to safely write temp subscribers
function writeTempSubscribers(subscribers) {
  try {
    console.log('Writing to temp subscribers file');
    fs.writeFileSync(TEMP_SUBSCRIBERS_PATH, JSON.stringify(subscribers, null, 2));
    console.log('Successfully wrote to temp subscribers file');
    return true;
  } catch (error) {
    console.error('Error writing to temp subscribers file:', error);
    return false;
  }
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return typeof email === 'string' && emailRegex.test(email);
}

// Helper function to add a subscriber to both main and temp files
function addSubscriberToAllFiles(email) {
  console.log('Adding subscriber to all files:', email);
  
  // Create new subscriber object
  const newSubscriber = {
    email,
    subscribed: true,
    subscribedAt: new Date().toISOString(),
    lastEmailSent: null
  };
  
  // Results object
  const results = {
    main: false,
    temp: false
  };
  
  // Add to main subscribers file
  try {
    const mainSubscribers = readMainSubscribers();
    if (!mainSubscribers.some(sub => sub.email === email)) {
      mainSubscribers.push(newSubscriber);
      results.main = writeMainSubscribers(mainSubscribers);
    } else {
      console.log('Email already exists in main subscribers:', email);
      results.main = true; // Already exists
    }
  } catch (mainError) {
    console.error('Error adding to main subscribers:', mainError);
  }
  
  // Add to temp subscribers file
  try {
    const tempSubscribers = readTempSubscribers();
    if (!tempSubscribers.some(sub => sub.email === email)) {
      tempSubscribers.push(newSubscriber);
      results.temp = writeTempSubscribers(tempSubscribers);
    } else {
      console.log('Email already exists in temp subscribers:', email);
      results.temp = true; // Already exists
    }
  } catch (tempError) {
    console.error('Error adding to temp subscribers:', tempError);
  }
  
  return results;
}

// Main handler function
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
    const { email } = payload;
    
    console.log('Received subscription request for:', email);
    
    // Validate email
    if (!isValidEmail(email)) {
      console.log('Invalid email format:', email);
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Valid email address required' })
      };
    }
    
    // Add subscriber to all files
    const results = addSubscriberToAllFiles(email);
    
    // Determine overall success
    const success = results.main || results.temp;
    
    if (success) {
      console.log('Successfully added subscriber:', email);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: true,
          message: 'Subscription successful!',
          results
        })
      };
    } else {
      console.log('Failed to add subscriber:', email);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          success: false,
          message: 'Failed to add subscriber',
          results
        })
      };
    }
  } catch (error) {
    console.error('Unexpected error in subscribe function:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: false,
        message: 'Server error',
        error: error.message
      })
    };
  }
};
