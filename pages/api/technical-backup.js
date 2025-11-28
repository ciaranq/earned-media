// API endpoint for Technical SEO Audit
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Running technical audit for: ${url}`);

    try {
      const audit = await performTechnicalAudit(url);
      return res.status(200).json(audit);
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

async function performTechnicalAudit(url) {
  const axios = require('axios');
  const cheerio = require('cheerio');

  try {
    console.log(`Fetching URL: ${url}`);

    const startTime = Date.now();
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAgent/1.0)'
      },
      timeout: 10000,
      maxRedirects: 5
    });
    const loadTime = Date.now() - startTime;

    console.log(`Successfully fetched URL: ${url}, status: ${response.status}`);

    const $ = cheerio.load(response.data);
    const issues = [];
    let score = 100;

    // Extract basic elements
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    const robots = $('meta[name="robots"]').attr('content') || '';
    const viewport = $('meta[name="viewport"]').attr('content') || '';
    const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content') || '';

    // Structured Data
    const structuredDataCount = $('script[type="application/ld+json"]').length;

    // Open Graph
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDescription = $('meta[property="og:description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';

    // Twitter Card
    const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';
    const twitterTitle = $('meta[name="twitter:title"]').attr('content') || '';

    // Headings
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const headingStructure = analyzeHeadingStructure($);

    // Images
    const images = $('img');
    const imgCount = images.length;
    const imgWithoutAlt = $('img:not([alt])').length;
    const imgWithoutSrc = $('img:not([src])').length;

    // Links
    const internalLinks = $('a[href^="/"], a[href^="' + url + '"]').length;
    const externalLinks = $('a[href^="http"]').not('[href^="' + url + '"]').length;
    const brokenHrefLinks = $('a[href="#"], a[href=""], a:not([href])').length;

    // Performance indicators
    const totalScripts = $('script').length;
    const externalScripts = $('script[src]').length;
    const inlineScripts = totalScripts - externalScripts;
    const stylesheets = $('link[rel="stylesheet"]').length;
    const inlineStyles = $('style').length;

    // Content
    const wordCount = $('body').text().trim().split(/\s+/).length;

    // Response headers check
    const contentType = response.headers['content-type'] || '';
    const serverHeader = response.headers['server'] || '';
    const cacheControl = response.headers['cache-control'] || '';
    const xFrameOptions = response.headers['x-frame-options'] || '';
    const contentSecurityPolicy = response.headers['content-security-policy'] || '';

    // HTTPS Check
    if (!url.startsWith('https://')) {
      issues.push({
        priority: 'critical',
        category: 'Security',
        issue: 'Not using HTTPS',
        description: 'The website is not served over HTTPS, which is critical for security and SEO.',
        recommendation: 'Implement SSL/TLS certificate and redirect all HTTP traffic to HTTPS'
      });
      score -= 15;
    }

    // Title Tag
    if (!title) {
      issues.push({
        priority: 'critical',
        category: 'Meta Tags',
        issue: 'Missing Title Tag',
        description: 'The page is missing a title tag, which is essential for SEO.',
        recommendation: 'Add a unique, descriptive title tag (50-60 characters recommended)'
      });
      score -= 10;
    } else if (title.length < 30) {
      issues.push({
        priority: 'high',
        category: 'Meta Tags',
        issue: 'Title Too Short',
        description: `Title is only ${title.length} characters. Recommended: 50-60 characters.`,
        recommendation: 'Expand the title to better describe the page content'
      });
      score -= 5;
    } else if (title.length > 60) {
      issues.push({
        priority: 'medium',
        category: 'Meta Tags',
        issue: 'Title Too Long',
        description: `Title is ${title.length} characters. It may be truncated in search results.`,
        recommendation: 'Shorten the title to 50-60 characters for optimal display'
      });
      score -= 3;
    }

    // Meta Description
    if (!metaDescription) {
      issues.push({
        priority: 'high',
        category: 'Meta Tags',
        issue: 'Missing Meta Description',
        description: 'The page is missing a meta description.',
        recommendation: 'Add a compelling meta description (150-160 characters recommended)'
      });
      score -= 8;
    } else if (metaDescription.length < 120) {
      issues.push({
        priority: 'medium',
        category: 'Meta Tags',
        issue: 'Meta Description Too Short',
        description: `Meta description is only ${metaDescription.length} characters.`,
        recommendation: 'Expand to 150-160 characters to maximize SERP visibility'
      });
      score -= 3;
    } else if (metaDescription.length > 160) {
      issues.push({
        priority: 'low',
        category: 'Meta Tags',
        issue: 'Meta Description Too Long',
        description: `Meta description is ${metaDescription.length} characters and may be truncated.`,
        recommendation: 'Shorten to 150-160 characters for optimal display'
      });
      score -= 2;
    }

    // Canonical Tag
    if (!canonical) {
      issues.push({
        priority: 'medium',
        category: 'Meta Tags',
        issue: 'Missing Canonical Tag',
        description: 'No canonical tag found. This can lead to duplicate content issues.',
        recommendation: 'Add a canonical tag to specify the preferred URL version'
      });
      score -= 5;
    }

    // Viewport
    if (!viewport) {
      issues.push({
        priority: 'critical',
        category: 'Mobile',
        issue: 'Missing Viewport Meta Tag',
        description: 'The page lacks a viewport meta tag, affecting mobile responsiveness.',
        recommendation: 'Add: <meta name="viewport" content="width=device-width, initial-scale=1">'
      });
      score -= 10;
    }

    // Charset
    if (!charset) {
      issues.push({
        priority: 'high',
        category: 'Meta Tags',
        issue: 'Missing Charset Declaration',
        description: 'No character encoding specified.',
        recommendation: 'Add <meta charset="UTF-8"> in the <head> section'
      });
      score -= 5;
    }

    // H1 Tags
    if (h1Count === 0) {
      issues.push({
        priority: 'high',
        category: 'Content Structure',
        issue: 'Missing H1 Tag',
        description: 'The page has no H1 heading.',
        recommendation: 'Add a single, descriptive H1 tag that represents the main topic'
      });
      score -= 8;
    } else if (h1Count > 1) {
      issues.push({
        priority: 'medium',
        category: 'Content Structure',
        issue: 'Multiple H1 Tags',
        description: `Found ${h1Count} H1 tags. Best practice is to use only one.`,
        recommendation: 'Use only one H1 tag per page; convert others to H2-H6 as appropriate'
      });
      score -= 5;
    }

    // Heading Structure
    if (!headingStructure.isProper) {
      issues.push({
        priority: 'medium',
        category: 'Content Structure',
        issue: 'Improper Heading Hierarchy',
        description: 'Heading tags are not properly structured (H1 > H2 > H3, etc.).',
        recommendation: 'Ensure headings follow a logical hierarchy without skipping levels'
      });
      score -= 4;
    }

    // Images without Alt
    if (imgWithoutAlt > 0) {
      issues.push({
        priority: 'high',
        category: 'Accessibility',
        issue: 'Images Missing Alt Text',
        description: `${imgWithoutAlt} out of ${imgCount} images are missing alt attributes.`,
        recommendation: 'Add descriptive alt text to all images for accessibility and SEO'
      });
      score -= Math.min(10, imgWithoutAlt * 2);
    }

    // Broken Links
    if (brokenHrefLinks > 0) {
      issues.push({
        priority: 'medium',
        category: 'Links',
        issue: 'Broken or Empty Links',
        description: `Found ${brokenHrefLinks} links with missing or empty href attributes.`,
        recommendation: 'Fix or remove broken links'
      });
      score -= Math.min(5, brokenHrefLinks);
    }

    // Structured Data
    if (structuredDataCount === 0) {
      issues.push({
        priority: 'medium',
        category: 'Structured Data',
        issue: 'No Structured Data',
        description: 'No JSON-LD structured data found.',
        recommendation: 'Implement schema.org structured data to enhance search appearance'
      });
      score -= 5;
    }

    // Open Graph
    if (!ogTitle || !ogDescription || !ogImage) {
      issues.push({
        priority: 'medium',
        category: 'Social Media',
        issue: 'Incomplete Open Graph Tags',
        description: 'Missing Open Graph tags for social media sharing.',
        recommendation: 'Add og:title, og:description, og:image for better social sharing'
      });
      score -= 4;
    }

    // Security Headers
    if (!xFrameOptions && !contentSecurityPolicy) {
      issues.push({
        priority: 'medium',
        category: 'Security',
        issue: 'Missing Security Headers',
        description: 'No X-Frame-Options or Content-Security-Policy headers detected.',
        recommendation: 'Implement security headers to protect against clickjacking and XSS'
      });
      score -= 4;
    }

    // Page Speed Indicators
    if (loadTime > 3000) {
      issues.push({
        priority: 'high',
        category: 'Performance',
        issue: 'Slow Page Load Time',
        description: `Page took ${loadTime}ms to load. Target: under 3000ms.`,
        recommendation: 'Optimize images, minimize CSS/JS, enable caching, use a CDN'
      });
      score -= 8;
    } else if (loadTime > 2000) {
      issues.push({
        priority: 'medium',
        category: 'Performance',
        issue: 'Moderate Page Load Time',
        description: `Page took ${loadTime}ms to load. Could be improved.`,
        recommendation: 'Consider optimizing resources to reduce load time below 2000ms'
      });
      score -= 3;
    }

    // Too many scripts
    if (totalScripts > 20) {
      issues.push({
        priority: 'medium',
        category: 'Performance',
        issue: 'Excessive JavaScript Files',
        description: `Found ${totalScripts} script tags. This may slow down page load.`,
        recommendation: 'Consolidate and minify JavaScript files; consider async/defer loading'
      });
      score -= 3;
    }

    // Content Length
    if (wordCount < 300) {
      issues.push({
        priority: 'medium',
        category: 'Content',
        issue: 'Thin Content',
        description: `Page has only ${wordCount} words. Recommended: at least 300 words.`,
        recommendation: 'Add more quality content to provide value and improve SEO'
      });
      score -= 5;
    }

    // Ensure score stays within 0-100
    score = Math.max(0, Math.min(100, score));

    console.log(`Technical audit complete for ${url}, score: ${score}`);

    return {
      url,
      score,
      issues,
      metrics: {
        loadTime: `${loadTime}ms`,
        hasHTTPS: url.startsWith('https://'),
        hasViewport: !!viewport,
        hasCanonical: !!canonical,
        hasStructuredData: structuredDataCount > 0,
        h1Count,
        h2Count,
        imgCount,
        imgWithoutAlt,
        internalLinks,
        externalLinks,
        wordCount,
        scriptCount: totalScripts,
        stylesheetCount: stylesheets
      },
      summary: generateSummary(score, issues)
    };
  } catch (error) {
    console.error(`Error auditing ${url}:`, error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error(`Timeout when connecting to ${url}`);
    }
    if (error.response) {
      throw new Error(`Failed to audit ${url}: Received status ${error.response.status}`);
    }
    throw new Error(`Failed to audit ${url}: ${error.message}`);
  }
}

function analyzeHeadingStructure($) {
  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each(function() {
    const level = parseInt(this.name.substring(1));
    headings.push(level);
  });

  let isProper = true;
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) {
      isProper = false;
      break;
    }
  }

  return { isProper, headings };
}

function generateSummary(score, issues) {
  const criticalCount = issues.filter(i => i.priority === 'critical').length;
  const highCount = issues.filter(i => i.priority === 'high').length;

  if (score >= 80) {
    return `Good technical SEO foundation with a score of ${score}/100. ${issues.length} issues identified that can be addressed to further improve performance.`;
  } else if (score >= 60) {
    return `Moderate technical SEO with a score of ${score}/100. Focus on ${criticalCount + highCount} critical and high priority issues to improve search engine visibility.`;
  } else {
    return `Significant technical SEO issues detected with a score of ${score}/100. ${criticalCount} critical and ${highCount} high priority issues require immediate attention.`;
  }
}
