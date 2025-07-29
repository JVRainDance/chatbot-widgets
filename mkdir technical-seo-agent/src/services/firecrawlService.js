const { chromium } = require('playwright');
const config = require('../config/config');

class FirecrawlService {
  constructor() {
    this.browser = null;
  }

  /**
   * Initialize browser if not already done
   */
  async initBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  /**
   * Close browser
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Scrape a single URL using Playwright
   * @param {string} url - The URL to scrape
   * @param {Object} options - Additional options for scraping
   * @returns {Promise<Object>} - Scraped data
   */
  async scrapeUrl(url, options = {}) {
    try {
      await this.initBrowser();
      const page = await this.browser.newPage();
      
      // Set user agent to avoid detection
      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
      
      // Navigate to the page
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Get page content
      const html = await page.content();
      const title = await page.title();
      
      // Extract metadata
      const metaDescription = await page.$eval('meta[name="description"]', el => el?.content || '').catch(() => '');
      const canonical = await page.$eval('link[rel="canonical"]', el => el?.href || '').catch(() => '');
      const robots = await page.$eval('meta[name="robots"]', el => el?.content || '').catch(() => '');
      const language = await page.$eval('html', el => el.getAttribute('lang') || '').catch(() => '');
      const charset = await page.$eval('meta[charset]', el => el?.getAttribute('charset') || '').catch(() => '');

      // Extract headings
      const h1Tags = await page.$$eval('h1', els => els.map(el => el.textContent.trim()));
      const h2Tags = await page.$$eval('h2', els => els.map(el => el.textContent.trim()));
      const h3Tags = await page.$$eval('h3', els => els.map(el => el.textContent.trim()));

      // Extract images
      const images = await page.$$eval('img', els => els.map(el => ({
        src: el.src,
        alt: el.alt || '',
        title: el.title || ''
      })));

      // Extract links
      const links = await page.$$eval('a', els => els.map(el => ({
        href: el.href,
        text: el.textContent.trim(),
        title: el.title || ''
      })));

      // Extract structured data
      const structuredData = await page.$$eval('script[type="application/ld+json"]', els => {
        return els.map(el => {
          try {
            return JSON.parse(el.textContent);
          } catch {
            return null;
          }
        }).filter(Boolean);
      });

      // Extract favicon
      const favicon = await page.$eval('link[rel="icon"], link[rel="shortcut icon"]', el => el?.href || '').catch(() => '');

      await page.close();

      return {
        url,
        html,
        title,
        metaDescription,
        canonical,
        robots,
        language,
        charset,
        h1Tags,
        h2Tags,
        h3Tags,
        images,
        links,
        structuredData,
        favicon
      };
    } catch (error) {
      console.error('Playwright scraping error:', error.message);
      throw new Error(`Failed to scrape ${url}: ${error.message}`);
    }
  }

  /**
   * Scrape multiple URLs using Playwright
   * @param {Array<string>} urls - Array of URLs to scrape
   * @param {Object} options - Additional options for scraping
   * @returns {Promise<Array>} - Array of scraped data
   */
  async scrapeUrls(urls, options = {}) {
    const results = [];
    
    for (const url of urls) {
      try {
        const result = await this.scrapeUrl(url, options);
        results.push({
          url,
          success: true,
          data: result,
        });
      } catch (error) {
        results.push({
          url,
          success: false,
          error: error.message,
        });
      }
      
      // Add delay between requests to be respectful
      if (urls.indexOf(url) < urls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, config.report.crawlDelay));
      }
    }

    return results;
  }

  /**
   * Get site structure and discover URLs
   * @param {string} baseUrl - The base URL to start crawling from
   * @param {Object} options - Crawling options
   * @returns {Promise<Object>} - Site structure and discovered URLs
   */
  async getSiteStructure(baseUrl, options = {}) {
    try {
      await this.initBrowser();
      const page = await this.browser.newPage();
      
      // Set user agent
      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
      
      // Navigate to the base URL
      await page.goto(baseUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Extract all links from the page
      const links = await page.$$eval('a[href]', els => els.map(el => el.href));
      
      // Filter internal links
      const baseUrlObj = new URL(baseUrl);
      const internalLinks = links.filter(link => {
        try {
          const linkUrl = new URL(link);
          return linkUrl.hostname === baseUrlObj.hostname;
        } catch {
          return false;
        }
      });

      // Remove duplicates and limit to max pages
      const uniqueLinks = [...new Set(internalLinks)].slice(0, options.maxPages || config.report.maxPagesToCrawl);

      await page.close();

      return {
        baseUrl,
        pages: uniqueLinks,
        totalPages: uniqueLinks.length
      };
    } catch (error) {
      console.error('Playwright crawling error:', error.message);
      throw new Error(`Failed to crawl ${baseUrl}: ${error.message}`);
    }
  }

  /**
   * Extract specific SEO data from scraped content
   * @param {Object} scrapedData - Data returned from Playwright
   * @returns {Object} - Extracted SEO data
   */
  extractSEOData(scrapedData) {
    const seoData = {
      url: scrapedData.url,
      title: scrapedData.title || '',
      metaDescription: scrapedData.metaDescription || '',
      h1Tags: scrapedData.h1Tags || [],
      h2Tags: scrapedData.h2Tags || [],
      h3Tags: scrapedData.h3Tags || [],
      images: scrapedData.images || [],
      links: scrapedData.links || [],
      internalLinks: [],
      externalLinks: [],
      canonicalUrl: scrapedData.canonical || '',
      robotsMeta: scrapedData.robots || '',
      structuredData: scrapedData.structuredData || [],
      favicon: scrapedData.favicon || '',
      language: scrapedData.language || '',
      charset: scrapedData.charset || '',
    };

    // Categorize links
    const baseUrl = new URL(scrapedData.url);
    seoData.links.forEach(link => {
      if (link.href) {
        try {
          const linkUrl = new URL(link.href, baseUrl);
          if (linkUrl.hostname === baseUrl.hostname) {
            seoData.internalLinks.push(link);
          } else {
            seoData.externalLinks.push(link);
          }
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });

    return seoData;
  }
}

module.exports = FirecrawlService; 