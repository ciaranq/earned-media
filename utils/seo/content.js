/*
Description: Content analyzer for SEO audits
Version: 1.0
Author: Ciaran Quinlan
Filename: utils/seo/content.js
Dependencies: reading-time, cheerio
*/

const readingTime = require('reading-time');

/**
 * Analyze page content for SEO
 * @param {object} $ - Cheerio instance
 * @param {string} url - The URL being analyzed
 * @returns {object} Content analysis results
 */
function analyzeContent($, url) {
  try {
    // Extract text content
    const bodyText = $('body').text().trim().replace(/\s+/g, ' ');
    const mainContent = extractMainContent($);

    // Word count
    const words = bodyText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Reading time
    const readingStats = readingTime(mainContent);

    // Sentence count (rough estimate)
    const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // Average sentence length
    const avgSentenceLength = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0;

    // Paragraph count
    const paragraphCount = $('p').length;

    // Heading analysis
    const headingStructure = {
      h1: $('h1').length,
      h2: $('h2').length,
      h3: $('h3').length,
      h4: $('h4').length,
      h5: $('h5').length,
      h6: $('h6').length
    };

    // Extract headings text
    const headings = {
      h1: $('h1').map((i, el) => $(el).text().trim()).get(),
      h2: $('h2').map((i, el) => $(el).text().trim()).get().slice(0, 5), // First 5
      h3: $('h3').map((i, el) => $(el).text().trim()).get().slice(0, 5)
    };

    // Content quality checks
    const qualityChecks = {
      hasEnoughContent: wordCount >= 300,
      hasGoodReadingLevel: avgSentenceLength >= 15 && avgSentenceLength <= 25,
      hasProperHeadings: headingStructure.h1 === 1 && headingStructure.h2 > 0,
      hasParagraphs: paragraphCount >= 3
    };

    // Calculate readability score (simplified Flesch Reading Ease)
    const readabilityScore = calculateSimpleReadability(wordCount, sentenceCount, words);

    // Detect duplicate content issues
    const duplicateIssues = checkDuplicateContent($);

    // Generate issues
    const issues = [];

    if (wordCount < 300) {
      issues.push({
        priority: 'high',
        category: 'Content',
        issue: `Low word count: ${wordCount} words (recommended: 300+)`,
        recommendation: 'Add more comprehensive, valuable content to improve SEO'
      });
    }

    if (headingStructure.h1 === 0) {
      issues.push({
        priority: 'high',
        category: 'Content',
        issue: 'Missing H1 heading',
        recommendation: 'Add a single H1 heading that describes the main topic'
      });
    } else if (headingStructure.h1 > 1) {
      issues.push({
        priority: 'medium',
        category: 'Content',
        issue: `Multiple H1 headings found (${headingStructure.h1})`,
        recommendation: 'Use only one H1 heading per page'
      });
    }

    if (headingStructure.h2 === 0) {
      issues.push({
        priority: 'medium',
        category: 'Content',
        issue: 'No H2 headings found',
        recommendation: 'Add H2 headings to structure your content'
      });
    }

    if (paragraphCount < 3) {
      issues.push({
        priority: 'low',
        category: 'Content',
        issue: `Only ${paragraphCount} paragraphs found`,
        recommendation: 'Break content into more paragraphs for better readability'
      });
    }

    if (avgSentenceLength > 30) {
      issues.push({
        priority: 'low',
        category: 'Content',
        issue: `Long average sentence length: ${avgSentenceLength} words`,
        recommendation: 'Break up long sentences for better readability'
      });
    }

    // Add duplicate content issues
    issues.push(...duplicateIssues);

    return {
      wordCount: wordCount,
      sentenceCount: sentenceCount,
      paragraphCount: paragraphCount,
      avgSentenceLength: parseFloat(avgSentenceLength),
      readingTime: {
        text: readingStats.text,
        minutes: readingStats.minutes,
        words: readingStats.words
      },
      headings: headingStructure,
      headingsSample: headings,
      readability: {
        score: readabilityScore,
        level: getReadabilityLevel(readabilityScore)
      },
      qualityChecks: qualityChecks,
      issues: issues,
      summary: generateContentSummary(wordCount, qualityChecks, issues)
    };

  } catch (error) {
    console.error('Error analyzing content:', error.message);
    return {
      wordCount: 0,
      issues: [{
        priority: 'high',
        category: 'Content',
        issue: `Failed to analyze content: ${error.message}`,
        recommendation: 'Check if the page has accessible content'
      }],
      error: error.message
    };
  }
}

