/**
 * SEO Thresholds and Best Practices Constants
 * Centralized configuration for all SEO analysis standards
 */

const SEO_THRESHOLDS = {
  // Title Tag Guidelines
  title: {
    min: 10,
    ideal: { min: 50, max: 60 },
    max: 160,
  },

  // Meta Description Guidelines
  metaDescription: {
    min: 50,
    ideal: { min: 120, max: 160 },
    max: 160,
  },

  // Heading Guidelines
  headings: {
    h1: {
      min: 1,
      max: 1,
    },
  },

  // Content Guidelines
  content: {
    minWordCount: 300,
    minParagraphs: 3,
    goodWordCount: 1500,
  },

  // Performance Thresholds (milliseconds)
  performance: {
    maxLoadTime: 3000,
    maxLCP: 2500,           // Largest Contentful Paint
    maxFID: 100,            // First Input Delay
    maxCLS: 0.1,            // Cumulative Layout Shift
  },

  // Network Configuration
  network: {
    timeout: 10000,
    maxRedirects: 5,
    userAgent: 'Mozilla/5.0 (compatible; SEOAgent/1.0)',
  },

  // Scoring Penalties (deducted from 100)
  penalties: {
    critical: 15,
    high: 10,
    medium: 5,
    low: 2,
  },

  // Keyword Analysis
  keywords: {
    minKeywordLength: 2,
    minFrequency: 2,
    longTailMinWords: 3,
    difficultyScaleMax: 100,
  },

  // Security Headers
  securityHeaders: {
    required: [
      'Strict-Transport-Security',
      'X-Content-Type-Options',
      'X-Frame-Options',
    ],
    recommended: [
      'Content-Security-Policy',
      'Referrer-Policy',
    ],
  },
};

module.exports = SEO_THRESHOLDS;
