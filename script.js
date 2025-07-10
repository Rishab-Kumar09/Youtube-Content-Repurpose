// Simple form handling
document.getElementById('repurpose-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = document.getElementById('youtube-url').value;
  const status = document.getElementById('status-message');
  
  // Create the n8n webhook URL with parameters
  const n8nUrl = `https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135?item={"json":{"URL":"${url}"}}`;
  
  // Open Postman Web with the URL
  window.open(`https://web.postman.co/workspace/My-Workspace/request/create?requestType=GET&requestUrl=${encodeURIComponent(n8nUrl)}`, '_blank');
  
  status.textContent = 'Opened in Postman Web! Click "Send" to process the video.';
}); 