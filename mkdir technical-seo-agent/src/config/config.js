require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Report Configuration
  report: {
    outputDir: process.env.REPORT_OUTPUT_DIR || './reports',
    maxPagesToCrawl: parseInt(process.env.MAX_PAGES_TO_CRAWL) || 50,
    crawlDelay: parseInt(process.env.CRAWL_DELAY) || 1000,
  },

  // Proxy Configuration (optional)
  proxy: {
    url: process.env.PROXY_URL,
    username: process.env.PROXY_USERNAME,
    password: process.env.PROXY_PASSWORD,
  },

  // SEO Analysis Configuration
  seo: {
    // Core Web Vitals thresholds
    lcpThreshold: 2500, // milliseconds
    fidThreshold: 100,   // milliseconds
    clsThreshold: 0.1,   // score

    // SEO score weights
    weights: {
      technical: 0.3,
      content: 0.25,
      performance: 0.25,
      accessibility: 0.2,
    },

    // Critical SEO elements to check
    criticalElements: [
      'title',
      'meta description',
      'h1',
      'canonical',
      'robots',
      'structured data',
      'internal links',
      'external links',
      'images',
      'favicon',
    ],
  },
};

module.exports = config; 