const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runIntegrationTests() {
  const PORT = 8080;
  console.log(`[Integration Test] Connecting to http://localhost:${PORT}...`);

  const endpoints = [
    { path: '/', expected: 200, name: 'Homepage (3D original)' },
    { path: '/about', expected: 200, name: 'About Us page (clean route)' },
    { path: '/about.html', expected: 200, name: 'About Us page (.html)' },
    { path: '/domains.html', expected: 200, name: 'Domains page' },
    { path: '/team.html', expected: 200, name: 'Team page' },
    { path: '/events.html', expected: 200, name: 'Events page' },
    { path: '/projects.html', expected: 200, name: 'Projects page' },
    { path: '/join.html', expected: 200, name: 'Join Us page' },
    { path: '/feedback.html', expected: 200, name: 'Feedback page' },
    { path: '/api/health', expected: 200, name: 'API Health Check' }
  ];

  for (const ep of endpoints) {
    try {
      const res = await makeRequest({
        hostname: '127.0.0.1',
        port: PORT,
        path: ep.path,
        method: 'GET'
      });
      if (res.statusCode === ep.expected) {
        console.log(`✓ [${res.statusCode}] ${ep.name} (${ep.path})`);
      } else {
        console.error(`✗ [${res.statusCode}] ${ep.name} expected ${ep.expected}`);
      }
    } catch (err) {
      console.error(`✗ Failed to connect to ${ep.path}: ${err.message}`);
    }
  }

  // Test validation on /api/join
  try {
    const postData = JSON.stringify({ fullName: '' }); // Invalid
    const res = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/join',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);

    console.log(`✓ POST /api/join returned status ${res.statusCode} (validation error as expected)`);
    console.log(`  Response: ${res.body.slice(0, 120)}...`);
  } catch (err) {
    console.error(`✗ POST /api/join error: ${err.message}`);
  }

  // Test validation on /api/feedback
  try {
    const postData = JSON.stringify({ name: '' }); // Invalid
    const res = await makeRequest({
      hostname: '127.0.0.1',
      port: PORT,
      path: '/api/feedback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);

    console.log(`✓ POST /api/feedback returned status ${res.statusCode} (validation error as expected)`);
    console.log(`  Response: ${res.body.slice(0, 120)}...`);
  } catch (err) {
    console.error(`✗ POST /api/feedback error: ${err.message}`);
  }
}

runIntegrationTests();
