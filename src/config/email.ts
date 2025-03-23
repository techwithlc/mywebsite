// Default EmailJS configuration with fallback values for production
// These values should match your EmailJS account settings
export const EMAIL_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  // We use the same template for both subscription and feedback by default
  FEEDBACK_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE_ID || '',
  SUBSCRIPTION_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_SUBSCRIPTION_TEMPLATE_ID || '',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  isConfigured: () => {
    return Boolean(
      EMAIL_CONFIG.SERVICE_ID && 
      EMAIL_CONFIG.TEMPLATE_ID && 
      EMAIL_CONFIG.PUBLIC_KEY
    );
  }
};

// Validate that EmailJS is properly configured
export const validateEmailConfig = () => {
  if (!EMAIL_CONFIG.isConfigured()) {
    console.warn('EmailJS configuration is incomplete. Forms will be disabled.');
    return false;
  }
  return true;
};