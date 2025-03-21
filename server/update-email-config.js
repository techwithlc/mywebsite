import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');

// Gmail configuration - REPLACE THESE VALUES
const EMAIL_CONFIG = {
  // Your Gmail address
  email: 'show99520show99620@gmail.com',
  // Your app password from https://myaccount.google.com/apppasswords
  password: 'jhswffnnjzqdvqsk'
};

// Function to update .env file
function updateEnvFile() {
  try {
    // Read existing .env file if it exists
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update email configuration lines
      const envLines = envContent.split('\n');
      const updatedLines = envLines.map(line => {
        if (line.startsWith('EMAIL_USER=')) {
          return `EMAIL_USER=${EMAIL_CONFIG.email}`;
        } else if (line.startsWith('EMAIL_PASS=')) {
          return `EMAIL_PASS=${EMAIL_CONFIG.password}`;
        } else if (line.startsWith('EMAIL_FROM=')) {
          return `EMAIL_FROM=${EMAIL_CONFIG.email}`;
        } else {
          return line;
        }
      });
      
      envContent = updatedLines.join('\n');
    } else {
      // Create new .env file with all configuration
      envContent = `# Server Configuration
PORT=3001

# Email Configuration
EMAIL_USER=${EMAIL_CONFIG.email}
EMAIL_PASS=${EMAIL_CONFIG.password}
EMAIL_FROM=${EMAIL_CONFIG.email}

# API Keys
OPENAI_API_KEY=${process.env.OPENAI_API_KEY}
NEWS_API_KEY=25e8435230ef4d64a53427191cf78c78
`;
    }
    
    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
    console.log('.env file updated with Gmail configuration!');
    
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error);
    return false;
  }
}

// Instructions for setting up Gmail App Password
function printInstructions() {
  console.log('\n===== Gmail Setup Instructions =====');
  console.log('To use Gmail for sending newsletters, you need to:');
  console.log('\n1. Edit this file (update-email-config.js) to add your Gmail credentials:');
  console.log('   - Replace "your.email@gmail.com" with your actual Gmail address');
  console.log('   - Replace "your-16-character-app-password" with your Gmail app password');
  console.log('\n2. To get an app password:');
  console.log('   a. Go to https://myaccount.google.com/apppasswords');
  console.log('   b. Sign in with your Google account');
  console.log('   c. Select "Mail" as the app and "Other (Custom name)" as the device');
  console.log('   d. Enter "TechwithLC Newsletter" and click "Generate"');
  console.log('   e. Copy the 16-character password that appears');
  console.log('\n3. After updating this file, run it again:');
  console.log('   node update-email-config.js');
  console.log('\n4. Then restart your server:');
  console.log('   npm start');
  console.log('\n5. Send a newsletter to all subscribers:');
  console.log('   curl -X POST http://localhost:3001/api/send-newsletter');
}

// Main function
function main() {
  console.log('===== TechwithLC Newsletter Email Configuration =====');
  
  // Check if user has updated the email config
  if (EMAIL_CONFIG.email === 'your.email@gmail.com' || 
      EMAIL_CONFIG.password === 'your-16-character-app-password') {
    printInstructions();
  } else {
    // Update .env file
    const updated = updateEnvFile();
    
    if (updated) {
      console.log('\n===== Email Configuration Complete =====');
      console.log('Your Gmail configuration has been saved to the .env file.');
      console.log('\nNext steps:');
      console.log('1. Restart your server:');
      console.log('   npm start');
      console.log('\n2. Send a newsletter to all subscribers:');
      console.log('   curl -X POST http://localhost:3001/api/send-newsletter');
    }
  }
}

// Run the script
main();
