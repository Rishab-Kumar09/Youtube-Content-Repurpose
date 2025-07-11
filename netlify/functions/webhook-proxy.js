const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': 'https://yt-repurpose.netlify.app',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Fire the request to n8n without waiting for completion
    fetch('https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: event.body // Forward the body as-is
    }).catch(error => console.error('n8n webhook error:', error));

    // Immediately return success - don't wait for n8n
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://yt-repurpose.netlify.app',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ success: true, message: 'Request accepted and being processed' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://yt-repurpose.netlify.app',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}; 