/**
 * Internal Linking Analyzer
 * Analyzes internal link structure, anchor text, and link equity distribution
 */

/**
 * Analyze internal linking structure
 * @param {object} $ - Cheerio instance
 * @param {string} url - Page URL
 * @returns {object} - Internal linking analysis
 */
function analyzeInternalLinks($, url) {
  const issues = [];
  const recommendations = [];
  let score = 100;

  try {
    const pageUrl = new URL(url);
    const domain = pageUrl.hostname;

    // Get all links
    const allLinks = $('a[href]');
    const totalLinks = allLinks.length;

    let internalLinks = 0;
    let externalLinks = 0;
    let brokenLinks = 0;
    let noFollowLinks = 0;
    let genericAnchors = 0;
    let emptyAnchors = 0;
    const anchorTexts = [];

    allLinks.each((i, link) => {
      const $link = $(link);
      const href = $link.attr('href');
      const anchorText = $link.text().trim();
      const rel = $link.attr('rel') || '';

      if (!href) {
        brokenLinks++;
        return;
      }

      // Check if link is internal
      const isInternal = href.startsWith('/') ||
        href.startsWith('#') ||
        href.includes(domain) ||
        (!href.startsWith('http') && !href.startsWith('//'));

      if (isInternal && !href.startsWith('#')) {
        internalLinks++;

        // Check anchor text quality
        if (!anchorText || anchorText.length === 0) {
          emptyAnchors++;
        } else if (anchorText.length < 100) {
          anchorTexts.push(anchorText);

          // Check for generic anchor text
          const genericTerms = ['click here', 'read more', 'learn more', 'here', 'this', 'link'];
          if (genericTerms.some(term => anchorText.toLowerCase() === term)) {
            genericAnchors++;
          }
        }

        // Check for nofollow on internal links
        if (rel.includes('nofollow')) {
          noFollowLinks++;
        }
      } else if (href.startsWith('http') || href.startsWith('//')) {
        externalLinks++;
      }
    });

    // Calculate metrics
    const internalToExternalRatio = externalLinks > 0 ?
      (internalLinks / externalLinks).toFixed(2) : 'N/A';

    // Generate issues
    if (internalLinks < 3) {
      score -= 15;
      issues.push({
        priority: 'high',
        category: 'Internal Linking',
        issue: `Very few internal links (${internalLinks})`,
        recommendation: 'Add 3-5 relevant internal links to help users navigate and distribute link equity'
      });
    } else if (internalLinks > 100) {
      score -= 8;
      issues.push({
        priority: 'medium',
        category: 'Internal Linking',
        issue: `Too many internal links (${internalLinks})`,
        recommendation: 'Reduce to 50-100 internal links per page for better user experience'
      });
    }

    if (genericAnchors > 0) {
      score -= Math.min(10, genericAnchors * 2);
      issues.push({
        priority: 'medium',
        category: 'Anchor Text',
        issue: `${genericAnchors} links use generic anchor text ("click here", "read more")`,
        recommendation: 'Use descriptive anchor text that indicates link destination'
      });
    }

    if (emptyAnchors > 0) {
      score -= Math.min(8, emptyAnchors * 3);
      issues.push({
        priority: 'high',
        category: 'Accessibility',
        issue: `${emptyAnchors} links have no anchor text`,
        recommendation: 'Add descriptive text to all links for accessibility and SEO'
      });
    }

    if (noFollowLinks > 0) {
      score -= 5;
      issues.push({
        priority: 'low',
        category: 'Internal Linking',
        issue: `${noFollowLinks} internal links are marked nofollow`,
        recommendation: 'Remove rel="nofollow" from internal links to pass link equity'
      });
    }

    if (internalLinks < externalLinks * 0.3 && externalLinks > 5) {
      score -= 10;
      issues.push({
        priority: 'medium',
        category: 'Link Balance',
        issue: 'More external links than internal links',
        recommendation: 'Balance external links with more internal links to keep users on your site'
      });
    }

    // Generate recommendations
    if (internalLinks < 5) {
      recommendations.push('Add contextual internal links to related content');
      recommendations.push('Link to your most important pages from this page');
    }

    if (genericAnchors > 3) {
      recommendations.push('Replace "click here" with descriptive anchor text like "SEO best practices guide"');
    }

    if (internalLinks > 20 && internalLinks < 50) {
      recommendations.push('Good internal linking structure - consider adding 2-3 more strategic links');
    }

    recommendations.push('Link to pages that need ranking boost using keyword-rich anchor text');
    recommendations.push('Use a mix of exact-match and natural anchor text for internal links');

    return {
      score: Math.max(0, score),
      totalLinks,
      internalLinks,
      externalLinks,
      brokenLinks,
      metrics: {
        internalToExternalRatio,
        genericAnchors,
        emptyAnchors,
        noFollowLinks,
        averageAnchorLength: anchorTexts.length > 0 ?
          (anchorTexts.reduce((sum, text) => sum + text.length, 0) / anchorTexts.length).toFixed(1) : 0
      },
      topAnchors: getTopAnchors(anchorTexts),
      issues,
      recommendations
    };

  } catch (error) {
    return {
      score: 0,
      error: error.message,
      issues: [{
        priority: 'medium',
        category: 'Internal Linking',
        issue: 'Could not analyze internal links',
        recommendation: 'Ensure page has valid URLs and link structure'
      }],
      recommendations: []
    };
  }
}

/**
 * Get most common anchor texts
 * @param {array} anchors - Array of anchor texts
 * @returns {array} - Top 5 anchor texts by frequency
 */
function getTopAnchors(anchors) {
  const frequency = {};
  anchors.forEach(anchor => {
    frequency[anchor] = (frequency[anchor] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([text, count]) => ({ text, count }));
}

module.exports = {
  analyzeInternalLinks
};
