import pg from 'pg';

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  // Zeabur PostgreSQL doesn't require SSL
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Check if PostgreSQL credentials are available
  if (!process.env.POSTGRES_HOST || !process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD) {
    console.error('PostgreSQL credentials missing in function environment.');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server configuration error.' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  let client;
  try {
    const { email } = JSON.parse(event.body);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Please provide a valid email address.' }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const lowerCaseEmail = email.trim().toLowerCase();

    // Get a client from the pool
    client = await pool.connect();

    // Check if email already exists
    const checkQuery = 'SELECT email FROM subscribers WHERE email = $1 LIMIT 1';
    const checkResult = await client.query(checkQuery, [lowerCaseEmail]);

    if (checkResult.rows.length > 0) {
      return {
        statusCode: 200, // Return 200 OK even if already subscribed
        body: JSON.stringify({ message: 'This email is already subscribed.', success: true }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    // Insert email if it doesn't exist
    const insertQuery = `
      INSERT INTO subscribers (email, subscribed, subscribed_at) 
      VALUES ($1, true, CURRENT_TIMESTAMP) 
      ON CONFLICT (email) DO NOTHING 
      RETURNING *
    `;
    const insertResult = await client.query(insertQuery, [lowerCaseEmail]);

    // Check if insert was successful
    if (insertResult.rows.length === 0) {
      // This might happen if there was a race condition and email was inserted between check and insert
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'This email is already subscribed.', success: true }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    // Success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscription successful!', success: true }),
      headers: { 'Content-Type': 'application/json' },
    };

  } catch (error) {
    console.error('Error processing subscription:', error);
    
    // Handle specific PostgreSQL errors
    if (error.code === '23505') { // Unique violation
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'This email is already subscribed.', success: true }),
        headers: { 'Content-Type': 'application/json' },
      };
    }
    
    // Handle JSON parsing errors or other unexpected issues
    const errorMessage = error instanceof SyntaxError ? 'Invalid request format.' : 'An unexpected error occurred.';
    return {
      statusCode: error instanceof SyntaxError ? 400 : 500,
      body: JSON.stringify({ message: errorMessage }),
      headers: { 'Content-Type': 'application/json' },
    };
  } finally {
    // Always release the client back to the pool
    if (client) {
      client.release();
    }
  }
};
