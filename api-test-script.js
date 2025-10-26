// testAPI.js - Test Real API Endpoints
// Run with: node testAPI.js

const http = require('http');

const BASE_URL = 'http://localhost:5000';

// Test actual endpoints that should exist
const endpoints = [
  '/api/v1/products',
  '/api/v1/services', 
  '/api/v1/categories',
  '/api/v1/health',
];

console.log('🔍 Testing API Endpoints...\n');
console.log('='.repeat(60));

function testEndpoint(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    console.log(`\n📡 Testing: ${BASE_URL}${path}`);

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const status = res.statusCode;
        const icon = status === 200 ? '✅' : status === 404 ? '❌' : '⚠️';
        
        console.log(`   ${icon} Status: ${status}`);
        
        try {
          const json = JSON.parse(data);
          if (status === 200) {
            const count = json.results?.length || json.data?.length || 0;
            console.log(`   📦 Items: ${count}`);
            console.log(`   ✨ SUCCESS!`);
          } else {
            console.log(`   📦 Response: ${json.message || data.substring(0, 100)}`);
          }
        } catch (e) {
          console.log(`   📦 Response: ${data.substring(0, 100)}`);
        }
        
        resolve({ success: status === 200, path, status, data });
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ FAILED: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log(`   💡 API server is not running!`);
      }
      resolve({ success: false, path, error: error.message });
    });

    req.on('timeout', () => {
      console.log(`   ❌ TIMEOUT`);
      req.destroy();
      resolve({ success: false, path, error: 'Timeout' });
    });

    req.end();
  });
}

async function runTests() {
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SUMMARY:\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success && r.status !== 404);
  const notFound = results.filter(r => r.status === 404);

  if (successful.length > 0) {
    console.log('✅ Working Endpoints:');
    successful.forEach(r => {
      console.log(`   ${BASE_URL}${r.path}`);
    });
  }

  if (notFound.length > 0) {
    console.log('\n⚠️  Endpoints Not Found (404):');
    notFound.forEach(r => {
      console.log(`   ${BASE_URL}${r.path}`);
    });
  }

  if (failed.length > 0) {
    console.log('\n❌ Connection Failed:');
    failed.forEach(r => {
      console.log(`   ${BASE_URL}${r.path} - ${r.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));

  if (successful.length > 0) {
    console.log('\n🎉 SUCCESS! Your API is working!\n');
    console.log('📝 Update your .env file:');
    console.log('   EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1\n');
    console.log('⚠️  For Android emulator, you need to:');
    console.log('   1. Make sure your API server listens on 0.0.0.0');
    console.log('   2. Use http://10.0.2.2:5000/api/v1 in your app\n');
  } else if (notFound.length === endpoints.length) {
    console.log('\n⚠️  API is running but endpoints not found!\n');
    console.log('Check your API routes configuration.');
    console.log('Expected base path: /api/v1/\n');
  } else {
    console.log('\n❌ API server not responding!\n');
    console.log('Start your server: cd api && npm run dev\n');
  }
}

runTests().catch(console.error);