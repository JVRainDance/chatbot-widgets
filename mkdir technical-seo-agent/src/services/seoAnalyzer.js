const config = require('../config/config');
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

class SEOAnalyzer {
  constructor() {
    this.config = config.seo;
  }

  /**
   * Analyze SEO data and generate comprehensive report
   * @param {Object} seoData - SEO data extracted from scraped content
   * @param {Object} performanceData - Performance data from Lighthouse
   * @returns {Object} - Comprehensive SEO analysis
   */
  analyzeSEO(seoData, performanceData = null) {
    const analysis = {
      url: seoData.url,
      timestamp: new Date().toISOString(),
      scores: {
        technical: 0,
        content: 0,
        performance: 0,
        accessibility: 0,
        overall: 0,
      },
      issues: [],
      recommendations: [],
      details: {
        technical: {},
        content: {},
        performance: {},
        accessibility: {},
      },
    };

    // Technical SEO Analysis
    analysis.details.technical = this.analyzeTechnicalSEO(seoData);
    analysis.scores.technical = this.calculateTechnicalScore(analysis.details.technical);

    // Content SEO Analysis
    analysis.details.content = this.analyzeContentSEO(seoData);
    analysis.scores.content = this.calculateContentScore(analysis.details.content);

    // Performance Analysis (if available)
    if (performanceData) {
      analysis.details.performance = this.analyzePerformance(performanceData);
      analysis.scores.performance = this.calculatePerformanceScore(analysis.details.performance);
    }

    // Accessibility Analysis
    analysis.details.accessibility = this.analyzeAccessibility(seoData);
    analysis.scores.accessibility = this.calculateAccessibilityScore(analysis.details.accessibility);

    // Calculate overall score
    analysis.scores.overall = this.calculateOverallScore(analysis.scores);

    // Generate issues and recommendations
    analysis.issues = this.generateIssues(analysis);
    analysis.recommendations = this.generateRecommendations(analysis);

    return analysis;
  }

  /**
   * Analyze technical SEO elements
   * @param {Object} seoData - SEO data
   * @returns {Object} - Technical SEO analysis
   */
  analyzeTechnicalSEO(seoData) {
    const technical = {
      title: {
        present: !!seoData.title,
        length: seoData.title ? seoData.title.length : 0,
        optimal: seoData.title && seoData.title.length >= 30 && seoData.title.length <= 60,
        score: 0,
      },
      metaDescription: {
        present: !!seoData.metaDescription,
        length: seoData.metaDescription ? seoData.metaDescription.length : 0,
        optimal: seoData.metaDescription && seoData.metaDescription.length >= 120 && seoData.metaDescription.length <= 160,
        score: 0,
      },
      h1Tags: {
        count: seoData.h1Tags.length,
        optimal: seoData.h1Tags.length === 1,
        score: 0,
      },
      canonicalUrl: {
        present: !!seoData.canonicalUrl,
        score: 0,
      },
      robotsMeta: {
        present: !!seoData.robotsMeta,
        score: 0,
      },
      structuredData: {
        present: seoData.structuredData.length > 0,
        count: seoData.structuredData.length,
        score: 0,
      },
      favicon: {
        present: !!seoData.favicon,
        score: 0,
      },
      language: {
        present: !!seoData.language,
        score: 0,
      },
      charset: {
        present: !!seoData.charset,
        score: 0,
      },
      images: {
        total: seoData.images.length,
        withAlt: seoData.images.filter(img => img.alt).length,
        withoutAlt: seoData.images.filter(img => !img.alt).length,
        score: 0,
      },
      internalLinks: {
        count: seoData.internalLinks.length,
        score: 0,
      },
      externalLinks: {
        count: seoData.externalLinks.length,
        score: 0,
      },
    };

    // Calculate scores
    technical.title.score = technical.title.optimal ? 100 : (technical.title.present ? 50 : 0);
    technical.metaDescription.score = technical.metaDescription.optimal ? 100 : (technical.metaDescription.present ? 50 : 0);
    technical.h1Tags.score = technical.h1Tags.optimal ? 100 : (technical.h1Tags.count > 0 ? 50 : 0);
    technical.canonicalUrl.score = technical.canonicalUrl.present ? 100 : 0;
    technical.robotsMeta.score = technical.robotsMeta.present ? 100 : 0;
    technical.structuredData.score = technical.structuredData.present ? 100 : 0;
    technical.favicon.score = technical.favicon.present ? 100 : 0;
    technical.language.score = technical.language.present ? 100 : 0;
    technical.charset.score = technical.charset.present ? 100 : 0;
    
    // Image alt text score
    if (technical.images.total === 0) {
      technical.images.score = 100;
    } else {
      technical.images.score = (technical.images.withAlt / technical.images.total) * 100;
    }

    // Link scores
    technical.internalLinks.score = Math.min(technical.internalLinks.count * 10, 100);
    technical.externalLinks.score = technical.externalLinks.count > 0 ? 100 : 0;

    return technical;
  }

