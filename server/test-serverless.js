import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handler } from './serverless/newsletter-function.js';
import { updateFeeds } from './services/rssFeedService.js';

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
  // This will be created when the handler is first called
  const crypto = await import('crypto');
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

// Webhook endpoint
app.post('/api/webhook/newsletter', async (req, res) => {
  try {
    // Convert Express request to Lambda event format
    const event = {
      body: JSON.stringify(req.body),
      headers: req.headers,
      queryStringParameters: req.query
    };
    
    const result = await handler(event, {});
    res.status(result.statusCode).send(JSON.parse(result.body));
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ success: false, message: 'Error processing webhook', error: error.message });
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

// JSON feed endpoint
app.get('/api/feeds/json', (req, res) => {
  try {
    const jsonFilePath = path.join(__dirname, 'public', 'ai-news-feed.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      return res.status(404).json({ success: false, message: 'JSON feed not found' });
    }
    
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    res.set('Content-Type', 'application/json');
    res.send(jsonContent);
  } catch (error) {
    console.error('Error serving JSON feed:', error);
    res.status(500).json({ success: false, message: 'Error serving JSON feed', error: error.message });
  }
});

// Newsletter subscription page
app.get('/newsletter', (req, res) => {
  try {
    const htmlFilePath = path.join(__dirname, 'public', 'newsletter-subscribe.html');
    
    if (!fs.existsSync(htmlFilePath)) {
      return res.status(404).json({ success: false, message: 'Newsletter subscription page not found' });
    }
    
    res.sendFile(htmlFilePath);
  } catch (error) {
    console.error('Error serving newsletter subscription page:', error);
    res.status(500).json({ success: false, message: 'Error serving newsletter subscription page', error: error.message });
  }
});

// Generate initial feeds if they don't exist
const rssFilePath = path.join(__dirname, 'public', 'ai-news-feed.xml');
const jsonFilePath = path.join(__dirname, 'public', 'ai-news-feed.json');

if (!fs.existsSync(rssFilePath) || !fs.existsSync(jsonFilePath)) {
  console.log('Generating initial feeds...');
  updateFeeds().then(() => {
    console.log('Initial feeds generated successfully');
  }).catch(error => {
    console.error('Error generating initial feeds:', error);
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Serverless test server running on port ${PORT}`);
  console.log(`RSS feed available at: http://localhost:${PORT}/api/feeds/rss`);
  console.log(`JSON feed available at: http://localhost:${PORT}/api/feeds/json`);
  console.log(`Newsletter subscription page: http://localhost:${PORT}/newsletter`);
  console.log(`Webhook URL: http://localhost:${PORT}/api/webhook/newsletter?key=${webhookSecret}`);
});
