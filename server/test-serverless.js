import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handler } from './serverless/newsletter-function.js';
import { updateFeeds } from './services/rssFeedService.js';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize serverless config
const configFilePath = path.join(__dirname, 'serverless', 'serverless-config.json');
let webhookSecret;

if (!fs.existsSync(configFilePath)) {
  console.log('Initializing serverless config...');
  // Generate webhook secret synchronously
  webhookSecret = crypto.randomBytes(32).toString('hex');
} else {
  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  webhookSecret = config.webhookSecret;
}

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Webhook endpoint for updating RSS feed
app.post('/api/webhook/rss-update', async (req, res) => {
  try {
    // Convert Express request to Lambda event format
    const event = {
      headers: req.headers,
      queryStringParameters: req.query
    };
    
    const result = await handler(event, {});
    res.status(result.statusCode).send(JSON.parse(result.body));
  } catch (error) {
    console.error('Error updating RSS feed:', error);
    res.status(500).json({ success: false, message: 'Error updating RSS feed', error: error.message });
  }
});

// RSS feed endpoint
app.get('/api/feeds/rss', (req, res) => {
  try {
    const rssFilePath = path.join(__dirname, 'public', 'ai-news-feed.xml');
    
    if (!fs.existsSync(rssFilePath)) {
      return res.status(404).json({ success: false, message: 'RSS feed not found' });
    }
    
    const rssContent = fs.readFileSync(rssFilePath, 'utf8');
    res.set('Content-Type', 'application/rss+xml');
    res.send(rssContent);
  } catch (error) {
    console.error('Error serving RSS feed:', error);
    res.status(500).json({ success: false, message: 'Error serving RSS feed', error: error.message });
  }
});

// Generate initial feed if it doesn't exist
const rssFilePath = path.join(__dirname, 'public', 'ai-news-feed.xml');

if (!fs.existsSync(rssFilePath)) {
  console.log('Generating initial RSS feed...');
  updateFeeds().then(() => {
    console.log('Initial RSS feed generated successfully');
  }).catch(error => {
    console.error('Error generating initial RSS feed:', error);
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`RSS feed server running on port ${PORT}`);
  console.log(`RSS feed available at: http://localhost:${PORT}/api/feeds/rss`);
  console.log(`RSS update webhook URL: http://localhost:${PORT}/api/webhook/rss-update?key=${webhookSecret}`);
});
