/**
 * Content Readability Analyzer
 * Calculates Flesch Reading Ease, sentence complexity, and provides SEO-focused content recommendations
 */

/**
 * Calculate Flesch Reading Ease score
 * @param {string} text - Content to analyze
 * @returns {object} - Readability analysis
 */
function analyzeReadability(text) {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      grade: 'No content',
      issues: [{
        priority: 'critical',
        category: 'Content',
        issue: 'No readable content found on page',
        recommendation: 'Add substantive content (minimum 300 words) to improve SEO'
      }],
      recommendations: ['Add at least 300 words of quality content']
    };
  }

  // Clean text
  const cleanText = text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.!?]/g, '')
    .trim();

  // Count sentences (periods, exclamation marks, question marks)
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Count words
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Count syllables (simple approximation)
  let syllableCount = 0;
  words.forEach(word => {
    syllableCount += countSyllables(word);
  });

  if (sentenceCount === 0 || wordCount === 0) {
    return {
      score: 0,
      grade: 'Insufficient content',
      wordCount,
      sentenceCount,
      issues: [],
      recommendations: ['Add more structured content with proper sentences']
    };
  }

  // Flesch Reading Ease Formula
  // Score = 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;

  const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  const score = Math.max(0, Math.min(100, fleschScore));

  // Determine grade level and SEO recommendations
  let grade, seoImpact, readingLevel;
  const issues = [];
  const recommendations = [];

  if (score >= 90) {
    grade = 'Very Easy';
    readingLevel = '5th grade';
    seoImpact = 'Excellent';
  } else if (score >= 80) {
    grade = 'Easy';
    readingLevel = '6th grade';
    seoImpact = 'Very Good';
  } else if (score >= 70) {
    grade = 'Fairly Easy';
    readingLevel = '7th grade';
    seoImpact = 'Good';
  } else if (score >= 60) {
    grade = 'Standard';
    readingLevel = '8-9th grade';
    seoImpact = 'Fair';
  } else if (score >= 50) {
    grade = 'Fairly Difficult';
    readingLevel = '10-12th grade';
    seoImpact = 'Below Average';
    issues.push({
      priority: 'medium',
      category: 'Content Quality',
      issue: 'Content may be too complex for average readers',
      recommendation: 'Simplify sentences and use shorter words to improve readability'
    });
  } else if (score >= 30) {
    grade = 'Difficult';
    readingLevel: 'College';
    seoImpact = 'Poor';
    issues.push({
      priority: 'high',
      category: 'Content Quality',
      issue: 'Content is difficult to read (college level)',
      recommendation: 'Break down complex sentences and use simpler vocabulary'
    });
  } else {
    grade = 'Very Difficult';
    readingLevel = 'College graduate';
    seoImpact = 'Very Poor';
    issues.push({
      priority: 'high',
      category: 'Content Quality',
      issue: 'Content is very difficult to read',
      recommendation: 'Significantly simplify content for broader audience reach'
    });
  }

  // Check word count
  if (wordCount < 300) {
    issues.push({
      priority: 'high',
      category: 'Content Length',
      issue: `Content is too short (${wordCount} words)`,
      recommendation: 'Aim for at least 300 words. Comprehensive content (1000-2000 words) ranks better'
    });
  } else if (wordCount < 1000) {
    issues.push({
      priority: 'low',
      category: 'Content Length',
      issue: `Content is minimal (${wordCount} words)`,
      recommendation: 'Consider expanding to 1000-2000 words for better ranking potential'
    });
  }

  // Check sentence length
  if (avgWordsPerSentence > 25) {
    issues.push({
      priority: 'medium',
      category: 'Readability',
      issue: `Average sentence length too long (${avgWordsPerSentence.toFixed(1)} words)`,
      recommendation: 'Keep sentences under 20 words for better readability'
    });
  }

  // Check for very short sentences (indicates choppy writing)
  const veryShortSentences = sentences.filter(s => s.split(/\s+/).length < 5).length;
  if (veryShortSentences > sentenceCount * 0.5) {
    issues.push({
      priority: 'low',
      category: 'Content Quality',
      issue: 'Too many very short sentences',
      recommendation: 'Vary sentence length to improve flow and engagement'
    });
  }

  // Generate recommendations
  if (score < 60) {
    recommendations.push('Use shorter sentences (15-20 words average)');
    recommendations.push('Replace complex words with simpler alternatives');
    recommendations.push('Break long paragraphs into 2-3 sentences each');
  }

  if (wordCount < 1000) {
    recommendations.push('Expand content to 1000-2000 words for better SEO performance');
  }

  if (avgWordsPerSentence > 20) {
    recommendations.push('Break long sentences into multiple shorter ones');
  }

  recommendations.push('Use headings (H2, H3) to structure content every 200-300 words');
  recommendations.push('Add bullet points or numbered lists to improve scannability');

  return {
    score: Math.round(score),
    grade,
    readingLevel,
    seoImpact,
    metrics: {
      wordCount,
      sentenceCount,
      syllableCount,
      avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
      avgSyllablesPerWord: avgSyllablesPerWord.toFixed(2),
      paragraphCount: text.split(/\n\n+/).filter(p => p.trim().length > 0).length
    },
    issues,
    recommendations
  };
}

/**
 * Count syllables in a word (simplified algorithm)
 * @param {string} word - Word to count syllables
 * @returns {number} - Syllable count
 */
function countSyllables(word) {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;

  // Count vowel groups
  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 0;

  // Subtract silent 'e' at end
  if (word.endsWith('e')) {
    count--;
  }

  // Subtract 'es' or 'ed' endings
  if (word.endsWith('es') || word.endsWith('ed')) {
    count--;
  }

  // Ensure at least 1 syllable
  return Math.max(1, count);
}

module.exports = {
  analyzeReadability
};
