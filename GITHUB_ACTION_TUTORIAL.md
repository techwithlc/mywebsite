# 🎓 Complete Guide: GitHub Actions for Automatic Newsletters

## 📚 Table of Contents
1. [What is GitHub Actions?](#what-is-github-actions)
2. [How Our Workflow Works](#how-our-workflow-works)
3. [Setting Up GitHub Secrets](#setting-up-github-secrets)
4. [Testing Your Workflow](#testing-your-workflow)
5. [Understanding the Parameters](#understanding-the-parameters)
6. [Troubleshooting](#troubleshooting)

---

## 🤖 What is GitHub Actions?

**GitHub Actions** is a CI/CD (Continuous Integration/Continuous Deployment) platform that lets you automate tasks directly in your GitHub repository.

### Why Use It for Newsletters?
- ✅ **Automatic scheduling** - Runs every Monday at 9am without you doing anything
- ✅ **Free** - 2,000 minutes/month free (we only use ~3 minutes/week)
- ✅ **Reliable** - GitHub's infrastructure ensures it runs on time
- ✅ **Secure** - Secrets are encrypted and never exposed in logs
- ✅ **Easy monitoring** - See logs and status for every run

---

## 🔧 How Our Workflow Works

Here's what happens every Monday at 9am UTC+8:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GitHub Actions triggers at scheduled time               │
│    (Every Monday, 1:00 AM UTC = 9:00 AM UTC+8)            │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Checks out your code from GitHub repository             │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Sets up Node.js 18 environment                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Installs dependencies (npm ci)                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Runs send-newsletter.js with your secrets               │
│    • Fetches AI news from News API                         │
│    • Summarizes with Perplexity AI                         │
│    • Gets subscribers from PostgreSQL                       │
│    • Sends emails via Gmail SMTP                            │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Reports success or failure                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Setting Up GitHub Secrets (Step by Step)

**GitHub Secrets** are encrypted environment variables that store your sensitive credentials securely.

### Why Use Secrets?
- 🔒 **Secure** - Encrypted and never visible in logs
- 🚫 **Not in code** - Keep credentials out of your repository
- ✅ **Easy to update** - Change secrets without changing code

### Step-by-Step Setup:

#### 1. Navigate to Secrets Page

1. Go to your repository: https://github.com/techwithlc/mywebsite
2. Click the **"Settings"** tab (top right)
3. In the left sidebar, find **"Secrets and variables"**
4. Click **"Actions"** under it
5. You'll see **"Repository secrets"** section

#### 2. Add Secrets One by One

Click **"New repository secret"** button (green button, top right)

For each secret below:
- Enter the **Name** (MUST be exact, case-sensitive!)
- Enter the **Value**
- Click **"Add secret"**

---

### 🗂️ All Secrets You Need (12 Total)

#### Group 1: PostgreSQL Database (5 secrets)

These connect to your Zeabur PostgreSQL database to get subscriber emails.

**Secret #1:**
```
Name: POSTGRES_HOST
Value: tpe1.clusters.zeabur.com
```
*What it does:* The server address where your database lives

**Secret #2:**
```
Name: POSTGRES_PORT
Value: 27700
```
*What it does:* The port number to connect to the database

**Secret #3:**
```
Name: POSTGRES_DATABASE
Value: techwithlc
```
*What it does:* The specific database name that has your subscribers table

**Secret #4:**
```
Name: POSTGRES_USER
Value: root
```
*What it does:* Username to authenticate with the database

**Secret #5:**
```
Name: POSTGRES_PASSWORD
Value: your_postgresql_password_here
```
*What it does:* Password to authenticate with the database

---

#### Group 2: Email Configuration (5 secrets)

These let the workflow send emails through your Gmail account.

**Secret #6:**
```
Name: EMAIL_HOST
Value: smtp.gmail.com
```
*What it does:* Gmail's SMTP server address

**Secret #7:**
```
Name: EMAIL_PORT
Value: 465
```
*What it does:* Port for secure email sending (SSL)

**Secret #8:**
```
Name: EMAIL_USER
Value: your_email@gmail.com
```
*What it does:* Your Gmail address (sender email)

**Secret #9:**
```
Name: EMAIL_PASS
Value: your_gmail_app_password_here
```
*What it does:* Gmail App Password (NOT your regular password!)

**Secret #10:**
```
Name: EMAIL_FROM
Value: your_email@gmail.com
```
*What it does:* The "From" address subscribers will see

---

#### Group 3: API Keys (2 secrets)

These connect to external services for news and AI.

**Secret #11:**
```
Name: NEWS_API_KEY
Value: your_news_api_key_here
```
*What it does:* Authenticates with News API to fetch AI news articles

**Secret #12:**
```
Name: PERPLEXITY_API_KEY
Value: pplx-your_perplexity_api_key_here
```
*What it does:* Authenticates with Perplexity AI to summarize news

---

### ✅ Verify All Secrets Are Added

After adding all 12, you should see:

```
POSTGRES_HOST          (set)
POSTGRES_PORT          (set)
POSTGRES_DATABASE      (set)
POSTGRES_USER          (set)
POSTGRES_PASSWORD      (set)
EMAIL_HOST             (set)
EMAIL_PORT             (set)
EMAIL_USER             (set)
EMAIL_PASS             (set)
EMAIL_FROM             (set)
NEWS_API_KEY           (set)
PERPLEXITY_API_KEY     (set)
```

**Important:** You can't view secret values after saving (for security). If you make a typo, just delete and re-add the secret.

---

## 🧪 Testing Your Workflow

### Option 1: Manual Test (Recommended First Time)

1. Go to: https://github.com/techwithlc/mywebsite/actions
2. Click **"Send Weekly Newsletter"** in the left sidebar
3. Click **"Run workflow"** button (right side, above the workflow list)
4. A dropdown appears - click the green **"Run workflow"** button
5. Wait ~2-3 minutes
6. Click on the running workflow to see live logs

### What You'll See in Logs:

```
✅ Checkout code
✅ Setup Node.js
✅ Install dependencies
✅ Send newsletter
   → Fetching latest AI news from News API...
   → Successfully fetched 5 articles!
   → Summarizing news with Perplexity...
   → Fetching subscribers from PostgreSQL...
   → Found 5 subscribers in PostgreSQL
   → Sending emails to 5 subscribers...
   → Email sent to user1@example.com
   → Email sent to user2@example.com
   ...
   → Newsletter sent: 5 successful, 0 failed
✅ Report success
   Newsletter sent successfully!
   Sent at: Mon Oct 21 01:00:00 UTC 2024
```

### Option 2: Wait for Scheduled Run

The workflow runs automatically every Monday at 9am UTC+8.

---

## 📝 Understanding the Parameters

Let's break down the workflow file (`.github/workflows/send-newsletter.yml`):

### Part 1: Trigger Configuration

```yaml
on:
  schedule:
    - cron: '0 1 * * 1'
  workflow_dispatch:
```

**Explained:**
- `schedule:` - Runs automatically on a schedule
- `cron: '0 1 * * 1'` - Cron expression (explained below)
- `workflow_dispatch:` - Allows manual triggering from GitHub UI

#### Understanding Cron: `'0 1 * * 1'`

Cron format: `minute hour day_of_month month day_of_week`

```
 ┌─────── minute (0-59)
 │ ┌─────── hour (0-23, UTC time!)
 │ │ ┌─────── day of month (1-31)
 │ │ │ ┌─────── month (1-12)
 │ │ │ │ ┌─────── day of week (0-6, Sunday=0, Monday=1)
 │ │ │ │ │
 * * * * *
```

**Our schedule:** `0 1 * * 1`
- `0` - At minute 0 (top of the hour)
- `1` - At 1 AM UTC
- `*` - Every day of the month
- `*` - Every month
- `1` - Only on Monday (0=Sun, 1=Mon, 2=Tue, etc.)

**Time conversion:**
- 1:00 AM UTC = 9:00 AM UTC+8 (Beijing/Taipei time)

**Examples of other schedules:**
```yaml
'0 1 * * 2'    # Tuesday 9am UTC+8
'0 1 * * *'    # Every day 9am UTC+8
'0 9 * * 1'    # Monday 5pm UTC+8
'30 2 * * 1'   # Monday 10:30am UTC+8
'0 1 1 * *'    # First day of every month, 9am UTC+8
```

### Part 2: Environment Variables

```yaml
env:
  POSTGRES_HOST: ${{ secrets.POSTGRES_HOST }}
  NEWS_API_KEY: ${{ secrets.NEWS_API_KEY }}
```

**Explained:**
- `env:` - Defines environment variables for the job
- `${{ secrets.SECRET_NAME }}` - References GitHub secrets
- These become available as `process.env.POSTGRES_HOST` in Node.js

**Why this matters:**
Your `send-newsletter.js` code uses these:
```javascript
const pool = new Pool({
  host: process.env.POSTGRES_HOST,  // From GitHub secret
  password: process.env.POSTGRES_PASSWORD,  // From GitHub secret
  // ...
});
```

### Part 3: Job Steps

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4
```

**Explained:**
- `steps:` - List of tasks to run
- `name:` - Human-readable description
- `uses:` - Runs a pre-built action from GitHub marketplace

**Common actions:**
- `actions/checkout@v4` - Downloads your repository code
- `actions/setup-node@v4` - Installs Node.js
- `run:` - Runs shell commands

### Part 4: Running Your Script

```yaml
- name: Send newsletter
  run: |
    cd server
    node send-newsletter.js
```

**Explained:**
- `run:` - Executes shell commands
- `|` - Multi-line script indicator
- `cd server` - Changes directory
- `node send-newsletter.js` - Runs your newsletter script

---

## 🛠️ Understanding GitHub Actions Workflow Syntax

### Basic Structure

```yaml
name: Workflow Name          # Shows in GitHub UI
on: [trigger]               # When to run
jobs:                       # What to do
  job-name:                 # Unique job identifier
    runs-on: ubuntu-latest  # OS environment
    steps:                  # Sequential tasks
      - name: Step 1        # Task description
        run: echo "Hello"   # Command to run
```

### Key Concepts

#### 1. **Workflow**
- A YAML file in `.github/workflows/`
- Defines automation process
- Can have multiple jobs

#### 2. **Jobs**
- Set of steps that run on the same runner
- Can run in parallel or sequence
- Each job runs in fresh environment

#### 3. **Steps**
- Individual tasks within a job
- Run sequentially
- Share the same filesystem

#### 4. **Actions**
- Reusable components from GitHub marketplace
- Like `actions/checkout@v4`
- Or custom scripts

---

## 🐛 Troubleshooting

### Issue 1: Workflow Not Appearing

**Symptom:** Can't find "Send Weekly Newsletter" in Actions tab

**Solution:**
1. Make sure `.github/workflows/send-newsletter.yml` exists
2. Push the file to GitHub
3. Check file syntax (must be valid YAML)
4. Wait 1-2 minutes for GitHub to detect it

### Issue 2: "Secret not found" Error

**Symptom:** Logs show `undefined` for environment variables

**Solution:**
1. Go to repo Settings → Secrets and variables → Actions
2. Verify ALL 12 secrets are added
3. Check secret names match EXACTLY (case-sensitive)
   - Must be `POSTGRES_HOST`, not `postgres_host`
4. Re-run the workflow after fixing

### Issue 3: Workflow Fails with "No subscribers"

**Symptom:** Success but "0 subscribers" in logs

**Solution:**
1. Add Netlify environment variables (see NETLIFY_SETUP.md)
2. Subscribe via your website form
3. Or manually add subscriber:
   ```bash
   cd server
   node -e "import('./database/db.js').then(m => m.db.addSubscriber('test@example.com'))"
   ```

### Issue 4: Email Not Sending

**Symptom:** "SMTP authentication failed" or similar

**Solution:**
1. Verify `EMAIL_PASS` is your Gmail **App Password**, not regular password
2. Generate new app password: https://myaccount.google.com/apppasswords
3. Update the `EMAIL_PASS` secret in GitHub
4. Re-run workflow

### Issue 5: Wrong Time Zone

**Symptom:** Newsletter sends at wrong time

**Solution:**
GitHub Actions uses UTC time. To adjust:

Calculate UTC time from your timezone:
```
Your time (UTC+8) = 9:00 AM
UTC time = 9:00 AM - 8 hours = 1:00 AM
Cron expression = '0 1 * * 1'
```

For different times:
```
12:00 PM UTC+8 = 4:00 AM UTC  → '0 4 * * 1'
6:00 PM UTC+8  = 10:00 AM UTC → '0 10 * * 1'
3:30 PM UTC+8  = 7:30 AM UTC  → '30 7 * * 1'
```

---

## 📊 Monitoring & Logs

### Where to Check:
https://github.com/techwithlc/mywebsite/actions

### What to Look For:

✅ **Green checkmark** = Success
- Newsletter sent successfully
- Check specific numbers in logs

❌ **Red X** = Failure
- Click on it to see error logs
- Common issues: API limits, wrong credentials

⚪ **Yellow dot** = Running
- Currently executing
- Click to see live logs

### Reading Logs:

Each step shows:
- ✅ Step name (e.g., "Send newsletter")
- ⏱️ Duration (e.g., "2m 34s")
- 📝 Output logs (expandable)

Click on any step to see detailed logs.

---

## 🎯 Quick Reference

### Essential Links:
- **Actions Dashboard:** https://github.com/techwithlc/mywebsite/actions
- **Secrets Settings:** https://github.com/techwithlc/mywebsite/settings/secrets/actions
- **Workflow File:** `.github/workflows/send-newsletter.yml`

### Essential Commands:
```bash
# Test locally
cd server && node send-newsletter.js

# Check subscribers
cd server && node -e "import('./database/db.js').then(m => m.db.getSubscriberCount().then(c => console.log('Subscribers:', c)))"

# Add test subscriber
cd server && node -e "import('./database/db.js').then(m => m.db.addSubscriber('test@example.com'))"
```

---

## 🎓 Learning Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Cron Expression Generator:** https://crontab.guru/
- **GitHub Actions Marketplace:** https://github.com/marketplace?type=actions

---

**You're all set! Add those 12 secrets and test your first newsletter!** 🚀

