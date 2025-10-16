# Database Module

This module provides PostgreSQL database connectivity and utilities for the TechwithLC newsletter system.

## Files

### `schema.sql`
Database schema definition for the subscribers table with indexes.

**Usage:**
```bash
# Initialize the database
node init-db.js

# Or manually with psql
psql -h tpe1.clusters.zeabur.com -p 27700 -U root -d techwithlc < schema.sql
```

### `db.js`
PostgreSQL connection pool and utility functions.

**Features:**
- Connection pooling for better performance
- Helper functions for common operations
- Automatic connection management
- Query logging

**Example Usage:**
```javascript
import { db, query } from './database/db.js';

// Get all active subscribers
const subscribers = await db.getActiveSubscribers();

// Check if email exists
const exists = await db.checkEmailExists('test@example.com');

// Add new subscriber
const newSub = await db.addSubscriber('user@example.com');

// Get subscriber count
const count = await db.getSubscriberCount();

// Custom query
const result = await query('SELECT * FROM subscribers WHERE id = $1', [1]);
```

### `init-db.js`
Database initialization script that creates tables and indexes.

**Usage:**
```bash
cd server
node database/init-db.js
```

This will:
1. Connect to your PostgreSQL database
2. Create the subscribers table
3. Create necessary indexes
4. Display database status

## Database Schema

### Subscribers Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Subscriber email |
| subscribed | BOOLEAN | DEFAULT true | Subscription status |
| subscribed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Subscription date |
| last_email_sent | TIMESTAMP | NULL | Last newsletter sent |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update |

### Indexes

- `idx_subscribers_email` - Optimizes email lookups
- `idx_subscribers_subscribed` - Optimizes filtering by subscription status

## Available Functions

### `db.getActiveSubscribers()`
Returns all active (subscribed) subscribers.

**Returns:** `Array<{email: string}>`

### `db.checkEmailExists(email)`
Checks if an email already exists in the database.

**Parameters:**
- `email` (string) - Email to check

**Returns:** `boolean`

### `db.addSubscriber(email)`
Adds a new subscriber to the database.

**Parameters:**
- `email` (string) - Email to add

**Returns:** `Object` - The created subscriber record (or undefined if already exists)

### `db.updateLastEmailSent(email)`
Updates the last_email_sent timestamp for a subscriber.

**Parameters:**
- `email` (string) - Email to update

**Returns:** `boolean` - True if updated successfully

### `db.unsubscribeUser(email)`
Marks a user as unsubscribed.

**Parameters:**
- `email` (string) - Email to unsubscribe

**Returns:** `boolean` - True if updated successfully

### `db.getSubscriberCount()`
Gets the count of active subscribers.

**Returns:** `number`

### `query(text, params)`
Execute a custom SQL query.

**Parameters:**
- `text` (string) - SQL query with $1, $2, etc. placeholders
- `params` (Array) - Query parameters

**Returns:** `Object` - Query result with rows property

## Environment Variables

Required environment variables (see [ENV_SETUP.md](../ENV_SETUP.md)):

```env
POSTGRES_HOST=tpe1.clusters.zeabur.com
POSTGRES_PORT=27700
POSTGRES_DATABASE=techwithlc
POSTGRES_USER=root
POSTGRES_PASSWORD=your_password
```

## Connection Pool Configuration

The connection pool is configured with:
- **Max connections:** 20
- **Idle timeout:** 30 seconds
- **Connection timeout:** 2 seconds
- **SSL:** Enabled with `rejectUnauthorized: false` for Zeabur

## Error Handling

All database operations include error handling and logging. Errors are:
1. Logged to console
2. Re-thrown for caller handling
3. Automatically release connections back to pool

## Testing

Test the database connection:

```bash
# Test connection and get subscriber count
node -e "import('./db.js').then(m => m.db.getSubscriberCount().then(c => console.log('Count:', c)))"

# Test adding a subscriber
node -e "import('./db.js').then(m => m.db.addSubscriber('test@example.com').then(r => console.log('Added:', r)))"
```

## Migration from Supabase

If migrating from Supabase, see [MIGRATION_GUIDE.md](../../MIGRATION_GUIDE.md) for detailed instructions on:
- Exporting existing subscribers
- Importing to PostgreSQL
- Updating environment variables
- Testing the migration

## Troubleshooting

### Connection Issues

**Problem:** Can't connect to database

**Solutions:**
1. Verify environment variables are set correctly
2. Check database is running on Zeabur
3. Ensure firewall allows connections
4. Test connection manually with psql

### Query Timeout

**Problem:** Queries taking too long

**Solutions:**
1. Check database server load
2. Verify indexes are created
3. Review query performance
4. Increase `connectionTimeoutMillis` if needed

### Pool Exhaustion

**Problem:** "No more connections available" error

**Solutions:**
1. Ensure connections are being released (use try/finally)
2. Increase `max` pool size if needed
3. Check for connection leaks in your code

---

For more information, see the main [README.md](../../README.md) and [MIGRATION_GUIDE.md](../../MIGRATION_GUIDE.md).