  /**
   * Analyze content SEO elements
   * @param {Object} seoData - SEO data
   * @returns {Object} - Content SEO analysis
   */
  analyzeContentSEO(seoData) {
    const content = {
      titleQuality: {
        score: 0,
        issues: [],
      },
      descriptionQuality: {
        score: 0,
        issues: [],
      },
      headingStructure: {
        score: 0,
        issues: [],
      },
      contentLength: {
        score: 0,
        issues: [],
      },
      keywordDensity: {
        score: 0,
        issues: [],
      },
    };

    // Title quality analysis
    if (seoData.title) {
      if (seoData.title.length < 30) {
        content.titleQuality.issues.push('Title is too short');
        content.titleQuality.score = 50;
      } else if (seoData.title.length > 60) {
        content.titleQuality.issues.push('Title is too long');
        content.titleQuality.score = 70;
      } else {
        content.titleQuality.score = 100;
      }
    } else {
      content.titleQuality.issues.push('Missing title tag');
      content.titleQuality.score = 0;
    }

    // Description quality analysis
    if (seoData.metaDescription) {
      if (seoData.metaDescription.length < 120) {
        content.descriptionQuality.issues.push('Meta description is too short');
        content.descriptionQuality.score = 50;
      } else if (seoData.metaDescription.length > 160) {
        content.descriptionQuality.issues.push('Meta description is too long');
        content.descriptionQuality.score = 70;
      } else {
        content.descriptionQuality.score = 100;
      }
    } else {
      content.descriptionQuality.issues.push('Missing meta description');
      content.descriptionQuality.score = 0;
    }

    // Heading structure analysis
    if (seoData.h1Tags.length === 1) {
      content.headingStructure.score = 100;
    } else if (seoData.h1Tags.length === 0) {
      content.headingStructure.issues.push('Missing H1 tag');
      content.headingStructure.score = 0;
    } else {
      content.headingStructure.issues.push('Multiple H1 tags found');
      content.headingStructure.score = 30;
    }

    // Content length analysis (basic)
    const totalTextLength = [
      seoData.title,
      seoData.metaDescription,
      ...seoData.h1Tags,
      ...seoData.h2Tags,
      ...seoData.h3Tags,
    ].join(' ').length;

    if (totalTextLength > 300) {
      content.contentLength.score = 100;
    } else if (totalTextLength > 150) {
      content.contentLength.score = 70;
    } else {
      content.contentLength.issues.push('Content appears to be too short');
      content.contentLength.score = 30;
    }

    return content;
  }

