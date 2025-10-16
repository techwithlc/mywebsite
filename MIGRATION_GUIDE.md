# Migration Guide: Supabase → Zeabur PostgreSQL & Gemini → Perplexity

This guide covers the migration from Supabase to Zeabur PostgreSQL database and from Google Gemini to Perplexity API.

## 🎯 Overview of Changes

### Database Migration
- **Before**: Supabase (hosted PostgreSQL with SDK)
- **After**: Zeabur PostgreSQL (direct PostgreSQL connection)
- **Library**: Changed from `@supabase/supabase-js` to `pg`

### AI API Migration
- **Before**: Google Gemini API (`@google/generative-ai`)
- **After**: Perplexity API (REST API via axios)
- **Model**: Using `llama-3.1-sonar-large-128k-online`

---

## 📋 Prerequisites

### 1. Install Dependencies

```bash
# Root directory
npm install pg

# Server directory
cd server
npm install pg
npm uninstall @supabase/supabase-js
```

### 2. Set Up Database

Run the SQL schema to create the subscribers table:

```bash
# Connect to your Zeabur PostgreSQL database
psql -h tpe1.clusters.zeabur.com -p 27700 -U root -d techwithlc

# Then run:
\i server/database/schema.sql
```

Or manually execute the SQL:

```sql
CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_email_sent TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed ON subscribers(subscribed);
```

---

## 🔐 Environment Variables

### Root `.env` File

Create a `.env` file in the project root:

```env
# PostgreSQL Database (Zeabur)
POSTGRES_HOST=tpe1.clusters.zeabur.com
POSTGRES_PORT=27700
POSTGRES_DATABASE=techwithlc
POSTGRES_USER=root
POSTGRES_PASSWORD=your_postgresql_password_here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com

# News API
NEWS_API_KEY=your_news_api_key

# Perplexity API
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

### Server `.env` File

Create a `.env` file in the `server/` directory with the same content as above.

### Netlify Environment Variables

In your Netlify dashboard, add these environment variables for the serverless functions:

- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DATABASE`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

---

## 🗄️ Database Migration

### Migrate Existing Subscribers

If you have existing subscribers in Supabase, export and import them:

#### 1. Export from Supabase

```sql
-- In Supabase SQL Editor
COPY (
  SELECT email, subscribed, subscribed_at 
  FROM subscriber 
  WHERE subscribed = true
) TO STDOUT WITH CSV HEADER;
```

#### 2. Import to Zeabur PostgreSQL

```bash
# Connect to Zeabur PostgreSQL
psql -h tpe1.clusters.zeabur.com -p 27700 -U root -d techwithlc

# Import the CSV
\copy subscribers(email, subscribed, subscribed_at) FROM 'subscribers.csv' WITH CSV HEADER;
```

---

## 📝 Code Changes Summary

### Files Modified

1. **`server/database/schema.sql`** (NEW)
   - Database schema definition for subscribers table

2. **`server/database/db.js`** (NEW)
   - PostgreSQL connection pool and utility functions
   - Helper methods for subscriber management

3. **`netlify/functions/subscribe.js`**
   - Replaced Supabase client with direct PostgreSQL connection
   - Uses `pg` library with connection pool

4. **`server/send-newsletter.js`**
   - Replaced Supabase subscriber fetching with PostgreSQL queries
   - Uses `db.getActiveSubscribers()` helper function
   - Updated to track last_email_sent in database

5. **`server/services/newsService.js`**
   - Replaced Google Gemini with Perplexity API
   - Function renamed: `summarizeNewsWithGemini()` → `summarizeNewsWithPerplexity()`
   - Uses REST API instead of SDK

6. **`server/send-newsletter-now.js`**
   - Updated to use Perplexity API for summarization

7. **`package.json`** (both root and server)
   - Added: `pg@^8.11.3`
   - Removed: `@supabase/supabase-js`

---

## 🧪 Testing

### 1. Test Database Connection

```bash
cd server
node -e "import('./database/db.js').then(m => m.db.getSubscriberCount().then(c => console.log('Subscribers:', c)))"
```

### 2. Test Newsletter Subscription

```bash
# Test the Netlify function locally
curl -X POST http://localhost:8888/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 3. Test Newsletter Generation

```bash
cd server
node send-newsletter-now.js
```

### 4. Test Newsletter Sending

```bash
cd server
node send-newsletter.js
```

---

## 🚀 Deployment Steps

### 1. Update Environment Variables

**Netlify:**
- Go to Site Settings → Environment Variables
- Remove old `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Add new PostgreSQL variables (listed above)
- Add `PERPLEXITY_API_KEY`

### 2. Install Dependencies

```bash
npm install
cd server && npm install
```

### 3. Deploy

```bash
# Commit changes
git add .
git commit -m "Migrate from Supabase to PostgreSQL and Gemini to Perplexity"

# Push to deploy (if using auto-deploy)
git push origin main
```

### 4. Run Database Migration

After deploying, ensure the database schema is set up on Zeabur PostgreSQL by running the SQL script.

---

## 🔧 Troubleshooting

### Connection Issues

If you see connection errors:

```bash
# Check if PostgreSQL is accessible
psql -h tpe1.clusters.zeabur.com -p 27700 -U root -d techwithlc
```

### SSL Certificate Issues

The code includes `ssl: { rejectUnauthorized: false }` for Zeabur. If you have SSL issues, verify this setting.

### Perplexity API Errors

- Verify API key is correct
- Check API rate limits
- Review error messages in `error.response.data`

### Missing Subscribers

If subscribers are missing after migration:
1. Verify the CSV export/import process
2. Check the table directly:
   ```sql
   SELECT COUNT(*) FROM subscribers WHERE subscribed = true;
   ```

---

## 📊 Database Schema

### Subscribers Table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| email | VARCHAR(255) | Unique email address |
| subscribed | BOOLEAN | Subscription status |
| subscribed_at | TIMESTAMP | When they subscribed |
| last_email_sent | TIMESTAMP | Last newsletter sent |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### Indexes

- `idx_subscribers_email` - Fast email lookups
- `idx_subscribers_subscribed` - Filter active subscribers

---

## 🎉 Benefits of Migration

### PostgreSQL Direct Connection
- ✅ More control over database operations
- ✅ Better performance with connection pooling
- ✅ Standard SQL queries
- ✅ No vendor lock-in

### Perplexity API
- ✅ More powerful language model
- ✅ Online search capabilities
- ✅ Better news summarization
- ✅ Simple REST API

---

## 📞 Support

If you encounter any issues:
1. Check the error logs in `server/logs/`
2. Verify environment variables are set correctly
3. Test database connectivity separately
4. Review Perplexity API documentation: https://docs.perplexity.ai/

---

## 🔄 Rollback Plan

If needed, you can rollback by:
1. Reinstalling `@supabase/supabase-js`
2. Reverting the code changes via git
3. Restoring environment variables

```bash
# Rollback commits
git revert HEAD

# Or restore from backup
git checkout <previous-commit-hash>
```

---

**Migration completed!** 🎊

