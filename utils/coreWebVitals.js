/**
 * Core Web Vitals Analysis Utility
 * Analyzes performance metrics including LCP, FID, and CLS
 */

const SEO_THRESHOLDS = require('./seoThresholds');

/**
 * Analyze Largest Contentful Paint (LCP)
 * Measures when the largest visible element is painted
 * @param {number} loadTime - Page load time in milliseconds
 * @returns {object} - { value, status, issues }
 */
function analyzeLCP(loadTime) {
  const { maxLCP } = SEO_THRESHOLDS.performance;
  const lcp = Math.min(loadTime, maxLCP + 1000); // Estimate based on load time

  let status = 'good';
  let issues = [];

  if (lcp > 4000) {
    status = 'poor';
    issues.push({
      severity: 'high',
      message: `LCP is ${lcp}ms (target: <2500ms)`,
      recommendation: 'Optimize server response time, lazy load images, minify CSS/JavaScript'
    });
  } else if (lcp > maxLCP) {
    status = 'needs-improvement';
    issues.push({
      severity: 'medium',
      message: `LCP is ${lcp}ms (target: <2500ms)`,
      recommendation: 'Consider optimizing server response time and resource loading'
    });
  }

  return { value: lcp, status, issues };
}

/**
 * Analyze First Input Delay (FID)
 * Measures responsiveness to user interactions
 * @param {number} resourceCount - Number of JavaScript resources
 * @returns {object} - { estimatedValue, status, issues }
 */
function analyzeFID(resourceCount) {
  const { maxFID } = SEO_THRESHOLDS.performance;
  // Estimate FID based on resource count and size
  const estimatedFID = Math.min(100 + (resourceCount * 10), 300);

  let status = 'good';
  let issues = [];

  if (estimatedFID > 300) {
    status = 'poor';
    issues.push({
      severity: 'high',
      message: `Estimated FID may be ${estimatedFID}ms (target: <100ms)`,
      recommendation: 'Reduce JavaScript execution time, use code splitting, consider Web Workers'
    });
  } else if (estimatedFID > maxFID) {
    status = 'needs-improvement';
    issues.push({
      severity: 'medium',
      message: `Estimated FID around ${estimatedFID}ms (target: <100ms)`,
      recommendation: 'Optimize JavaScript processing and defer non-critical tasks'
    });
  }

  return { estimatedValue: estimatedFID, status, issues };
}

/**
 * Analyze Cumulative Layout Shift (CLS)
 * Measures visual stability of the page
 * @param {object} pageData - Parsed page data
 * @returns {object} - { estimatedValue, status, issues }
 */
function analyzeCLS(pageData) {
  const { maxCLS } = SEO_THRESHOLDS.performance;
  const issues = [];
  let estimatedScore = 0; // CLS is 0-1 scale

  // Check for images without dimensions (common cause of layout shift)
  if (pageData.imagesWithoutDimensions > 0) {
    estimatedScore += Math.min(0.3, pageData.imagesWithoutDimensions * 0.05);
    issues.push({
      severity: 'medium',
      message: `${pageData.imagesWithoutDimensions} images missing width/height attributes`,
      recommendation: 'Add width and height attributes to all img tags to prevent layout shift'
    });
  }

  // Check for ads/embeds without reserved space
  if (pageData.adsCount > 0) {
    estimatedScore += Math.min(0.2, pageData.adsCount * 0.1);
    issues.push({
      severity: 'medium',
      message: `${pageData.adsCount} ads/embeds detected without reserved space`,
      recommendation: 'Reserve space for ads and embed content with container aspect ratios'
    });
  }

  // Check for dynamically injected content
  if (pageData.dynamicContent) {
    estimatedScore = Math.max(estimatedScore, 0.15);
    issues.push({
      severity: 'low',
      message: 'Dynamically injected content detected',
      recommendation: 'Minimize layout shifts from dynamic content by reserving space upfront'
    });
  }

  let status = 'good';
  if (estimatedScore > maxCLS) {
    status = estimatedScore > 0.25 ? 'poor' : 'needs-improvement';
  }

  return { estimatedValue: estimatedScore, status, issues };
}

/**
 * Get Core Web Vitals assessment
 * @param {object} pageMetrics - Page performance metrics
 * @returns {object} - Complete Core Web Vitals assessment
 */
function assessCoreWebVitals(pageMetrics = {}) {
  const {
    loadTime = 3000,
    resourceCount = 0,
    imagesWithoutDimensions = 0,
    adsCount = 0,
    dynamicContent = false,
  } = pageMetrics;

  const lcp = analyzeLCP(loadTime);
  const fid = analyzeFID(resourceCount);
  const cls = analyzeCLS({
    imagesWithoutDimensions,
    adsCount,
    dynamicContent,
  });

  // Determine overall status
  let overallStatus = 'good';
  const statusPriority = { poor: 0, 'needs-improvement': 1, good: 2 };
  const lowestStatus = Math.min(
    statusPriority[lcp.status] || 2,
    statusPriority[fid.status] || 2,
    statusPriority[cls.status] || 2
  );

  for (const [key, value] of Object.entries(statusPriority)) {
    if (value === lowestStatus) {
      overallStatus = key;
      break;
    }
  }

  const allIssues = [...lcp.issues, ...fid.issues, ...cls.issues];

  return {
    status: overallStatus,
    metrics: {
      lcp,
      fid,
      cls,
    },
    issues: allIssues,
    recommendations: generateRecommendations(allIssues),
    passedAllTests: allIssues.length === 0,
  };
}

/**
 * Generate prioritized recommendations
 * @param {array} issues - Array of Core Web Vitals issues
 * @returns {array} - Prioritized recommendations
 */
function generateRecommendations(issues) {
  const recommendations = [];

  // Organize by impact
  const critical = issues.filter(i => i.severity === 'critical' || i.severity === 'high');
  const medium = issues.filter(i => i.severity === 'medium');
  const low = issues.filter(i => i.severity === 'low');

  [...critical, ...medium, ...low].forEach(issue => {
    if (!recommendations.includes(issue.recommendation)) {
      recommendations.push(issue.recommendation);
    }
  });

  return recommendations;
}

module.exports = {
  analyzeLCP,
  analyzeFID,
  analyzeCLS,
  assessCoreWebVitals,
  generateRecommendations,
};
