import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const newsletterPath = path.join(__dirname, 'latest-ai-news.html');

// Email configuration - REPLACE THESE VALUES
const EMAIL_CONFIG = {
  // Use your Gmail address
  email: 'your.email@gmail.com',
  // Use an app password: https://myaccount.google.com/apppasswords
  appPassword: 'your-16-character-app-password',
  // Email to send the test newsletter to
  recipient: 'kuanlunlawrence.chen@gmail.com'
};

// Function to send email
async function sendEmail(config) {
  try {
    // Read the newsletter HTML
    if (!fs.existsSync(newsletterPath)) {
      console.error('Newsletter HTML file not found. Please run test-news-to-file.js first.');
      process.exit(1);
    }
    
    const htmlContent = fs.readFileSync(newsletterPath, 'utf8');
    
    // Configure Gmail transporter
    console.log('\nConfiguring Gmail transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email,
        pass: config.appPassword
      }
    });
    
    // Verify connection
    console.log('Verifying connection to Gmail...');
    await transporter.verify();
    console.log('Gmail connection successful!');
    
    // Setup email data
    const mailOptions = {
      from: `"TechwithLC Newsletter" <${config.email}>`,
      to: config.recipient,
      subject: `Latest AI News from TechwithLC - ${new Date().toLocaleDateString()}`,
      html: htmlContent
    };
    
    // Send email
    console.log(`Sending test email to ${config.recipient}...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    
    // Update .env file
    updateEnvFile({
      EMAIL_HOST: 'smtp.gmail.com',
      EMAIL_PORT: 587,
      EMAIL_USER: config.email,
      EMAIL_PASS: config.appPassword,
      EMAIL_FROM: config.email
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Function to update .env file
function updateEnvFile(emailConfig) {
  try {
    const envPath = path.join(__dirname, '.env');
    
    // Create new .env file with all configuration
    const envContent = `# Server Configuration
PORT=3001

# Email Configuration
EMAIL_HOST=${emailConfig.EMAIL_HOST}
EMAIL_PORT=${emailConfig.EMAIL_PORT}
EMAIL_USER=${emailConfig.EMAIL_USER}
EMAIL_PASS=${emailConfig.EMAIL_PASS}
EMAIL_FROM=${emailConfig.EMAIL_FROM}

# API Keys
OPENAI_API_KEY=${process.env.OPENAI_API_KEY}
NEWS_API_KEY=25e8435230ef4d64a53427191cf78c78
`;
    
    // Write .env file
    fs.writeFileSync(envPath, envContent);
    console.log('\n.env file updated with email configuration!');
    
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Email Setup =====');
  console.log('This script will help you configure and test email sending for your newsletter.');
  console.log('\nIMPORTANT: Before running this script, please:');
  console.log('1. Edit this file to set your Gmail address and app password');
  console.log('2. For Gmail, you need to create an "App Password":');
  console.log('   - Go to https://myaccount.google.com/apppasswords');
  console.log('   - Sign in with your Google account');
  console.log('   - Select "Mail" and "Other (Custom name)"');
  console.log('   - Enter "TechwithLC Newsletter" and click "Generate"');
  console.log('   - Use the 16-character password generated');
  
  // Check if user has updated the email config
  if (EMAIL_CONFIG.email === 'your.email@gmail.com' || 
      EMAIL_CONFIG.appPassword === 'your-16-character-app-password') {
    console.error('\nERROR: Please edit this file first to set your Gmail address and app password!');
    process.exit(1);
  }
  
  // Send test email
  const success = await sendEmail(EMAIL_CONFIG);
  
  if (success) {
    console.log('\n===== Email Setup Complete =====');
    console.log('Your email configuration has been saved to the .env file.');
    console.log('\nNext steps:');
    console.log('1. Start your server:');
    console.log('   npm start');
    console.log('\n2. Send a newsletter to all subscribers:');
    console.log('   curl -X POST http://localhost:3001/api/send-newsletter');
  }
}

// Run the script
main();
