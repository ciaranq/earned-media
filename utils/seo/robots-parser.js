/*
Description: Robots.txt parser and analyzer for SEO audits
Version: 1.0
Author: Ciaran Quinlan
Filename: utils/seo/robots-parser.js
Dependencies: robots-parser, axios
*/

const robotsParser = require('robots-parser');
const axios = require('axios');

/**
 * Fetch and parse robots.txt for a given URL
 * @param {string} url - The website URL to check
 * @returns {Promise<Object>} Robots.txt analysis results
 */
async function analyzeRobotsTxt(url) {
  try {
    const urlObj = new URL(url);
    const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;

    console.log(`Fetching robots.txt from: ${robotsUrl}`);

    const response = await axios.get(robotsUrl, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAgent/1.0)'
      },
      validateStatus: (status) => status < 500 // Accept 404 as valid response
    });

    if (response.status === 404) {
      return {
        exists: false,
        allows: true, // No robots.txt means everything is allowed
        content: null,
        sitemaps: [],
        issues: ['No robots.txt file found - consider adding one for better crawler control']
      };
    }

    const robotsTxtContent = response.data;
    const robots = robotsParser(robotsUrl, robotsTxtContent);

    // Check if our user agent is allowed to crawl the page
    const isAllowed = robots.isAllowed(url, 'SEOAgent');

    // Extract sitemap locations from robots.txt
    const sitemaps = extractSitemaps(robotsTxtContent);

    // Analyze for common issues
    const issues = analyzeRobotsIssues(robotsTxtContent, isAllowed);

    return {
      exists: true,
      allows: isAllowed,
      content: robotsTxtContent,
      sitemaps: sitemaps,
      issues: issues,
      size: robotsTxtContent.length
    };

  } catch (error) {
    console.error('Error analyzing robots.txt:', error.message);

    if (error.code === 'ECONNABORTED') {
      return {
        exists: false,
        allows: true,
        content: null,
        sitemaps: [],
        issues: ['Timeout fetching robots.txt'],
        error: 'Timeout'
      };
    }

    return {
      exists: false,
      allows: true,
      content: null,
      sitemaps: [],
      issues: [`Error fetching robots.txt: ${error.message}`],
      error: error.message
    };
  }
}

/**
 * Extract sitemap URLs from robots.txt content
 * @param {string} content - Robots.txt content
 * @returns {Array<string>} Array of sitemap URLs
 */
function extractSitemaps(content) {
  const sitemaps = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith('sitemap:')) {
      const sitemapUrl = trimmed.substring(8).trim();
      if (sitemapUrl) {
        sitemaps.push(sitemapUrl);
      }
    }
  }

  return sitemaps;
}

/**
 * Analyze robots.txt for common issues
 * @param {string} content - Robots.txt content
 * @param {boolean} isAllowed - Whether crawling is allowed
 * @returns {Array<string>} Array of issues found
 */
function analyzeRobotsIssues(content, isAllowed) {
  const issues = [];

  if (!isAllowed) {
    issues.push('Website blocks crawlers via robots.txt - this may impact SEO');
  }

  // Check for disallow all
  if (content.includes('Disallow: /') && !content.includes('Allow:')) {
    issues.push('Robots.txt blocks all pages - this will prevent indexing');
  }

  // Check for sitemap directive
  if (!content.toLowerCase().includes('sitemap:')) {
    issues.push('No sitemap declared in robots.txt - add sitemap location for better indexing');
  }

  // Check file size
  if (content.length > 500000) {
    issues.push('Robots.txt file is very large (>500KB) - this may slow down crawlers');
  }

  return issues;
}

module.exports = {
  analyzeRobotsTxt
};
