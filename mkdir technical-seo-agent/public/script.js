// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to selected tab
    event.target.classList.add('active');
}

// Utility functions
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').classList.remove('show');
    hideMessages();
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    hideLoading();
}

function showSuccess(message) {
    const successDiv = document.getElementById('success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    hideLoading();
}

function hideMessages() {
    document.getElementById('error').style.display = 'none';
    document.getElementById('success').style.display = 'none';
}

function displayResults(data) {
    const analysis = data.analysis;
    const scores = analysis.scores;
    
    // Update overall score
    document.getElementById('overallScore').textContent = scores.overall;
    
    // Update individual scores
    document.getElementById('technicalScore').textContent = `${scores.technical}/100`;
    document.getElementById('contentScore').textContent = `${scores.content}/100`;
    document.getElementById('performanceScore').textContent = `${scores.performance}/100`;
    document.getElementById('accessibilityScore').textContent = `${scores.accessibility}/100`;
    
    // Update issues list
    const issuesList = document.getElementById('issuesList');
    issuesList.innerHTML = '';
    if (analysis.issues && analysis.issues.length > 0) {
        analysis.issues.forEach(issue => {
            const issueItem = document.createElement('div');
            issueItem.className = 'list-item';
            issueItem.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${issue}`;
            issuesList.appendChild(issueItem);
        });
    } else {
        issuesList.innerHTML = '<div class="list-item">No issues found! 🎉</div>';
    }
    
    // Update recommendations list
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    if (analysis.recommendations && analysis.recommendations.length > 0) {
        analysis.recommendations.forEach(rec => {
            const recItem = document.createElement('div');
            recItem.className = 'list-item';
            recItem.innerHTML = `<i class="fas fa-lightbulb"></i> ${rec}`;
            recommendationsList.appendChild(recItem);
        });
    } else {
        recommendationsList.innerHTML = '<div class="list-item">No recommendations needed! 🎉</div>';
    }
    
    // Show results
    document.getElementById('results').classList.add('show');
    
    // Show success message
    showSuccess(`Analysis completed for ${data.url}! Report saved to: ${data.reportPath}`);
}

// API call function
async function callAPI(endpoint, data) {
    try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`API call failed: ${error.message}`);
    }
}

// Single URL analysis
async function analyzeSingle() {
    const url = document.getElementById('singleUrl').value.trim();
    if (!url) {
        showError('Please enter a valid URL');
        return;
    }
    
    showLoading();
    
    try {
        const options = {
            url: url,
            includePerformance: document.getElementById('includePerformance').checked,
            format: document.getElementById('reportFormat').value
        };
        
        const result = await callAPI('/analyze', options);
        
        if (result.success) {
            displayResults(result);
        } else {
            showError(result.error || 'Analysis failed');
        }
    } catch (error) {
        showError(error.message);
    }
}

// Bulk analysis
async function analyzeBulk() {
    const urlsText = document.getElementById('bulkUrls').value.trim();
    if (!urlsText) {
        showError('Please enter at least one URL');
        return;
    }
    
    const urls = urlsText.split('\n').map(url => url.trim()).filter(url => url);
    if (urls.length === 0) {
        showError('Please enter at least one valid URL');
        return;
    }
    
    showLoading();
    
    try {
        const options = {
            urls: urls,
            includePerformance: document.getElementById('includePerformance').checked,
            format: document.getElementById('reportFormat').value
        };
        
        const result = await callAPI('/analyze-bulk', options);
        
        if (result.successful > 0) {
            // Display first successful result
            const firstSuccess = result.results.find(r => r.success);
            if (firstSuccess) {
                displayResults(firstSuccess);
                showSuccess(`Bulk analysis completed! ${result.successful}/${result.totalUrls} successful`);
            }
        } else {
            showError('All analyses failed. Please check your URLs and try again.');
        }
    } catch (error) {
        showError(error.message);
    }
}

// Crawl website
async function crawlWebsite() {
    const url = document.getElementById('crawlUrl').value.trim();
    const maxPages = parseInt(document.getElementById('maxPages').value) || 10;
    
    if (!url) {
        showError('Please enter a valid URL');
        return;
    }
    
    showLoading();
    
    try {
        const options = {
            url: url,
            maxPages: maxPages,
            includePerformance: document.getElementById('includePerformance').checked,
            format: document.getElementById('reportFormat').value
        };
        
        const result = await callAPI('/crawl-and-analyze', options);
        
        if (result.successful > 0) {
            // Display first successful result
            const firstSuccess = result.results.find(r => r.success);
            if (firstSuccess) {
                displayResults(firstSuccess);
                showSuccess(`Crawl analysis completed! ${result.successful}/${result.totalUrls} pages analyzed`);
            }
        } else {
            showError('Crawl analysis failed. Please check your URL and try again.');
        }
    } catch (error) {
        showError(error.message);
    }
}

// Health check on page load
async function checkServerHealth() {
    try {
        const response = await fetch('http://localhost:3000/health');
        if (response.ok) {
            console.log('✅ Server is running');
        } else {
            console.log('⚠️ Server health check failed');
        }
    } catch (error) {
        console.log('❌ Server is not running. Please start the server with: node src/index.js server');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check server health
    checkServerHealth();
    
    // Add enter key support for single URL input
    document.getElementById('singleUrl').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeSingle();
        }
    });
    
    // Add enter key support for crawl URL input
    document.getElementById('crawlUrl').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            crawlWebsite();
        }
    });
    
    // Pre-fill with example URL
    document.getElementById('singleUrl').value = 'https://rapidtakeoffsandestimating.com.au/';
}); 