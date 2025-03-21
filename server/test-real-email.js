import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const newsletterPath = path.join(__dirname, 'latest-ai-news.html');

// Function to send a real email using Gmail SMTP
async function sendRealEmail() {
  try {
    // Check if newsletter HTML exists
    if (!fs.existsSync(newsletterPath)) {
      console.error('Newsletter HTML file not found. Please run test-news-to-file.js first.');
      process.exit(1);
    }
    
    // Read the newsletter HTML
    const htmlContent = fs.readFileSync(newsletterPath, 'utf8');
    
    // Configure Gmail transporter with direct credentials
    // This bypasses the need for .env file
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your.email@gmail.com', // Replace with your Gmail
        pass: 'your-app-password'     // Replace with your app password
      }
    });
    
    // Setup email data
    const mailOptions = {
      from: '"TechwithLC Newsletter" <your.email@gmail.com>', // Replace with your Gmail
      to: "kuanlunlawrence.chen@gmail.com",
      subject: `Latest AI News from TechwithLC - ${new Date().toLocaleDateString()}`,
      html: htmlContent
    };
    
    // Verify connection
    console.log('Verifying connection to Gmail...');
    await transporter.verify();
    console.log('Gmail connection successful!');
    
    // Send email
    console.log(`Sending real email to kuanlunlawrence.chen@gmail.com...`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('===== TechwithLC Newsletter Real Email Test =====');
  console.log('This script will send a real email with the newsletter.');
  
  console.log('\nIMPORTANT: Before running this script:');
  console.log('1. Edit this file to replace "your.email@gmail.com" with your Gmail address');
  console.log('2. Edit this file to replace "your-app-password" with your Gmail app password');
  console.log('   (Get an app password from: https://myaccount.google.com/apppasswords)');
  
  // Check if user has updated the email config
  if (
    !fs.readFileSync(__filename, 'utf8').includes('your.email@gmail.com') &&
    !fs.readFileSync(__filename, 'utf8').includes('your-app-password')
  ) {
    // Send real email
    const success = await sendRealEmail();
    
    if (success) {
      console.log('\n===== Real Email Test Complete =====');
      console.log('The newsletter has been sent to your email.');
      console.log('Check your inbox (and spam folder) for the email.');
    }
  } else {
    console.error('\nERROR: Please edit this file first to set your Gmail address and app password!');
    console.log('Replace "your.email@gmail.com" with your actual Gmail address');
    console.log('Replace "your-app-password" with your actual app password');
  }
}

// Run the script
main();
