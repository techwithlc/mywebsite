import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { router as subscriberRoutes } from './routes/subscribers.js';
import { fetchAndSummarizeNews } from './services/newsService.js';
import { sendNewsletterToAllSubscribers } from './services/emailService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/subscribers', subscriberRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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