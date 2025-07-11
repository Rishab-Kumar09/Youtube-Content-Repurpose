// Simple form handling
document.getElementById('repurpose-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const url = document.getElementById('youtube-url').value;
  const status = document.getElementById('status-message');
  const statusContainer = document.getElementById('status-container');
  
  // Show status container and update message
  statusContainer.classList.remove('hidden');
  status.textContent = 'Processing your video...';

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
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify({
        URL: formattedUrl
      })
    };

    // Log the request for debugging
    console.log('Sending request with options:', requestOptions);
    
    // Make POST request to n8n webhook
    const response = await fetch('https://n8n-gauntlethq-u50028.vm.elestio.app/webhook/78797ede-a5e7-4ae9-8f7d-326f5260c135', requestOptions);

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Success response:', data);
    
    // Get the first item from the response which contains our content
    const content = data[0]?.fields || {};
    
    // Update result container with dynamic content
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = `
      <div class="result-header">
        <i class="fas fa-check-circle"></i>
        <h3>Content Processing Complete!</h3>
      </div>
      <div class="result-content">
        <p>Your YouTube content has been successfully repurposed.</p>
        <div class="platform-grid">
          ${content.Twitter ? `
            <button class="platform-button" onclick="showContent('twitter', ${JSON.stringify(content.Twitter)})">
              <i class="fab fa-twitter"></i>
              <span>Twitter</span>
            </button>
          ` : ''}
          ${content.LinkedIn ? `
            <button class="platform-button" onclick="showContent('linkedin', ${JSON.stringify(content.LinkedIn)})">
              <i class="fab fa-linkedin"></i>
              <span>LinkedIn</span>
            </button>
          ` : ''}
          ${content.Summary ? `
            <button class="platform-button" onclick="showContent('summary', ${JSON.stringify(content.Summary)})">
              <i class="fas fa-file-alt"></i>
              <span>Summary</span>
            </button>
          ` : ''}
        </div>
        <div id="content-display" class="content-display hidden">
          <div class="content-header">
            <span id="content-platform"></span>
            <button onclick="hideContent()" class="close-button">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div id="content-text" class="content-text"></div>
        </div>
      </div>
    `;
    resultContainer.classList.remove('hidden');
  } catch (error) {
    console.error('Request failed:', error);
    status.textContent = 'Error: ' + error.message;
    status.style.color = 'var(--danger-color)';
  }
});

// Function to show content when a platform button is clicked
window.showContent = function(platform, content) {
  const contentDisplay = document.getElementById('content-display');
  const contentPlatform = document.getElementById('content-platform');
  const contentText = document.getElementById('content-text');
  
  // Set platform name and icon
  const platformIcons = {
    twitter: 'fab fa-twitter',
    linkedin: 'fab fa-linkedin',
    summary: 'fas fa-file-alt'
  };
  
  contentPlatform.innerHTML = `<i class="${platformIcons[platform]}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
  contentText.textContent = content;
  contentDisplay.classList.remove('hidden');
};

// Function to hide content display
window.hideContent = function() {
  const contentDisplay = document.getElementById('content-display');
  contentDisplay.classList.add('hidden');
}; 