  /**
   * Analyze performance data from Lighthouse
   * @param {Object} performanceData - Lighthouse performance data
   * @returns {Object} - Performance analysis
   */
  analyzePerformance(performanceData) {
    const performance = {
      lcp: {
        value: performanceData.lcp || 0,
        score: 0,
        optimal: false,
      },
      fid: {
        value: performanceData.fid || 0,
        score: 0,
        optimal: false,
      },
      cls: {
        value: performanceData.cls || 0,
        score: 0,
        optimal: false,
      },
      fcp: {
        value: performanceData.fcp || 0,
        score: 0,
        optimal: false,
      },
      ttfb: {
        value: performanceData.ttfb || 0,
        score: 0,
        optimal: false,
      },
    };

    // LCP analysis
    if (performance.lcp.value <= this.config.lcpThreshold) {
      performance.lcp.score = 100;
      performance.lcp.optimal = true;
    } else {
      performance.lcp.score = Math.max(0, 100 - ((performance.lcp.value - this.config.lcpThreshold) / 1000) * 50);
    }

    // FID analysis
    if (performance.fid.value <= this.config.fidThreshold) {
      performance.fid.score = 100;
      performance.fid.optimal = true;
    } else {
      performance.fid.score = Math.max(0, 100 - ((performance.fid.value - this.config.fidThreshold) / 10) * 50);
    }

    // CLS analysis
    if (performance.cls.value <= this.config.clsThreshold) {
      performance.cls.score = 100;
      performance.cls.optimal = true;
    } else {
      performance.cls.score = Math.max(0, 100 - (performance.cls.value * 1000));
    }

    return performance;
  }

  /**
   * Analyze accessibility elements
   * @param {Object} seoData - SEO data
   * @returns {Object} - Accessibility analysis
   */
  analyzeAccessibility(seoData) {
    const accessibility = {
      images: {
        withAlt: seoData.images.filter(img => img.alt).length,
        withoutAlt: seoData.images.filter(img => !img.alt).length,
        total: seoData.images.length,
        score: 0,
      },
      language: {
        present: !!seoData.language,
        score: 0,
      },
      headings: {
        hasH1: seoData.h1Tags.length > 0,
        hasStructure: seoData.h2Tags.length > 0 || seoData.h3Tags.length > 0,
        score: 0,
      },
    };

    // Image accessibility score
    if (accessibility.images.total === 0) {
      accessibility.images.score = 100;
    } else {
      accessibility.images.score = (accessibility.images.withAlt / accessibility.images.total) * 100;
    }

    // Language score
    accessibility.language.score = accessibility.language.present ? 100 : 0;

    // Heading structure score
    if (accessibility.headings.hasH1 && accessibility.headings.hasStructure) {
      accessibility.headings.score = 100;
    } else if (accessibility.headings.hasH1) {
      accessibility.headings.score = 70;
    } else {
      accessibility.headings.score = 0;
    }

    return accessibility;
  }

