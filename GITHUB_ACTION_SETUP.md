# 🤖 GitHub Action: Automatic Newsletter Sending

## What It Does
Automatically sends your AI newsletter every **Monday at 9:00 AM UTC+8** using GitHub Actions.

## How It Works
1. Every Monday at 9am UTC+8, GitHub Actions triggers
2. Fetches latest AI news from News API
3. Summarizes with Perplexity AI
4. Sends newsletter to all subscribers in PostgreSQL
5. Done! ✅

---

## 🔧 Setup Required (One-time)

You need to add secrets to your GitHub repository so the action can access your credentials.

### Step 1: Go to GitHub Repository Settings

1. Open: https://github.com/techwithlc/mywebsite
2. Click **"Settings"** tab (top right)
3. In left sidebar, click **"Secrets and variables"** → **"Actions"**
4. You'll see **"Repository secrets"**

### Step 2: Add These Secrets

Click **"New repository secret"** for each of these:

#### PostgreSQL Secrets (5 secrets)

**Secret 1:**
```
Name: POSTGRES_HOST
Value: tpe1.clusters.zeabur.com
```

**Secret 2:**
```
Name: POSTGRES_PORT
Value: 27700
```

**Secret 3:**
```
Name: POSTGRES_DATABASE
Value: techwithlc
```

**Secret 4:**
```
Name: POSTGRES_USER
Value: root
```

**Secret 5:**
```
Name: POSTGRES_PASSWORD
Value: your_postgresql_password_here
```

#### Email Secrets (5 secrets)

**Secret 6:**
```
Name: EMAIL_HOST
Value: smtp.gmail.com
```

**Secret 7:**
```
Name: EMAIL_PORT
Value: 465
```

**Secret 8:**
```
Name: EMAIL_USER
Value: your_email@gmail.com
```

**Secret 9:**
```
Name: EMAIL_PASS
Value: your_gmail_app_password
```

**Secret 10:**
```
Name: EMAIL_FROM
Value: your_email@gmail.com
```

#### API Key Secrets (2 secrets)

**Secret 11:**
```
Name: NEWS_API_KEY
Value: your_news_api_key_here
```

**Secret 12:**
```
Name: PERPLEXITY_API_KEY
Value: your_perplexity_api_key_here
```

---

## ✅ Verify Setup

After adding all secrets, you should see **12 repository secrets** in total.

---

## 🧪 Test the Action (Before Waiting for Monday)

### Option 1: Manual Trigger (Recommended)
1. Go to: https://github.com/techwithlc/mywebsite/actions
2. Click **"Send Weekly Newsletter"** workflow (left sidebar)
3. Click **"Run workflow"** button (right side)
4. Click the green **"Run workflow"** button in the dropdown
5. Watch it run! 🎉

### Option 2: Wait for Monday 9am UTC+8
The action will automatically run every Monday at 9am UTC+8.

---

## 📊 Monitor the Action

### View Execution Logs
1. Go to: https://github.com/techwithlc/mywebsite/actions
2. Click on any workflow run
3. Click on the job to see detailed logs
4. You'll see:
   - News fetching
   - AI summarization
   - Email sending
   - Success/failure status

### Check if Emails Were Sent
- Check your subscriber count in database
- Look for success message in logs: "✅ Newsletter sent successfully!"
- Check your own inbox (if you're subscribed)

---

## 🎯 Schedule Details

**When:** Every Monday at 9:00 AM UTC+8 (Beijing/Taipei time)  
**Cron:** `0 1 * * 1` (1am UTC = 9am UTC+8)

### Want to Change the Schedule?

Edit `.github/workflows/send-newsletter.yml` and change the cron:

```yaml
schedule:
  # Examples:
  - cron: '0 1 * * 1'    # Monday 9am UTC+8
  - cron: '0 1 * * 2'    # Tuesday 9am UTC+8
  - cron: '0 1 * * *'    # Every day 9am UTC+8
  - cron: '0 9 * * 1'    # Monday 5pm UTC+8
```

**Cron format:** `minute hour day_of_month month day_of_week`
- Minute: 0-59
- Hour: 0-23 (UTC time)
- Day of month: 1-31
- Month: 1-12
- Day of week: 0-6 (0 = Sunday, 1 = Monday, etc.)

**UTC Time Converter:**
- 9am UTC+8 = 1am UTC
- 12pm UTC+8 = 4am UTC
- 6pm UTC+8 = 10am UTC

---

## 🔍 Troubleshooting

### Action Fails to Run

**Problem:** Workflow doesn't trigger on schedule

**Solution:**
1. Check if you pushed the workflow file to GitHub
2. Workflows need at least one successful manual run first
3. GitHub Actions must be enabled in repo settings

### "Secret not found" Error

**Problem:** Missing or misnamed secrets

**Solution:**
1. Go to repo Settings → Secrets and variables → Actions
2. Verify ALL 12 secrets are added
3. Check secret names match EXACTLY (case-sensitive)
4. Re-add any missing secrets

### Newsletter Not Sending

**Problem:** Action runs but emails don't send

**Solution:**
1. Check Gmail app password is correct
2. Verify PostgreSQL has subscribers
3. Check action logs for specific errors
4. Test locally: `cd server && node send-newsletter.js`

### No Subscribers in Database

**Problem:** Newsletter runs but "0 subscribers" 

**Solution:**
1. Add test subscriber via website subscription form
2. Or manually add: 
   ```bash
   cd server
   node -e "import('./database/db.js').then(m => m.db.addSubscriber('your@email.com'))"
   ```

---

## 📈 Cost Considerations

**GitHub Actions Free Tier:**
- 2,000 minutes/month for free
- This workflow uses ~2-3 minutes per run
- Monthly cost: ~10-12 minutes (well within free tier)

**API Costs:**
- News API: Free tier (100 requests/day)
- Perplexity: Check your plan limits
- Gmail SMTP: Free

---

## 🎉 Quick Summary

1. ✅ Created workflow: `.github/workflows/send-newsletter.yml`
2. ⚠️ **ACTION NEEDED:** Add 12 secrets to GitHub
3. ✅ Test with manual trigger
4. ✅ Enjoy automatic newsletters every Monday!

---

## 🔗 Quick Links

- **GitHub Actions**: https://github.com/techwithlc/mywebsite/actions
- **Secrets Settings**: https://github.com/techwithlc/mywebsite/settings/secrets/actions
- **Workflow File**: `.github/workflows/send-newsletter.yml`

---

**Next Step:** Add the 12 secrets to GitHub, then test the workflow manually! 🚀


