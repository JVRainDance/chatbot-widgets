# 🎨 Technical SEO Agent Frontend

## 🚀 Quick Start

### 1. Launch the Application
```bash
# Start the server with frontend
npm run frontend

# Or start just the server
npm run server
```

### 2. Open Your Browser
Navigate to: **http://localhost:3000**

### 3. Start Analyzing!
- Enter a URL in the "Single URL" tab
- Click "Analyze" to get comprehensive SEO insights
- View results, scores, and recommendations
- Download reports in HTML, JSON, or PDF format

## 🎯 Features

### 📊 Single URL Analysis
- Analyze any website with one click
- Get detailed SEO scores and insights
- View technical, content, performance, and accessibility scores
- See issues and recommendations

### 📋 Bulk Analysis
- Analyze multiple URLs at once
- Enter URLs one per line
- Get comprehensive results for all sites

### 🕷️ Website Crawling
- Crawl entire websites automatically
- Set maximum pages to analyze
- Discover and analyze all pages on a site

### 📄 Report Generation
- HTML reports with beautiful styling
- JSON reports for programmatic access
- PDF reports for sharing and documentation

## 🎨 Interface Features

### ✨ Modern Design
- Beautiful gradient background
- Responsive design for all devices
- Smooth animations and transitions
- Professional color scheme

### 🔧 Easy Configuration
- Toggle performance analysis on/off
- Choose report format (HTML/JSON/PDF)
- Set crawl limits and options
- Real-time feedback and loading states

### 📱 Mobile Friendly
- Works perfectly on phones and tablets
- Touch-friendly interface
- Responsive layout adapts to screen size

## 🛠️ Technical Details

### Frontend Technologies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Async/await for API calls
- **Font Awesome** - Beautiful icons
- **Google Fonts** - Inter font family

### Backend Integration
- **RESTful API** - Clean API endpoints
- **CORS enabled** - Cross-origin requests
- **Static file serving** - Serves frontend files
- **Real-time communication** - Live updates and feedback

## 🎯 Usage Examples

### Single Website Analysis
1. Open http://localhost:3000
2. Enter URL: `https://rapidtakeoffsandestimating.com.au/`
3. Click "Analyze"
4. View results and download report

### Bulk Analysis
1. Switch to "Bulk Analysis" tab
2. Enter multiple URLs (one per line)
3. Click "Analyze All"
4. Review results for all sites

### Website Crawling
1. Switch to "Crawl Website" tab
2. Enter base URL
3. Set max pages (default: 10)
4. Click "Crawl & Analyze"
5. Get comprehensive site analysis

## 🔧 Customization

### Styling
Edit `public/index.html` to customize:
- Colors and gradients
- Layout and spacing
- Fonts and typography
- Animations and effects

### Functionality
Edit `public/script.js` to add:
- New analysis types
- Custom result displays
- Additional API endpoints
- Enhanced error handling

## 🚀 Deployment

### Local Development
```bash
npm run dev  # With auto-reload
npm run frontend  # Production mode
```

### Production Deployment
1. Copy all files to your server
2. Install dependencies: `npm install`
3. Install Playwright: `npx playwright install chromium`
4. Start server: `npm run server`
5. Access at your domain

## 📊 API Endpoints

The frontend communicates with these endpoints:
- `GET /health` - Server health check
- `POST /analyze` - Single URL analysis
- `POST /analyze-bulk` - Multiple URL analysis
- `POST /crawl-and-analyze` - Website crawling

## 🎉 Ready to Use!

The frontend provides a beautiful, user-friendly interface for the technical SEO agent. Simply launch the server and start analyzing websites with ease! 