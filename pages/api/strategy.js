// API endpoint for SEO Strategy Generation
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Generating SEO strategy for: ${url}`);

    try {
      const strategy = await generateSEOStrategy(url);
      return res.status(200).json(strategy);
    } catch (strategyError) {
      console.error('Strategy generation error:', strategyError);
      return res.status(500).json({
        error: 'Strategy generation failed',
        message: strategyError.message,
        stack: process.env.NODE_ENV === 'development' ? strategyError.stack : undefined
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

async function generateSEOStrategy(url) {
  const axios = require('axios');
  const cheerio = require('cheerio');

  try {
    console.log(`Fetching and analyzing URL: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAgent/1.0)'
      },
      timeout: 10000,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);

    // Quick analysis for strategy formulation
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Count = $('h1').length;
    const hasHTTPS = url.startsWith('https://');
    const hasViewport = $('meta[name="viewport"]').length > 0;
    const hasStructuredData = $('script[type="application/ld+json"]').length > 0;
    const imgWithoutAlt = $('img:not([alt])').length;
    const wordCount = $('body').text().trim().split(/\s+/).length;

    // Extract content for keyword analysis
    const bodyText = $('body').text().toLowerCase();
    const h1Text = $('h1').map((i, el) => $(el).text().trim()).get();
    const h2Text = $('h2').map((i, el) => $(el).text().trim()).get();

    // Determine primary issues and opportunities
    const technicalIssues = identifyTechnicalIssues({
      hasHTTPS,
      hasViewport,
      hasStructuredData,
      h1Count,
      imgWithoutAlt,
      title,
      metaDescription,
      wordCount
    });

    const contentAnalysis = analyzeContent(bodyText, h1Text, h2Text);
    const industry = inferIndustry(title, metaDescription, bodyText);

    // Determine strategic focus
    const strategicFocus = determineStrategicFocus(technicalIssues, contentAnalysis, industry);

    // Create timeline
    const timeline = createTimeline(technicalIssues, contentAnalysis, strategicFocus);

    // Generate action items
    const actionItems = generateActionItems(technicalIssues, contentAnalysis, strategicFocus);

    // Content strategy
    const contentStrategy = generateContentStrategy(contentAnalysis, industry, h1Text, h2Text);

    // Link building strategy
    const linkBuildingStrategy = generateLinkBuildingStrategy(industry, contentAnalysis);

    // Expected outcomes
    const expectedOutcomes = generateExpectedOutcomes(strategicFocus, technicalIssues);

    // KPIs
    const kpis = defineKPIs(strategicFocus);

    // Summary
    const summary = generateSummary(strategicFocus, timeline);

    console.log(`Strategy generation complete for ${url}`);

    return {
      url,
      focus: strategicFocus,
      timeline,
      actionItems,
      contentStrategy,
      linkBuildingStrategy,
      expectedOutcomes,
      kpis,
      summary
    };
  } catch (error) {
    console.error(`Error generating strategy for ${url}:`, error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error(`Timeout when connecting to ${url}`);
    }
    if (error.response) {
      throw new Error(`Failed to generate strategy for ${url}: Received status ${error.response.status}`);
    }
    throw new Error(`Failed to generate strategy for ${url}: ${error.message}`);
  }
}

function identifyTechnicalIssues(metrics) {
  const issues = [];

  if (!metrics.hasHTTPS) {
    issues.push({ type: 'security', severity: 'critical', issue: 'No HTTPS' });
  }
  if (!metrics.hasViewport) {
    issues.push({ type: 'mobile', severity: 'critical', issue: 'No viewport meta tag' });
  }
  if (!metrics.hasStructuredData) {
    issues.push({ type: 'structured-data', severity: 'medium', issue: 'Missing structured data' });
  }
  if (metrics.h1Count === 0) {
    issues.push({ type: 'content-structure', severity: 'high', issue: 'Missing H1' });
  }
  if (metrics.h1Count > 1) {
    issues.push({ type: 'content-structure', severity: 'medium', issue: 'Multiple H1 tags' });
  }
  if (metrics.imgWithoutAlt > 0) {
    issues.push({ type: 'accessibility', severity: 'medium', issue: `${metrics.imgWithoutAlt} images without alt text` });
  }
  if (!metrics.title || metrics.title.length < 30) {
    issues.push({ type: 'meta-tags', severity: 'high', issue: 'Poor title tag' });
  }
  if (!metrics.metaDescription || metrics.metaDescription.length < 120) {
    issues.push({ type: 'meta-tags', severity: 'medium', issue: 'Poor meta description' });
  }
  if (metrics.wordCount < 300) {
    issues.push({ type: 'content', severity: 'medium', issue: 'Thin content' });
  }

  return issues;
}

