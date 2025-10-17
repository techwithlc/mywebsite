# ✅ Complete Setup Checklist

Use this checklist to set up your automatic newsletter system.

## 📋 Setup Tasks

### ✅ Completed (Already Done)
- [x] Migrate from Supabase to PostgreSQL
- [x] Replace Gemini with Perplexity API
- [x] Create database and schema
- [x] Test database connection
- [x] Install all dependencies
- [x] Create GitHub Actions workflow
- [x] Delete old workflow file
- [x] Sanitize all credentials from git
- [x] Push code to GitHub
- [x] Create comprehensive documentation

### ⚠️ Required (Your Action)

#### 1. Add GitHub Secrets (Required for automatic newsletters)

Go to: https://github.com/techwithlc/mywebsite/settings/secrets/actions

Add these 12 secrets:

```
□ POSTGRES_HOST
□ POSTGRES_PORT
□ POSTGRES_DATABASE
□ POSTGRES_USER
□ POSTGRES_PASSWORD
□ EMAIL_HOST
□ EMAIL_PORT
□ EMAIL_USER
□ EMAIL_PASS
□ EMAIL_FROM
□ NEWS_API_KEY
□ PERPLEXITY_API_KEY
```

**See:** `GITHUB_ACTION_TUTORIAL.md` for values and detailed instructions

#### 2. Add Netlify Environment Variables (Required for website subscription)

Go to: https://app.netlify.com → Your Site → Environment Variables

Add these 5 variables:

```
□ POSTGRES_HOST
□ POSTGRES_PORT
□ POSTGRES_DATABASE
□ POSTGRES_USER
□ POSTGRES_PASSWORD
```

**See:** `NETLIFY_SETUP.md` for values and step-by-step guide

#### 3. Test Everything

After adding secrets and variables:

```
□ Test GitHub Action manually
  → Go to: https://github.com/techwithlc/mywebsite/actions
  → Click "Send Weekly Newsletter"
  → Click "Run workflow"
  → Watch it complete successfully

□ Test Netlify subscription
  → Visit your website
  → Enter email in subscription form
  → Verify "Subscription successful!" message

□ Verify subscriber in database
  → cd server
  → npm run setup (should show all ✅)
```

---

## 🎯 How to Add GitHub Secrets (Visual Guide)

### Step-by-Step:

1. **Open your repository**
   ```
   https://github.com/techwithlc/mywebsite
   ```

2. **Go to Settings tab** (top navigation)

3. **Navigate to Secrets**
   - Left sidebar → "Secrets and variables"
   - Click "Actions"
   - You'll see "Repository secrets"

4. **Add each secret**
   - Click green "New repository secret" button
   - Enter Name (EXACTLY as shown, case-sensitive!)
   - Enter Value (from GITHUB_ACTION_TUTORIAL.md)
   - Click "Add secret"
   - Repeat for all 12 secrets

5. **Verify**
   - You should see 12 secrets listed
   - Each shows "(set)" but value is hidden (for security)

---

## 🎯 How to Add Netlify Variables (Visual Guide)

### Step-by-Step:

1. **Open Netlify Dashboard**
   ```
   https://app.netlify.com
   ```

2. **Select your site**
   - Find "techwithlc/mywebsite" or your site name
   - Click on it

3. **Go to Environment Variables**
   - Click "Site settings" (top nav)
   - Left sidebar → "Environment variables"

4. **Add each variable**
   - Click "Add a variable" button
   - Select "Add a single variable"
   - Enter Key (EXACTLY as shown!)
   - Enter Value (from NETLIFY_SETUP.md)
   - Click "Create variable"
   - Repeat for all 5 variables

5. **Trigger Redeploy**
   - Go to "Deploys" tab
   - Click "Trigger deploy"
   - Select "Clear cache and deploy site"
   - Wait 2-3 minutes

6. **Test**
   - Visit your website
   - Try subscribing with your email
   - Should work! ✅

---

## 🧪 Testing Commands

Run these to verify everything works:

```bash
# Check setup status
cd server && npm run setup

# Test database connection
cd server && node -e "import('./database/db.js').then(m => m.db.getSubscriberCount().then(c => console.log('Subscribers:', c)))"

# Generate newsletter locally
cd server && npm run generate-newsletter

# Send newsletter locally (be careful - sends to real subscribers!)
cd server && npm run send-newsletter
```

---

## 📅 GitHub Action Schedule

**When:** Every Monday at 9:00 AM UTC+8 (1:00 AM UTC)

**What happens:**
1. Fetches latest AI news (News API)
2. Summarizes with AI (Perplexity)
3. Gets subscribers (PostgreSQL)
4. Sends emails (Gmail SMTP)

**Manual trigger:** Available anytime at:
https://github.com/techwithlc/mywebsite/actions

---

## 🎓 Key Files to Read

1. **`GITHUB_ACTION_TUTORIAL.md`** ⭐ START HERE
   - Complete GitHub Actions explanation
   - All 12 secrets with descriptions
   - Cron schedule explained
   - Parameter breakdown
   - Troubleshooting guide

2. **`NETLIFY_SETUP.md`**
   - Step-by-step Netlify setup
   - Environment variables guide
   - Testing instructions

3. **`SETUP_COMPLETE.md`**
   - Current system status
   - What's done vs what's needed

4. **`.github/workflows/send-newsletter.yml`**
   - The actual workflow file
   - Review to understand how it works

---

## 🚀 Quick Start

```bash
# 1. Read the tutorial
cat GITHUB_ACTION_TUTORIAL.md

# 2. Add GitHub Secrets (see tutorial for values)
# Go to: https://github.com/techwithlc/mywebsite/settings/secrets/actions

# 3. Add Netlify Variables (see NETLIFY_SETUP.md for values)
# Go to: https://app.netlify.com

# 4. Test GitHub Action
# Go to: https://github.com/techwithlc/mywebsite/actions
# Click "Run workflow"

# 5. Test website subscription
# Visit your site and subscribe with an email

# 6. Done! ✅
```

---

## 💡 Pro Tips

- ✅ **Test locally first** before setting up GitHub Actions
- ✅ **Add yourself as subscriber** to receive test newsletters
- ✅ **Check spam folder** when testing emails
- ✅ **Monitor GitHub Actions logs** for the first few runs
- ✅ **Start with manual trigger** before relying on schedule

---

## 🆘 Need Help?

All documentation includes troubleshooting sections:

- **GitHub Actions issues** → `GITHUB_ACTION_TUTORIAL.md`
- **Netlify subscription errors** → `NETLIFY_SETUP.md`
- **Database problems** → `server/database/README.md`
- **General setup** → `SETUP_COMPLETE.md`

---

**Ready to set up automatic newsletters! Follow GITHUB_ACTION_TUTORIAL.md!** 🚀

