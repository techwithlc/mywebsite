import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Removed EmailJS imports
import { LanguageProvider } from './contexts/LanguageContext';

// Removed EmailJS initialization block

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
