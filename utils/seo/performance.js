/*
Description: Performance analyzer for SEO audits (without PageSpeed API)
Version: 1.0
Author: Ciaran Quinlan
Filename: utils/seo/performance.js
Dependencies: axios, cheerio
*/

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Analyze page performance metrics
 * @param {string} url - The website URL to analyze
 * @param {object} $ - Cheerio instance (optional, will fetch if not provided)
 * @returns {Promise<Object>} Performance analysis results
 */
async function analyzePerformance(url, $ = null) {
  try {
    let htmlContent;
    let loadTime;
    let htmlSize;

    // Fetch page if not already loaded
    if (!$) {
      const startTime = Date.now();
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEOAgent/1.0)'
        }
      });
      loadTime = Date.now() - startTime;
      htmlContent = response.data;
      htmlSize = Buffer.byteLength(htmlContent, 'utf8');
      $ = cheerio.load(htmlContent);
    } else {
      // Estimate from existing cheerio instance
      htmlContent = $.html();
      htmlSize = Buffer.byteLength(htmlContent, 'utf8');
      loadTime = null; // Unknown if already loaded
    }

    // Count resources
    const resources = {
      totalScripts: $('script').length,
      externalScripts: $('script[src]').length,
      inlineScripts: $('script').not('[src]').length,

      totalStylesheets: $('link[rel="stylesheet"]').length,
      inlineStyles: $('style').length,

      totalImages: $('img').length,
      imagesWithoutSrc: $('img').not('[src]').length,

      totalLinks: $('a').length,
      externalLinks: 0, // Will calculate below

      totalFonts: $('link[rel="preload"][as="font"]').length +
                  $('link[href*=".woff"]').length +
                  $('link[href*=".woff2"]').length,

      iframes: $('iframe').length,
      videos: $('video').length
    };

    // Count external vs internal links
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && href.startsWith('http') && !href.includes(domain)) {
        resources.externalLinks++;
      }
    });

    // Calculate resource sizes (estimated)
    let estimatedScriptSize = 0;
    $('script').each((i, elem) => {
      const scriptContent = $(elem).html();
      if (scriptContent) {
        estimatedScriptSize += Buffer.byteLength(scriptContent, 'utf8');
      }
    });

    let estimatedStyleSize = 0;
    $('style').each((i, elem) => {
      const styleContent = $(elem).html();
      if (styleContent) {
        estimatedStyleSize += Buffer.byteLength(styleContent, 'utf8');
      }
    });

    // Check for performance best practices
    const checks = analyzePerformanceBestPractices($, resources);

    // Calculate content-to-code ratio
    const textContent = $('body').text().trim();
    const textSize = Buffer.byteLength(textContent, 'utf8');
    const contentToCodeRatio = ((textSize / htmlSize) * 100).toFixed(2);

    // Analyze images for optimization
    const imageAnalysis = analyzeImages($);

    const issues = [];

    // Performance issues
    if (loadTime && loadTime > 3000) {
      issues.push({
        priority: 'high',
        category: 'Performance',
        issue: `Page load time is ${loadTime}ms (target: <3000ms)`,
        recommendation: 'Optimize server response time, enable caching, use a CDN'
      });
    }

    if (htmlSize > 200000) {
      issues.push({
        priority: 'medium',
        category: 'Performance',
        issue: `HTML size is ${(htmlSize / 1024).toFixed(2)}KB (recommended: <200KB)`,
        recommendation: 'Minify HTML, remove unnecessary whitespace and comments'
      });
    }

    if (resources.totalScripts > 20) {
      issues.push({
        priority: 'medium',
        category: 'Performance',
        issue: `${resources.totalScripts} script tags found (recommended: <20)`,
        recommendation: 'Combine and minify JavaScript files, use async/defer attributes'
      });
    }

    if (resources.totalImages > 50) {
      issues.push({
        priority: 'low',
        category: 'Performance',
        issue: `${resources.totalImages} images on page (recommended: <50)`,
        recommendation: 'Use lazy loading for images, optimize image sizes'
      });
    }

    if (!checks.hasAsyncOrDefer) {
      issues.push({
        priority: 'medium',
        category: 'Performance',
        issue: 'Scripts not using async or defer attributes',
        recommendation: 'Add async/defer to script tags to prevent render blocking'
      });
    }

    return {
      loadTime: loadTime,
      sizes: {
        html: htmlSize,
        htmlKB: (htmlSize / 1024).toFixed(2),
        estimatedScripts: estimatedScriptSize,
        estimatedScriptsKB: (estimatedScriptSize / 1024).toFixed(2),
        estimatedStyles: estimatedStyleSize,
        estimatedStylesKB: (estimatedStyleSize / 1024).toFixed(2)
      },
      resources: resources,
      metrics: {
        contentToCodeRatio: parseFloat(contentToCodeRatio),
        hasAsyncScripts: checks.hasAsyncOrDefer,
        hasCriticalCSS: checks.hasCriticalCSS,
        hasPreload: checks.hasPreload,
        hasPreconnect: checks.hasPreconnect
      },
      images: imageAnalysis,
      issues: issues,
      summary: generatePerformanceSummary(loadTime, htmlSize, resources, issues)
    };

  } catch (error) {
    console.error('Error analyzing performance:', error.message);
    return {
      loadTime: null,
      sizes: {},
      resources: {},
      metrics: {},
      images: {},
      issues: [{
        priority: 'high',
        category: 'Performance',
        issue: `Failed to analyze performance: ${error.message}`,
        recommendation: 'Check if the URL is accessible'
      }],
      error: error.message
    };
  }
}

