# Environment Setup Instructions

To fix your newsletter subscription functionality, you need to set up the following environment variables in your `.env` file:

```
# MongoDB Connection
MONGODB_URI=mongodb://your-mongodb-connection-string

# Email Service Configuration
EMAIL_HOST=your-smtp-server
EMAIL_PORT=587
EMAIL_USER=your-email-username
EMAIL_PASS=your-email-password
EMAIL_FROM=your-sender-email

# API Keys
OPENAI_API_KEY=your-openai-api-key
NEWS_API_KEY=your-newsapi-key
```

## Steps to Fix the Subscription System:

1. Create or update your `.env` file in the `/server` directory with the above variables
2. Make sure your MongoDB instance is running
3. Restart your server with `npm run dev` from the server directory
4. Test the subscription form on your website

## Important Notes:

- For OpenAI API, you need an API key that has access to the Claude 3.7 Sonnet model
- For email sending, you need valid SMTP credentials
- The NewsAPI key is required to fetch the latest AI news articles
