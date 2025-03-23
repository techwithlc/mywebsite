import { exec } from 'child_process';

console.log('===== Starting Server and Sending Newsletter =====');

// Start the server
console.log('Starting the server...');
const serverProcess = exec('npm start', { cwd: process.cwd() });

// Log server output
serverProcess.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`Server error: ${data}`);
});

// Wait for server to start using setTimeout rather than await
console.log('Waiting for server to initialize (5 seconds)...');
setTimeout(() => {
  // Send newsletter after waiting
  console.log('Sending newsletter to all subscribers...');
  exec('curl -X POST http://localhost:3001/api/send-newsletter', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error sending newsletter: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    
    console.log('Newsletter sent successfully!');
    console.log(`Response: ${stdout}`);
    
    // Keep the server running
    console.log('\nServer is running. Press Ctrl+C to stop.');
  });
}, 5000);
