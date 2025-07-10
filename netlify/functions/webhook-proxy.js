exports.handler = async (event, context) => {
  // Set CORS headers to allow requests from the frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get YouTube URL from query parameters or request body
    let youtubeUrl;
    
    if (event.httpMethod === 'GET') {
      youtubeUrl = event.queryStringParameters?.URL;
    } else if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      youtubeUrl = body.URL;
    }

    if (!youtubeUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'YouTube URL is required',
          message: 'Please provide a URL parameter' 
        })
      };
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    if (!youtubeRegex.test(youtubeUrl)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid YouTube URL',
          message: 'Please provide a valid YouTube URL' 
        })
      };
    }

    // n8n webhook URL
    const n8nWebhookUrl = 'https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135';

    console.log('Proxying request to n8n webhook:', n8nWebhookUrl);
    console.log('YouTube URL:', youtubeUrl);

    // Make request to n8n webhook with URL query parameter (server-to-server, no CORS issues)
    const n8nUrl = new URL(n8nWebhookUrl);
    n8nUrl.searchParams.append('URL', youtubeUrl);
    
    const response = await fetch(n8nUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'YouTube-Content-Repurpose-Proxy/1.0'
      }
    });

    console.log('n8n response status:', response.status);

    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log('n8n response data:', responseData);

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: `n8n webhook error: ${response.status}`,
          message: responseData,
          webhookStatus: response.status
        })
      };
    }

    // Return successful response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'YouTube content processing started successfully',
        youtubeUrl: youtubeUrl,
        webhookResponse: responseData,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Webhook proxy error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        details: 'Failed to connect to n8n webhook'
      })
    };
  }
}; 