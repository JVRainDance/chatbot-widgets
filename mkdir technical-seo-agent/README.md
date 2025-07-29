# Technical SEO Agent

A powerful technical SEO analysis tool that uses Playwright to scrape websites and generate comprehensive SEO reports. This agent provides both CLI and API interfaces for analyzing single URLs, multiple URLs, or entire websites.

## Features

- 🔍 **Comprehensive SEO Analysis**: Analyzes technical SEO, content SEO, performance, and accessibility
- 🕷️ **Web Scraping**: Uses Playwright for reliable web scraping and data extraction
- 📊 **Performance Metrics**: Integrates Lighthouse for Core Web Vitals analysis
- 📄 **Multiple Report Formats**: Generates HTML, JSON, and PDF reports
- 🚀 **API & CLI**: Both REST API and command-line interfaces
- 🎯 **Bulk Analysis**: Analyze multiple URLs or crawl entire websites
- 📈 **Scoring System**: Provides detailed scores for different SEO aspects

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd technical-seo-agent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` to customize settings if needed:
   ```env
   PORT=3000
   NODE_ENV=development
   REPORT_OUTPUT_DIR=./reports
   MAX_PAGES_TO_CRAWL=50
   CRAWL_DELAY=1000
   ```

## Usage

### Command Line Interface

#### Analyze a single URL
```bash
# Basic analysis
node src/index.js analyze https://example.com

# Skip performance analysis
node src/index.js analyze https://example.com --no-performance

# Generate JSON report
node src/index.js analyze https://example.com --format json

# Generate PDF report
node src/index.js analyze https://example.com --format pdf
```

#### Analyze multiple URLs
```bash
# Analyze multiple URLs
node src/index.js bulk https://example.com https://example.org https://example.net

# With options
node src/index.js bulk https://example.com https://example.org --format json --no-performance
```

#### Crawl and analyze a website
```bash
# Crawl and analyze up to 10 pages
node src/index.js crawl https://example.com

# Crawl and analyze up to 20 pages
node src/index.js crawl https://example.com --max-pages 20

# With options
node src/index.js crawl https://example.com --max-pages 15 --format json --no-performance
```

#### Start the API server
```bash
node src/index.js server
```

### API Interface

Start the server and use the REST API endpoints:

#### Health Check
```bash
GET http://localhost:3000/health
```

#### Single URL Analysis
```bash
POST http://localhost:3000/analyze
Content-Type: application/json

{
  "url": "https://example.com",
  "includePerformance": true,
  "format": "html"
}
```

#### Bulk URL Analysis
```bash
POST http://localhost:3000/analyze-bulk
Content-Type: application/json

{
  "urls": [
    "https://example.com",
    "https://example.org",
    "https://example.net"
  ],
  "includePerformance": true,
  "format": "html"
}
```

#### Crawl and Analyze
```bash
POST http://localhost:3000/crawl-and-analyze
Content-Type: application/json

{
  "url": "https://example.com",
  "maxPages": 10,
  "includePerformance": true,
  "format": "html"
}
```

## Configuration

Edit the configuration in `src/config/config.js` or use environment variables:

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `REPORT_OUTPUT_DIR` | Reports output directory | ./reports |
| `MAX_PAGES_TO_CRAWL` | Maximum pages to crawl | 50 |
| `CRAWL_DELAY` | Delay between requests (ms) | 1000 |

### SEO Analysis Configuration

The agent analyzes the following SEO elements:

#### Technical SEO
- Title tags
- Meta descriptions
- H1 tags
- Canonical URLs
- Robots meta tags
- Structured data
- Favicon
- Language and charset
- Image alt text
- Internal and external links

#### Content SEO
- Title quality and length
- Meta description quality
- Heading structure
- Content length

#### Performance (Core Web Vitals)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- First Contentful Paint (FCP)
- Time to First Byte (TTFB)

#### Accessibility
- Image alt text
- Language attributes
- Heading structure

## Report Formats

### HTML Report
Beautiful, responsive HTML reports with:
- Overall SEO score
- Detailed breakdown by category
- Issues and recommendations
- Performance metrics
- Technical SEO analysis

### JSON Report
Structured JSON data for programmatic access:
```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "scores": {
    "overall": 85,
    "technical": 90,
    "content": 80,
    "performance": 85,
    "accessibility": 90
  },
  "issues": [...],
  "recommendations": [...],
  "details": {...}
}
```

### PDF Report
Professional PDF reports for sharing and documentation.

## Scoring System

The agent uses a weighted scoring system:

- **Technical SEO**: 30% weight
- **Content SEO**: 25% weight
- **Performance**: 25% weight
- **Accessibility**: 20% weight

Each category is scored from 0-100 based on various factors:

### Technical SEO Scoring
- Title tag presence and length
- Meta description presence and length
- H1 tag structure
- Canonical URL presence
- Structured data implementation
- Image alt text coverage
- Internal/external link presence

### Content SEO Scoring
- Title quality and optimization
- Meta description quality
- Heading hierarchy
- Content length assessment

### Performance Scoring
- Core Web Vitals performance
- LCP, FID, CLS thresholds
- Performance optimization opportunities

### Accessibility Scoring
- Image accessibility
- Language attributes
- Heading structure

## API Response Format

### Success Response
```json
{
  "success": true,
  "url": "https://example.com",
  "analysis": {
    "url": "https://example.com",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "scores": {
      "overall": 85,
      "technical": 90,
      "content": 80,
      "performance": 85,
      "accessibility": 90
    },
    "issues": [
      "Title tag needs optimization",
      "Some images are missing alt text"
    ],
    "recommendations": [
      "Optimize title tag to be between 30-60 characters",
      "Add alt text to all images for better accessibility"
    ],
    "details": {
      "technical": {...},
      "content": {...},
      "performance": {...},
      "accessibility": {...}
    }
  },
  "reportPath": "./reports/seo-report-example-com-2024-01-01T00-00-00-000Z.html",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "error": "Failed to scrape https://example.com: Network error"
}
```

## Development

### Project Structure
```
src/
├── config/
│   └── config.js          # Configuration management
├── services/
│   ├── firecrawlService.js # Firecrawl API integration
│   ├── seoAnalyzer.js     # SEO analysis logic
│   └── reportGenerator.js  # Report generation
└── index.js               # Main application entry point
```

### Adding New SEO Checks

1. **Update the SEO analyzer** in `src/services/seoAnalyzer.js`
2. **Add new extraction logic** in `src/services/firecrawlService.js`
3. **Update scoring weights** in `src/config/config.js`
4. **Add to report templates** in `src/services/reportGenerator.js`

### Running Tests
```bash
npm test
```

## Troubleshooting

### Common Issues

1. **Firecrawl API Key Error**
   - Ensure your API key is correctly set in `.env`
   - Verify the key is valid in the Firecrawl dashboard

2. **Performance Analysis Fails**
   - Ensure Puppeteer dependencies are installed
   - Check if the target URL is accessible
   - Some sites may block automated browsers

3. **PDF Generation Fails**
   - Ensure `html-pdf` is properly installed
   - Check system dependencies for PDF generation

4. **Memory Issues with Large Sites**
   - Reduce `MAX_PAGES_TO_CRAWL` in configuration
   - Increase `CRAWL_DELAY` to reduce server load

### Performance Tips

- Use `--no-performance` flag for faster analysis
- Set appropriate `CRAWL_DELAY` to avoid rate limiting
- Use JSON format for programmatic processing
- Consider running bulk analysis in batches

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section
- Review the configuration options
- Ensure all dependencies are properly installed
- Verify your configuration settings are correct 