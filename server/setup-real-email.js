import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for email credentials
function promptForCredentials() {
  return new Promise((resolve) => {
    console.log('\n===== Email Configuration =====');
    console.log('Please enter your Gmail credentials to send the newsletter:');
    
    rl.question('Gmail address: ', (email) => {
      rl.question('Gmail app password (16-character): ', (password) => {
        resolve({
          email,
          password
        });
        rl.close();
      });
    });
  });
}

// Function to update .env file
function updateEnvFile(emailConfig) {
  try {
    let envContent = '';
    
    // Check if .env file exists
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update email configuration
      const envLines = envContent.split('\n');
      const updatedLines = envLines.map(line => {
        if (line.startsWith('EMAIL_HOST=')) {
          return `EMAIL_HOST=smtp.gmail.com`;
        } else if (line.startsWith('EMAIL_PORT=')) {
          return `EMAIL_PORT=587`;
        } else if (line.startsWith('EMAIL_USER=')) {
          return `EMAIL_USER=${emailConfig.email}`;
        } else if (line.startsWith('EMAIL_PASS=')) {
          return `EMAIL_PASS=${emailConfig.password}`;
        } else if (line.startsWith('EMAIL_FROM=')) {
          return `EMAIL_FROM=${emailConfig.email}`;
        } else {
          return line;
        }
      });
      
      envContent = updatedLines.join('\n');
    } else {
      // Create new .env file with email configuration
      envContent = `# Server Configuration
PORT=3001

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=${emailConfig.email}
EMAIL_PASS=${emailConfig.password}
EMAIL_FROM=${emailConfig.email}

# API Keys
OPENAI_API_KEY=${process.env.OPENAI_API_KEY}
NEWS_API_KEY=25e8435230ef4d64a53427191cf78c78
`;
    }
    
    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
    console.log('\n.env file updated with Gmail configuration!');
    
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Gmail Setup =====');
  console.log('This script will help you configure Gmail for sending real newsletters.');
  
  console.log('\nIMPORTANT: Before continuing, you need to create an App Password for your Gmail account:');
  console.log('1. Go to https://myaccount.google.com/apppasswords');
  console.log('2. Sign in with your Google account');
  console.log('3. Select "Mail" and "Other (Custom name)"');
  console.log('4. Enter "TechwithLC Newsletter" and click "Generate"');
  console.log('5. Copy the 16-character password generated');
  
  // Prompt for email credentials
  const credentials = await promptForCredentials();
  
  // Update .env file
  const updated = updateEnvFile(credentials);
  
  if (updated) {
    console.log('\n===== Gmail Setup Complete =====');
    console.log('Your Gmail configuration has been saved to the .env file.');
    console.log('\nNext steps:');
    console.log('1. Restart your server:');
    console.log('   npm start');
    console.log('\n2. Send a newsletter to all subscribers:');
    console.log('   curl -X POST http://localhost:3001/api/send-newsletter');
  }
}

// Run the script
main();
