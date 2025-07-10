// Simple form handling
document.getElementById('repurpose-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = document.getElementById('youtube-url').value;
  const status = document.getElementById('status-message');
  
  // Create the n8n webhook URL with parameters
  const n8nUrl = new URL('https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135');
  const itemData = {
    json: {
      URL: url
    }
  };
  n8nUrl.searchParams.set('item', JSON.stringify(itemData));
  
  // Create Postman URL
  const postmanUrl = `postman://open?url=${encodeURIComponent(n8nUrl.toString())}&method=GET`;
  
  // Try to open Postman
  window.location.href = postmanUrl;
  
  // Show instructions
  status.textContent = 'Opening Postman... Please send the request in Postman.';
}); 