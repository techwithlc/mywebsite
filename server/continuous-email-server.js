import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create log files
const outLog = fs.createWriteStream(path.join(logDir, 'out.log'), { flags: 'a' });
const errorLog = fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' });

console.log('Starting email server in continuous mode...');

function startServer() {
  const server = spawn('node', ['index.js'], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Log timestamp when server starts
  const timestamp = new Date().toISOString();
  outLog.write(`\n[${timestamp}] Server started\n`);
  
  // Pipe stdout and stderr to log files
  server.stdout.pipe(outLog);
  server.stderr.pipe(errorLog);
  
  // Also log to console
  server.stdout.on('data', (data) => {
    console.log(data.toString().trim());
  });
  
  server.stderr.on('data', (data) => {
    console.error(data.toString().trim());
  });

  // Restart server if it crashes
  server.on('close', (code) => {
    const closeTimestamp = new Date().toISOString();
    outLog.write(`\n[${closeTimestamp}] Server exited with code ${code}\n`);
    console.log(`Server exited with code ${code}. Restarting in 5 seconds...`);
    
    // Wait 5 seconds before restarting
    setTimeout(startServer, 5000);
  });
  
  return server;
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  outLog.write(`\n[${new Date().toISOString()}] Received SIGINT. Shutting down gracefully...\n`);
  outLog.end();
  errorLog.end();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  outLog.write(`\n[${new Date().toISOString()}] Received SIGTERM. Shutting down gracefully...\n`);
  outLog.end();
  errorLog.end();
  process.exit(0);
});

// Start the server
startServer();
