// Simple form handling
document.getElementById('repurpose-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = document.getElementById('youtube-url').value;
  const status = document.getElementById('status-message');
  const statusContainer = document.getElementById('status-container');
  
  // Show status container and update message
  statusContainer.classList.remove('hidden');
  status.textContent = 'Processing your video...';
  
  try {
    // Make POST request to n8n webhook
    const response = await fetch('https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: {
          URL: url
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    status.textContent = 'Success! Your video is being processed.';
    status.style.color = 'var(--success-color)';
    
    // Show result container after success
    document.getElementById('result-container').classList.remove('hidden');
  } catch (error) {
    status.textContent = 'Error: ' + error.message;
    status.style.color = 'var(--danger-color)';
  }
}); 