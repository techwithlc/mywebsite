# Serverless Newsletter System Deployment Guide

This guide explains how to deploy your newsletter subscription system without requiring a continuously running server, using RSS feeds, webhooks, and serverless functions.

## Overview

The serverless newsletter system consists of:

1. **Static HTML Page**: A subscription page where users can subscribe via email or RSS/JSON feeds
2. **RSS/JSON Feeds**: Automatically updated feeds with your latest AI news content
3. **Webhook Integration**: Allows external services to trigger newsletter updates and sending
4. **GitHub Actions Workflow**: Automatically updates feeds and sends newsletters on a schedule
5. **Serverless Functions**: Can be deployed to Netlify, Vercel, or AWS Lambda

## Deployment Options

### Option 1: GitHub Actions (Recommended)

The simplest approach is to use the GitHub Actions workflow we've created:

1. Push your code to GitHub
2. Set up the following repository secrets:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEWS_API_KEY`: Your News API key
   - `EMAIL_HOST`: SMTP server host
   - `EMAIL_PORT`: SMTP server port
   - `EMAIL_USER`: SMTP username
   - `EMAIL_PASS`: SMTP password
   - `EMAIL_FROM`: Sender email address

The workflow will:
- Run every Monday at 9:00 AM UTC
- Update the RSS and JSON feeds with the latest AI news
- Send the newsletter to all subscribers
- Commit and push the updated feeds to your repository

You can also manually trigger the workflow from the GitHub Actions tab.

### Option 2: Netlify Deployment

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy to Netlify:
   ```bash
   cd server
   netlify deploy --prod
   ```

3. Set up environment variables in the Netlify dashboard:
   - `OPENAI_API_KEY`
   - `NEWS_API_KEY`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `EMAIL_FROM`

### Option 3: Vercel Deployment

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   cd server
   vercel --prod
   ```

3. Set up environment variables in the Vercel dashboard.

## Using the Serverless Newsletter System

### Subscription Options

1. **Email Subscription**:
   - Users can subscribe via the newsletter subscription page: `/newsletter`
   - Emails are stored in `subscribers.json`

2. **RSS Feed Subscription**:
   - Users can subscribe to the RSS feed: `/api/feeds/rss`
   - Compatible with all major RSS readers

3. **JSON Feed Subscription**:
   - For developers or modern feed readers: `/api/feeds/json`
   - Follows the JSON Feed specification

### Webhook Integration

You can trigger newsletter updates and sending via webhooks:

1. **Webhook URL**: `/api/webhook/newsletter?key=YOUR_WEBHOOK_SECRET`
2. **Webhook Secret**: Automatically generated and stored in `serverless-config.json`
3. **Request Body**:
   ```json
   {
     "actions": {
       "updateFeeds": true,
       "sendNewsletter": true
     }
   }
   ```

### Integrating with External Services

You can integrate your webhook with services like:

1. **Zapier**: Create a Zap that triggers your webhook on a schedule
2. **IFTTT**: Create an applet that triggers your webhook based on events
3. **Pipedream**: Build workflows that trigger your webhook
4. **n8n**: Create automated workflows that call your webhook

## Security Considerations

1. **Webhook Security**:
   - The webhook secret is automatically generated
   - You can whitelist IPs by editing `serverless-config.json`
   - Consider using HTTPS for all webhook requests

2. **Environment Variables**:
   - Never commit your API keys or credentials to the repository
   - Use the secrets management of your chosen deployment platform

## Troubleshooting

1. **RSS Feed Not Updating**:
   - Check if the GitHub Actions workflow is running successfully
   - Verify that your API keys are valid

2. **Webhook Not Working**:
   - Verify the webhook secret is correct
   - Check if your IP is whitelisted (if configured)
   - Examine the webhook logs in your deployment platform

3. **Emails Not Sending**:
   - Verify your SMTP credentials
   - Check if the email service is working
   - Look for error logs in your deployment platform

## Next Steps

1. **Custom Domain**: Set up a custom domain for your serverless functions
2. **Analytics**: Add tracking to see how many people are using your RSS feeds
3. **Monitoring**: Set up alerts for webhook failures
4. **Backup**: Implement a backup system for your subscriber data
