import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the .env file
const envPath = path.join(__dirname, '.env');

// Define the environment variables
const envContent = `# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/techwithlc

# Email Service Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_FROM=newsletter@techwithlc.com

# API Keys
OPENAI_API_KEY=${process.argv[2] || ''}
NEWS_API_KEY=your-newsapi-key
`;

// Write the content to the .env file
fs.writeFileSync(envPath, envContent);

console.log('Environment variables have been set up successfully!');
console.log('Please update any missing values in the .env file.');