function analyzeContent(bodyText, h1Array, h2Array) {
  const words = bodyText.match(/\b[a-z]{3,}\b/g) || [];
  const wordCount = words.length;
  const uniqueWords = new Set(words).size;
  const diversity = uniqueWords / wordCount;

  return {
    wordCount,
    uniqueWords,
    diversity,
    hasGoodStructure: h1Array.length > 0 && h2Array.length > 0,
    topicDepth: h2Array.length,
    needsExpansion: wordCount < 500
  };
}

function inferIndustry(title, description, text) {
  const combinedText = (title + ' ' + description + ' ' + text).toLowerCase();

  const industryPatterns = [
    { name: 'E-commerce', keywords: ['shop', 'store', 'buy', 'product', 'price'] },
    { name: 'Technology', keywords: ['software', 'tech', 'app', 'digital', 'platform'] },
    { name: 'Healthcare', keywords: ['health', 'medical', 'care', 'patient', 'treatment'] },
    { name: 'Finance', keywords: ['financial', 'investment', 'bank', 'loan', 'insurance'] },
    { name: 'Education', keywords: ['education', 'course', 'learning', 'student', 'training'] },
    { name: 'Professional Services', keywords: ['service', 'consulting', 'business', 'professional'] }
  ];

  for (const industry of industryPatterns) {
    const matches = industry.keywords.filter(kw => combinedText.includes(kw)).length;
    if (matches >= 2) {
      return industry.name;
    }
  }

  return 'General';
}

function determineStrategicFocus(technicalIssues, contentAnalysis, industry) {
  const criticalIssues = technicalIssues.filter(i => i.severity === 'critical').length;
  const highIssues = technicalIssues.filter(i => i.severity === 'high').length;

  if (criticalIssues > 0 || highIssues >= 2) {
    return `Technical SEO Foundation: Address critical technical issues and establish a solid technical foundation to improve crawlability, indexability, and user experience in the ${industry} sector.`;
  }

  if (contentAnalysis.needsExpansion || contentAnalysis.topicDepth < 3) {
    return `Content Development & Topical Authority: Build comprehensive, authoritative content around core ${industry} topics to establish expertise and capture relevant search traffic.`;
  }

  return `SEO Optimization & Growth: Refine existing content, expand keyword targeting, and build authoritative backlinks to improve rankings and organic visibility in the ${industry} market.`;
}

function createTimeline(technicalIssues, contentAnalysis, strategicFocus) {
  const isTechnicalFocus = strategicFocus.includes('Technical SEO Foundation');
  const isContentFocus = strategicFocus.includes('Content Development');

  if (isTechnicalFocus) {
    return {
      month1: 'Fix critical technical issues: HTTPS implementation, mobile optimization, meta tags. Set up Google Search Console and analytics tracking.',
      month2: 'Implement structured data, optimize site speed, fix accessibility issues. Begin content audit and keyword mapping.',
      month3: 'Complete technical optimizations, launch initial content improvements, establish baseline metrics and monitoring.'
    };
  }

  if (isContentFocus) {
    return {
      month1: 'Conduct comprehensive keyword research and content gap analysis. Create content calendar and outline pillar content pieces.',
      month2: 'Publish 4-6 high-quality content pieces targeting primary keywords. Optimize existing content. Begin internal linking strategy.',
      month3: 'Continue content production (4-6 pieces), launch link building outreach, analyze performance and refine strategy.'
    };
  }

  return {
    month1: 'Optimize existing high-potential pages, conduct competitor analysis, identify quick-win keyword opportunities.',
    month2: 'Create targeted content for identified opportunities, implement technical improvements, begin strategic link building.',
    month3: 'Scale content production, expand link building efforts, monitor rankings and traffic, refine based on data.'
  };
}

