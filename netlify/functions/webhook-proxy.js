const axios = require('axios');

exports.handler = async (event) => {
  const youtubeUrl = event.queryStringParameters?.URL;
  
  if (!youtubeUrl) {
    return { 
      statusCode: 400, 
      body: 'Missing URL parameter' 
    };
  }

  // Format URL exactly as n8n expects it
  const n8nUrl = new URL('https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135');
  n8nUrl.searchParams.set('item', JSON.stringify({
    json: {
      URL: youtubeUrl
    }
  }));

  // Redirect to n8n webhook
  return {
    statusCode: 302,
    headers: {
      Location: n8nUrl.toString()
    }
  };
}; 