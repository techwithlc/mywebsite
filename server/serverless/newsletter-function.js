import { updateFeeds } from '../services/rssFeedService.js';
import { sendNewsletterToAllSubscribers } from '../services/emailService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
    
    console.log('Webhook triggered: Updating RSS feed');
    const feedResult = await updateFeeds();
    
    // Send newsletter to subscribers after updating feed
    console.log('Sending newsletter to subscribers...');
    try {
      // Extract news content for email
      const newsData = {
        title: 'TechwithLC AI News',
        articles: feedResult.newsContent?.articles || []
      };
      
      const emailResults = await sendNewsletterToAllSubscribers(newsData);
      console.log(`Newsletter sent to ${emailResults?.successCount || 0} subscribers`);
    } catch (emailError) {
      console.warn('Error sending newsletter emails:', emailError.message);
      // Continue even if email sending fails - we don't want to break the build/update process
    }
    
    // Update last run timestamp
    config.lastRun = new Date().toISOString();
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'RSS feed updated successfully',
        results: feedResult
      })
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Error updating RSS feed',
        error: error.message
      })
    };
  }
}

// For local testing
if (process.argv[2] === '--local') {
  const testEvent = {
    queryStringParameters: {
      key: initializeConfig().webhookSecret
    },
    headers: {}
  };
  
  handler(testEvent, {})
    .then(response => console.log(JSON.stringify(response, null, 2)))
    .catch(error => console.error('Error:', error));
}
