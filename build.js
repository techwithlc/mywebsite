// build.js - Handles post-build RSS feed generation
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { updateFeeds } from './server/services/rssFeedService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    console.log('🚀 Starting post-build process...');
    
    // Ensure server/public directory exists
    const publicDir = path.join(__dirname, 'server', 'public');
    if (!fs.existsSync(publicDir)) {
      console.log('📁 Creating server/public directory...');
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Copy dist content to server/public
    console.log('📋 Copying build files to server/public...');
    copyDirectory(path.join(__dirname, 'dist'), publicDir);
    
    // Generate RSS feed if environment variables are available
    if (process.env.OPENAI_API_KEY && process.env.NEWS_API_KEY) {
      console.log('📰 Generating RSS feed...');
      await updateFeeds();
    } else {
      console.log('⚠️ Skipping RSS feed generation - missing API keys');
      console.log('   Note: RSS feeds will be generated during Netlify deployment');
      
      // Create placeholder files for local development
      const placeholderRSS = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>TechwithLC AI News</title>
    <link>https://techwithlc.com/ai-news</link>
    <description>Latest AI news curated and summarized by TechwithLC</description>
    <item>
      <title>Development Placeholder</title>
      <description>This is a placeholder RSS feed. The actual feed will be generated during deployment.</description>
    </item>
  </channel>
</rss>`;
      
      fs.writeFileSync(path.join(publicDir, 'ai-news-feed.xml'), placeholderRSS);
      fs.writeFileSync(path.join(publicDir, 'ai-news-feed.json'), JSON.stringify({
        title: "TechwithLC AI News",
        description: "Development placeholder. The actual feed will be generated during deployment.",
        items: []
      }, null, 2));
    }
    
    console.log('✅ Build process completed successfully!');
  } catch (error) {
    console.error('❌ Build process failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const files = fs.readdirSync(source);
  
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

main();
