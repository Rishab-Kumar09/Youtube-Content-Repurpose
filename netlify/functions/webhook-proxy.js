const axios = require('axios');

exports.handler = async (event) => {
  const youtubeUrl = event.queryStringParameters?.URL;
  
  if (!youtubeUrl) {
    return { 
      statusCode: 400, 
      body: 'Missing URL parameter' 
    };
  }

  // Redirect to n8n webhook
  return {
    statusCode: 302,
    headers: {
      Location: `https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135?URL=${encodeURIComponent(youtubeUrl)}`
    }
  };
}; 