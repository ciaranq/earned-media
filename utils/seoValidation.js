/**
 * Shared SEO Validation Utilities
 * Reusable validation functions across all SEO analysis endpoints
 */

const SEO_THRESHOLDS = require('./seoThresholds');

/**
 * Validates a URL string
 * @param {string} url - URL to validate
 * @returns {object} - { valid: boolean, error?: string }
 */
function validateURL(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL must be a non-empty string' };
  }

  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validates title tag based on SEO best practices
 * @param {string} title - Title tag content
 * @returns {object} - { valid: boolean, issues: array }
 */
function validateTitle(title) {
  const issues = [];
  const { min, ideal, max } = SEO_THRESHOLDS.title;

  if (!title) {
    issues.push({ severity: 'high', message: 'Missing title tag' });
  } else {
    if (title.length < min) {
      issues.push({ severity: 'medium', message: `Title too short (${title.length}/${min} chars)` });
    }
    if (title.length < ideal.min) {
      issues.push({ severity: 'low', message: `Title could be longer (${title.length}/${ideal.min}-${ideal.max} chars ideal)` });
    }
    if (title.length > ideal.max && title.length < max) {
      issues.push({ severity: 'low', message: `Title is longer than ideal (${title.length}/${ideal.min}-${ideal.max} chars ideal)` });
    }
    if (title.length > max) {
      issues.push({ severity: 'medium', message: `Title exceeds max length (${title.length}/${max} chars)` });
    }
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Validates meta description based on SEO best practices
 * @param {string} description - Meta description content
 * @returns {object} - { valid: boolean, issues: array }
 */
function validateMetaDescription(description) {
  const issues = [];
  const { min, ideal, max } = SEO_THRESHOLDS.metaDescription;

  if (!description) {
    issues.push({ severity: 'high', message: 'Missing meta description' });
  } else {
    if (description.length < min) {
      issues.push({ severity: 'medium', message: `Description too short (${description.length}/${min} chars)` });
    }
    if (description.length < ideal.min) {
      issues.push({ severity: 'low', message: `Description could be longer (${description.length}/${ideal.min}-${ideal.max} chars ideal)` });
    }
    if (description.length > ideal.max && description.length < max) {
      issues.push({ severity: 'low', message: `Description longer than ideal (${description.length}/${ideal.min}-${ideal.max} chars ideal)` });
    }
    if (description.length > max) {
      issues.push({ severity: 'medium', message: `Description exceeds max length (${description.length}/${max} chars)` });
    }
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Validates H1 heading structure
 * @param {number} h1Count - Number of H1 tags found
 * @returns {object} - { valid: boolean, issues: array }
 */
function validateH1Structure(h1Count) {
  const issues = [];
  const { min, max } = SEO_THRESHOLDS.headings.h1;

  if (h1Count < min) {
    issues.push({ severity: 'high', message: 'Missing H1 heading' });
  } else if (h1Count > max) {
    issues.push({ severity: 'medium', message: `Multiple H1 tags found (${h1Count}). Use only one H1 per page.` });
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Validates content length
 * @param {number} wordCount - Number of words in content
 * @returns {object} - { valid: boolean, issues: array }
 */
function validateContentLength(wordCount) {
  const issues = [];
  const { minWordCount, goodWordCount } = SEO_THRESHOLDS.content;

  if (wordCount < minWordCount) {
    issues.push({
      severity: 'high',
      message: `Content too short (${wordCount}/${minWordCount} words minimum)`
    });
  } else if (wordCount < goodWordCount) {
    issues.push({
      severity: 'low',
      message: `Content could be more substantial (${wordCount} words, ${goodWordCount}+ recommended)`
    });
  }

  return { valid: wordCount >= minWordCount, issues };
}

/**
 * Calculates SEO score based on issues
 * @param {array} issues - Array of issue objects with severity
 * @returns {number} - Score from 0-100
 */
function calculateScore(issues) {
  let score = 100;

  issues.forEach(issue => {
    const penalty = SEO_THRESHOLDS.penalties[issue.severity] || 0;
    score -= penalty;
  });

  return Math.max(0, Math.min(100, score));
}

/**
 * Categorizes issues by severity
 * @param {array} issues - Array of issue objects
 * @returns {object} - Issues grouped by severity
 */
function categorizeIssues(issues) {
  return {
    critical: issues.filter(i => i.severity === 'critical'),
    high: issues.filter(i => i.severity === 'high'),
    medium: issues.filter(i => i.severity === 'medium'),
    low: issues.filter(i => i.severity === 'low'),
  };
}

module.exports = {
  validateURL,
  validateTitle,
  validateMetaDescription,
  validateH1Structure,
  validateContentLength,
  calculateScore,
  categorizeIssues,
};
