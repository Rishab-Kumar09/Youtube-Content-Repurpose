// Simple form handling
document.getElementById('repurpose-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = document.getElementById('youtube-url').value;
  const status = document.getElementById('status-message');
  const statusContainer = document.getElementById('status-container');
  
  // Show status container and update message
  statusContainer.classList.remove('hidden');
  status.textContent = 'Submitting your request...';

  // Validate and format YouTube URL
  let formattedUrl = url;
  try {
    // Convert youtu.be URLs to full youtube.com URLs
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split(/[#?]/)[0];
      formattedUrl = `https://youtu.be/${videoId}`;  // Keep youtu.be format since it works
    }

    console.log('Original URL:', url);
    console.log('Formatted URL:', formattedUrl);
    
    // Construct the request options with the exact format that works
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        URL: formattedUrl
      })
    };

    // Log the request for debugging
    console.log('Sending request with options:', requestOptions);
    
    // Make POST request through our Netlify proxy function
    const response = await fetch('/.netlify/functions/webhook-proxy', requestOptions);
    
    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // If we get here, the request was accepted
    status.textContent = 'Request accepted! Your video is being processed. This may take 1-2 minutes...';
    status.style.color = 'var(--success-color)';
    
    // Show result container after success
    document.getElementById('result-container').classList.remove('hidden');
  } catch (error) {
    console.error('Request failed:', error);
    status.textContent = 'Error: ' + error.message;
    status.style.color = 'var(--danger-color)';
  }
}); 