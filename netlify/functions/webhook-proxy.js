const axios = require('axios');

exports.handler = async (event) => {
  // Get URL from query parameters
  const youtubeUrl = event.queryStringParameters?.URL;
  
  if (!youtubeUrl) {
    return { 
      statusCode: 400, 
      body: 'Missing URL parameter' 
    };
  }

  try {
    // Forward to n8n
    const response = await axios.get(`https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135?URL=${encodeURIComponent(youtubeUrl)}`);
    
    return {
      statusCode: 200,
      body: 'Success'
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message
    };
  }
} 