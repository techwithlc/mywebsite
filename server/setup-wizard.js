import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║         TechwithLC Setup Status Checker                     ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// Check PostgreSQL
console.log('🔍 Checking Configuration...\n');

const checks = {
  postgres: {
    name: 'PostgreSQL Database',
    vars: ['POSTGRES_HOST', 'POSTGRES_PORT', 'POSTGRES_DATABASE', 'POSTGRES_USER', 'POSTGRES_PASSWORD'],
    status: null
  },
  perplexity: {
    name: 'Perplexity API',
    vars: ['PERPLEXITY_API_KEY'],
    status: null
  },
  email: {
    name: 'Email (Gmail)',
    vars: ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'],
    status: null
  },
  news: {
    name: 'News API',
    vars: ['NEWS_API_KEY'],
    status: null
  }
};

// Check each service
for (const [key, check] of Object.entries(checks)) {
  const missing = check.vars.filter(v => !process.env[v] || process.env[v] === 'your_email@gmail.com' || process.env[v] === 'your_gmail_app_password' || process.env[v] === 'your_news_api_key');
  check.status = missing.length === 0 ? '✅' : '⚠️';
  check.missing = missing;
}

// Display results
console.log('═══════════════════════════════════════════════════════════════\n');

for (const [key, check] of Object.entries(checks)) {
  console.log(`${check.status} ${check.name}`);
  if (check.missing && check.missing.length > 0) {
    console.log(`   Missing: ${check.missing.join(', ')}`);
  } else {
    console.log('   All configured! ✓');
  }
  console.log('');
}

console.log('═══════════════════════════════════════════════════════════════\n');

// Overall status
const allConfigured = Object.values(checks).every(c => c.status === '✅');

if (allConfigured) {
  console.log('🎉 All configuration complete! You\'re ready to go!\n');
  console.log('Next steps:');
  console.log('  1. Test newsletter generation: npm run generate-newsletter');
  console.log('  2. Send test newsletter: npm run send-newsletter');
  console.log('  3. Update Netlify environment variables');
  console.log('  4. Deploy to production\n');
} else {
  console.log('📝 To complete setup:\n');
  
  if (checks.email.status === '⚠️') {
    console.log('1. Get Gmail App Password:');
    console.log('   → Visit: https://myaccount.google.com/apppasswords');
    console.log('   → Generate new app password');
    console.log('   → Update server/.env:\n');
    console.log('     EMAIL_USER=your_email@gmail.com');
    console.log('     EMAIL_PASS=your_app_password');
    console.log('     EMAIL_FROM=your_email@gmail.com\n');
  }
  
  if (checks.news.status === '⚠️') {
    console.log('2. Get News API Key:');
    console.log('   → Visit: https://newsapi.org/');
    console.log('   → Sign up for free account');
    console.log('   → Update server/.env:\n');
    console.log('     NEWS_API_KEY=your_news_api_key\n');
  }
}

console.log('═══════════════════════════════════════════════════════════════\n');

// Save status to file
const statusReport = {
  timestamp: new Date().toISOString(),
  checks: checks,
  allConfigured: allConfigured
};

fs.writeFileSync(
  path.join(__dirname, 'setup-status.json'),
  JSON.stringify(statusReport, null, 2)
);

console.log('Status saved to: server/setup-status.json\n');

