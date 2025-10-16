import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

async function initializeDatabase() {
  console.log('=== TechwithLC Database Initialization ===\n');

  // Check if all required environment variables are present
  const requiredVars = ['POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DATABASE', 'POSTGRES_USER', 'POSTGRES_PASSWORD'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease check your .env file and try again.');
    process.exit(1);
  }

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    // Try without SSL first
    ssl: false
  });

  try {
    // Connect to database
    console.log('📡 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('📄 Reading schema file...');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    console.log('🔨 Creating tables and indexes...');
    await client.query(schema);
    console.log('✅ Database schema created successfully!\n');

    // Check if table exists and show info
    const result = await client.query(`
      SELECT COUNT(*) as count 
      FROM subscribers
    `);
    
    console.log('📊 Database Status:');
    console.log(`   - Table: subscribers`);
    console.log(`   - Current subscriber count: ${result.rows[0].count}`);

    // Show table structure
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'subscribers'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Table Structure:');
    tableInfo.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    console.log('\n✨ Database initialization complete!\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('\nFull error details:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('👋 Connection closed.\n');
  }
}

// Run the initialization
initializeDatabase();

