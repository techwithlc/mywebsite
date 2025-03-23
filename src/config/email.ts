export const validateEmailConfig = () => {
  if (!import.meta.env.VITE_EMAILJS_SERVICE_ID) throw new Error('Missing EmailJS Service ID')
  if (!import.meta.env.VITE_EMAILJS_TEMPLATE_ID) throw new Error('Missing EmailJS Template ID')
  if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY) throw new Error('Missing EmailJS Public Key')
};

export const EMAIL_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};