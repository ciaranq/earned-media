// API endpoint for Keyword Strategy Builder - Clusters keywords and generates content strategy
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keywords, url, mode } = req.body;

    // Mode can be 'keywords' (direct input) or 'url' (extract from URL)
    if (!keywords && !url) {
      return res.status(400).json({ error: 'Either keywords or URL is required' });
    }

    console.log(`Performing keyword strategy analysis - Mode: ${mode}`);

    try {
      let keywordList;

      if (mode === 'url' && url) {
        // Extract keywords from URL
        keywordList = await extractKeywordsFromUrl(url);
      } else {
        // Parse keywords from input
        keywordList = parseKeywordInput(keywords);
      }

      if (keywordList.length === 0) {
        return res.status(400).json({ error: 'No valid keywords found' });
      }

      // Cluster the keywords
      const clusters = clusterKeywords(keywordList);

      // Generate strategy for each cluster
      const strategy = generateClusterStrategy(clusters);

      // Generate overall recommendations
      const recommendations = generateOverallRecommendations(clusters, strategy);

      // Generate content calendar
      const contentCalendar = generateContentCalendar(clusters, strategy);

      return res.status(200).json({
        totalKeywords: keywordList.length,
        clusters,
        strategy,
        recommendations,
        contentCalendar,
        exportData: prepareExportData(clusters, strategy)
      });
    } catch (analysisError) {
      console.error('Analysis error:', analysisError);
      return res.status(500).json({
        error: 'Analysis failed',
        message: analysisError.message,
        stack: process.env.NODE_ENV === 'development' ? analysisError.stack : undefined
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

// Parse keyword input from various formats (newline, comma, or tab separated)
function parseKeywordInput(input) {
  if (!input || typeof input !== 'string') return [];

  // Split by newlines, commas, or tabs
  const keywords = input
    .split(/[\n,\t]+/)
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0 && k.length < 100);

  // Remove duplicates
  return [...new Set(keywords)];
}

// Extract keywords from URL content
async function extractKeywordsFromUrl(url) {
  const axios = require('axios');
  const cheerio = require('cheerio');

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SEOAgent/1.0)'
    },
    timeout: 10000,
    maxRedirects: 5
  });

  const $ = cheerio.load(response.data);

  // Remove script and style tags
  $('script, style, noscript, svg').remove();

  // Extract text from important areas
  const title = $('title').text().trim();
  const h1Text = $('h1').map((i, el) => $(el).text().trim()).get().join(' ');
  const h2Text = $('h2').map((i, el) => $(el).text().trim()).get().join(' ');
  const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
  const metaDescription = $('meta[name="description"]').attr('content') || '';

  // Combine all important text
  const combinedText = [title, h1Text, h2Text, metaKeywords, metaDescription].join(' ');

  // Extract meaningful keywords/phrases
  const keywords = extractMeaningfulKeywords(combinedText);

  return keywords;
}

