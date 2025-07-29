const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const FirecrawlService = require('./services/firecrawlService');
const SEOAnalyzer = require('./services/seoAnalyzer');
const ReportGenerator = require('./services/reportGenerator');
const chalk = require('chalk');
const ora = require('ora');

class TechnicalSEOAgent {
  constructor() {
    this.firecrawlService = new FirecrawlService();
    this.seoAnalyzer = new SEOAnalyzer();
    this.reportGenerator = new ReportGenerator();
    this.app = express();
    this.setupExpress();
  }

  /**
   * Setup Express server
   */
  setupExpress() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Serve static files from public directory
    this.app.use(express.static('public'));

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Serve the main page
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Single URL analysis endpoint
    this.app.post('/analyze', async (req, res) => {
      try {
        const { url, includePerformance = true, format = 'html' } = req.body;
        
        if (!url) {
          return res.status(400).json({ error: 'URL is required' });
        }

        const result = await this.analyzeURL(url, includePerformance, format);
        res.json(result);
      } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: error.message });
      }
    });

    // Multiple URLs analysis endpoint
    this.app.post('/analyze-bulk', async (req, res) => {
      try {
        const { urls, includePerformance = true, format = 'html' } = req.body;
        
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
          return res.status(400).json({ error: 'URLs array is required' });
        }

        const results = await this.analyzeMultipleURLs(urls, includePerformance, format);
        res.json(results);
      } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: error.message });
      }
    });

    // Site crawl and analysis endpoint
    this.app.post('/crawl-and-analyze', async (req, res) => {
      try {
        const { url, maxPages = 10, includePerformance = true, format = 'html' } = req.body;
        
        if (!url) {
          return res.status(400).json({ error: 'URL is required' });
        }

        const results = await this.crawlAndAnalyze(url, maxPages, includePerformance, format);
        res.json(results);
      } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: error.message });
      }
    });
  }

  /**
   * Start the Express server
   */
  startServer() {
    const port = config.server.port;
    this.app.listen(port, () => {
      console.log(chalk.green(`🚀 Technical SEO Agent server running on port ${port}`));
      console.log(chalk.blue(`📊 Health check: http://localhost:${port}/health`));
      console.log(chalk.blue(`🔍 Single URL analysis: POST http://localhost:${port}/analyze`));
      console.log(chalk.blue(`📋 Bulk analysis: POST http://localhost:${port}/analyze-bulk`));
      console.log(chalk.blue(`🕷️  Crawl & analyze: POST http://localhost:${port}/crawl-and-analyze`));
    });
  }

  /**
   * Analyze a single URL
   * @param {string} url - URL to analyze
   * @param {boolean} includePerformance - Whether to include performance analysis
   * @param {string} format - Report format
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeURL(url, includePerformance = true, format = 'html') {
    const spinner = ora(`Analyzing ${url}...`).start();

    try {
      // Step 1: Scrape the URL
      spinner.text = `Scraping ${url}...`;
      const scrapedData = await this.firecrawlService.scrapeUrl(url);
      
      // Step 2: Extract SEO data
      spinner.text = `Extracting SEO data from ${url}...`;
      const seoData = this.firecrawlService.extractSEOData(scrapedData);

      // Step 3: Run performance analysis (if requested)
      let performanceData = null;
      if (includePerformance) {
        spinner.text = `Running performance analysis for ${url}...`;
        performanceData = await this.seoAnalyzer.runLighthouseAudit(url);
      }

      // Step 4: Analyze SEO
      spinner.text = `Analyzing SEO for ${url}...`;
      const analysis = this.seoAnalyzer.analyzeSEO(seoData, performanceData);

      // Step 5: Generate report
      spinner.text = `Generating ${format.toUpperCase()} report for ${url}...`;
      const reportPath = await this.reportGenerator.generateReport(analysis, format);

      // Step 6: Generate console report
      this.reportGenerator.generateConsoleReport(analysis);

      spinner.succeed(`Analysis completed for ${url}`);

      return {
        success: true,
        url,
        analysis,
        reportPath,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      spinner.fail(`Analysis failed for ${url}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze multiple URLs
   * @param {Array<string>} urls - URLs to analyze
   * @param {boolean} includePerformance - Whether to include performance analysis
   * @param {string} format - Report format
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeMultipleURLs(urls, includePerformance = true, format = 'html') {
    const results = [];
    const spinner = ora(`Analyzing ${urls.length} URLs...`).start();

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        spinner.text = `Analyzing ${url} (${i + 1}/${urls.length})...`;
        const result = await this.analyzeURL(url, includePerformance, format);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          url,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    spinner.succeed(`Completed analysis of ${urls.length} URLs`);

    return {
      totalUrls: urls.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  }

  /**
   * Crawl a site and analyze discovered pages
   * @param {string} baseUrl - Base URL to start crawling from
   * @param {number} maxPages - Maximum number of pages to analyze
   * @param {boolean} includePerformance - Whether to include performance analysis
   * @param {string} format - Report format
   * @returns {Promise<Object>} - Analysis results
   */
  async crawlAndAnalyze(baseUrl, maxPages = 10, includePerformance = true, format = 'html') {
    const spinner = ora(`Crawling ${baseUrl}...`).start();

    try {
      // Step 1: Get site structure
      spinner.text = `Discovering pages on ${baseUrl}...`;
      const siteStructure = await this.firecrawlService.getSiteStructure(baseUrl, {
        maxPages: Math.min(maxPages, config.report.maxPagesToCrawl),
      });

      // Step 2: Extract URLs from site structure
      const urls = siteStructure.pages ? siteStructure.pages.slice(0, maxPages) : [baseUrl];
      
      spinner.succeed(`Discovered ${urls.length} pages on ${baseUrl}`);

      // Step 3: Analyze discovered URLs
      return await this.analyzeMultipleURLs(urls, includePerformance, format);
    } catch (error) {
      spinner.fail(`Crawl and analysis failed for ${baseUrl}: ${error.message}`);
      throw error;
    }
  }

  /**
   * CLI interface for single URL analysis
   * @param {string} url - URL to analyze
   * @param {Object} options - Analysis options
   */
  async analyzeFromCLI(url, options = {}) {
    const { includePerformance = true, format = 'html' } = options;

    try {
      const result = await this.analyzeURL(url, includePerformance, format);
      console.log(chalk.green('\n✅ Analysis completed successfully!'));
      console.log(chalk.blue(`📄 Report saved to: ${result.reportPath}`));
      return result;
    } catch (error) {
      console.error(chalk.red(`\n❌ Analysis failed: ${error.message}`));
      process.exit(1);
    }
  }

  /**
   * CLI interface for bulk URL analysis
   * @param {Array<string>} urls - URLs to analyze
   * @param {Object} options - Analysis options
   */
  async analyzeBulkFromCLI(urls, options = {}) {
    const { includePerformance = true, format = 'html' } = options;

    try {
      const result = await this.analyzeMultipleURLs(urls, includePerformance, format);
      console.log(chalk.green('\n✅ Bulk analysis completed!'));
      console.log(chalk.blue(`📊 Processed ${result.totalUrls} URLs`));
      console.log(chalk.green(`✅ Successful: ${result.successful}`));
      console.log(chalk.red(`❌ Failed: ${result.failed}`));
      return result;
    } catch (error) {
      console.error(chalk.red(`\n❌ Bulk analysis failed: ${error.message}`));
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const agent = new TechnicalSEOAgent();
  
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(chalk.blue.bold('Technical SEO Agent'));
    console.log(chalk.gray('Usage:'));
    console.log(chalk.cyan('  node src/index.js analyze <url> [options]'));
    console.log(chalk.cyan('  node src/index.js bulk <url1> <url2> ... [options]'));
    console.log(chalk.cyan('  node src/index.js crawl <baseUrl> [options]'));
    console.log(chalk.cyan('  node src/index.js server'));
    console.log('');
    console.log(chalk.gray('Options:'));
    console.log(chalk.cyan('  --no-performance  Skip performance analysis'));
    console.log(chalk.cyan('  --format <format>  Report format (html, json, pdf)'));
    console.log(chalk.cyan('  --max-pages <num>  Max pages to crawl (for crawl command)'));
    process.exit(0);
  }

  const options = {
    includePerformance: !args.includes('--no-performance'),
    format: args.includes('--format') ? args[args.indexOf('--format') + 1] : 'html',
    maxPages: args.includes('--max-pages') ? parseInt(args[args.indexOf('--max-pages') + 1]) : 10,
  };

  switch (command) {
    case 'analyze':
      const url = args[1];
      if (!url) {
        console.error(chalk.red('URL is required for analyze command'));
        process.exit(1);
      }
      agent.analyzeFromCLI(url, options);
      break;

    case 'bulk':
      const urls = args.slice(1).filter(arg => !arg.startsWith('--'));
      if (urls.length === 0) {
        console.error(chalk.red('At least one URL is required for bulk command'));
        process.exit(1);
      }
      agent.analyzeBulkFromCLI(urls, options);
      break;

    case 'crawl':
      const baseUrl = args[1];
      if (!baseUrl) {
        console.error(chalk.red('Base URL is required for crawl command'));
        process.exit(1);
      }
      agent.crawlAndAnalyze(baseUrl, options.maxPages, options.includePerformance, options.format)
        .then(result => {
          console.log(chalk.green('\n✅ Crawl and analysis completed!'));
          console.log(chalk.blue(`📊 Processed ${result.totalUrls} URLs`));
          console.log(chalk.green(`✅ Successful: ${result.successful}`));
          console.log(chalk.red(`❌ Failed: ${result.failed}`));
        })
        .catch(error => {
          console.error(chalk.red(`\n❌ Crawl and analysis failed: ${error.message}`));
          process.exit(1);
        });
      break;

    case 'server':
      agent.startServer();
      break;

    default:
      console.error(chalk.red(`Unknown command: ${command}`));
      process.exit(1);
  }
}

module.exports = TechnicalSEOAgent; 