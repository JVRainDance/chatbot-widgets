const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');
const chalk = require('chalk');

class ReportGenerator {
  constructor() {
    this.outputDir = config.report.outputDir;
  }

  /**
   * Generate comprehensive SEO report
   * @param {Object} analysis - SEO analysis data
   * @param {string} format - Report format (html, json, pdf)
   * @returns {Promise<string>} - Path to generated report
   */
  async generateReport(analysis, format = 'html') {
    // Ensure output directory exists
    await this.ensureOutputDir();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const domain = new URL(analysis.url).hostname;
    const filename = `seo-report-${domain}-${timestamp}`;

    switch (format.toLowerCase()) {
      case 'json':
        return await this.generateJSONReport(analysis, filename);
      case 'pdf':
        return await this.generatePDFReport(analysis, filename);
      case 'html':
      default:
        return await this.generateHTMLReport(analysis, filename);
    }
  }

  /**
   * Generate HTML report
   * @param {Object} analysis - SEO analysis data
   * @param {string} filename - Base filename
   * @returns {Promise<string>} - Path to HTML report
   */
  async generateHTMLReport(analysis, filename) {
    const htmlContent = this.generateHTMLContent(analysis);
    const filePath = path.join(this.outputDir, `${filename}.html`);
    
    await fs.writeFile(filePath, htmlContent, 'utf8');
    console.log(chalk.green(`✓ HTML report generated: ${filePath}`));
    
    return filePath;
  }

  /**
   * Generate JSON report
   * @param {Object} analysis - SEO analysis data
   * @param {string} filename - Base filename
   * @returns {Promise<string>} - Path to JSON report
   */
  async generateJSONReport(analysis, filename) {
    const filePath = path.join(this.outputDir, `${filename}.json`);
    
    await fs.writeFile(filePath, JSON.stringify(analysis, null, 2), 'utf8');
    console.log(chalk.green(`✓ JSON report generated: ${filePath}`));
    
    return filePath;
  }

  /**
   * Generate PDF report
   * @param {Object} analysis - SEO analysis data
   * @param {string} filename - Base filename
   * @returns {Promise<string>} - Path to PDF report
   */
  async generatePDFReport(analysis, filename) {
    const htmlContent = this.generateHTMLContent(analysis);
    const filePath = path.join(this.outputDir, `${filename}.pdf`);
    
    try {
      const pdf = require('html-pdf');
      const options = {
        format: 'A4',
        border: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      };

      return new Promise((resolve, reject) => {
        pdf.create(htmlContent, options).toFile(filePath, (error, result) => {
          if (error) {
            reject(error);
          } else {
            console.log(chalk.green(`✓ PDF report generated: ${filePath}`));
            resolve(filePath);
          }
        });
      });
    } catch (error) {
      console.error(chalk.red('PDF generation failed. Make sure html-pdf is installed.'));
      throw error;
    }
  }

  /**
   * Generate HTML content for report
   * @param {Object} analysis - SEO analysis data
   * @returns {string} - HTML content
   */
  generateHTMLContent(analysis) {
    const scores = analysis.scores;
    const details = analysis.details;
    const issues = analysis.issues;
    const recommendations = analysis.recommendations;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical SEO Report - ${new URL(analysis.url).hostname}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 3px solid #007bff;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #007bff;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            color: #666;
            font-size: 1.1em;
        }
        
        .overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .score-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .score-card h3 {
            font-size: 1.2em;
            margin-bottom: 10px;
        }
        
