/*
Description: Enhanced Technical SEO Audit API endpoint
Version: 2.0
Author: Ciaran Quinlan
Filename: pages/api/technical-enhanced.js
Dependencies: axios, cheerio, custom SEO utilities
*/

const axios = require('axios');
const cheerio = require('cheerio');
const { analyzeRobotsTxt } = require('../../utils/seo/robots-parser');
const { analyzeSitemap } = require('../../utils/seo/sitemap-parser');
const { analyzePerformance } = require('../../utils/seo/performance');
const { analyzeContent } = require('../../utils/seo/content');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Running enhanced technical audit for: ${url}`);

    const startTime = Date.now();

    try {
      const audit = await performEnhancedTechnicalAudit(url);
      const executionTime = Date.now() - startTime;

      return res.status(200).json({
        ...audit,
        metadata: {
          executionTime: executionTime,
          timestamp: new Date().toISOString(),
          version: '2.0'
        }
      });
    } catch (auditError) {
      console.error('Audit error:', auditError);
      return res.status(500).json({
        error: 'Audit failed',
        message: auditError.message,
        stack: process.env.NODE_ENV === 'development' ? auditError.stack : undefined
      });
    }
  } catch (error) {
    console.error('Request handling error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
}

async function performEnhancedTechnicalAudit(url) {
  try {
    console.log(`Fetching URL: ${url}`);

    // PHASE 1: Fetch HTML and basic parsing (fast, 1-3s)
    const fetchStart = Date.now();
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAgent/1.0)'
      },
      timeout: 10000,
      maxRedirects: 5
    });
    const loadTime = Date.now() - fetchStart;

    console.log(`Successfully fetched URL: ${url}, status: ${response.status}`);

    const $ = cheerio.load(response.data);

    // PHASE 2: Run parallel analyses (5-8s)
    console.log('Running parallel analyses...');

    const [
      robotsResult,
      onPageResult,
      performanceResult,
      contentResult
    ] = await Promise.all([
      // Crawling & Indexing
      analyzeRobotsTxt(url).catch(err => ({
        exists: false,
        error: err.message,
        issues: [`Failed to analyze robots.txt: ${err.message}`]
      })),

      // On-Page SEO (existing logic enhanced)
      analyzeOnPageSEO($, url, response),

      // Performance Analysis
      analyzePerformance(url, $).catch(err => ({
        error: err.message,
        issues: [`Failed to analyze performance: ${err.message}`]
      })),

      // Content Analysis
      Promise.resolve(analyzeContent($, url))
    ]);

    // PHASE 3: Sitemap (depends on robots.txt)
    console.log('Analyzing sitemap...');
    const sitemapResult = await analyzeSitemap(url, robotsResult.sitemaps || []).catch(err => ({
      exists: false,
      error: err.message,
      issues: [`Failed to analyze sitemap: ${err.message}`]
    }));

    // PHASE 4: Combine all results and calculate overall score
    const allIssues = [
      ...(robotsResult.issues || []).map(i => typeof i === 'string' ? {
        priority: 'medium',
        category: 'Crawling',
        issue: i,
        recommendation: ''
      } : i),
      ...(sitemapResult.issues || []).map(i => typeof i === 'string' ? {
        priority: 'medium',
        category: 'Sitemap',
        issue: i,
        recommendation: ''
      } : i),
      ...(onPageResult.issues || []),
      ...(performanceResult.issues || []),
      ...(contentResult.issues || [])
    ];

    const score = calculateOverallScore(allIssues, onPageResult, performanceResult, contentResult);

    console.log(`Enhanced technical audit complete for ${url}, score: ${score}`);

    return {
      url,
      score,
      status: 'success',
      data: {
        crawling: {
          robotsTxt: robotsResult,
          sitemap: sitemapResult,
          metaRobots: onPageResult.metaRobots,
          canonical: onPageResult.canonical
        },
        onPage: {
          title: onPageResult.title,
          metaDescription: onPageResult.metaDescription,
          headings: onPageResult.headings,
          images: onPageResult.images,
          links: onPageResult.links,
          structuredData: onPageResult.structuredData,
          openGraph: onPageResult.openGraph,
          twitterCard: onPageResult.twitterCard
        },
        performance: performanceResult,
        content: contentResult,
        technical: {
          https: url.startsWith('https://'),
          viewport: onPageResult.viewport,
          charset: onPageResult.charset,
          loadTime: loadTime,
          responseCode: response.status
        }
      },
      issues: prioritizeIssues(allIssues),
      summary: generateAuditSummary(score, allIssues)
    };

  } catch (error) {
    console.error(`Error in enhanced audit for ${url}:`, error.message);
    throw error;
  }
}

// Enhanced on-page SEO analysis
async function analyzeOnPageSEO($, url, response) {
  const issues = [];

  // Title
  const title = $('title').text().trim();
  const titleLength = title.length;
  const titleIssues = [];
  if (!title) {
    titleIssues.push('Missing title tag');
    issues.push({
      priority: 'critical',
      category: 'On-Page',
      issue: 'Missing title tag',
      recommendation: 'Add a unique, descriptive title tag (50-60 characters)'
    });
  } else if (titleLength < 30) {
    titleIssues.push('Title too short');
    issues.push({
      priority: 'high',
      category: 'On-Page',
      issue: `Title is only ${titleLength} characters`,
      recommendation: 'Expand title to 50-60 characters for optimal display'
    });
  } else if (titleLength > 60) {
    titleIssues.push('Title may be truncated in search results');
    issues.push({
      priority: 'medium',
      category: 'On-Page',
      issue: `Title is ${titleLength} characters (may be truncated)`,
      recommendation: 'Shorten title to 50-60 characters'
    });
  }

  // Meta Description
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const metaDescLength = metaDescription.length;
  const metaDescIssues = [];
  if (!metaDescription) {
    metaDescIssues.push('Missing meta description');
    issues.push({
      priority: 'high',
      category: 'On-Page',
      issue: 'Missing meta description',
      recommendation: 'Add compelling meta description (150-160 characters)'
    });
  } else if (metaDescLength < 120) {
    metaDescIssues.push('Meta description too short');
    issues.push({
      priority: 'medium',
      category: 'On-Page',
      issue: `Meta description is only ${metaDescLength} characters`,
      recommendation: 'Expand to 150-160 characters for better SERP display'
    });
  }

  // Meta Robots
  const metaRobots = $('meta[name="robots"]').attr('content') || '';
  const robotsDirectives = metaRobots.toLowerCase();
  const isIndexable = !robotsDirectives.includes('noindex');
  const isFollowable = !robotsDirectives.includes('nofollow');

  if (!isIndexable) {
    issues.push({
      priority: 'critical',
      category: 'Indexing',
      issue: 'Page is blocked from indexing (noindex)',
      recommendation: 'Remove noindex if page should be indexed by search engines'
    });
  }

  // Canonical
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  if (!canonical) {
    issues.push({
      priority: 'medium',
      category: 'On-Page',
      issue: 'Missing canonical tag',
      recommendation: 'Add canonical tag to specify preferred URL version'
    });
  }

  // Viewport
  const viewport = $('meta[name="viewport"]').attr('content') || '';
  if (!viewport) {
    issues.push({
      priority: 'critical',
      category: 'Mobile',
      issue: 'Missing viewport meta tag',
      recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">'
    });
  }

  // Charset
  const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content') || '';

  // Headings
  const h1Count = $('h1').length;
  const h2Count = $('h2').length;
  if (h1Count === 0) {
    issues.push({
      priority: 'high',
      category: 'Content Structure',
      issue: 'Missing H1 heading',
      recommendation: 'Add a single H1 heading describing the main topic'
    });
  } else if (h1Count > 1) {
    issues.push({
      priority: 'medium',
      category: 'Content Structure',
      issue: `Multiple H1 headings (${h1Count})`,
      recommendation: 'Use only one H1 heading per page'
    });
  }

  // Images
  const imgCount = $('img').length;
  const imgWithoutAlt = $('img').not('[alt]').length;
  if (imgWithoutAlt > 0) {
    issues.push({
      priority: 'high',
      category: 'Accessibility',
      issue: `${imgWithoutAlt} of ${imgCount} images missing alt text`,
      recommendation: 'Add descriptive alt text to all images'
    });
  }

  // Links
  const internalLinks = $('a[href^="/"], a[href^="' + url + '"]').length;
  const externalLinks = $('a[href^="http"]').not('[href^="' + url + '"]').length;

  // Structured Data
  const structuredDataCount = $('script[type="application/ld+json"]').length;
  if (structuredDataCount === 0) {
    issues.push({
      priority: 'medium',
      category: 'Structured Data',
      issue: 'No JSON-LD structured data found',
      recommendation: 'Implement schema.org structured data for rich snippets'
    });
  }

  // Open Graph
  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogDescription = $('meta[property="og:description"]').attr('content') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  if (!ogTitle || !ogDescription || !ogImage) {
    issues.push({
      priority: 'medium',
      category: 'Social Media',
      issue: 'Incomplete Open Graph tags',
      recommendation: 'Add og:title, og:description, og:image for social sharing'
    });
  }

  // Twitter Card
  const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';
  if (!twitterCard) {
    issues.push({
      priority: 'low',
      category: 'Social Media',
      issue: 'No Twitter Card tags',
      recommendation: 'Add Twitter Card meta tags for better Twitter sharing'
    });
  }

  return {
    title: { value: title, length: titleLength, issues: titleIssues },
    metaDescription: { value: metaDescription, length: metaDescLength, issues: metaDescIssues },
    metaRobots: { value: metaRobots, index: isIndexable, follow: isFollowable },
    canonical: { value: canonical, exists: !!canonical },
    viewport: { value: viewport, exists: !!viewport },
    charset: { value: charset, exists: !!charset },
    headings: { h1: h1Count, h2: h2Count },
    images: { total: imgCount, withoutAlt: imgWithoutAlt },
    links: { internal: internalLinks, external: externalLinks },
    structuredData: { count: structuredDataCount },
    openGraph: { title: ogTitle, description: ogDescription, image: ogImage },
    twitterCard: { card: twitterCard },
    issues
  };
}

function calculateOverallScore(allIssues, onPageResult, performanceResult, contentResult) {
  let score = 100;

  // Deduct points based on issue severity
  allIssues.forEach(issue => {
    switch (issue.priority) {
      case 'critical':
        score -= 15;
        break;
      case 'high':
        score -= 10;
        break;
      case 'medium':
        score -= 5;
        break;
      case 'low':
        score -= 2;
        break;
    }
  });

  return Math.max(0, Math.min(100, score));
}

function prioritizeIssues(issues) {
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return issues.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function generateAuditSummary(score, issues) {
  const criticalCount = issues.filter(i => i.priority === 'critical').length;
  const highCount = issues.filter(i => i.priority === 'high').length;

  if (score >= 90) {
    return `Excellent technical SEO (${score}/100). Minor optimizations available.`;
  } else if (score >= 75) {
    return `Good technical SEO (${score}/100). ${highCount + criticalCount} priority issues to address.`;
  } else if (score >= 60) {
    return `Moderate technical SEO (${score}/100). Focus on ${criticalCount} critical and ${highCount} high priority issues.`;
  } else {
    return `Poor technical SEO (${score}/100). Significant improvements needed - ${criticalCount + highCount} priority issues require immediate attention.`;
  }
}