  /**
   * Calculate technical SEO score
   * @param {Object} technical - Technical analysis data
   * @returns {number} - Technical score (0-100)
   */
  calculateTechnicalScore(technical) {
    const scores = [
      technical.title.score,
      technical.metaDescription.score,
      technical.h1Tags.score,
      technical.canonicalUrl.score,
      technical.robotsMeta.score,
      technical.structuredData.score,
      technical.favicon.score,
      technical.language.score,
      technical.charset.score,
      technical.images.score,
      technical.internalLinks.score,
      technical.externalLinks.score,
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  /**
   * Calculate content SEO score
   * @param {Object} content - Content analysis data
   * @returns {number} - Content score (0-100)
   */
  calculateContentScore(content) {
    const scores = [
      content.titleQuality.score,
      content.descriptionQuality.score,
      content.headingStructure.score,
      content.contentLength.score,
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  /**
   * Calculate performance score
   * @param {Object} performance - Performance analysis data
   * @returns {number} - Performance score (0-100)
   */
  calculatePerformanceScore(performance) {
    const scores = [
      performance.lcp.score,
      performance.fid.score,
      performance.cls.score,
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  /**
   * Calculate accessibility score
   * @param {Object} accessibility - Accessibility analysis data
   * @returns {number} - Accessibility score (0-100)
   */
  calculateAccessibilityScore(accessibility) {
    const scores = [
      accessibility.images.score,
      accessibility.language.score,
      accessibility.headings.score,
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  /**
   * Calculate overall SEO score
   * @param {Object} scores - Individual scores
   * @returns {number} - Overall score (0-100)
   */
  calculateOverallScore(scores) {
    const weights = this.config.weights;
    return Math.round(
      scores.technical * weights.technical +
      scores.content * weights.content +
      scores.performance * weights.performance +
      scores.accessibility * weights.accessibility
    );
  }

  /**
   * Generate issues from analysis
   * @param {Object} analysis - Complete analysis
   * @returns {Array} - List of issues
   */
  generateIssues(analysis) {
    const issues = [];

    // Technical issues
    if (analysis.details.technical.title.score < 100) {
      issues.push('Title tag needs optimization');
    }
    if (analysis.details.technical.metaDescription.score < 100) {
      issues.push('Meta description needs optimization');
    }
    if (analysis.details.technical.h1Tags.score < 100) {
      issues.push('H1 tag structure needs improvement');
    }
    if (analysis.details.technical.images.score < 100) {
      issues.push('Some images are missing alt text');
    }

    // Content issues
    analysis.details.content.titleQuality.issues.forEach(issue => issues.push(issue));
    analysis.details.content.descriptionQuality.issues.forEach(issue => issues.push(issue));
    analysis.details.content.headingStructure.issues.forEach(issue => issues.push(issue));

    // Performance issues
    if (analysis.details.performance) {
      if (analysis.details.performance.lcp.score < 100) {
        issues.push('Largest Contentful Paint needs improvement');
      }
      if (analysis.details.performance.fid.score < 100) {
        issues.push('First Input Delay needs improvement');
      }
      if (analysis.details.performance.cls.score < 100) {
        issues.push('Cumulative Layout Shift needs improvement');
      }
    }

    return issues;
  }

  /**
   * Generate recommendations from analysis
   * @param {Object} analysis - Complete analysis
   * @returns {Array} - List of recommendations
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    // Technical recommendations
    if (analysis.details.technical.title.score < 100) {
      recommendations.push('Optimize title tag to be between 30-60 characters');
    }
    if (analysis.details.technical.metaDescription.score < 100) {
      recommendations.push('Optimize meta description to be between 120-160 characters');
    }
    if (analysis.details.technical.structuredData.score < 100) {
      recommendations.push('Add structured data markup to improve search visibility');
    }
    if (analysis.details.technical.images.score < 100) {
      recommendations.push('Add alt text to all images for better accessibility');
    }

    // Content recommendations
    if (analysis.details.content.headingStructure.score < 100) {
      recommendations.push('Ensure proper heading hierarchy with one H1 per page');
    }

    // Performance recommendations
    if (analysis.details.performance) {
      if (analysis.details.performance.lcp.score < 100) {
        recommendations.push('Optimize images and reduce server response time to improve LCP');
      }
      if (analysis.details.performance.fid.score < 100) {
        recommendations.push('Reduce JavaScript execution time to improve FID');
      }
      if (analysis.details.performance.cls.score < 100) {
        recommendations.push('Avoid layout shifts by setting proper dimensions for images and ads');
      }
    }

    return recommendations;
  }

  /**
   * Run Lighthouse audit for performance analysis
   * @param {string} url - URL to audit
   * @returns {Promise<Object>} - Lighthouse results
   */
  async runLighthouseAudit(url) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const { lhr } = await lighthouse(url, {
        port: (new URL(browser.wsEndpoint())).port,
        output: 'json',
        onlyCategories: ['performance'],
      });
      await browser.close();

      return {
        lcp: lhr.audits['largest-contentful-paint']?.numericValue,
        fid: lhr.audits['max-potential-fid']?.numericValue,
        cls: lhr.audits['cumulative-layout-shift']?.numericValue,
        fcp: lhr.audits['first-contentful-paint']?.numericValue,
        ttfb: lhr.audits['server-response-time']?.numericValue,
      };
    } catch (error) {
      console.error('Lighthouse audit failed:', error.message);
      return null;
    }
  }
}

module.exports = SEOAnalyzer; 