        .score-value {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .score-label {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        .section {
            margin-bottom: 40px;
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .section h2 {
            color: #007bff;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
        }
        
        .technical-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .technical-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #007bff;
        }
        
        .technical-item h4 {
            color: #495057;
            margin-bottom: 8px;
        }
        
        .technical-item .status {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .status.good { color: #28a745; }
        .status.warning { color: #ffc107; }
        .status.error { color: #dc3545; }
        
        .issues-recommendations {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        .issues, .recommendations {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        
        .issues h3, .recommendations h3 {
            color: #495057;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #dee2e6;
        }
        
        .issues ul, .recommendations ul {
            list-style: none;
        }
        
        .issues li, .recommendations li {
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .issues li:before {
            content: "⚠️ ";
            margin-right: 8px;
        }
        
        .recommendations li:before {
            content: "💡 ";
            margin-right: 8px;
        }
        
        .performance-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .metric {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        
        .metric h4 {
            color: #495057;
            margin-bottom: 8px;
        }
        
        .metric-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #007bff;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #666;
        }
        
        @media (max-width: 768px) {
            .issues-recommendations {
                grid-template-columns: 1fr;
            }
            
            .overview {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Technical SEO Report</h1>
            <p>Generated on ${new Date(analysis.timestamp).toLocaleString()}</p>
            <p><strong>URL:</strong> ${analysis.url}</p>
        </div>

        <div class="overview">
            <div class="score-card">
                <h3>Overall Score</h3>
                <div class="score-value">${scores.overall}</div>
                <div class="score-label">out of 100</div>
            </div>
            <div class="score-card">
                <h3>Technical SEO</h3>
                <div class="score-value">${scores.technical}</div>
                <div class="score-label">out of 100</div>
            </div>
            <div class="score-card">
                <h3>Content SEO</h3>
                <div class="score-value">${scores.content}</div>
                <div class="score-label">out of 100</div>
            </div>
            <div class="score-card">
                <h3>Performance</h3>
                <div class="score-value">${scores.performance}</div>
                <div class="score-label">out of 100</div>
            </div>
            <div class="score-card">
                <h3>Accessibility</h3>
                <div class="score-value">${scores.accessibility}</div>
                <div class="score-label">out of 100</div>
            </div>
        </div>

        <div class="section">
            <h2>Technical SEO Analysis</h2>
            <div class="technical-grid">
                <div class="technical-item">
                    <h4>Title Tag</h4>
                    <div class="status ${details.technical.title.score >= 80 ? 'good' : details.technical.title.score >= 50 ? 'warning' : 'error'}">
                        ${details.technical.title.present ? 'Present' : 'Missing'}
                    </div>
                    <div>Length: ${details.technical.title.length} characters</div>
                    <div>Score: ${details.technical.title.score}/100</div>
                </div>
                
                <div class="technical-item">
                    <h4>Meta Description</h4>
                    <div class="status ${details.technical.metaDescription.score >= 80 ? 'good' : details.technical.metaDescription.score >= 50 ? 'warning' : 'error'}">
                        ${details.technical.metaDescription.present ? 'Present' : 'Missing'}
                    </div>
                    <div>Length: ${details.technical.metaDescription.length} characters</div>
                    <div>Score: ${details.technical.metaDescription.score}/100</div>
                </div>
                
                <div class="technical-item">
                    <h4>H1 Tags</h4>
                    <div class="status ${details.technical.h1Tags.score >= 80 ? 'good' : details.technical.h1Tags.score >= 50 ? 'warning' : 'error'}">
                        ${details.technical.h1Tags.count} found
                    </div>
                    <div>Score: ${details.technical.h1Tags.score}/100</div>
                </div>
                
                <div class="technical-item">
                    <h4>Canonical URL</h4>
                    <div class="status ${details.technical.canonicalUrl.score >= 80 ? 'good' : 'error'}">
                        ${details.technical.canonicalUrl.present ? 'Present' : 'Missing'}
                    </div>
                    <div>Score: ${details.technical.canonicalUrl.score}/100</div>
                </div>
                
                <div class="technical-item">
                    <h4>Structured Data</h4>
                    <div class="status ${details.technical.structuredData.score >= 80 ? 'good' : 'error'}">
                        ${details.technical.structuredData.present ? 'Present' : 'Missing'}
                    </div>
                    <div>Count: ${details.technical.structuredData.count}</div>
                    <div>Score: ${details.technical.structuredData.score}/100</div>
                </div>
                
                <div class="technical-item">
                    <h4>Images with Alt Text</h4>
                    <div class="status ${details.technical.images.score >= 80 ? 'good' : details.technical.images.score >= 50 ? 'warning' : 'error'}">
                        ${details.technical.images.withAlt}/${details.technical.images.total}
                    </div>
                    <div>Score: ${details.technical.images.score}/100</div>
                </div>
                
                <div class="technical-item">
                    <h4>Internal Links</h4>
                    <div class="status ${details.technical.internalLinks.score >= 80 ? 'good' : details.technical.internalLinks.score >= 50 ? 'warning' : 'error'}">
                        ${details.technical.internalLinks.count} found
                    </div>
                    <div>Score: ${details.technical.internalLinks.score}/100</div>
                </div>
                
                <div class="technical-item">
                    <h4>External Links</h4>
                    <div class="status ${details.technical.externalLinks.score >= 80 ? 'good' : 'error'}">
                        ${details.technical.externalLinks.count} found
                    </div>
                    <div>Score: ${details.technical.externalLinks.score}/100</div>
                </div>
            </div>
        </div>

        ${details.performance ? `
        <div class="section">
            <h2>Performance Metrics</h2>
            <div class="performance-metrics">
                <div class="metric">
                    <h4>Largest Contentful Paint (LCP)</h4>
                    <div class="metric-value">${details.performance.lcp.value}ms</div>
                    <div class="status ${details.performance.lcp.score >= 80 ? 'good' : details.performance.lcp.score >= 50 ? 'warning' : 'error'}">
                        Score: ${details.performance.lcp.score}/100
                    </div>
                </div>
                
                <div class="metric">
                    <h4>First Input Delay (FID)</h4>
                    <div class="metric-value">${details.performance.fid.value}ms</div>
                    <div class="status ${details.performance.fid.score >= 80 ? 'good' : details.performance.fid.score >= 50 ? 'warning' : 'error'}">
                        Score: ${details.performance.fid.score}/100
                    </div>
                </div>
                
                <div class="metric">
                    <h4>Cumulative Layout Shift (CLS)</h4>
                    <div class="metric-value">${details.performance.cls.value}</div>
                    <div class="status ${details.performance.cls.score >= 80 ? 'good' : details.performance.cls.score >= 50 ? 'warning' : 'error'}">
                        Score: ${details.performance.cls.score}/100
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        <div class="section">
            <div class="issues-recommendations">
                <div class="issues">
                    <h3>Issues Found (${issues.length})</h3>
                    <ul>
                        ${issues.map(issue => `<li>${issue}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="recommendations">
                    <h3>Recommendations (${recommendations.length})</h3>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Report generated by Technical SEO Agent</p>
            <p>Powered by Firecrawl & Lighthouse</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDir() {
    try {
      await fs.access(this.outputDir);
    } catch (error) {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate console report
   * @param {Object} analysis - SEO analysis data
   */
  generateConsoleReport(analysis) {
    const scores = analysis.scores;
    const issues = analysis.issues;
    const recommendations = analysis.recommendations;

    console.log('\n' + chalk.blue.bold('='.repeat(60)));
    console.log(chalk.blue.bold('TECHNICAL SEO REPORT'));
    console.log(chalk.blue.bold('='.repeat(60)));
    
    console.log(chalk.gray(`URL: ${analysis.url}`));
    console.log(chalk.gray(`Generated: ${new Date(analysis.timestamp).toLocaleString()}`));
    console.log('');

    // Overall Score
    console.log(chalk.bold('OVERALL SCORE:'));
    console.log(chalk.cyan(`  ${scores.overall}/100`));
    console.log('');

    // Individual Scores
    console.log(chalk.bold('DETAILED SCORES:'));
    console.log(`  Technical SEO: ${chalk.cyan(scores.technical)}/100`);
    console.log(`  Content SEO:   ${chalk.cyan(scores.content)}/100`);
    console.log(`  Performance:   ${chalk.cyan(scores.performance)}/100`);
    console.log(`  Accessibility: ${chalk.cyan(scores.accessibility)}/100`);
    console.log('');

    // Issues
    if (issues.length > 0) {
      console.log(chalk.red.bold(`ISSUES FOUND (${issues.length}):`));
      issues.forEach((issue, index) => {
        console.log(chalk.red(`  ${index + 1}. ${issue}`));
      });
      console.log('');
    }

    // Recommendations
    if (recommendations.length > 0) {
      console.log(chalk.green.bold(`RECOMMENDATIONS (${recommendations.length}):`));
      recommendations.forEach((rec, index) => {
        console.log(chalk.green(`  ${index + 1}. ${rec}`));
      });
      console.log('');
    }

    console.log(chalk.blue.bold('='.repeat(60)));
  }
}

module.exports = ReportGenerator; 