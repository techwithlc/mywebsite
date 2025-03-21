import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// List of files to check and fix
const filesToFix = [
  'send-newsletter-now.js',
  'send-with-resend.js',
  'test-news-to-file.js',
  'test-email-send.js',
  'test-newsletter-ethereal.js',
  'setup-real-email.js',
  'send-test-newsletter.js',
  'auto-newsletter.js',
  'setup-newsletter.js',
  'update-email-config.js',
  'send-real-newsletter.js'
];

// Patterns to replace
const replacements = [
  {
    pattern: /apiKey: .*"sk-proj-.*"/g,
    replacement: 'apiKey: process.env.OPENAI_API_KEY'
  },
  {
    pattern: /apiKey: "sk-proj-.*"/g,
    replacement: 'apiKey: process.env.OPENAI_API_KEY'
  },
  {
    pattern: /OPENAI_API_KEY=sk-proj-.*(?=\n|$)/g,
    replacement: 'OPENAI_API_KEY=${process.env.OPENAI_API_KEY}'
  },
  {
    pattern: /OPENAI_API_KEY=\${process\.env\.OPENAI_API_KEY \|\| "sk-proj-.*"}/g,
    replacement: 'OPENAI_API_KEY=${process.env.OPENAI_API_KEY}'
  },
  {
    pattern: /apiKey: process\.env\.OPENAI_API_KEY \|\| "sk-proj-.*"/g,
    replacement: 'apiKey: process.env.OPENAI_API_KEY'
  },
  {
    pattern: /apiKey: process\.env\.NEWS_API_KEY \|\| ".*"/g,
    replacement: 'apiKey: process.env.NEWS_API_KEY'
  },
  {
    pattern: /NEWS_API_KEY=\${process\.env\.NEWS_API_KEY \|\| ".*"}/g,
    replacement: 'NEWS_API_KEY=${process.env.NEWS_API_KEY}'
  },
  {
    pattern: /NEWS_API_KEY=".*"/g,
    replacement: 'NEWS_API_KEY=${process.env.NEWS_API_KEY}'
  }
];

// Process each file
for (const file of filesToFix) {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    console.log(`Processing ${file}...`);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Apply all replacements
      for (const { pattern, replacement } of replacements) {
        const originalContent = content;
        content = content.replace(pattern, replacement);
        
        if (content !== originalContent) {
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed API keys in ${file}`);
      } else {
        console.log(`ℹ️ No API keys found in ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
}

console.log('\nAll files processed. API keys have been removed.');
