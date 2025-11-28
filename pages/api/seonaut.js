import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read the CSV file
    const filePath = path.join(process.cwd(), 'site-reports', 'SEONAUTwww.visory.com.au-issues 2025-11-28.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Parse CSV
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');

    const issues = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(',');
      if (values.length >= 3) {
        const url = values[0];
        const issueType = values[1];
        const priority = values[2].trim();

        // Categorize as page or resource
        const isResource = isResourceUrl(url);

        issues.push({
          url,
          issueType,
          priority,
          isResource,
          isPage: !isResource
        });
      }
    }

    // Separate pages from resources
    const pageIssues = issues.filter(i => i.isPage);
    const resourceIssues = issues.filter(i => i.isResource);

    // Group issues by priority
    const critical = issues.filter(i => i.priority === 'Critical');
    const alert = issues.filter(i => i.priority === 'Alert');
    const warning = issues.filter(i => i.priority === 'Warning');

    // Detailed issue type analysis
    const issueTypeCounts = {};
    issues.forEach(issue => {
      if (!issueTypeCounts[issue.issueType]) {
        issueTypeCounts[issue.issueType] = {
          count: 0,
          priority: issue.priority,
          urls: [],
          pageCount: 0,
          resourceCount: 0,
          samplePages: [],
          sampleResources: []
        };
      }
      const issueData = issueTypeCounts[issue.issueType];
      issueData.count++;

      if (issue.isPage) {
        issueData.pageCount++;
        if (issueData.samplePages.length < 10) {
          issueData.samplePages.push(issue.url);
        }
      } else {
        issueData.resourceCount++;
        if (issueData.sampleResources.length < 5) {
          issueData.sampleResources.push(issue.url);
        }
      }

      if (issueData.urls.length < 10) {
        issueData.urls.push(issue.url);
      }
    });

    // Sort issue types by count
    const sortedIssueTypes = Object.entries(issueTypeCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([type, data]) => ({
        type,
        count: data.count,
        priority: data.priority,
        pageCount: data.pageCount,
        resourceCount: data.resourceCount,
        samplePages: data.samplePages,
        sampleResources: data.sampleResources,
        sampleUrls: data.urls
      }));

    // Get unique pages with issues
    const uniquePages = new Set(pageIssues.map(i => i.url));
    const uniqueResources = new Set(resourceIssues.map(i => i.url));

    // Page-level issue breakdown
    const pageIssuesByUrl = {};
    pageIssues.forEach(issue => {
      if (!pageIssuesByUrl[issue.url]) {
        pageIssuesByUrl[issue.url] = {
          url: issue.url,
          issues: [],
          criticalCount: 0,
          alertCount: 0,
          warningCount: 0
        };
      }
      pageIssuesByUrl[issue.url].issues.push({
        type: issue.issueType,
        priority: issue.priority
      });
      if (issue.priority === 'Critical') pageIssuesByUrl[issue.url].criticalCount++;
      if (issue.priority === 'Alert') pageIssuesByUrl[issue.url].alertCount++;
      if (issue.priority === 'Warning') pageIssuesByUrl[issue.url].warningCount++;
    });

    // Sort pages by severity (critical first, then by total issues)
    const pagesWithMostIssues = Object.values(pageIssuesByUrl)
      .sort((a, b) => {
        if (b.criticalCount !== a.criticalCount) return b.criticalCount - a.criticalCount;
        if (b.alertCount !== a.alertCount) return b.alertCount - a.alertCount;
        return b.issues.length - a.issues.length;
      })
      .slice(0, 20);

    // Generate top 3 actions based on comprehensive analysis
    const actions = generateTopActions(critical, alert, sortedIssueTypes, pageIssues, resourceIssues);

    // Generate comprehensive summary
    const summary = {
      totalIssues: issues.length,
      criticalCount: critical.length,
      alertCount: alert.length,
      warningCount: warning.length,
      pageIssuesCount: pageIssues.length,
      resourceIssuesCount: resourceIssues.length,
      uniquePages: uniquePages.size,
      uniqueResources: uniqueResources.size,
      issueTypes: sortedIssueTypes,
      topActions: actions,
      criticalIssues: critical,
      alertIssues: alert,
      pagesWithMostIssues,
      topIssuesByType: sortedIssueTypes,
      reportDate: '2025-11-28',
      domain: 'visory.com.au'
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error('Error analyzing SEONaut report:', error);
    res.status(500).json({ error: 'Failed to analyze SEONaut report', details: error.message });
  }
}