function generateActionItems(technicalIssues, contentAnalysis, strategicFocus) {
  const actions = [];

  // Technical actions
  if (technicalIssues.some(i => i.type === 'security')) {
    actions.push({
      title: 'Implement HTTPS',
      description: 'Install SSL certificate and redirect all HTTP traffic to HTTPS',
      priority: 'high',
      owner: 'Technical Team'
    });
  }

  if (technicalIssues.some(i => i.type === 'mobile')) {
    actions.push({
      title: 'Mobile Optimization',
      description: 'Add viewport meta tag and ensure responsive design',
      priority: 'high',
      owner: 'Technical Team'
    });
  }

  if (technicalIssues.some(i => i.type === 'meta-tags')) {
    actions.push({
      title: 'Optimize Meta Tags',
      description: 'Improve title tags and meta descriptions across key pages',
      priority: 'high',
      owner: 'Content Team'
    });
  }

  if (technicalIssues.some(i => i.type === 'structured-data')) {
    actions.push({
      title: 'Add Structured Data',
      description: 'Implement schema.org markup for better search appearance',
      priority: 'medium',
      owner: 'Technical Team'
    });
  }

  if (technicalIssues.some(i => i.type === 'accessibility')) {
    actions.push({
      title: 'Improve Accessibility',
      description: 'Add alt text to all images and ensure WCAG compliance',
      priority: 'medium',
      owner: 'Content Team'
    });
  }

  // Content actions
  if (contentAnalysis.needsExpansion) {
    actions.push({
      title: 'Expand Content',
      description: 'Create comprehensive content targeting primary keywords (minimum 800 words per page)',
      priority: 'high',
      owner: 'Content Team'
    });
  }

  if (!contentAnalysis.hasGoodStructure) {
    actions.push({
      title: 'Improve Content Structure',
      description: 'Add proper heading hierarchy (H1-H6) to improve readability and SEO',
      priority: 'medium',
      owner: 'Content Team'
    });
  }

  // Strategic actions
  actions.push({
    title: 'Keyword Research & Mapping',
    description: 'Conduct comprehensive keyword research and map keywords to pages',
    priority: 'high',
    owner: 'Content Team'
  });

  actions.push({
    title: 'Content Calendar Creation',
    description: 'Develop 3-month content calendar aligned with keyword strategy',
    priority: 'medium',
    owner: 'Content Team'
  });

  actions.push({
    title: 'Link Building Campaign',
    description: 'Identify link building opportunities and begin outreach',
    priority: 'medium',
    owner: 'Link Building Team'
  });

  actions.push({
    title: 'Analytics Setup & Monitoring',
    description: 'Ensure proper tracking and create dashboard for KPI monitoring',
    priority: 'high',
    owner: 'Technical Team'
  });

  return actions;
}

function generateContentStrategy(contentAnalysis, industry, h1Array, h2Array) {
  const topics = [...new Set([...h1Array, ...h2Array])].slice(0, 5);

  return {
    topics: topics.length > 0 ? topics : [
      `Core ${industry} topics`,
      `${industry} best practices`,
      `${industry} solutions and services`,
      `${industry} case studies`,
      'Industry trends and insights'
    ],
    frequency: 'Publish 2-3 high-quality articles per week (8-12 per month)',
    description: `Focus on creating comprehensive, authoritative content around ${industry} topics. Develop pillar content pieces (2000+ words) supported by cluster content. Prioritize topics with high search volume and medium competition. Include multimedia elements, expert insights, and practical value.`
  };
}

function generateLinkBuildingStrategy(industry, contentAnalysis) {
  return `Target authoritative ${industry} websites, industry publications, and relevant blogs for link acquisition. Tactics: Create linkable assets (original research, infographics, comprehensive guides), pursue guest posting opportunities, leverage digital PR for brand mentions, engage in strategic partnerships, and participate in industry communities. Focus on quality over quantity, targeting DA 40+ domains with relevant audience overlap.`;
}

function generateExpectedOutcomes(strategicFocus, technicalIssues) {
  const outcomes = [];

  if (strategicFocus.includes('Technical')) {
    outcomes.push('Improved site crawlability and indexability');
    outcomes.push('Enhanced mobile user experience');
    outcomes.push('Faster page load times');
    outcomes.push('Better search engine understanding of content');
  }

  if (strategicFocus.includes('Content')) {
    outcomes.push('Increased organic search traffic (20-40% over 3 months)');
    outcomes.push('Improved rankings for target keywords');
    outcomes.push('Higher engagement metrics (time on page, pages per session)');
    outcomes.push('Enhanced topical authority in industry');
  }

  outcomes.push('Improved search visibility for branded and non-branded queries');
  outcomes.push('Increased quality backlink profile');
  outcomes.push('Better conversion rates from organic traffic');
  outcomes.push('Stronger foundation for long-term SEO growth');

  return outcomes;
}

function defineKPIs(strategicFocus) {
  return [
    { metric: 'Organic Traffic', target: '+25-40%' },
    { metric: 'Keyword Rankings', target: 'Top 10 for 5-10 terms' },
    { metric: 'Domain Authority', target: '+5 points' },
    { metric: 'Page Load Time', target: '<3 seconds' },
    { metric: 'Indexed Pages', target: '+20%' },
    { metric: 'Organic Conversions', target: '+30%' }
  ];
}

function generateSummary(strategicFocus, timeline) {
  return `This 3-month SEO strategy focuses on ${strategicFocus.split(':')[0].toLowerCase()}. The approach prioritizes ${timeline.month1.split('.')[0].toLowerCase()}, followed by ${timeline.month2.split('.')[0].toLowerCase()}, and concluding with ${timeline.month3.split('.')[0].toLowerCase()}. Success requires coordinated efforts between technical, content, and link building teams, with regular monitoring and adjustment based on performance data.`;
}
