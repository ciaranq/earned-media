/**
 * Image Optimization Analyzer
 * Checks for modern formats, lazy loading, compression, alt text, dimensions
 */

/**
 * Analyze all images on the page for SEO optimization
 * @param {object} $ - Cheerio instance
 * @param {string} url - Page URL
 * @returns {object} - Image optimization analysis
 */
function analyzeImages($, url) {
  const images = $('img');
  const totalImages = images.length;

  if (totalImages === 0) {
    return {
      totalImages: 0,
      score: 100,
      issues: [],
      recommendations: ['Consider adding images to improve user engagement and SEO']
    };
  }

  const issues = [];
  const recommendations = [];
  let score = 100;

  // Track optimization metrics
  let missingAlt = 0;
  let missingDimensions = 0;
  let notLazyLoaded = 0;
  let nonModernFormats = 0;
  let largeImages = 0;
  let emptyAlt = 0;

  const imageDetails = [];

  images.each((i, img) => {
    const $img = $(img);
    const src = $img.attr('src') || $img.attr('data-src') || '';
    const alt = $img.attr('alt');
    const loading = $img.attr('loading');
    const width = $img.attr('width');
    const height = $img.attr('height');

    const detail = {
      index: i + 1,
      src: src.substring(0, 100),
      issues: []
    };

    // Check 1: Alt text
    if (!alt) {
      missingAlt++;
      detail.issues.push('Missing alt attribute');
    } else if (alt.trim() === '') {
      emptyAlt++;
      detail.issues.push('Empty alt attribute');
    }

    // Check 2: Dimensions (prevents layout shift)
    if (!width || !height) {
      missingDimensions++;
      detail.issues.push('Missing width/height attributes (causes layout shift)');
    }

    // Check 3: Lazy loading
    if (!loading && i > 2) {
      // Only flag images below the fold (after first 3)
      notLazyLoaded++;
      detail.issues.push('Not lazy loaded (loading="lazy")');
    }

    // Check 4: Modern formats (WebP, AVIF)
    const ext = src.split('.').pop().toLowerCase().split('?')[0];
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      nonModernFormats++;
      detail.issues.push(`Old format (.${ext}) - consider WebP or AVIF`);
    }

    // Check 5: Overly descriptive file names (good for SEO)
    const filename = src.split('/').pop().split('?')[0];
    if (/^(image|img|photo|pic|picture)\d*\.(jpg|png|webp)/i.test(filename)) {
      detail.issues.push('Generic filename - use descriptive names');
    }

    if (detail.issues.length > 0) {
      imageDetails.push(detail);
    }
  });

  // Calculate score and generate issues
  if (missingAlt > 0) {
    const percentage = ((missingAlt / totalImages) * 100).toFixed(0);
    score -= Math.min(15, missingAlt * 2);
    issues.push({
      priority: 'high',
      category: 'Accessibility & SEO',
      issue: `${missingAlt} images (${percentage}%) missing alt text`,
      recommendation: 'Add descriptive alt text to all images for accessibility and SEO'
    });
  }

  if (emptyAlt > 0) {
    score -= Math.min(5, emptyAlt);
    issues.push({
      priority: 'medium',
      category: 'SEO',
      issue: `${emptyAlt} images have empty alt attributes`,
      recommendation: 'Add descriptive alt text or use alt="" only for decorative images'
    });
  }

  if (missingDimensions > 0) {
    const percentage = ((missingDimensions / totalImages) * 100).toFixed(0);
    score -= Math.min(10, Math.floor(missingDimensions / 2));
    issues.push({
      priority: 'high',
      category: 'Core Web Vitals',
      issue: `${missingDimensions} images (${percentage}%) missing width/height attributes`,
      recommendation: 'Add width and height attributes to prevent Cumulative Layout Shift (CLS)'
    });
  }

  if (notLazyLoaded > 0 && totalImages > 5) {
    score -= Math.min(8, Math.floor(notLazyLoaded / 3));
    issues.push({
      priority: 'medium',
      category: 'Performance',
      issue: `${notLazyLoaded} below-the-fold images not lazy loaded`,
      recommendation: 'Add loading="lazy" to images below the fold to improve page speed'
    });
  }

  if (nonModernFormats > 0) {
    const percentage = ((nonModernFormats / totalImages) * 100).toFixed(0);
    score -= Math.min(10, Math.floor(nonModernFormats / 5));
    issues.push({
      priority: 'medium',
      category: 'Performance',
      issue: `${nonModernFormats} images (${percentage}%) using old formats (JPG/PNG)`,
      recommendation: 'Convert images to WebP or AVIF for 25-35% file size reduction'
    });
  }

  // Generate recommendations
  if (missingAlt > 0 || emptyAlt > 0) {
    recommendations.push('Write unique, descriptive alt text for each image (not just keywords)');
  }
  if (missingDimensions > 0) {
    recommendations.push('Always specify width and height to prevent layout shifts and improve CLS');
  }
  if (nonModernFormats > totalImages * 0.5) {
    recommendations.push('Serve images in WebP format with fallback to JPG for better compression');
  }
  if (notLazyLoaded > 5) {
    recommendations.push('Implement lazy loading for all images below the fold');
  }
  if (totalImages > 20) {
    recommendations.push('Consider using an image CDN for automatic optimization and resizing');
  }

  return {
    totalImages,
    score: Math.max(0, score),
    optimizationRate: ((totalImages - missingAlt - emptyAlt - missingDimensions) / totalImages * 100).toFixed(1),
    metrics: {
      missingAlt,
      emptyAlt,
      missingDimensions,
      notLazyLoaded,
      nonModernFormats,
      withAlt: totalImages - missingAlt,
      withDimensions: totalImages - missingDimensions,
      lazyLoaded: totalImages - notLazyLoaded,
      modernFormats: totalImages - nonModernFormats
    },
    issues,
    recommendations,
    imageDetails: imageDetails.slice(0, 10) // Only show first 10 problematic images
  };
}

module.exports = {
  analyzeImages
};
