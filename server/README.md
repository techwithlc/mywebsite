# TechwithLC Newsletter Server

This server handles the backend functionality for the TechwithLC website's newsletter subscription system. It provides APIs for subscribing to the newsletter and sends AI news summaries to subscribers using OpenAI's GPT-4o.

## Features

- Newsletter subscription management
- AI news fetching from News API
- News summarization using OpenAI's GPT-4o
- Automated email delivery to subscribers
- Scheduled weekly newsletters

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` with your configuration:
   ```
   # Server Configuration
   PORT=3001

   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/techwithlc

   # Email Configuration
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   EMAIL_FROM=your-email@example.com

   # OpenAI API
   OPENAI_API_KEY=your-openai-api-key

   # News API
   NEWS_API_KEY=your-news-api-key
   ```

3. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### Subscribers

- `GET /api/subscribers` - Get all active subscribers
- `POST /api/subscribers` - Add a new subscriber
- `DELETE /api/subscribers/:email` - Unsubscribe an email

### Newsletter

- `POST /api/send-newsletter` - Manually trigger newsletter sending

### Health Check

- `GET /api/health` - Check server status

## Architecture

- **Models**: MongoDB schemas for subscribers
- **Routes**: API endpoints for subscriber management
- **Services**: 
  - `newsService.js`: Fetches AI news and generates summaries with OpenAI's GPT-4o
  - `emailService.js`: Handles email delivery to subscribers

## Scheduled Tasks

The server uses node-cron to schedule weekly newsletters every Monday at 9:00 AM.

## Integration with Frontend

The frontend communicates with this server to handle newsletter subscriptions. The subscription form in the website sends POST requests to `/api/subscribers` to add new subscribers.
