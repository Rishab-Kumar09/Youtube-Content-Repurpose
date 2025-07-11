const fetch = require('node-fetch');

// In-memory storage for results (in production, use a proper database)
let latestResults = null;

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://yt-repurpose.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET'
  };

  // Handle GET requests to check for results
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ results: latestResults })
    };
  }

  // Handle POST requests from n8n with new results
  if (event.httpMethod === 'POST') {
    try {
      // Parse the completion data from n8n
      const data = JSON.parse(event.body);
      
      // Store the results
      latestResults = data;
      console.log('Received completion data:', data);

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // Handle other HTTP methods
  return {
    statusCode: 405,
    headers: corsHeaders,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}; 