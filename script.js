// Simple form handling
document.getElementById('repurpose-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = document.getElementById('youtube-url').value;
  const status = document.getElementById('status-message');
  
  status.textContent = 'Processing...';
  
  try {
    const response = await fetch(`/.netlify/functions/webhook-proxy?URL=${url}`);
    
    if (response.ok) {
      status.textContent = 'Success! Content is being processed.';
    } else {
      status.textContent = 'Error: Please try again.';
    }
  } catch (error) {
    status.textContent = 'Error: Please try again.';
  }
}); 