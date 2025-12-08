/**
 * Social Media Meta Tags Analyzer
 * Checks Open Graph, Twitter Cards, and social sharing optimization
 */

/**
 * Analyze social media meta tags
 * @param {object} $ - Cheerio instance
 * @param {string} url - Page URL
 * @returns {object} - Social meta analysis
 */
function analyzeSocialMeta($, url) {
  const issues = [];
  const recommendations = [];
  let score = 100;

  // Open Graph tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogUrl = $('meta[property="og:url"]').attr('content');
  const ogType = $('meta[property="og:type"]').attr('content');
  const ogSiteName = $('meta[property="og:site_name"]').attr('content');

  // Twitter Card tags
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  const twitterTitle = $('meta[name="twitter:title"]').attr('content');
  const twitterDescription = $('meta[name="twitter:description"]').attr('content');
  const twitterImage = $('meta[name="twitter:image"]').attr('content');
  const twitterSite = $('meta[name="twitter:site"]').attr('content');
  const twitterCreator = $('meta[name="twitter:creator"]').attr('content');

  // Facebook specific
  const fbAppId = $('meta[property="fb:app_id"]').attr('content');

  // Open Graph validation
  if (!ogTitle) {
    score -= 10;
    issues.push({
      priority: 'high',
      category: 'Social Media',
      issue: 'Missing og:title - crucial for Facebook/LinkedIn shares',
      recommendation: 'Add <meta property="og:title" content="Your Page Title">'
    });
  }

  if (!ogDescription) {
    score -= 8;
    issues.push({
      priority: 'high',
      category: 'Social Media',
      issue: 'Missing og:description - affects social media CTR',
      recommendation: 'Add <meta property="og:description" content="Compelling description">'
    });
  }

  if (!ogImage) {
    score -= 15;
    issues.push({
      priority: 'critical',
      category: 'Social Media',
      issue: 'Missing og:image - shares will have no image preview',
      recommendation: 'Add high-quality image (1200x630px recommended) with og:image tag'
    });
  } else {
    // Check image URL format
    if (!ogImage.startsWith('http')) {
      score -= 5;
      issues.push({
        priority: 'medium',
        category: 'Social Media',
        issue: 'og:image should be absolute URL, not relative',
        recommendation: 'Use full URL: https://yourdomain.com/image.jpg'
      });
    }

    // Recommend og:image dimensions
    const ogImageWidth = $('meta[property="og:image:width"]').attr('content');
    const ogImageHeight = $('meta[property="og:image:height"]').attr('content');
    if (!ogImageWidth || !ogImageHeight) {
      score -= 3;
      issues.push({
        priority: 'low',
        category: 'Social Media',
        issue: 'Missing og:image:width and og:image:height',
        recommendation: 'Specify image dimensions for better preview rendering'
      });
    }
  }

  if (!ogUrl) {
    score -= 5;
    issues.push({
      priority: 'medium',
      category: 'Social Media',
      issue: 'Missing og:url',
      recommendation: 'Add canonical URL with og:url for proper attribution'
    });
  }

  if (!ogType) {
    score -= 3;
    issues.push({
      priority: 'low',
      category: 'Social Media',
      issue: 'Missing og:type',
      recommendation: 'Add og:type (usually "website" or "article")'
    });
  }

  // Twitter Card validation
  if (!twitterCard) {
    score -= 10;
    issues.push({
      priority: 'high',
      category: 'Twitter',
      issue: 'Missing twitter:card - no Twitter card preview',
      recommendation: 'Add <meta name="twitter:card" content="summary_large_image">'
    });
  } else if (!['summary', 'summary_large_image', 'app', 'player'].includes(twitterCard)) {
    score -= 3;
    issues.push({
      priority: 'medium',
      category: 'Twitter',
      issue: `Invalid twitter:card type: ${twitterCard}`,
      recommendation: 'Use "summary_large_image" for best visual impact'
    });
  }

  if (!twitterImage && !ogImage) {
    score -= 5;
    issues.push({
      priority: 'medium',
      category: 'Twitter',
      issue: 'Missing twitter:image (and no og:image fallback)',
      recommendation: 'Add twitter:image or ensure og:image is present'
    });
  }

  if (!twitterSite) {
    score -= 3;
    issues.push({
      priority: 'low',
      category: 'Twitter',
      issue: 'Missing twitter:site',
      recommendation: 'Add your Twitter handle: <meta name="twitter:site" content="@yourhandle">'
    });
  }

  // Generate recommendations
  if (!ogImage || !twitterImage) {
    recommendations.push('Create social media images (1200x630px for Facebook, 1200x600px for Twitter)');
  }

  if (issues.filter(i => i.priority === 'high' || i.priority === 'critical').length > 0) {
    recommendations.push('Fix critical social media tags to improve share appearance and CTR');
  }

  if (!ogTitle || !twitterTitle) {
    recommendations.push('Ensure social titles are compelling and different from page <title> if needed');
  }

  if (!fbAppId) {
    recommendations.push('Consider adding fb:app_id for Facebook Insights tracking');
  }

  recommendations.push('Test social previews with Facebook Sharing Debugger and Twitter Card Validator');
  recommendations.push('Use unique images for each page to improve social media engagement');

  return {
    score: Math.max(0, score),
    openGraph: {
      title: ogTitle || null,
      description: ogDescription || null,
      image: ogImage || null,
      url: ogUrl || null,
      type: ogType || null,
      siteName: ogSiteName || null,
      complete: !!(ogTitle && ogDescription && ogImage && ogUrl)
    },
    twitter: {
      card: twitterCard || null,
      title: twitterTitle || ogTitle || null,
      description: twitterDescription || ogDescription || null,
      image: twitterImage || ogImage || null,
      site: twitterSite || null,
      creator: twitterCreator || null,
      complete: !!(twitterCard && (twitterImage || ogImage))
    },
    facebook: {
      appId: fbAppId || null
    },
    issues,
    recommendations,
    hasBasicSetup: !!(ogTitle && ogImage),
    hasCompleteSetup: !!(ogTitle && ogDescription && ogImage && ogUrl && twitterCard)
  };
}

module.exports = {
  analyzeSocialMeta
};
