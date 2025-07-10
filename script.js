// Configuration
const CONFIG = {
    webhookUrl: 'https://n8n-gauntlethq-u50028.vm.elestio.app/webhook-test/78797ede-a5e7-4ae9-8f7d-326f5260c135',
    maxRetries: 3,
    retryDelay: 2000,
    processingTime: 30000 // 30 seconds estimated processing time
};

// DOM elements
const form = document.getElementById('repurpose-form');
const urlInput = document.getElementById('youtube-url');
const submitBtn = document.getElementById('submit-btn');
const statusContainer = document.getElementById('status-container');
const statusMessage = document.getElementById('status-message');
const progressBar = document.querySelector('.progress-fill');
const resultContainer = document.getElementById('result-container');

// State management
let isProcessing = false;
let progressTimer = null;
let retryCount = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Bind event listeners
    form.addEventListener('submit', handleFormSubmit);
    urlInput.addEventListener('input', handleUrlInput);
    urlInput.addEventListener('paste', handleUrlPaste);
    
    // Add some nice focus effects
    urlInput.addEventListener('focus', () => {
        urlInput.parentElement.classList.add('focused');
    });
    
    urlInput.addEventListener('blur', () => {
        urlInput.parentElement.classList.remove('focused');
    });
    
    console.log('YouTube Content Repurpose App initialized');
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    if (isProcessing) return;
    
    const youtubeUrl = urlInput.value.trim();
    
    if (!youtubeUrl) {
        showError('Please enter a YouTube URL');
        return;
    }
    
    if (!isValidYouTubeUrl(youtubeUrl)) {
        showError('Please enter a valid YouTube URL');
        return;
    }
    
    processContent(youtubeUrl);
}

function handleUrlInput(event) {
    const url = event.target.value.trim();
    
    if (url && !isValidYouTubeUrl(url)) {
        event.target.style.borderColor = 'var(--danger-color)';
        event.target.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.1)';
    } else {
        event.target.style.borderColor = '';
        event.target.style.boxShadow = '';
    }
}

function handleUrlPaste(event) {
    setTimeout(() => {
        const url = event.target.value.trim();
        if (url && isValidYouTubeUrl(url)) {
            event.target.style.borderColor = 'var(--success-color)';
            event.target.style.boxShadow = '0 0 0 3px rgba(46, 213, 115, 0.1)';
            
            // Auto-submit after a short delay if URL is valid
            setTimeout(() => {
                if (event.target.value.trim() === url) {
                    form.dispatchEvent(new Event('submit'));
                }
            }, 1000);
        }
    }, 100);
}

function isValidYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
}

async function processContent(youtubeUrl) {
    try {
        isProcessing = true;
        retryCount = 0;
        
        // Update UI to show processing state
        showProcessingState();
        
        // Start progress animation
        startProgressAnimation();
        
        // Send request to n8n webhook
        const response = await sendToWebhook(youtubeUrl);
        
        if (response.success) {
            // Simulate processing time for better UX
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            showSuccess(response.data);
        } else {
            throw new Error(response.error || 'Failed to process content');
        }
        
    } catch (error) {
        console.error('Error processing content:', error);
        
        if (retryCount < CONFIG.maxRetries) {
            retryCount++;
            showRetryMessage(retryCount);
            
            setTimeout(() => {
                processContent(youtubeUrl);
            }, CONFIG.retryDelay);
        } else {
            showError(`Failed to process content after ${CONFIG.maxRetries} attempts. Please try again later.`);
        }
        
    } finally {
        if (retryCount >= CONFIG.maxRetries || arguments.length === 0) {
            isProcessing = false;
            resetForm();
        }
    }
}

async function sendToWebhook(youtubeUrl) {
    try {
        const response = await fetch(CONFIG.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                URL: youtubeUrl
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            success: true,
            data: data
        };
        
    } catch (error) {
        console.error('Webhook request failed:', error);
        
        return {
            success: false,
            error: error.message
        };
    }
}

function showProcessingState() {
    // Hide result container
    resultContainer.classList.add('hidden');
    
    // Show status container
    statusContainer.classList.remove('hidden');
    statusMessage.textContent = 'Processing your YouTube content...';
    
    // Update submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
    
    // Add loading class to form
    form.classList.add('loading');
}

function showRetryMessage(attempt) {
    statusMessage.textContent = `Retrying... (Attempt ${attempt}/${CONFIG.maxRetries})`;
    progressBar.style.width = '0%';
    
    setTimeout(() => {
        startProgressAnimation();
    }, 500);
}

function showSuccess(data) {
    // Hide status container
    statusContainer.classList.add('hidden');
    
    // Show result container
    resultContainer.classList.remove('hidden');
    
    // Add success animation
    resultContainer.style.opacity = '0';
    resultContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        resultContainer.style.transition = 'all 0.5s ease';
        resultContainer.style.opacity = '1';
        resultContainer.style.transform = 'translateY(0)';
    }, 100);
    
    // Update form state
    urlInput.value = '';
    urlInput.style.borderColor = '';
    urlInput.style.boxShadow = '';
    
    // Show success message
    showNotification('Content successfully repurposed!', 'success');
    
    // Auto-hide result after 10 seconds
    setTimeout(() => {
        if (!resultContainer.classList.contains('hidden')) {
            resultContainer.style.opacity = '0';
            setTimeout(() => {
                resultContainer.classList.add('hidden');
                resultContainer.style.opacity = '';
            }, 500);
        }
    }, 10000);
}

function showError(message) {
    // Hide status and result containers
    statusContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    
    // Show error notification
    showNotification(message, 'error');
    
    // Reset form
    resetForm();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--accent-color)'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function startProgressAnimation() {
    let progress = 0;
    const increment = 100 / (CONFIG.processingTime / 100);
    
    // Clear existing timer
    if (progressTimer) {
        clearInterval(progressTimer);
    }
    
    progressTimer = setInterval(() => {
        progress += increment;
        
        if (progress >= 95) {
            progress = 95; // Don't complete until we get actual response
        }
        
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 95) {
            clearInterval(progressTimer);
        }
    }, 100);
}

function resetForm() {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-magic"></i><span>Repurpose Content</span>';
    
    // Remove loading class
    form.classList.remove('loading');
    
    // Clear progress timer
    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
    }
    
    // Reset progress bar
    progressBar.style.width = '0%';
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getYouTubeVideoId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Add some nice CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    @media (max-width: 480px) {
        .notification {
            right: 10px !important;
            left: 10px !important;
            max-width: none !important;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Add some performance optimizations
window.addEventListener('beforeunload', () => {
    if (progressTimer) {
        clearInterval(progressTimer);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
        if (!isProcessing) {
            form.dispatchEvent(new Event('submit'));
        }
    }
});

console.log('YouTube Content Repurpose App loaded successfully!'); 