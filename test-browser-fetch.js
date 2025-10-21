// Test script to simulate browser fetch behavior
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/content/general?section_key=hero_section',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Test Browser)'
  }
};

console.log('🧪 Testing browser-like fetch...');

const req = http.request(options, (res) => {
  console.log(`📡 Status: ${res.statusCode} ${res.statusMessage}`);
  console.log(`📋 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ Response received:', data.length, 'bytes');
    try {
      const parsed = JSON.parse(data);
      console.log('📊 Parsed JSON keys:', Object.keys(parsed));
      if (parsed.success && parsed.data && parsed.data.content) {
        console.log('🎯 Headline:', parsed.data.content.headline);
      }
    } catch (e) {
      console.log('❌ JSON parse error:', e.message);
      console.log('📄 Raw response:', data.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.on('timeout', () => {
  console.error('⏰ Request timeout');
  req.destroy();
});

req.setTimeout(10000); // 10 second timeout
req.end();

console.log('⏳ Request sent, waiting for response...');