// Extract meaningful keywords from text
function extractMeaningfulKeywords(text) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them',
    'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all',
    'your', 'our', 'my', 'his', 'her', 'its', 'us', 'me', 'just', 'also',
    'very', 'really', 'more', 'most', 'some', 'any', 'no', 'not', 'only'
  ]);

  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const filtered = words.filter(w => !stopWords.has(w));

  // Count frequency
  const freq = {};
  filtered.forEach(w => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Get top keywords
  return Object.entries(freq)
    .filter(([word, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);
}

// Topic categories for clustering
const TOPIC_CATEGORIES = {
  'seo': {
    name: 'SEO & Search Optimization',
    keywords: ['seo', 'search', 'ranking', 'serp', 'organic', 'optimization', 'keywords', 'backlink', 'backlinks', 'link building', 'meta', 'indexing', 'crawl', 'crawling', 'sitemap', 'google', 'bing', 'search engine'],
    intent: 'Informational',
    contentType: 'Educational guides and tutorials'
  },
  'content': {
    name: 'Content Marketing',
    keywords: ['content', 'blog', 'blogging', 'article', 'articles', 'writing', 'copy', 'copywriting', 'storytelling', 'editorial', 'publishing', 'post', 'posts'],
    intent: 'Informational',
    contentType: 'How-to guides and best practices'
  },
  'technical': {
    name: 'Technical & Development',
    keywords: ['technical', 'code', 'coding', 'developer', 'development', 'api', 'html', 'css', 'javascript', 'website', 'web', 'hosting', 'server', 'performance', 'speed', 'loading', 'mobile', 'responsive'],
    intent: 'Informational',
    contentType: 'Technical documentation and tutorials'
  },
  'marketing': {
    name: 'Digital Marketing',
    keywords: ['marketing', 'digital', 'campaign', 'advertising', 'ads', 'ppc', 'cpc', 'cpm', 'social media', 'facebook', 'instagram', 'linkedin', 'twitter', 'email', 'newsletter', 'automation'],
    intent: 'Commercial',
    contentType: 'Strategy guides and case studies'
  },
  'analytics': {
    name: 'Analytics & Data',
    keywords: ['analytics', 'data', 'metrics', 'tracking', 'measurement', 'reporting', 'dashboard', 'kpi', 'conversion', 'conversions', 'rate', 'traffic', 'visitors', 'sessions', 'bounce'],
    intent: 'Informational',
    contentType: 'Data analysis and reporting guides'
  },
  'ecommerce': {
    name: 'E-commerce & Sales',
    keywords: ['ecommerce', 'shop', 'store', 'product', 'products', 'buy', 'purchase', 'cart', 'checkout', 'payment', 'sales', 'selling', 'retail', 'price', 'pricing', 'discount'],
    intent: 'Transactional',
    contentType: 'Product pages and buying guides'
  },
  'local': {
    name: 'Local SEO & Business',
    keywords: ['local', 'location', 'near me', 'nearby', 'city', 'region', 'business', 'gmb', 'google my business', 'maps', 'directions', 'reviews', 'rating', 'ratings'],
    intent: 'Local',
    contentType: 'Local landing pages and location guides'
  },
  'branding': {
    name: 'Branding & Identity',
    keywords: ['brand', 'branding', 'identity', 'logo', 'design', 'reputation', 'awareness', 'recognition', 'trust', 'authority', 'credibility'],
    intent: 'Commercial',
    contentType: 'Brand storytelling and thought leadership'
  },
  'services': {
    name: 'Services & Solutions',
    keywords: ['service', 'services', 'solution', 'solutions', 'consulting', 'agency', 'company', 'firm', 'professional', 'expert', 'specialists', 'help', 'support', 'assistance'],
    intent: 'Commercial',
    contentType: 'Service pages and case studies'
  },
  'industry': {
    name: 'Industry Specific',
    keywords: ['industry', 'sector', 'niche', 'market', 'vertical', 'healthcare', 'finance', 'legal', 'real estate', 'technology', 'education', 'manufacturing'],
    intent: 'Informational',
    contentType: 'Industry-specific content and guides'
  }
};

// Cluster keywords into topically related groups
function clusterKeywords(keywords) {
  const clusters = {};
  const unclustered = [];

  // Initialize clusters
  Object.keys(TOPIC_CATEGORIES).forEach(key => {
    clusters[key] = {
      id: key,
      name: TOPIC_CATEGORIES[key].name,
      keywords: [],
      intent: TOPIC_CATEGORIES[key].intent,
      contentType: TOPIC_CATEGORIES[key].contentType,
      priority: 'medium'
    };
  });

  // Add 'other' cluster for uncategorized keywords
  clusters['other'] = {
    id: 'other',
    name: 'Other Topics',
    keywords: [],
    intent: 'Mixed',
    contentType: 'Various content types',
    priority: 'low'
  };

  // Assign each keyword to the best matching cluster
  keywords.forEach(keyword => {
    let bestMatch = null;
    let bestScore = 0;

    Object.entries(TOPIC_CATEGORIES).forEach(([key, category]) => {
      let score = 0;

      // Check if keyword contains any category keywords
      category.keywords.forEach(catKeyword => {
        if (keyword.includes(catKeyword) || catKeyword.includes(keyword)) {
          score += catKeyword.length; // Longer matches score higher
        }
        // Check for word overlap
        const keywordWords = keyword.split(/\s+/);
        const catWords = catKeyword.split(/\s+/);
        keywordWords.forEach(kw => {
          catWords.forEach(cw => {
            if (kw === cw || (kw.length > 4 && cw.length > 4 && (kw.includes(cw) || cw.includes(kw)))) {
              score += 2;
            }
          });
        });
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = key;
      }
    });

    // Assign to best cluster or 'other'
    if (bestMatch && bestScore > 0) {
      clusters[bestMatch].keywords.push(keyword);
    } else {
      clusters['other'].keywords.push(keyword);
    }
  });

  // Calculate priority based on keyword count
  Object.values(clusters).forEach(cluster => {
    if (cluster.keywords.length >= 10) {
      cluster.priority = 'high';
    } else if (cluster.keywords.length >= 5) {
      cluster.priority = 'medium';
    } else {
      cluster.priority = 'low';
    }
  });

  // Filter out empty clusters and sort by keyword count
  const filteredClusters = Object.values(clusters)
    .filter(c => c.keywords.length > 0)
    .sort((a, b) => b.keywords.length - a.keywords.length);

  // Generate sub-clusters for large clusters
  filteredClusters.forEach(cluster => {
    if (cluster.keywords.length > 8) {
      cluster.subClusters = generateSubClusters(cluster.keywords);
    }
  });

  return filteredClusters;
}

// Generate sub-clusters for large keyword groups
function generateSubClusters(keywords) {
  const subClusters = [];

  // Group by common prefixes or patterns
  const groups = {};

  keywords.forEach(keyword => {
    const words = keyword.split(/\s+/);
    const firstWord = words[0];

    if (!groups[firstWord]) {
      groups[firstWord] = [];
    }
    groups[firstWord].push(keyword);
  });

  // Convert to sub-clusters
  Object.entries(groups).forEach(([prefix, kws]) => {
    if (kws.length >= 2) {
      subClusters.push({
        prefix,
        keywords: kws,
        suggestedPage: generatePageSuggestion(prefix, kws)
      });
    }
  });

  return subClusters.slice(0, 5); // Limit to 5 sub-clusters
}

// Generate page suggestion for a keyword group
function generatePageSuggestion(prefix, keywords) {
  const commonWords = findCommonWords(keywords);
  const title = commonWords.length > 0
    ? `${capitalizeWords(commonWords.slice(0, 3).join(' '))} Guide`
    : `${capitalizeWords(prefix)} Resources`;

  return {
    title,
    suggestedUrl: `/${prefix.toLowerCase().replace(/\s+/g, '-')}-guide`,
    targetKeywords: keywords.slice(0, 5)
  };
}

// Find common words across keywords
function findCommonWords(keywords) {
  if (keywords.length === 0) return [];

  const wordCounts = {};
  keywords.forEach(kw => {
    const words = kw.split(/\s+/);
    words.forEach(w => {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });
  });

  return Object.entries(wordCounts)
    .filter(([word, count]) => count >= Math.ceil(keywords.length / 2))
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

// Capitalize words
function capitalizeWords(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Generate strategy for each cluster
function generateClusterStrategy(clusters) {
  return clusters.map(cluster => {
    const strategy = {
      clusterId: cluster.id,
      clusterName: cluster.name,
      keywordCount: cluster.keywords.length,
      priority: cluster.priority,

      // Content strategy
      contentStrategy: generateContentStrategy(cluster),

      // Page recommendations
      pageRecommendations: generatePageRecommendations(cluster),

      // Internal linking strategy
      internalLinking: generateInternalLinkingStrategy(cluster),

      // Quick wins (low competition opportunities)
      quickWins: identifyQuickWins(cluster.keywords),

      // Action items
      actionItems: generateActionItems(cluster)
    };

    return strategy;
  });
}

// Generate content strategy for a cluster
function generateContentStrategy(cluster) {
  const keywordCount = cluster.keywords.length;

  let approach, frequency, contentTypes;

  if (cluster.priority === 'high') {
    approach = 'Comprehensive coverage with pillar content and supporting articles';
    frequency = '2-3 articles per week';
    contentTypes = ['Pillar page (3000+ words)', 'Blog posts (1500+ words)', 'How-to guides', 'FAQ pages'];
  } else if (cluster.priority === 'medium') {
    approach = 'Targeted content focusing on high-value keywords';
    frequency = '1-2 articles per week';
    contentTypes = ['In-depth guides (2000+ words)', 'Blog posts', 'Comparison articles'];
  } else {
    approach = 'Opportunistic content for long-tail keywords';
    frequency = '1 article per week';
    contentTypes = ['Blog posts (1000+ words)', 'Quick guides', 'FAQ entries'];
  }

  return {
    approach,
    frequency,
    contentTypes,
    intent: cluster.intent,
    suggestedTopics: generateTopicSuggestions(cluster.keywords)
  };
}

// Generate topic suggestions from keywords
function generateTopicSuggestions(keywords) {
  const topics = [];

  // Generate topic ideas from keywords
  keywords.slice(0, 10).forEach(keyword => {
    const templates = [
      `Complete Guide to ${capitalizeWords(keyword)}`,
      `How to ${capitalizeWords(keyword)}: Best Practices`,
      `${capitalizeWords(keyword)}: Everything You Need to Know`,
      `Top 10 ${capitalizeWords(keyword)} Tips for 2024`,
      `${capitalizeWords(keyword)} vs Alternatives: Comparison`
    ];

    topics.push({
      keyword,
      suggestions: templates.slice(0, 2)
    });
  });

  return topics.slice(0, 5);
}

// Generate page recommendations
function generatePageRecommendations(cluster) {
  const recommendations = [];

  // Pillar page
  if (cluster.priority === 'high' || cluster.keywords.length >= 5) {
    recommendations.push({
      type: 'Pillar Page',
      title: `Ultimate Guide to ${cluster.name}`,
      description: `Comprehensive resource covering all aspects of ${cluster.name.toLowerCase()}`,
      targetKeywords: cluster.keywords.slice(0, 5),
      wordCount: '3000-5000 words',
      priority: 'high'
    });
  }

  // Category/hub pages
  if (cluster.subClusters && cluster.subClusters.length > 0) {
    cluster.subClusters.forEach(sub => {
      recommendations.push({
        type: 'Hub Page',
        title: sub.suggestedPage.title,
        description: `Focused resource on ${sub.prefix}`,
        targetKeywords: sub.keywords.slice(0, 3),
        wordCount: '1500-2500 words',
        priority: 'medium'
      });
    });
  }

  // Individual keyword pages for top keywords
  cluster.keywords.slice(0, 3).forEach(keyword => {
    recommendations.push({
      type: 'Blog Post',
      title: `How to Master ${capitalizeWords(keyword)}`,
      description: `Detailed guide targeting "${keyword}"`,
      targetKeywords: [keyword],
      wordCount: '1500-2000 words',
      priority: cluster.priority
    });
  });

  return recommendations;
}

// Generate internal linking strategy
function generateInternalLinkingStrategy(cluster) {
  return {
    structure: 'Hub and Spoke',
    description: `Create a central pillar page for ${cluster.name} that links to all related content. Each piece of content should link back to the pillar and to related pieces.`,
    linkingRules: [
      `Every article in this cluster should link to the main ${cluster.name} pillar page`,
      'Use exact-match anchor text for primary keywords (sparingly)',
      'Cross-link related articles within the cluster',
      'Include contextual links in the body content',
      'Add "Related Articles" sections at the end of each post'
    ],
    suggestedAnchors: cluster.keywords.slice(0, 5).map(kw => ({
      keyword: kw,
      anchorVariations: [kw, `learn about ${kw}`, `${kw} guide`, `more on ${kw}`]
    }))
  };
}

// Identify quick wins (easier opportunities)
function identifyQuickWins(keywords) {
  const quickWins = [];

  // Long-tail keywords are typically easier to rank for
  const longTail = keywords.filter(k => k.split(/\s+/).length >= 3);

  longTail.slice(0, 5).forEach(keyword => {
    quickWins.push({
      keyword,
      reason: 'Long-tail keyword with lower competition',
      suggestedAction: `Create focused content targeting "${keyword}"`,
      estimatedDifficulty: 'Low'
    });
  });

  // Question-based keywords
  const questionKeywords = keywords.filter(k =>
    k.startsWith('how') || k.startsWith('what') || k.startsWith('why') ||
    k.startsWith('when') || k.startsWith('where') || k.includes('?')
  );

  questionKeywords.slice(0, 3).forEach(keyword => {
    quickWins.push({
      keyword,
      reason: 'Question-based query - great for featured snippets',
      suggestedAction: `Create FAQ content or Q&A format article`,
      estimatedDifficulty: 'Low-Medium'
    });
  });

  return quickWins;
}

// Generate action items for a cluster
function generateActionItems(cluster) {
  const items = [];

  // Priority 1: Audit existing content
  items.push({
    priority: 1,
    action: 'Content Audit',
    description: `Review existing content for ${cluster.name} keywords`,
    team: 'Content Team',
    timeframe: 'Week 1'
  });

  // Priority 2: Create pillar content
  if (cluster.priority === 'high') {
    items.push({
      priority: 2,
      action: 'Create Pillar Page',
      description: `Develop comprehensive pillar content for ${cluster.name}`,
      team: 'Content Team',
      timeframe: 'Week 2-3'
    });
  }

  // Priority 3: Optimize existing pages
  items.push({
    priority: 3,
    action: 'On-Page Optimization',
    description: `Optimize title tags, meta descriptions, and headers for cluster keywords`,
    team: 'SEO Team',
    timeframe: 'Week 2'
  });

  // Priority 4: Internal linking
  items.push({
    priority: 4,
    action: 'Internal Linking',
    description: 'Implement hub-and-spoke linking structure',
    team: 'SEO Team',
    timeframe: 'Week 3'
  });

  // Priority 5: Create supporting content
  items.push({
    priority: 5,
    action: 'Supporting Content',
    description: `Create ${Math.min(cluster.keywords.length, 5)} supporting articles`,
    team: 'Content Team',
    timeframe: 'Week 4-6'
  });

  return items;
}

// Generate overall recommendations
function generateOverallRecommendations(clusters, strategy) {
  const totalKeywords = clusters.reduce((sum, c) => sum + c.keywords.length, 0);
  const highPriorityClusters = clusters.filter(c => c.priority === 'high');

  return {
    summary: `Your ${totalKeywords} keywords have been organized into ${clusters.length} topical clusters. ${highPriorityClusters.length > 0 ? `Focus on ${highPriorityClusters.length} high-priority cluster(s) first.` : 'Start with the clusters containing the most keywords.'}`,

    topPriorities: [
      {
        title: 'Build Topic Authority',
        description: 'Focus on creating comprehensive content for your top clusters to establish topical authority.'
      },
      {
        title: 'Implement Pillar-Cluster Model',
        description: 'Create pillar pages for each major cluster with supporting content that links back.'
      },
      {
        title: 'Prioritize Quick Wins',
        description: 'Target long-tail keywords first for faster ranking results while building authority for competitive terms.'
      }
    ],

    contentGaps: identifyContentGaps(clusters),

    estimatedTimeline: {
      phase1: {
        name: 'Foundation (Month 1)',
        activities: ['Content audit', 'Keyword mapping', 'Create pillar pages for top 2 clusters']
      },
      phase2: {
        name: 'Expansion (Month 2-3)',
        activities: ['Supporting content creation', 'Internal linking optimization', 'On-page SEO updates']
      },
      phase3: {
        name: 'Optimization (Month 4+)',
        activities: ['Performance tracking', 'Content updates', 'Link building for pillar pages']
      }
    }
  };
}

// Identify content gaps
function identifyContentGaps(clusters) {
  const gaps = [];

  clusters.forEach(cluster => {
    if (cluster.keywords.length < 3) {
      gaps.push({
        cluster: cluster.name,
        issue: 'Limited keyword coverage',
        recommendation: 'Research additional keywords for this topic area'
      });
    }

    // Check for missing intent types
    if (cluster.intent === 'Transactional' && cluster.keywords.every(k => !k.includes('buy') && !k.includes('price'))) {
      gaps.push({
        cluster: cluster.name,
        issue: 'Missing transactional keywords',
        recommendation: 'Add purchase-intent keywords like "buy [product]" or "[product] price"'
      });
    }
  });

  return gaps;
}

// Generate content calendar
function generateContentCalendar(clusters, strategy) {
  const calendar = {
    weeks: []
  };

  // Prioritize high-priority clusters
  const sortedClusters = [...clusters].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  let weekNum = 1;

  sortedClusters.slice(0, 4).forEach(cluster => {
    // Week for pillar content
    calendar.weeks.push({
      week: weekNum,
      focus: cluster.name,
      contentPieces: [
        {
          type: 'Pillar Page',
          title: `${cluster.name} Ultimate Guide`,
          keywords: cluster.keywords.slice(0, 3),
          wordCount: 3000
        }
      ]
    });
    weekNum++;

    // Weeks for supporting content
    const supportingKeywords = cluster.keywords.slice(3, 7);
    if (supportingKeywords.length > 0) {
      calendar.weeks.push({
        week: weekNum,
        focus: cluster.name,
        contentPieces: supportingKeywords.map(kw => ({
          type: 'Blog Post',
          title: `Guide to ${capitalizeWords(kw)}`,
          keywords: [kw],
          wordCount: 1500
        }))
      });
      weekNum++;
    }
  });

  return calendar;
}

// Prepare data for export
function prepareExportData(clusters, strategy) {
  return {
    csv: generateCSVData(clusters),
    json: { clusters, strategy }
  };
}

// Generate CSV-formatted data
function generateCSVData(clusters) {
  const rows = [['Cluster', 'Priority', 'Keyword', 'Intent', 'Content Type']];

  clusters.forEach(cluster => {
    cluster.keywords.forEach(keyword => {
      rows.push([
        cluster.name,
        cluster.priority,
        keyword,
        cluster.intent,
        cluster.contentType
      ]);
    });
  });

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}
