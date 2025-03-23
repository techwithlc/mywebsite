# RSS Feed Deployment Guide

This guide explains how to deploy your AI news RSS feed system without requiring a continuously running server, using GitHub Actions and serverless functions.

## Overview

The RSS feed system consists of:

1. **Static HTML Page**: A subscription page where users can subscribe via RSS
2. **RSS Feed**: Automatically updated feed with your latest AI news content
3. **GitHub Actions Workflow**: Automatically updates the feed on a schedule
4. **Serverless Functions**: Can be deployed to Netlify or Vercel

## Deployment Options

### Option 1: GitHub Actions (Recommended)

The simplest approach is to use the GitHub Actions workflow we've created:

1. Push your code to GitHub
2. Set up the following repository secrets:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEWS_API_KEY`: Your News API key

The workflow will:
- Run every Monday at 9:00 AM UTC
- Update the RSS feed with the latest AI news
- Commit and push the updated feed to your repository

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

## Using the RSS Feed System

### Subscription Options

**RSS Feed Subscription**:
- Users can subscribe to the RSS feed: `/api/feeds/rss`
- Compatible with all major RSS readers
- Mobile-friendly QR code provided on the subscription page

### Webhook Integration (For Advanced Users)

You can trigger RSS feed updates via webhooks:

1. **Webhook URL**: `/api/webhook/rss-update?key=YOUR_WEBHOOK_SECRET`
2. **Webhook Secret**: Automatically generated and stored in `serverless-config.json`

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
   - Never commit your API keys to the repository
   - Use the secrets management of your chosen deployment platform

## Troubleshooting

1. **RSS Feed Not Updating**:
   - Check if the GitHub Actions workflow is running successfully
   - Verify that your API keys are valid

2. **Webhook Not Working**:
   - Verify the webhook secret is correct
   - Check if your IP is whitelisted (if configured)
   - Examine the webhook logs in your deployment platform

## Next Steps

1. **Custom Domain**: Set up a custom domain for your serverless functions
2. **Analytics**: Add tracking to see how many people are using your RSS feed
3. **Monitoring**: Set up alerts for webhook failures
