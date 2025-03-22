# TechwithLC Newsletter Server

This server handles the backend functionality for the TechwithLC website's newsletter subscription system. It provides APIs for subscribing to the newsletter and sends AI news summaries to subscribers using OpenAI's GPT-4o and Resend API.

## Features

- Newsletter subscription management with file-based storage
- AI news fetching from News API
- News summarization using OpenAI's GPT-4o
- Automated email delivery to subscribers via Resend API
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

   # Email Configuration (Resend API)
   RESEND_API_KEY=your-resend-api-key

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

## Newsletter Scripts

Several scripts are available to help manage and test the newsletter system:

- `node send-newsletter-now.js` - Fetches AI news, summarizes it, and sends the newsletter to all subscribers using Resend API
- `node test-news-to-file.js` - Fetches and summarizes AI news, saving the result to a file without sending emails
- `node test-news-summary.js` - Tests the OpenAI news summarization functionality
- `node update-email-config.js` - Updates the email configuration in the .env file

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

- **Routes**: API endpoints for subscriber management
- **Services**: 
  - `newsService.js`: Fetches AI news and generates summaries with OpenAI's GPT-4o
  - `emailService.js`: Handles email delivery to subscribers using Resend API
- **Storage**:
  - `subscribers.json`: File-based storage for subscriber information
  - `latest-ai-news.html`: Latest generated newsletter HTML content

## Integration with Frontend

The frontend communicates with this server to handle newsletter subscriptions. The subscription form in the website sends POST requests to `/api/subscribers` to add new subscribers.

## Troubleshooting

If you encounter issues with email delivery:

1. Verify your Resend API key is correct in the `.env` file
2. Check that you've verified your email domain with Resend if sending to multiple recipients
3. View the generated newsletter HTML at `latest-ai-news.html` to ensure content is being created correctly
4. Run `node send-newsletter-now.js` to manually trigger newsletter sending and view detailed logs

## Production Deployment

For production deployment with continuous operation, it's recommended to use PM2, a process manager for Node.js applications:

1. Install PM2 globally:
   ```
   npm install pm2 -g
   ```

2. Start the server with PM2:
   ```
   pm2 start index.js --name "techwithlc-newsletter"
   ```

3. Set up auto-restart on system boot:
   ```
   pm2 startup
   pm2 save
   ```

4. Useful PM2 commands:
   ```
   pm2 list                       # View all running processes
   pm2 monit                      # Monitor application in real-time
   pm2 logs techwithlc-newsletter # View application logs
   pm2 restart techwithlc-newsletter # Restart application
   pm2 stop techwithlc-newsletter # Stop application
   ```

5. For better reliability in a production environment, consider deploying to a cloud provider like:
   - Heroku
   - Vercel
   - AWS (EC2, Elastic Beanstalk)
   - Google Cloud Run
   - Digital Ocean App Platform