function isResourceUrl(url) {
  // Check if URL is a static resource (image, CSS, JS, font, etc.)
  const resourceExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico',
    '.css', '.js',
    '.woff', '.woff2', '.ttf', '.eot',
    '.pdf', '.zip', '.xml', '.json'
  ];

  const lowerUrl = url.toLowerCase();
  return resourceExtensions.some(ext => lowerUrl.includes(ext)) ||
         lowerUrl.includes('/wp-content/uploads/') ||
         lowerUrl.includes('/wp-content/cache/') ||
         lowerUrl.includes('fw-cdn.com');
}

function generateTopActions(critical, alert, sortedIssueTypes, pageIssues, resourceIssues) {
  const actions = [];

  // Low-priority issues to skip in top 3 actions
  const lowPriorityIssues = [
    'URLs returning status code 30x',  // Trailing slash redirects
    'URLs with underscore characters', // Not a real issue
    'Pages with external follow links', // Usually desired behavior
    'Pages with too many Links'        // Rarely a concern
  ];

  // Prioritize page-level critical issues (but skip low-priority ones)
  const criticalPageIssues = critical.filter(i => i.isPage && !lowPriorityIssues.includes(i.issueType));
  const criticalTypes = {};
  criticalPageIssues.forEach(issue => {
    criticalTypes[issue.issueType] = (criticalTypes[issue.issueType] || 0) + 1;
  });

  if (Object.keys(criticalTypes).length > 0) {
    const topCritical = Object.entries(criticalTypes)
      .sort((a, b) => b[1] - a[1])[0];

    actions.push({
      priority: 'Critical',
      title: `Fix ${topCritical[0]}`,
      description: `${topCritical[1]} page(s) affected. ${getActionRecommendation(topCritical[0])}`,
      affectedUrls: topCritical[1],
      category: 'Technical',
      impact: 'Critical'
    });
  }

  // Find high-impact page-level issues (exclude low-priority ones)
  const pageOnlyIssues = sortedIssueTypes.filter(issue =>
    issue.pageCount > 0 &&
    !lowPriorityIssues.includes(issue.type) &&
    !actions.find(a => a.title.includes(issue.type))
  );

  // Prioritize truly impactful issues
  const highImpactIssues = pageOnlyIssues.filter(issue =>
    issue.type.includes('alt attribute') ||
    issue.type.includes('H1 heading') ||
    issue.type.includes('viewport') ||
    issue.type.includes('meta description') ||
    issue.type.includes('Slow Time to First Byte') ||
    issue.type.includes('Large images') ||
    issue.type.includes('headings order') ||
    issue.type.includes('duplicated IDs')
  );

  // Add high-impact issues first
  if (highImpactIssues.length > 0 && actions.length < 3) {
    const topImpact = highImpactIssues[0];
    actions.push({
      priority: topImpact.priority,
      title: `Resolve ${topImpact.type}`,
      description: `${topImpact.pageCount} page(s) affected. ${getActionRecommendation(topImpact.type)}`,
      affectedUrls: topImpact.pageCount,
      category: getIssueCategory(topImpact.type),
      impact: calculateImpact(topImpact)
    });
  }

  // Add second high-impact issue if available
  if (highImpactIssues.length > 1 && actions.length < 3) {
    const secondImpact = highImpactIssues[1];
    actions.push({
      priority: secondImpact.priority,
      title: `Address ${secondImpact.type}`,
      description: `${secondImpact.pageCount} page(s) affected. ${getActionRecommendation(secondImpact.type)}`,
      affectedUrls: secondImpact.pageCount,
      category: getIssueCategory(secondImpact.type),
      impact: calculateImpact(secondImpact)
    });
  }

  // If still need more actions, use any remaining page issues
  if (actions.length < 3 && pageOnlyIssues.length > 0) {
    for (let issue of pageOnlyIssues) {
      if (!actions.find(a => a.title.includes(issue.type))) {
        actions.push({
          priority: issue.priority,
          title: `Consider ${issue.type}`,
          description: `${issue.pageCount} page(s) affected. ${getActionRecommendation(issue.type)}`,
          affectedUrls: issue.pageCount,
          category: getIssueCategory(issue.type),
          impact: calculateImpact(issue)
        });
        if (actions.length >= 3) break;
      }
    }
  }

  return actions;
}

function calculateImpact(issue) {
  if (issue.priority === 'Critical') return 'Critical';
  if (issue.priority === 'Alert' && issue.pageCount > 20) return 'High';
  if (issue.pageCount > 50) return 'High';
  if (issue.pageCount > 10) return 'Medium';
  return 'Low';
}

