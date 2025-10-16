import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './database/db.js'; // Import PostgreSQL database utilities
import { fetchAndSummarizeNews } from './services/newsService.js'; // Import the updated function

// Load .env file only if not in production/CI environment
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'ci') {
  dotenv.config();
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, 'latest-ai-news.html');
const outputTextPath = path.join(__dirname, 'latest-ai-news.txt'); // Define text output path

// Function to convert HTML to plain text
function htmlToPlainText(html) {
  // Remove HTML tags
  let text = html.replace(/<style[^>]*>.*?<\/style>/gs, '')
    .replace(/<script[^>]*>.*?<\/script>/gs, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Replace common HTML entities
  text = text.replace(/&nbsp;/g, ' ')
    .replace(/&/g, '&') // Must be first
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Add line breaks for block elements first
  text = text.replace(/<h[1-6][^>]*>/gi, '\n\n')
             .replace(/<\/h[1-6][^>]*>/gi, '\n\n')
             .replace(/<p[^>]*>/gi, '\n')
             .replace(/<\/p[^>]*>/gi, '\n')
             .replace(/<div[^>]*>/gi, '\n')
             .replace(/<\/div[^>]*>/gi, '\n')
             .replace(/<li[^>]*>/gi, '\n* ') // Add bullet for list items
             .replace(/<br\s*\/?>/gi, '\n');

  // Remove remaining tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode entities again after tag removal, in case some were missed or created
  text = text.replace(/&/g, '&')
             .replace(/</g, '<')
             .replace(/>/g, '>')
             .replace(/"/g, '"')
             .replace(/&#39;/g, "'")
             .replace(/&nbsp;/g, ' ');

  // Clean up whitespace and multiple line breaks
  text = text.replace(/[ \t]+/g, ' ').replace(/\n[ \t]+/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();

  return text;
}

// Function to send emails with Gmail (modified for PostgreSQL)
async function sendWithGmail(htmlContent, emailSubject) {
  // Recommendation: For better deliverability and scalability, consider using a dedicated email service
  // provider (ESP) like SendGrid, Mailgun, AWS SES, or Resend instead of direct Gmail SMTP for newsletters.
  console.log('Setting up Gmail transport...');

  // Create plain text version of the newsletter
  const plainTextContent = htmlToPlainText(htmlContent);

  // Save plain text version to file for reference
  fs.writeFileSync(outputTextPath, plainTextContent);
  console.log(`Plain text newsletter saved to: ${outputTextPath}`);

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true, // Use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully!');
  } catch (error) {
    console.error('SMTP verification failed:', error);
    throw new Error(`Email configuration error: ${error.message}`);
  }

  // --- Fetch subscribers from PostgreSQL ---
  console.log('Fetching subscribers from PostgreSQL...');
  let activeSubscribers = [];
  try {
    activeSubscribers = await db.getActiveSubscribers();
    console.log(`Found ${activeSubscribers.length} subscribers in PostgreSQL.`);
  } catch (error) {
    console.error('Error fetching subscribers from PostgreSQL:', error.message);
    throw new Error(`Could not fetch subscribers: ${error.message}`);
  }
  // --- End Fetch subscribers from PostgreSQL ---

  if (activeSubscribers.length === 0) {
    console.log('No subscribers to send to.');
    return { success: true, sent: 0, message: 'No subscribers found in PostgreSQL' };
  }

  // Prepare email with both HTML and plain text versions
  const mailOptions = {
    from: `"TechwithLC" <${process.env.EMAIL_FROM}>`,
    subject: emailSubject || `TechwithLC AI News Update - ${new Date().toLocaleDateString()}`, // Use subject from summary if available
    text: plainTextContent, // Plain text version
    html: htmlContent, // HTML version
    // Add List-Unsubscribe header for better deliverability
    headers: {
      'List-Unsubscribe': '<mailto:unsubscribe@yourdomain.com?subject=Unsubscribe>, <https://yourdomain.com/unsubscribe>' // TODO: Replace with actual unsubscribe link/email
    }
  };

  // Send to each subscriber
  let successCount = 0;
  let failCount = 0;

  console.log(`Sending emails to ${activeSubscribers.length} subscribers...`);
  for (const subscriber of activeSubscribers) {
    if (!subscriber.email) {
      console.warn('Skipping subscriber with missing email.');
      failCount++;
      continue;
    }
    try {
      mailOptions.to = subscriber.email;
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${subscriber.email}: ${info.messageId}`);
      
      // Update last email sent timestamp in database
      await db.updateLastEmailSent(subscriber.email);
      
      successCount++;
      // Optional: Add a small delay between emails to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
    } catch (error) {
      console.error(`Failed to send to ${subscriber.email}:`, error.message);
      failCount++;
    }
  }

  console.log(`Newsletter sent: ${successCount} successful, ${failCount} failed`);
  return { success: true, sent: successCount, failed: failCount };
}

// Main function (updated)
async function main() {
  console.log('===== TechwithLC Newsletter Sender (Perplexity + PostgreSQL) =====');

  try {
    // Step 1: Fetch and summarize news using Perplexity (from newsService.js)
    console.log('Fetching and summarizing news using Perplexity...');
    const summaryResult = await fetchAndSummarizeNews(); // This now uses Perplexity

    if (!summaryResult || !summaryResult.content) {
      throw new Error("Failed to generate news summary content.");
    }

    const htmlContent = summaryResult.content;
    const emailSubject = summaryResult.title; // Use the title from the summary result

    // Print article titles (optional, if available in summaryResult.articles)
    if (summaryResult.articles && summaryResult.articles.length > 0) {
      console.log('\nOriginal articles fetched:');
      summaryResult.articles.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title} (${article.source?.name || 'Unknown'})`);
      });
    } else {
      console.log('\nNo original article details available in summary result.');
    }

    // Step 2: Save summary to file
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`\nNewsletter HTML saved to: ${outputPath}`);

    // Step 3: Send with Gmail to PostgreSQL subscribers
    console.log('\nSending newsletter via Gmail to PostgreSQL subscribers...');
    const result = await sendWithGmail(htmlContent, emailSubject); // Pass subject

    if (result.success) {
      console.log('\n===== Newsletter Sending Complete =====');
      console.log(`Successfully sent newsletters to ${result.sent} subscribers!`);
      if (result.failed > 0) {
        console.log(`Failed to send to ${result.failed} subscribers.`);
      }
      console.log('Check your inbox (and spam folder) for the newsletter.');
    } else {
      console.error('\n===== Newsletter Sending Failed =====');
      console.error(`Message: ${result.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('\nError in main newsletter process:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
