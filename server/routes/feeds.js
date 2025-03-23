import express from 'express';
import { getRSSFeed, getJSONFeed, updateFeeds } from '../services/rssFeedService.js';

const router = express.Router();

// Get RSS feed
router.get('/rss', async (req, res) => {
  try {
    const rssFeed = getRSSFeed();
    
    if (!rssFeed) {
      // If feed doesn't exist, generate it first
      await updateFeeds();
      const newFeed = getRSSFeed();
      
      if (!newFeed) {
        return res.status(500).json({ success: false, message: 'Failed to generate RSS feed' });
      }
      
      res.set('Content-Type', 'application/rss+xml');
      return res.send(newFeed);
    }
    
    res.set('Content-Type', 'application/rss+xml');
    res.send(rssFeed);
  } catch (error) {
    console.error('Error serving RSS feed:', error);
    res.status(500).json({ success: false, message: 'Failed to serve RSS feed', error: error.message });
  }
});

// Get JSON feed
router.get('/json', async (req, res) => {
  try {
    const jsonFeed = getJSONFeed();
    
    if (!jsonFeed) {
      // If feed doesn't exist, generate it first
      await updateFeeds();
      const newFeed = getJSONFeed();
      
      if (!newFeed) {
        return res.status(500).json({ success: false, message: 'Failed to generate JSON feed' });
      }
      
      res.set('Content-Type', 'application/json');
      return res.send(newFeed);
    }
    
    res.set('Content-Type', 'application/json');
    res.send(jsonFeed);
  } catch (error) {
    console.error('Error serving JSON feed:', error);
    res.status(500).json({ success: false, message: 'Failed to serve JSON feed', error: error.message });
  }
});

// Manually update feeds
router.post('/update', async (req, res) => {
  try {
    const result = await updateFeeds();
    res.status(200).json({ success: true, message: 'Feeds updated successfully', result });
  } catch (error) {
    console.error('Error updating feeds:', error);
    res.status(500).json({ success: false, message: 'Failed to update feeds', error: error.message });
  }
});

export { router as feedsRouter };
