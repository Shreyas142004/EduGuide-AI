const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('==============================================');
console.log('🚀 EduGuide AI - Setup & Environment Validator');
console.log('==============================================\n');

// 1. Ensure required storage directories exist
const dirsToCreate = [
  path.resolve(__dirname, '../storage/uploads'),
  path.resolve(__dirname, '../storage/vector_indexes'),
  path.resolve(__dirname, '../demo-data'),
];

dirsToCreate.forEach((d) => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
    console.log(`[SETUP] Created directory: ${path.relative(__dirname, d)}`);
  } else {
    console.log(`[SETUP] Directory exists: ${path.relative(__dirname, d)}`);
  }
});

// 2. Check Node & npm
try {
  const nodeVer = execSync('node -v').toString().trim();
  const npmVer = execSync('npm -v').toString().trim();
  console.log(`[SETUP] Node.js version: ${nodeVer} | npm: ${npmVer}`);
} catch (e) {
  console.error('[SETUP] Warning: Node.js or npm is not in PATH.');
}

console.log('\n[SETUP] Environment ready! You can now start the application:');
console.log('1. Start Python NLP Microservice:');
console.log('   cd nlp-service');
console.log('   .\\venv\\Scripts\\python.exe -m uvicorn main:app --port 8000 --reload');
console.log('2. Start Node.js Express Backend:');
console.log('   cd backend');
console.log('   npm start');
console.log('3. Start Vite React Frontend:');
console.log('   cd frontend');
console.log('   npm run dev');
console.log('\n==============================================');