/**
 * Analyze performance best practices
 * @param {object} $ - Cheerio instance
 * @param {object} resources - Resource counts
 * @returns {object} Best practice checks
 */
function analyzePerformanceBestPractices($, resources) {
  return {
    hasAsyncOrDefer: $('script[async], script[defer]').length > 0,
    hasCriticalCSS: $('style').length > 0, // Inline styles can be critical CSS
    hasPreload: $('link[rel="preload"]').length > 0,
    hasPreconnect: $('link[rel="preconnect"], link[rel="dns-prefetch"]').length > 0,
    hasCompression: false, // Can't detect without headers
    hasHTTP2: false // Can't detect without protocol inspection
  };
}

/**
 * Analyze images for optimization opportunities
 * @param {object} $ - Cheerio instance
 * @returns {object} Image analysis
 */
function analyzeImages($) {
  const images = [];
  let withoutAlt = 0;
  let withoutDimensions = 0;
  let lazyLoaded = 0;

  $('img').each((i, elem) => {
    const $img = $(elem);
    const src = $img.attr('src');
    const alt = $img.attr('alt');
    const width = $img.attr('width');
    const height = $img.attr('height');
    const loading = $img.attr('loading');

    if (!alt || alt.trim() === '') {
      withoutAlt++;
    }

    if (!width || !height) {
      withoutDimensions++;
    }

    if (loading === 'lazy') {
      lazyLoaded++;
    }

    if (i < 5) { // Sample first 5 images
      images.push({
        src: src ? src.substring(0, 100) : 'missing',
        hasAlt: !!alt,
        hasDimensions: !!(width && height),
        isLazyLoaded: loading === 'lazy'
      });
    }
  });

  return {
    total: $('img').length,
    withoutAlt: withoutAlt,
    withoutDimensions: withoutDimensions,
    lazyLoaded: lazyLoaded,
    sample: images
  };
}

/**
 * Generate performance summary
 * @param {number} loadTime - Page load time
 * @param {number} htmlSize - HTML size in bytes
 * @param {object} resources - Resource counts
 * @param {Array} issues - Performance issues
 * @returns {string} Summary text
 */
function generatePerformanceSummary(loadTime, htmlSize, resources, issues) {
  const criticalIssues = issues.filter(i => i.priority === 'high' || i.priority === 'critical').length;

  if (criticalIssues > 0) {
    return `Performance needs improvement: ${criticalIssues} critical issues detected. Focus on reducing page load time and resource counts.`;
  }

  if (loadTime && loadTime < 2000 && htmlSize < 150000) {
    return `Good performance: Page loads quickly with reasonable resource usage.`;
  }

  return `Moderate performance: Some optimization opportunities available to improve load times.`;
}

module.exports = {
  analyzePerformance
};