/**
 * Extract main content (excluding nav, footer, sidebar)
 * @param {object} $ - Cheerio instance
 * @returns {string} Main content text
 */
function extractMainContent($) {
  // Remove nav, footer, sidebar, header from analysis
  const contentCopy = $.load($.html());
  contentCopy('nav, footer, aside, header, .sidebar, #sidebar, .nav, #nav').remove();

  // Try to find main content area
  let mainText = contentCopy('main, article, .content, #content, .main, #main').text();

  if (!mainText || mainText.trim().length < 100) {
    mainText = contentCopy('body').text();
  }

  return mainText.trim().replace(/\s+/g, ' ');
}

/**
 * Calculate simplified readability score
 * @param {number} wordCount - Total words
 * @param {number} sentenceCount - Total sentences
 * @param {Array} words - Array of words
 * @returns {number} Readability score (0-100, higher is easier)
 */
function calculateSimpleReadability(wordCount, sentenceCount, words) {
  if (sentenceCount === 0 || wordCount === 0) return 0;

  // Count syllables (simplified - count vowel groups)
  let syllableCount = 0;
  words.forEach(word => {
    syllableCount += countSyllables(word);
  });

  // Simplified Flesch Reading Ease formula
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;

  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Count syllables in a word (simplified)
 * @param {string} word - Word to analyze
 * @returns {number} Estimated syllable count
 */
function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 1;

  // Adjust for silent e
  if (word.endsWith('e')) count--;

  return Math.max(1, count);
}

/**
 * Get readability level description
 * @param {number} score - Readability score
 * @returns {string} Level description
 */
function getReadabilityLevel(score) {
  if (score >= 90) return 'Very Easy (5th grade)';
  if (score >= 80) return 'Easy (6th grade)';
  if (score >= 70) return 'Fairly Easy (7th grade)';
  if (score >= 60) return 'Standard (8th-9th grade)';
  if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
  if (score >= 30) return 'Difficult (College)';
  return 'Very Difficult (College graduate)';
}

/**
 * Check for duplicate content issues
 * @param {object} $ - Cheerio instance
 * @returns {Array} Duplicate content issues
 */
function checkDuplicateContent($) {
  const issues = [];

  // Check for duplicate title in H1
  const title = $('title').text().trim().toLowerCase();
  const h1Text = $('h1').first().text().trim().toLowerCase();

  if (title && h1Text && title === h1Text) {
    issues.push({
      priority: 'low',
      category: 'Content',
      issue: 'H1 is identical to title tag',
      recommendation: 'Differentiate H1 from title tag while keeping them related'
    });
  }

  // Check for duplicate meta description
  const metaDesc = $('meta[name="description"]').attr('content');
  if (metaDesc && metaDesc.trim().toLowerCase() === title) {
    issues.push({
      priority: 'low',
      category: 'Content',
      issue: 'Meta description is identical to title',
      recommendation: 'Write unique meta description that complements the title'
    });
  }

  return issues;
}

/**
 * Generate content summary
 * @param {number} wordCount - Total words
 * @param {object} qualityChecks - Quality check results
 * @param {Array} issues - Content issues
 * @returns {string} Summary text
 */
function generateContentSummary(wordCount, qualityChecks, issues) {
  const criticalIssues = issues.filter(i => i.priority === 'high').length;

  if (criticalIssues > 0) {
    return `Content needs improvement: ${criticalIssues} critical issues found. Focus on adding more comprehensive content and proper heading structure.`;
  }

  if (qualityChecks.hasEnoughContent && qualityChecks.hasProperHeadings) {
    return `Good content quality: ${wordCount} words with proper structure and readability.`;
  }

  return `Content quality is moderate: Some improvements needed for better SEO performance.`;
}

module.exports = {
  analyzeContent
};
