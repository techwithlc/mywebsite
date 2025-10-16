import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Client } = pg;

async function createDatabase() {
  console.log('=== Creating TechwithLC Database ===\n');

  // Connect to default 'postgres' database first
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: 'postgres', // Connect to default database first
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: false
  });

  try {
    console.log('📡 Connecting to PostgreSQL server...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Check if database already exists
    console.log('🔍 Checking if database exists...');
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'techwithlc'"
    );

    if (checkResult.rows.length > 0) {
      console.log('✅ Database "techwithlc" already exists!');
      console.log('\nYou can now run: npm run init-db\n');
      return;
    }

    // Create the database
    console.log('🔨 Creating database "techwithlc"...');
    await client.query('CREATE DATABASE techwithlc');
    console.log('✅ Database created successfully!\n');

    console.log('📊 Database Details:');
    console.log('   - Name: techwithlc');
    console.log('   - Host: ' + process.env.POSTGRES_HOST);
    console.log('   - Port: ' + process.env.POSTGRES_PORT);
    console.log('   - User: ' + process.env.POSTGRES_USER);

    console.log('\n✨ Next step: Run "npm run init-db" to create tables!\n');

  } catch (error) {
    if (error.code === '42P04') {
      console.log('✅ Database "techwithlc" already exists!');
      console.log('\nYou can now run: npm run init-db\n');
    } else {
      console.error('❌ Error creating database:', error.message);
      console.error('\nFull error:', error);
      process.exit(1);
    }
  } finally {
    await client.end();
    console.log('👋 Connection closed.\n');
  }
}

// Run the script
createDatabase();

