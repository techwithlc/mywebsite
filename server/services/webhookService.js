import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchAndSummarizeNews } from './newsService.js';
import { sendNewsletterToAllSubscribers } from './emailService.js';
import { updateFeeds } from './rssFeedService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webhookConfigPath = path.join(__dirname, '..', 'webhook-config.json');

/**
 * Initialize webhook configuration
 */
export function initializeWebhookConfig() {
  try {
    if (!fs.existsSync(webhookConfigPath)) {
      // Generate a secure webhook secret
      const webhookSecret = crypto.randomBytes(32).toString('hex');
      
      const config = {
        webhookSecret,
        webhookEndpoint: '/api/webhook/newsletter',
        allowedIPs: [],
        lastTriggered: null,
        enabled: true
      };
      
      fs.writeFileSync(webhookConfigPath, JSON.stringify(config, null, 2));
      console.log('Webhook configuration initialized with new secret');
      return config;
    } else {
      const config = JSON.parse(fs.readFileSync(webhookConfigPath, 'utf8'));
      console.log('Loaded existing webhook configuration');
      return config;
    }
  } catch (error) {
    console.error('Error initializing webhook config:', error);
    throw error;
  }
}

/**
 * Validate webhook request
 */
export function validateWebhook(req, webhookSecret) {
  // Check if webhook is enabled
  const config = JSON.parse(fs.readFileSync(webhookConfigPath, 'utf8'));
  if (!config.enabled) {
    return { valid: false, reason: 'Webhook is disabled' };
  }
  
  // Check IP whitelist if configured
  if (config.allowedIPs && config.allowedIPs.length > 0) {
    const clientIP = req.ip || req.connection.remoteAddress;
    if (!config.allowedIPs.includes(clientIP)) {
      return { valid: false, reason: 'IP not allowed' };
    }
  }
  
  // Validate signature if provided
  const signature = req.headers['x-webhook-signature'];
  if (signature) {
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return { valid: false, reason: 'Invalid signature' };
    }
  } else if (req.query.key !== webhookSecret) {
    // Fall back to query parameter validation
    return { valid: false, reason: 'Invalid webhook key' };
  }
  
  return { valid: true };
}

/**
 * Process webhook for newsletter generation and sending
 */
export async function processNewsletterWebhook(req) {
  try {
    // Update webhook last triggered timestamp
    const config = JSON.parse(fs.readFileSync(webhookConfigPath, 'utf8'));
    config.lastTriggered = new Date().toISOString();
    fs.writeFileSync(webhookConfigPath, JSON.stringify(config, null, 2));
    
    // Determine actions to perform
    const actions = {
      updateFeeds: true,
      sendNewsletter: true,
      ...req.body.actions
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
    
    return results;
  } catch (error) {
    console.error('Error processing newsletter webhook:', error);
    throw error;
  }
}

/**
 * Generate a webhook URL for external services
 */
export function getWebhookUrl(baseUrl) {
  try {
    const config = JSON.parse(fs.readFileSync(webhookConfigPath, 'utf8'));
    return `${baseUrl}${config.webhookEndpoint}?key=${config.webhookSecret}`;
  } catch (error) {
    console.error('Error generating webhook URL:', error);
    throw error;
  }
}

/**
 * Update webhook configuration
 */
export function updateWebhookConfig(updates) {
  try {
    const config = JSON.parse(fs.readFileSync(webhookConfigPath, 'utf8'));
    const updatedConfig = { ...config, ...updates };
    fs.writeFileSync(webhookConfigPath, JSON.stringify(updatedConfig, null, 2));
    return updatedConfig;
  } catch (error) {
    console.error('Error updating webhook config:', error);
    throw error;
  }
}