function getActionRecommendation(issueType) {
  const recommendations = {
    'URLs returning status code 30x': 'Low priority - Likely trailing slash redirects (e.g., /page → /page/). This is standard behavior and not a major concern unless causing redirect chains. Consider updating internal links to match the canonical format for minor performance gains.',
    'Timeout': 'High priority - Server timeout issues detected. Investigate and resolve server performance problems, optimize database queries, and consider implementing caching or CDN.',
    'Pages with short title': 'Moderate priority - Expand title tags to 50-60 characters for better keyword inclusion and SERP display.',
    'Pages with long title': 'Low-moderate priority - Reduce title tags to under 60 characters to prevent truncation in search results.',
    'Pages with missing meta description': 'Moderate priority - Add unique, compelling meta descriptions (150-160 characters) to improve click-through rates from search results.',
    'Pages with short meta description': 'Low priority - Expand meta descriptions to 150-160 characters for better search result display and CTR.',
    'Pages with long meta description': 'Low priority - Reduce meta descriptions to under 160 characters to avoid truncation.',
    'Pages containing images with no alt attribute': 'High priority - Add descriptive alt text to all images for accessibility compliance and SEO. This is both an accessibility requirement and ranking factor.',
    'Missing HSTS header': 'Low-moderate priority (infrastructure) - Implement HTTP Strict Transport Security header at server level. This is a server configuration affecting all resources, not individual pages.',
    'Missing content type options': 'Low priority (infrastructure) - Add X-Content-Type-Options: nosniff header to server configuration for security best practices.',
    'Missing content security policy': 'Moderate priority (security) - Implement Content Security Policy header to protect against XSS attacks. Requires careful testing.',
    'Pages containing images missing size attributes': 'Moderate-high priority - Add width and height attributes to images to prevent layout shifts and improve Core Web Vitals (CLS score).',
    'Pages without valid headings order': 'Moderate priority - Ensure proper heading hierarchy (H1 → H2 → H3) for accessibility and SEO. Important for screen readers and content structure.',
    'Pages with external follow links': 'Low priority - Review case-by-case. Most external links should be followed; only add rel="nofollow" for untrusted content or paid links.',
    'URLs with underscore characters': 'Very low priority - Modern search engines handle underscores fine. Consider hyphens for new URLs, but no need to change existing ones.',
    'Pages with too many Links': 'Low priority - Review pages with excessive links. Consider whether all links add value to users. This is rarely a major issue unless extreme (500+ links).',
    'Slow Time to First Byte': 'High priority - Optimize server response time through caching, database optimization, PHP/WordPress optimization, and hosting improvements. Affects user experience and rankings.',
    'Pages containing elements with duplicated IDs': 'Moderate priority - Fix duplicate ID attributes to ensure valid HTML and proper JavaScript/CSS functionality. Can cause technical issues.',
    'Pages with external links to redirect URLs': 'Low priority - Update external links to point directly to final destinations where possible.',
    'Large images': 'High priority - Compress and optimize images to improve page load speed and Core Web Vitals. Use modern formats like WebP.',
    'Pages missing the viewport meta tag': 'High priority - Add <meta name="viewport" content="width=device-width, initial-scale=1"> for proper mobile display. Critical for mobile-first indexing.',
    'Pages missing the H1 heading': 'High priority - Add a descriptive, unique H1 heading to each page for SEO and content structure. H1 is a strong ranking signal.',
    'Non indexable pages': 'Varies - Review each case. Ensure important pages are indexable. Some pages (like admin, thank-you pages) should be noindex.',
    'Pages with broken external links': 'Moderate priority - Remove or replace broken external links to maintain site quality and user experience.',
    'URLs with incorrect media type': 'Low-moderate priority - Ensure resources are served with correct Content-Type headers for proper browser handling.',
    'HTML documents with an excessive DOM size': 'Moderate priority - Simplify page structure to improve rendering performance. Target under 1500 DOM nodes where possible.',
    'Orphan pages': 'Moderate-high priority - Add internal links to orphan pages to improve crawlability and user navigation. Pages with no internal links may not be indexed.',
    'Hreflang values with relative URLs': 'Moderate priority - Use absolute URLs in hreflang tags for proper international SEO implementation.'
  };

  return recommendations[issueType] || 'Review and resolve this issue to improve site quality.';
}

function getIssueCategory(issueType) {
  if (issueType.includes('HSTS') || issueType.includes('security') || issueType.includes('content type')) {
    return 'Security';
  }
  if (issueType.includes('Time to First Byte') || issueType.includes('images') || issueType.includes('DOM size')) {
    return 'Performance';
  }
  if (issueType.includes('title') || issueType.includes('meta description') || issueType.includes('alt attribute') || issueType.includes('heading')) {
    return 'Content';
  }
  if (issueType.includes('redirect') || issueType.includes('status code') || issueType.includes('links')) {
    return 'Technical';
  }
  return 'General';
}
