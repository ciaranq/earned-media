/*
Description: XML Sitemap parser and analyzer for SEO audits
Version: 1.0
Author: Ciaran Quinlan
Filename: utils/seo/sitemap-parser.js
Dependencies: xml2js, axios
*/

const xml2js = require('xml2js');
const axios = require('axios');

/**
 * Detect and analyze XML sitemap for a given URL
 * @param {string} url - The website URL to check
 * @param {Array<string>} robotsSitemaps - Sitemap URLs from robots.txt
 * @returns {Promise<Object>} Sitemap analysis results
 */
async function analyzeSitemap(url, robotsSitemaps = []) {
  try {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

    // Common sitemap locations to try
    const commonPaths = [
      '/sitemap.xml',
      '/sitemap_index.xml',
      '/sitemap1.xml',
      '/sitemaps/sitemap.xml'
    ];

    // Start with sitemaps from robots.txt, then try common locations
    const sitemapsToTry = [
      ...robotsSitemaps,
      ...commonPaths.map(path => `${baseUrl}${path}`)
    ];

    // Remove duplicates
    const uniqueSitemaps = [...new Set(sitemapsToTry)];

    for (const sitemapUrl of uniqueSitemaps) {
      console.log(`Checking sitemap at: ${sitemapUrl}`);

      try {
        const result = await fetchAndParseSitemap(sitemapUrl);
        if (result.exists) {
          return result;
        }
      } catch (error) {
        console.log(`Sitemap not found at ${sitemapUrl}`);
        continue;
      }
    }

    return {
      exists: false,
      location: null,
      urls: [],
      count: 0,
      issues: ['No sitemap.xml found - create one to improve crawlability']
    };

  } catch (error) {
    console.error('Error analyzing sitemap:', error.message);
    return {
      exists: false,
      location: null,
      urls: [],
      count: 0,
      issues: [`Error detecting sitemap: ${error.message}`],
      error: error.message
    };
  }
}

/**
 * Fetch and parse a specific sitemap URL
 * @param {string} sitemapUrl - The sitemap URL to fetch
 * @returns {Promise<Object>} Parsed sitemap data
 */
async function fetchAndParseSitemap(sitemapUrl) {
  const response = await axios.get(sitemapUrl, {
    timeout: 8000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SEOAgent/1.0)'
    },
    validateStatus: (status) => status === 200
  });

  if (response.status !== 200) {
    return { exists: false };
  }

  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(response.data);

  // Check if it's a sitemap index or regular sitemap
  const isSitemapIndex = result.sitemapindex !== undefined;
  const urls = [];
  let childSitemaps = [];

  if (isSitemapIndex) {
    // It's a sitemap index
    childSitemaps = result.sitemapindex.sitemap.map(s => s.loc[0]);
  } else if (result.urlset && result.urlset.url) {
    // It's a regular sitemap
    for (const urlEntry of result.urlset.url) {
      if (urlEntry.loc && urlEntry.loc[0]) {
        urls.push({
          loc: urlEntry.loc[0],
          lastmod: urlEntry.lastmod ? urlEntry.lastmod[0] : null,
          priority: urlEntry.priority ? parseFloat(urlEntry.priority[0]) : null,
          changefreq: urlEntry.changefreq ? urlEntry.changefreq[0] : null
        });
      }
    }
  }

  const issues = analyzeSitemapIssues(urls, isSitemapIndex, response.data.length);

  return {
    exists: true,
    location: sitemapUrl,
    isSitemapIndex: isSitemapIndex,
    childSitemaps: childSitemaps,
    urls: urls.slice(0, 10), // Return first 10 URLs for sample
    count: urls.length,
    totalSize: response.data.length,
    issues: issues
  };
}

/**
 * Analyze sitemap for common issues
 * @param {Array} urls - Array of URLs from sitemap
 * @param {boolean} isSitemapIndex - Whether this is a sitemap index
 * @param {number} fileSize - Size of sitemap file
 * @returns {Array<string>} Array of issues found
 */
function analyzeSitemapIssues(urls, isSitemapIndex, fileSize) {
  const issues = [];

  if (!isSitemapIndex) {
    // Check URL count (max 50,000 per sitemap)
    if (urls.length > 50000) {
      issues.push('Sitemap contains more than 50,000 URLs - split into multiple sitemaps');
    }

    // Check file size (max 50MB uncompressed)
    if (fileSize > 50 * 1024 * 1024) {
      issues.push('Sitemap file exceeds 50MB - compress or split into multiple files');
    }

    // Check for missing lastmod dates
    const urlsWithoutLastmod = urls.filter(u => !u.lastmod).length;
    if (urlsWithoutLastmod > urls.length * 0.5) {
      issues.push('More than 50% of URLs missing lastmod dates - add modification dates');
    }

    // Check for missing priorities
    const urlsWithoutPriority = urls.filter(u => !u.priority).length;
    if (urlsWithoutPriority === urls.length && urls.length > 0) {
      issues.push('No priority values set - consider adding priorities to guide crawlers');
    }
  }

  return issues;
}

module.exports = {
  analyzeSitemap
};
