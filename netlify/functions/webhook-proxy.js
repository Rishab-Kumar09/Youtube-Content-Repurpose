const axios = require('axios');

exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Get URL from request body
    const { URL } = JSON.parse(event.body);
    
    // Forward to n8n webhook with URL as query parameter
    const n8nUrl = 'https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135';
    const response = await axios.get(`${n8nUrl}?URL=${encodeURIComponent(URL)}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
} 