import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import { router as subscriberRoutes } from './routes/subscribers.js';
import { fetchAndSummarizeNews } from './services/newsService.js';
import { sendNewsletterToAllSubscribers } from './services/emailService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/subscribers', subscriberRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Setup file-based storage instead of MongoDB
const subscribersFilePath = path.join(__dirname, 'subscribers.json');

// Initialize subscribers file if it doesn't exist
if (!fs.existsSync(subscribersFilePath)) {
  fs.writeFileSync(subscribersFilePath, JSON.stringify([]));
  console.log('Created subscribers.json file for storage');
}

console.log('Using file-based storage instead of MongoDB');

// Schedule weekly newsletter (every Monday at 9:00 AM)
cron.schedule('0 9 * * 1', async () => {
  try {
    console.log('Running scheduled newsletter task');
    const newsContent = await fetchAndSummarizeNews();
    await sendNewsletterToAllSubscribers(newsContent);
    console.log('Newsletter sent successfully');
  } catch (error) {
    console.error('Error sending scheduled newsletter:', error);
  }
});

// Manual trigger endpoint for newsletter (protected in production)
app.post('/api/send-newsletter', async (req, res) => {
  try {
    const newsContent = await fetchAndSummarizeNews();
    await sendNewsletterToAllSubscribers(newsContent);
    res.status(200).json({ success: true, message: 'Newsletter sent successfully' });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({ success: false, message: 'Failed to send newsletter', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});