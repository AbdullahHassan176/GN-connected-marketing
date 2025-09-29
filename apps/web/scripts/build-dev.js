const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting development build process...');

try {
  // Start the development server in the background
  console.log('📦 Starting development server...');
  const devProcess = execSync('npm run dev', { 
    cwd: process.cwd(),
    stdio: 'pipe',
    timeout: 30000
  });
  
  console.log('✅ Development server started successfully');
  
  // Wait a bit for the server to fully start
  console.log('⏳ Waiting for server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Check if the server is responding
  console.log('🔍 Checking server health...');
  const response = await fetch('http://localhost:3000');
  
  if (response.ok) {
    console.log('✅ Server is responding correctly');
    console.log('🎉 Development build completed successfully!');
    console.log('📝 Note: This is a development build. For production, fix the React context issue.');
  } else {
    console.log('❌ Server is not responding correctly');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
