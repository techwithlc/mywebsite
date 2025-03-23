import { fetchAndSummarizeNews } from '../services/newsService.js';
import { sendNewsletterToAllSubscribers } from '../services/emailService.js';
import { updateFeeds } from '../services/rssFeedService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const subscribersFilePath = path.join(__dirname, '..', 'subscribers.json');
const configFilePath = path.join(__dirname, 'serverless-config.json');

// Initialize configuration if it doesn't exist
function initializeConfig() {
  if (!fs.existsSync(configFilePath)) {
    const webhookSecret = crypto.randomBytes(32).toString('hex');
    const config = {
      webhookSecret,
      allowedIPs: [],
      enabled: true,
      lastRun: null
    };
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    return config;
  }
  return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
}

// Validate webhook request
function validateWebhook(event, config) {
  // Check if webhook is enabled
  if (!config.enabled) {
    return { valid: false, reason: 'Webhook is disabled' };
  }
  
  // Check IP whitelist if configured
  if (config.allowedIPs && config.allowedIPs.length > 0) {
    const clientIP = event.headers['x-forwarded-for'] || event.requestContext?.identity?.sourceIp;
    if (!config.allowedIPs.includes(clientIP)) {
      return { valid: false, reason: 'IP not allowed' };
    }
  }
  
  // Validate signature if provided
  const signature = event.headers['x-webhook-signature'];
  if (signature) {
    const payload = typeof event.body === 'string' ? event.body : JSON.stringify(event.body);
    const expectedSignature = crypto
      .createHmac('sha256', config.webhookSecret)
      .update(payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return { valid: false, reason: 'Invalid signature' };
    }
  } else {
    // Check query parameter for key
    const queryParams = new URLSearchParams(event.queryStringParameters || {});
    if (queryParams.get('key') !== config.webhookSecret) {
      return { valid: false, reason: 'Invalid webhook key' };
    }
  }
  
  return { valid: true };
}

// Main handler function
export async function handler(event, context) {
  try {
    // Initialize configuration
    const config = initializeConfig();
    
    // Validate webhook request
    const validation = validateWebhook(event, config);
    if (!validation.valid) {
      return {
        statusCode: 403,
        body: JSON.stringify({ success: false, message: `Unauthorized: ${validation.reason}` })
      };
    }
    
    // Parse request body
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    
    // Determine actions to perform
    const actions = {
      updateFeeds: true,
      sendNewsletter: true,
      ...body?.actions
    };
    
    const results = {
      success: true,
      actions: {}
    };
    
    // Update RSS and JSON feeds
    if (actions.updateFeeds) {
      console.log('Webhook triggered: Updating feeds');
      const feedResult = await updateFeeds();
      results.actions.updateFeeds = feedResult;
    }
    
    // Send newsletter to subscribers
    if (actions.sendNewsletter) {
      console.log('Webhook triggered: Sending newsletter');
      const newsContent = await fetchAndSummarizeNews();
      const emailResult = await sendNewsletterToAllSubscribers(newsContent);
      results.actions.sendNewsletter = emailResult;
    }
    
    // Update last run timestamp
    config.lastRun = new Date().toISOString();
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Webhook processed successfully',
        results
      })
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Error processing webhook',
        error: error.message
      })
    };
  }
}

// For local testing
if (process.argv[2] === '--local') {
  const testEvent = {
    body: JSON.stringify({
      actions: {
        updateFeeds: true,
        sendNewsletter: false
      }
    }),
    queryStringParameters: {
      key: initializeConfig().webhookSecret
    },
    headers: {}
  };
  
  handler(testEvent, {})
    .then(response => console.log(JSON.stringify(response, null, 2)))
    .catch(error => console.error('Error:', error));
}
