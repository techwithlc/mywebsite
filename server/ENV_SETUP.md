# Environment Variables Setup

This document describes all environment variables needed for the TechwithLC server.

## Required Environment Variables

### PostgreSQL Database (Zeabur)

```env
POSTGRES_HOST=tpe1.clusters.zeabur.com
POSTGRES_PORT=27700
POSTGRES_DATABASE=techwithlc
POSTGRES_USER=root
POSTGRES_PASSWORD=your_postgresql_password_here
```

**Description:**
- These credentials connect to your Zeabur PostgreSQL database
- The database stores newsletter subscribers
- SSL is required and configured automatically

### Email Configuration (Gmail SMTP)

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com
```

**Description:**
- Used for sending newsletter emails to subscribers
- Requires Gmail App Password (not regular password)
- To generate an App Password: https://myaccount.google.com/apppasswords

### News API

```env
NEWS_API_KEY=your_news_api_key_here
```

**Description:**
- Fetches latest AI news articles
- Get your key at: https://newsapi.org/

### Perplexity API

```env
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

**Description:**
- Used for AI-powered news summarization
- Uses model: `llama-3.1-sonar-large-128k-online`
- Get your key at: https://www.perplexity.ai/settings/api

### Optional Variables

```env
NODE_ENV=development
```

**Description:**
- Set to `production` when deploying
- Affects logging and error handling

---

## Setup Instructions

### 1. Local Development

Create a `.env` file in the `server/` directory:

```bash
cd server
touch .env
# Edit the file and add all variables listed above
```

### 2. Netlify Functions

For the subscription function to work on Netlify:

1. Go to your Netlify site dashboard
2. Navigate to **Site Settings** → **Environment Variables**
3. Add the following variables:
   - `POSTGRES_HOST`
   - `POSTGRES_PORT`
   - `POSTGRES_DATABASE`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`

### 3. Production Server

If deploying to a server (e.g., Zeabur, Heroku):

1. Add environment variables through the platform's dashboard
2. Or use a `.env` file (ensure it's in `.gitignore`)

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` files to git
- `.env` files are already in `.gitignore`
- Use environment variables or secrets management in production
- Rotate API keys periodically
- Use App Passwords for Gmail (not your account password)

---

## Testing Connection

### Test PostgreSQL Connection

```bash
node -e "import('./database/db.js').then(m => m.db.getSubscriberCount().then(c => console.log('Subscribers:', c)))"
```

### Test Email Configuration

```bash
node send-newsletter.js
```

---

## Common Issues

### PostgreSQL Connection Failed

**Error:** `Connection refused` or `timeout`

**Solutions:**
- Verify `POSTGRES_HOST` and `POSTGRES_PORT` are correct
- Check if Zeabur database is running
- Ensure firewall allows connections

### Email Sending Failed

**Error:** `Authentication failed`

**Solutions:**
- Use Gmail App Password, not regular password
- Enable "Less secure app access" (if using old Gmail)
- Check `EMAIL_USER` matches `EMAIL_FROM`

### Perplexity API Error

**Error:** `401 Unauthorized`

**Solutions:**
- Verify `PERPLEXITY_API_KEY` is correct
- Check API key hasn't expired
- Ensure you have API credits

---

## Environment Variable Checklist

Before running the server, ensure all these are set:

- [ ] `POSTGRES_HOST`
- [ ] `POSTGRES_PORT`
- [ ] `POSTGRES_DATABASE`
- [ ] `POSTGRES_USER`
- [ ] `POSTGRES_PASSWORD`
- [ ] `EMAIL_HOST`
- [ ] `EMAIL_PORT`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASS`
- [ ] `EMAIL_FROM`
- [ ] `NEWS_API_KEY`
- [ ] `PERPLEXITY_API_KEY`

---

For more details, see [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md)

