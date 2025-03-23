#!/bin/bash
set -e

echo "🔍 Verifying build process..."
npm run build

echo "✅ Checking for AI news feed XML file..."
if [ -f "server/public/ai-news-feed.xml" ]; then
  echo "   Found ai-news-feed.xml ✓"
else
  echo "❌ ERROR: ai-news-feed.xml not found in server/public/"
  exit 1
fi

echo "✅ Checking EmailJS configuration..."
if grep -q "VITE_EMAILJS" .env; then
  echo "   EmailJS environment variables found ✓"
else
  echo "⚠️ WARNING: EmailJS environment variables not found in .env"
  echo "   Make sure these are set in Netlify:"
  echo "   - VITE_EMAILJS_SERVICE_ID"
  echo "   - VITE_EMAILJS_TEMPLATE_ID"
  echo "   - VITE_EMAILJS_PUBLIC_KEY"
fi

echo "🚀 All checks passed! Ready to deploy."
