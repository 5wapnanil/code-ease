const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

// Create .vercel directory if it doesn't exist
const vercelDir = path.join(process.cwd(), '.vercel');
if (!fs.existsSync(vercelDir)) {
  console.log('Creating .vercel directory...');
  fs.mkdirSync(vercelDir, { recursive: true });
}

// Install backend dependencies
console.log('📦 Installing backend dependencies...');
try {
  execSync('cd backend && npm install --production', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error);
  process.exit(1);
}

console.log('✨ Build completed successfully!');
