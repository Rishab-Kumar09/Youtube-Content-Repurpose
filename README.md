# YouTube Content Repurpose 🎬✨

A modern, responsive web application that transforms your YouTube content into engaging social media posts across multiple platforms using n8n automation.

## 🚀 Features

- **🎯 Simple Interface**: Clean, intuitive design for effortless content repurposing
- **🤖 AI-Powered Processing**: Automated content analysis and transformation
- **📱 Multi-Platform Distribution**: Automatic posting to Twitter, Facebook, Instagram, and LinkedIn
- **⚡ Real-time Processing**: Live progress tracking and status updates
- **🔄 Retry Logic**: Robust error handling with automatic retry mechanisms
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **Icons**: Font Awesome 6.0
- **Fonts**: Inter (Google Fonts)
- **Automation**: n8n webhook integration
- **Deployment**: Netlify with GitHub integration

## 🚀 Live Demo

Visit the live application: [YouTube Content Repurpose](https://youtube-content-repurpose.netlify.app)

## 📦 Installation & Setup

### Prerequisites
- Git installed on your machine
- A modern web browser

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rishab-Kumar09/Youtube-Content-Repurpose.git
   cd Youtube-Content-Repurpose
   ```

2. **Start a local server:**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open your browser:**
   Navigate to `http://localhost:8000`

## 🌐 Deployment to Netlify

### Method 1: GitHub Integration (Recommended)

1. **Push your code to GitHub** (if not already done)
2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select this repository
   - Deploy settings are automatically configured via `netlify.toml`

3. **Deploy:**
   - Click "Deploy site"
   - Your site will be available at `https://[random-name].netlify.app`
   - Optionally, configure a custom domain

### Method 2: Drag & Drop Deploy

1. **Build the project** (if needed)
2. **Drag the project folder** to Netlify's deploy area
3. **Your site is live!**

## 🎯 Usage

1. **Enter YouTube URL**: Paste any YouTube video URL into the input field
2. **Click "Repurpose Content"**: The app will validate the URL and start processing
3. **Monitor Progress**: Watch real-time progress updates and status messages
4. **View Results**: See confirmation of successful social media distribution

### Supported YouTube URL Formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/embed/VIDEO_ID`
- `https://youtube.com/v/VIDEO_ID`

## ⚙️ Configuration

The app is configured to work with the n8n webhook endpoint:
```
https://n8n-gauntlethq-u50028.vm.elestio.app/webhook-test/78797ede-a5e7-4ae9-8f7d-326f5260c135
```

To modify the webhook URL, update the `CONFIG` object in `script.js`:
```javascript
const CONFIG = {
    webhookUrl: 'YOUR_WEBHOOK_URL_HERE',
    maxRetries: 3,
    retryDelay: 2000,
    processingTime: 30000
};
```

## 🎨 Customization

### Styling
Modify `styles.css` to customize the appearance:
- Update CSS variables in `:root` for colors and spacing
- Modify animations and transitions
- Adjust responsive breakpoints

### Functionality
Enhance `script.js` to add features:
- Additional form validation
- New social media platforms
- Enhanced error handling
- Analytics tracking

## 📁 Project Structure

```
Youtube-Content-Repurpose/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet with modern design
├── script.js           # JavaScript functionality
├── package.json        # Project metadata
├── netlify.toml        # Netlify configuration
├── _redirects          # Netlify redirects
└── README.md          # This file
```

## 🔧 Technical Details

### Security Features
- Content Security Policy (CSP) headers
- XSS protection
- Frame options security
- HTTPS enforcement

### Performance Optimizations
- CSS and JavaScript minification
- Static asset caching
- Gzip compression
- Image optimization

### Browser Support
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [n8n](https://n8n.io) for the automation platform
- [Netlify](https://netlify.com) for hosting and deployment
- [Font Awesome](https://fontawesome.com) for icons
- [Google Fonts](https://fonts.google.com) for typography

## 📞 Support

If you encounter any issues or have questions:
- Create an [issue](https://github.com/Rishab-Kumar09/Youtube-Content-Repurpose/issues)
- Check the [documentation](https://github.com/Rishab-Kumar09/Youtube-Content-Repurpose/wiki)
- Contact: [contact@rishab.com](mailto:contact@rishab.com)

---

Made with ❤️ by [Rishab Kumar](https://github.com/Rishab-Kumar09) 