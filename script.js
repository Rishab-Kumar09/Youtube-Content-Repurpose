// Simple form handling
document.getElementById('repurpose-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = document.getElementById('youtube-url').value;
  const status = document.getElementById('status-message');
  const statusContainer = document.getElementById('status-container');
  const resultContainer = document.getElementById('result-container');
  
  // Show status container and update message
  statusContainer.classList.remove('hidden');
  status.textContent = 'Processing your video...';
  resultContainer.classList.add('hidden');

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
    
    // Make POST request through our Netlify proxy function with 2.5 minute timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 150000); // 2.5 minutes in milliseconds

    try {
      const response = await fetch('/.netlify/functions/webhook-proxy', {
        ...requestOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeout);

      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Show success message
      status.textContent = 'Content repurposed successfully!';
      status.style.color = 'var(--success-color)';
      
      // Show result container with completion message
      resultContainer.classList.remove('hidden');
      
    } catch (error) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 2.5 minutes. Your content is still being processed in the background.');
      }
      throw error;
    }
  } catch (error) {
    console.error('Request failed:', error);
    status.textContent = 'Error: ' + error.message;
    status.style.color = 'var(--danger-color)';
    
    // If it's a timeout, still show the result container as processing continues in background
    if (error.message.includes('timed out')) {
      resultContainer.classList.remove('hidden');
    }
  }
}); 