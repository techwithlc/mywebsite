# Quick Start Guide

Get your TechwithLC newsletter system up and running in minutes!

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

✅ **Done!** Dependencies installed.

---

### 2. Set Up Environment Variables

The PostgreSQL credentials are already configured. You just need to add your email and API keys:

**Edit `server/.env`:**

```bash
cd server
nano .env  # or use your preferred editor
```

**Update these values:**

```env
# Email Configuration - REQUIRED for sending newsletters
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com

# News API - REQUIRED for fetching news
NEWS_API_KEY=your_news_api_key
```

**How to get these:**
- **Gmail App Password**: https://myaccount.google.com/apppasswords
- **News API Key**: https://newsapi.org/ (free tier available)

✅ **Done!** Environment configured.

---

### 3. Initialize Database

```bash
cd server
npm run init-db
```

This will:
- Connect to your Zeabur PostgreSQL database
- Create the subscribers table
- Set up indexes
- Show you the database status

✅ **Done!** Database ready.

---

### 4. Test the System

#### Test Newsletter Generation

```bash
cd server
npm run generate-newsletter
```

This will:
- Fetch latest AI news
- Use Perplexity to create a summary
- Save the newsletter to `latest-ai-news.html`

#### Test Subscription (Local)

Start Netlify Dev:
```bash
# In root directory
npx netlify dev
```

Then test the subscription endpoint:
```bash
curl -X POST http://localhost:8888/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

✅ **Done!** System tested and working!

---

## 📧 Sending Newsletters

### Option 1: Manual Send (Recommended for Testing)

```bash
cd server
npm run send-newsletter
```

This will:
1. Fetch and summarize AI news using Perplexity
2. Get all active subscribers from PostgreSQL
3. Send emails via Gmail SMTP

### Option 2: Scheduled Send (Production)

Set up a cron job or use Zeabur's scheduled tasks:

```bash
# Run every Monday at 9 AM
0 9 * * 1 cd /path/to/mywebsite/server && npm run send-newsletter
```

---

## 🔍 Verify Everything is Working

### 1. Check Database Connection

```bash
cd server
node -e "import('./database/db.js').then(m => m.db.getSubscriberCount().then(c => console.log('Subscribers:', c)))"
```

**Expected output:** `Subscribers: 1` (if you added test@example.com)

### 2. Check API Keys

**Test Perplexity API:**
```bash
curl https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer your_perplexity_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.1-sonar-large-128k-online","messages":[{"role":"user","content":"Test"}]}'
```

**Test News API:**
```bash
curl "https://newsapi.org/v2/everything?q=AI&apiKey=YOUR_NEWS_API_KEY"
```

### 3. Check Generated Files

After running `generate-newsletter`, check:
- `server/latest-ai-news.html` - Newsletter HTML
- `server/latest-ai-news.txt` - Newsletter plain text

---

## 🎯 Next Steps

### For Development

1. **Start the frontend:**
   ```bash
   npm run dev
   ```

2. **Start Netlify functions locally:**
   ```bash
   npx netlify dev
   ```

3. **Test the subscription form** on your website

### For Production

1. **Update Netlify environment variables:**
   - Go to your Netlify dashboard
   - Add PostgreSQL credentials (see [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md))

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Migrate to PostgreSQL and Perplexity"
   git push origin main
   ```

3. **Verify production deployment:**
   - Test the subscription form on your live site
   - Run a test newsletter send

---

## 📚 Documentation

- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Complete migration documentation
- **[server/ENV_SETUP.md](server/ENV_SETUP.md)** - Environment variables reference
- **[server/database/README.md](server/database/README.md)** - Database documentation

---

## ⚠️ Troubleshooting

### "Connection refused" error

**Problem:** Can't connect to PostgreSQL

**Solution:**
```bash
# Test connection manually
psql -h tpe1.clusters.zeabur.com -p 27700 -U root -d techwithlc
```

### "Authentication failed" email error

**Problem:** Can't send emails

**Solution:**
- Use Gmail **App Password**, not your regular password
- Generate one at: https://myaccount.google.com/apppasswords

### "API key invalid" error

**Problem:** Perplexity or News API not working

**Solution:**
- Verify API keys in `server/.env`
- Check for extra spaces or quotes
- Ensure keys haven't expired

---

## 🎊 Success!

You now have:
- ✅ PostgreSQL database connected and initialized
- ✅ Perplexity API integrated for AI summaries
- ✅ Newsletter generation working
- ✅ Email sending configured
- ✅ Subscription system ready

**Ready to send your first newsletter!** 🚀

---

## 💡 Tips

1. **Test with your own email first** before sending to all subscribers
2. **Check spam folder** when testing emails
3. **Monitor API usage** for Perplexity (check your dashboard)
4. **Backup your database** regularly
5. **Keep API keys secure** - never commit them to git

---

Need help? Check the [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed troubleshooting.

