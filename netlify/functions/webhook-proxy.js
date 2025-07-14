const fetch = require('node-fetch');

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://yt-repurpose.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No content needed for OPTIONS
      headers: corsHeaders
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Forward the request to n8n with a timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 145000); // 2.45 minutes (slightly less than frontend timeout)

    try {
      const response = await fetch('https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: event.body, // Forward the body as-is
        signal: controller.signal
      });

      clearTimeout(timeout);

      // Return success response without trying to parse n8n response
      return {
        statusCode: response.ok ? 200 : response.status,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: response.ok,
          message: response.ok ? 'Request processed successfully' : 'Failed to process request'
        })
      };
    } catch (error) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        throw new Error('n8n request timed out after 2.45 minutes');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 