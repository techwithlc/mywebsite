import express from 'express';
import { 
  initializeWebhookConfig, 
  validateWebhook, 
  processNewsletterWebhook,
  getWebhookUrl,
  updateWebhookConfig
} from '../services/webhookService.js';

const router = express.Router();

// Initialize webhook configuration
const webhookConfig = initializeWebhookConfig();

// Process newsletter webhook
router.post('/newsletter', async (req, res) => {
  try {
    // Validate webhook request
    const validation = validateWebhook(req, webhookConfig.webhookSecret);
    
    if (!validation.valid) {
      console.warn(`Invalid webhook request: ${validation.reason}`);
      return res.status(403).json({ success: false, message: 'Unauthorized webhook request' });
    }
    
    // Process the webhook
    const result = await processNewsletterWebhook(req);
    res.status(200).json({ success: true, message: 'Webhook processed successfully', result });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ success: false, message: 'Failed to process webhook', error: error.message });
  }
});

// Get webhook configuration (protected)
router.get('/config', (req, res) => {
  try {
    // Simple admin check - in production, use proper authentication
    const adminKey = req.query.adminKey;
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // Don't expose the actual secret
    const safeConfig = { ...webhookConfig };
    delete safeConfig.webhookSecret;
    
    // Generate webhook URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    safeConfig.webhookUrl = getWebhookUrl(baseUrl);
    
    res.status(200).json({ success: true, config: safeConfig });
  } catch (error) {
    console.error('Error getting webhook config:', error);
    res.status(500).json({ success: false, message: 'Failed to get webhook config', error: error.message });
  }
});

// Update webhook configuration (protected)
router.put('/config', (req, res) => {
  try {
    // Simple admin check - in production, use proper authentication
    const adminKey = req.query.adminKey;
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // Only allow updating certain fields
    const allowedUpdates = ['enabled', 'allowedIPs', 'webhookEndpoint'];
    const updates = {};
    
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    
    const updatedConfig = updateWebhookConfig(updates);
    
    // Don't expose the actual secret
    const safeConfig = { ...updatedConfig };
    delete safeConfig.webhookSecret;
    
    res.status(200).json({ success: true, message: 'Webhook configuration updated', config: safeConfig });
  } catch (error) {
    console.error('Error updating webhook config:', error);
    res.status(500).json({ success: false, message: 'Failed to update webhook config', error: error.message });
  }
});

// Regenerate webhook secret (protected)
router.post('/regenerate-secret', (req, res) => {
  try {
    // Simple admin check - in production, use proper authentication
    const adminKey = req.query.adminKey;
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const crypto = require('crypto');
    const newSecret = crypto.randomBytes(32).toString('hex');
    
    const updatedConfig = updateWebhookConfig({ webhookSecret: newSecret });
    
    // Generate new webhook URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const webhookUrl = getWebhookUrl(baseUrl);
    
    res.status(200).json({ 
      success: true, 
      message: 'Webhook secret regenerated',
      webhookUrl
    });
  } catch (error) {
    console.error('Error regenerating webhook secret:', error);
    res.status(500).json({ success: false, message: 'Failed to regenerate webhook secret', error: error.message });
  }
});

export { router as webhookRouter };
