import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'ci') {
  dotenv.config();
}

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  // Try without SSL first, Zeabur might not require it
  ssl: false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('PostgreSQL connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on PostgreSQL client', err);
  process.exit(-1);
});

// Helper function to query the database
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get a client from the pool
export async function getClient() {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query(...args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release();
  };

  return client;
}

// Database utility functions
export const db = {
  // Get all active subscribers
  async getActiveSubscribers() {
    const result = await query(
      'SELECT email FROM subscribers WHERE subscribed = true ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Check if email exists
  async checkEmailExists(email) {
    const result = await query(
      'SELECT email FROM subscribers WHERE email = $1 LIMIT 1',
      [email.toLowerCase()]
    );
    return result.rows.length > 0;
  },

  // Add new subscriber
  async addSubscriber(email) {
    const result = await query(
      `INSERT INTO subscribers (email, subscribed, subscribed_at) 
       VALUES ($1, true, CURRENT_TIMESTAMP) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING *`,
      [email.toLowerCase()]
    );
    return result.rows[0];
  },

  // Update last email sent timestamp
  async updateLastEmailSent(email) {
    const result = await query(
      'UPDATE subscribers SET last_email_sent = CURRENT_TIMESTAMP WHERE email = $1',
      [email.toLowerCase()]
    );
    return result.rowCount > 0;
  },

  // Unsubscribe user
  async unsubscribeUser(email) {
    const result = await query(
      'UPDATE subscribers SET subscribed = false, updated_at = CURRENT_TIMESTAMP WHERE email = $1',
      [email.toLowerCase()]
    );
    return result.rowCount > 0;
  },

  // Get subscriber count
  async getSubscriberCount() {
    const result = await query(
      'SELECT COUNT(*) as count FROM subscribers WHERE subscribed = true'
    );
    return parseInt(result.rows[0].count);
  }
};

export default pool;

