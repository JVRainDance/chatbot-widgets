# GitHub Integration Guide

## Adding Technical SEO Agent to Your Existing Repository

### Option 1: Add as a Subdirectory
Create a new directory in your existing repo:
```bash
mkdir technical-seo-agent
# Copy all the files from this project into that directory
```

### Option 2: Add as a Branch
```bash
# In your existing repository
git checkout -b feature/technical-seo-agent
# Copy all files from this project
git add .
git commit -m "Add technical SEO agent functionality"
git push origin feature/technical-seo-agent
```

### Option 3: Merge into Main
```bash
# After adding files to your repo
git add .
git commit -m "Add technical SEO agent with Playwright web scraping"
git push origin main
```

## Files to Include

### Core Application Files
- `src/` - All source code
- `package.json` - Dependencies and scripts
- `README.md` - Documentation
- `LICENSE` - MIT License
- `.gitignore` - Git ignore rules
- `env.example` - Environment variables template

### Optional Files
- `examples/` - Usage examples
- `test-agent.js` - Test script
- `basic-test.js` - Basic functionality test

## Update Your Existing package.json

If you want to integrate the dependencies into your existing `package.json`, add these to your dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cheerio": "^1.0.0-rc.12",
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "chalk": "^4.1.2",
    "ora": "^5.4.1",
    "playwright": "^1.40.0",
    "lighthouse": "^11.4.0",
    "puppeteer": "^21.5.2",
    "html-pdf": "^3.0.1",
    "multer": "^1.4.5-lts.1",
    "cli-table3": "^0.6.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## Quick Start After Integration

1. **Install dependencies:**
   ```bash
   npm install
   npx playwright install chromium
   ```

2. **Set up environment (optional):**
   ```bash
   cp env.example .env
   # Edit .env with your preferences
   ```

3. **Test the agent:**
   ```bash
   node test-agent.js
   ```

4. **Run the server:**
   ```bash
   node src/index.js server
   ```

## Usage Examples

### Command Line
```bash
# Analyze a single URL
node src/index.js analyze https://example.com

# Analyze multiple URLs
node src/index.js bulk https://example.com https://example.org

# Crawl and analyze a website
node src/index.js crawl https://example.com --max-pages 10

# Start API server
node src/index.js server
```

### API Endpoints
```bash
# Health check
GET http://localhost:3000/health

# Single URL analysis
POST http://localhost:3000/analyze
{
  "url": "https://example.com",
  "includePerformance": true,
  "format": "html"
}

# Bulk analysis
POST http://localhost:3000/analyze-bulk
{
  "urls": ["https://example.com", "https://example.org"],
  "includePerformance": true,
  "format": "json"
}
```

## Customization

You can customize the agent by modifying:
- `src/config/config.js` - Configuration settings
- `src/services/seoAnalyzer.js` - SEO analysis logic
- `src/services/reportGenerator.js` - Report templates
- `src/services/firecrawlService.js` - Web scraping logic

## Notes

- The agent uses Playwright for web scraping (no API keys required)
- Reports are generated in HTML, JSON, and PDF formats
- Performance analysis uses Lighthouse (requires Chrome/Chromium)
- All analysis is done locally for privacy and speed 