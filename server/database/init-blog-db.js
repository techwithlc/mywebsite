import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initBlogDatabase() {
  try {
    console.log('🚀 Initializing blog database schema...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'blog-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Blog database schema initialized successfully!');
    console.log('📊 Created tables:');
    console.log('   - blog_posts');
    console.log('📈 Created indexes for better performance');
    console.log('⚡ Created triggers for automatic timestamp updates');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing blog database:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the initialization
initBlogDatabase();

