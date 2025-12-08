/**
 * Keyword Difficulty Scoring Utility
 * Estimates keyword difficulty and search volume potential
 */

/**
 * Calculate keyword difficulty score (0-100)
 * Based on keyword characteristics
 * @param {string} keyword - The keyword to analyze
 * @returns {number} - Difficulty score 0-100 (0=easy, 100=difficult)
 */
function calculateDifficulty(keyword) {
  if (!keyword || typeof keyword !== 'string') return 0;

  const cleanKeyword = keyword.toLowerCase().trim();
  let score = 50; // Base difficulty

  // Factor 1: Keyword length (longer = generally easier)
  const words = cleanKeyword.split(/\s+/).length;
  if (words >= 4) {
    score -= 20; // Long-tail keywords are easier
  } else if (words === 3) {
    score -= 10;
  } else if (words === 2) {
    score -= 5;
  } // Single word is hardest (no adjustment)

  // Factor 2: Keyword specificity indicators
  if (cleanKeyword.includes('best ')) score -= 15;
  if (cleanKeyword.includes('how to ')) score -= 12;
  if (cleanKeyword.includes('near me')) score -= 18; // Local intent
  if (cleanKeyword.includes('tutorial')) score -= 10;
  if (cleanKeyword.includes('review')) score -= 8;
  if (cleanKeyword.includes('price')) score -= 5;
  if (cleanKeyword.includes('cheap')) score -= 10;
  if (cleanKeyword.includes('free')) score -= 12;

  // Factor 3: Industry competitiveness
  const competitiveTerms = ['credit card', 'loan', 'insurance', 'casino', 'dating', 'attorney', 'software'];
  competitiveTerms.forEach(term => {
    if (cleanKeyword.includes(term)) {
      score += 30; // These sectors are highly competitive
    }
  });

  // Factor 4: Numbers and specific details (usually easier)
  if (/\d/.test(cleanKeyword)) score -= 8;
  if (cleanKeyword.includes('vs ')) score -= 5;
  if (cleanKeyword.includes('in ')) score -= 5; // Location-based

  // Constrain to 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Estimate search volume category
 * @param {string} keyword - The keyword to analyze
 * @returns {object} - { category, estimate, range }
 */
function estimateSearchVolume(keyword) {
  if (!keyword || typeof keyword !== 'string') {
    return { category: 'unknown', estimate: 0, range: '0' };
  }

  const cleanKeyword = keyword.toLowerCase().trim();
  const words = cleanKeyword.split(/\s+/).length;

  // Volume decreases with specificity
  let baseVolume = 10000;

  // Single word keywords typically have higher volume
  if (words === 1) {
    baseVolume = 30000 + Math.random() * 50000;
  }
  // Two-word phrases are moderately specific
  else if (words === 2) {
    baseVolume = 5000 + Math.random() * 15000;
  }
  // Long-tail (3+ words) has lower but more qualified volume
  else {
    baseVolume = 500 + Math.random() * 3000;
  }

  // Adjust for common volume indicators
  if (cleanKeyword.includes('how to') || cleanKeyword.includes('tutorial')) {
    baseVolume *= 1.3;
  } else if (cleanKeyword.includes('vs ') || cleanKeyword.includes('comparison')) {
    baseVolume *= 0.8;
  } else if (cleanKeyword.includes('buy') || cleanKeyword.includes('price')) {
    baseVolume *= 0.6;
  }

  let category = 'very low';
  if (baseVolume > 50000) category = 'very high';
  else if (baseVolume > 10000) category = 'high';
  else if (baseVolume > 1000) category = 'medium';
  else if (baseVolume > 100) category = 'low';

  return {
    category,
    estimate: Math.round(baseVolume),
    range: getVolumeRange(baseVolume),
  };
}

/**
 * Get volume range description
 * @param {number} volume - Estimated volume
 * @returns {string} - Range description
 */
function getVolumeRange(volume) {
  if (volume > 100000) return '100k+';
  if (volume > 50000) return '50k-100k';
  if (volume > 10000) return '10k-50k';
  if (volume > 5000) return '5k-10k';
  if (volume > 1000) return '1k-5k';
  if (volume > 100) return '100-1k';
  return '<100';
}

/**
 * Calculate keyword opportunity score
 * Combines difficulty and volume for ranking potential
 * @param {string} keyword - The keyword to analyze
 * @returns {object} - Complete keyword analysis
 */
function analyzeKeywordOpportunity(keyword) {
  const difficulty = calculateDifficulty(keyword);
  const volume = estimateSearchVolume(keyword);

  // Opportunity = High volume + Low difficulty
  // Score from 0-100
  const opportunity = ((100 - difficulty) * (parseInt(volume.range) || 50)) / 100;

  let opportunityLevel = 'poor';
  if (opportunity > 75) opportunityLevel = 'excellent';
  else if (opportunity > 50) opportunityLevel = 'good';
  else if (opportunity > 25) opportunityLevel = 'fair';

  return {
    keyword,
    difficulty: {
      score: difficulty,
      level: getDifficultyLevel(difficulty),
    },
    searchVolume: volume,
    opportunity: {
      score: Math.round(opportunity),
      level: opportunityLevel,
    },
    recommendation: generateRecommendation(difficulty, volume.category, opportunity),
  };
}

/**
 * Get difficulty level label
 * @param {number} score - Difficulty score
 * @returns {string} - Difficulty level
 */
function getDifficultyLevel(score) {
  if (score > 75) return 'Very Hard';
  if (score > 50) return 'Hard';
  if (score > 25) return 'Moderate';
  if (score > 10) return 'Easy';
  return 'Very Easy';
}

/**
 * Generate ranking recommendation
 * @param {number} difficulty - Difficulty score
 * @param {string} volumeCategory - Volume category
 * @param {number} opportunity - Opportunity score
 * @returns {string} - Recommendation text
 */
function generateRecommendation(difficulty, volumeCategory, opportunity) {
  if (opportunity > 75) {
    return 'Excellent opportunity - target this keyword. Combine with similar long-tail variations.';
  }
  if (difficulty > 70) {
    if (volumeCategory === 'very high') {
      return 'High volume but very competitive. Consider similar long-tail alternatives with less competition.';
    }
    return 'Too competitive for immediate ranking. Build authority and consider complementary keywords first.';
  }
  if (volumeCategory === 'very low') {
    return 'Low search volume. Use as supporting/secondary keyword. Build content targeting higher-volume related terms.';
  }
  return 'Fair opportunity. Combine with other related keywords in a topic cluster strategy.';
}

/**
 * Analyze multiple keywords and sort by opportunity
 * @param {array} keywords - Array of keyword strings
 * @returns {array} - Sorted analysis results
 */
function analyzeKeywordSet(keywords) {
  const analyses = keywords
    .filter(k => k && typeof k === 'string')
    .map(k => analyzeKeywordOpportunity(k))
    .sort((a, b) => b.opportunity.score - a.opportunity.score);

  return analyses;
}

module.exports = {
  calculateDifficulty,
  estimateSearchVolume,
  analyzeKeywordOpportunity,
  analyzeKeywordSet,
  getDifficultyLevel,
  generateRecommendation,
};
