import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize email transporter
const createTransport = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export async function handler(event) {
  try {
    // Enable CORS
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Preflight request successful' })
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Method not allowed' })
      };
    }

    // Parse body
    const body = JSON.parse(event.body);
    const message = body.message;

    if (!message || message.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Message cannot be empty' })
      };
    }

    // Only try to send email if needed credentials are available
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Send email
      const transporter = createTransport();
      
      await transporter.sendMail({
        from: `"Website Feedback" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'New Website Feedback',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">New Feedback Received</h2>
            <p style="font-size: 16px; line-height: 1.5;">
              ${message.replace(/\n/g, '<br>')}
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              Sent from your TechwithLC website
            </p>
          </div>
        `
      });
    } else {
      console.log('Email credentials not available, but feedback received:', message);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Feedback sent successfully!' })
    };
  } catch (error) {
    console.error('Error in feedback API:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Server error, please try again later' })
    };
  }
}
