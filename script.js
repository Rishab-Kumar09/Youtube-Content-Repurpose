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
    
    status.textContent = 'Success! Your video is being processed.';
    status.style.color = 'var(--success-color)';
    
    // Show result container after success
    const resultContainer = document.getElementById('result-container');
    resultContainer.classList.remove('hidden');

    // Get the platforms container
    const platformsContainer = document.querySelector('.social-platforms');
    platformsContainer.innerHTML = ''; // Clear existing platforms

    // Create platform buttons based on response data
    if (data && data[0] && data[0].fields) {
      const fields = data[0].fields;
      
      // Add Summary button if available
      if (fields.Summary) {
        addPlatformButton(platformsContainer, 'summary', '📝 Summary', fields.Summary);
      }

      // Add Twitter button if available
      if (fields.Twitter) {
        addPlatformButton(platformsContainer, 'twitter', '<i class="fab fa-twitter"></i> Twitter', fields.Twitter);
      }

      // Add LinkedIn button if available
      if (fields.LinkedIn) {
        addPlatformButton(platformsContainer, 'linkedin', '<i class="fab fa-linkedin"></i> LinkedIn', fields.LinkedIn);
      }

      // Add Gmail/Email button if available
      if (fields.GMAIL) {
        addPlatformButton(platformsContainer, 'gmail', '<i class="fas fa-envelope"></i> Email', fields.GMAIL);
      }

      // Add WordPress button if available
      if (fields.Wordpress) {
        addPlatformButton(platformsContainer, 'wordpress', '<i class="fab fa-wordpress"></i> WordPress', fields.Wordpress);
      }

      // Add Mailchimp button if available
      if (fields.Mailchimp) {
        addPlatformButton(platformsContainer, 'mailchimp', '<i class="fas fa-mail-bulk"></i> Mailchimp', fields.Mailchimp);
      }
    }

  } catch (error) {
    console.error('Request failed:', error);
    status.textContent = 'Error: ' + error.message;
    status.style.color = 'var(--danger-color)';
  }
});

// Function to add a platform button
function addPlatformButton(container, platform, label, content) {
  const button = document.createElement('button');
  button.className = 'platform-button';
  button.innerHTML = label;
  button.onclick = () => showContent(platform, content);
  container.appendChild(button);
}

// Function to show content in a modal
function showContent(platform, content) {
  // Create or get existing modal
  let modal = document.getElementById('content-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'content-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }

  // Update modal content
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button" onclick="document.getElementById('content-modal').style.display='none'">&times;</span>
      <h2>${platform.charAt(0).toUpperCase() + platform.slice(1)} Content</h2>
      <div class="content-display">${content}</div>
    </div>
  `;

  // Show modal
  modal.style.display = 'block';
} 