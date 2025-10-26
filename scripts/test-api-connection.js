const axios = require('axios');

// Load environment variables if available
require('dotenv').config();

// Get API base URL from environment or use default
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.4:5000/api/v1';
const HEALTH_CHECK_URL = API_BASE_URL.replace('/api/v1', '/health');

console.log('Testing API connection...');
console.log('API Base URL:', API_BASE_URL);
console.log('Health Check URL:', HEALTH_CHECK_URL);
console.log('----------------------------------------');

async function testConnection() {
  try {
    console.log('Attempting to connect to health check endpoint...');
    
    const response = await axios.get(HEALTH_CHECK_URL, {
      timeout: 1000, // 10 second timeout
    });

    console.log('✅ Connection successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
    // Test a few more endpoints
    console.log('\nTesting other endpoints...');
    
    // Test products endpoint
    try {
      const productsResponse = await axios.get(`${API_BASE_URL}/products`, {
        timeout: 10000
      });
      console.log('✅ Products endpoint: OK -', productsResponse.status, 'Status');
    } catch (error) {
      console.log('❌ Products endpoint failed:', error.message);
    }
    
    // Test categories endpoint
    try {
      const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`, {
        timeout: 10000
      });
      console.log('✅ Categories endpoint: OK -', categoriesResponse.status, 'Status');
    } catch (error) {
      console.log('❌ Categories endpoint failed:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Connection failed!');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('Error: Connection refused - server may not be running or incorrect address');
      console.log('Please check:');
      console.log('  - Is the API server running on port 5000?');
      console.log('  - Is the API_BASE_URL in your .env file correct?');
    } else if (error.code === 'ENOTFOUND') {
      console.log('Error: DNS lookup failed - incorrect hostname');
      console.log('Please check the hostname in your API URL configuration');
    } else if (error.code === 'ECONNABORTED') {
      console.log('Error: Connection timeout - server may be slow to respond');
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('\n💡 Troubleshooting Tips:');
    console.log('  - Make sure the API server is running: cd api && npm run dev');
    console.log('  - Verify your API URL configuration');
    console.log('  - For mobile devices, use your computer\'s IP address instead of localhost');
    console.log('  - Check firewall settings if connection is blocked');
  }
}

// Run the test
testConnection();