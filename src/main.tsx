import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from './config/email';
import { LanguageProvider } from './contexts/LanguageContext';

// Add error handling for initialization
try {
  console.log('Initializing EmailJS...');
  emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
  console.log('EmailJS initialized successfully');
} catch (error) {
  console.error('Failed to initialize EmailJS:', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);

