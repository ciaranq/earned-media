// API endpoint for SEO analysis
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Log the URL being analyzed
    console.log(`Analyzing URL: ${url}`);
    
    try {
      // Analyze the URL
      const analysis = await analyzeSEO(url);
      return res.status(200).json(analysis);
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

// Function to analyze a URL
async function analyzeSEO(url) {
  // We'll need these packages
  const axios = require('axios');
  const cheerio = require('cheerio');
  
  try {
    console.log(`Fetching URL: ${url}`);
    
    // Fetch the webpage with a timeout
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAgent/1.0)'
      },
      timeout: 10000, // 10 second timeout
      maxRedirects: 5
    });
    
    console.log(`Successfully fetched URL: ${url}, status: ${response.status}`);
    
    // Parse HTML
    const $ = cheerio.load(response.data);
    
    // Extract basic SEO elements
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Text = $('h1').text().trim();
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const imgCount = $('img').length;
    const imgWithoutAlt = $('img:not([alt])').length;
    const wordCount = $('body').text().trim().split(/\s+/).length;
    
    console.log(`Extracted data from ${url}:`, { 
      title: title.substring(0, 30) + '...', 
      h1Count, 
      imgCount 
    });
    
    // Basic SEO analysis
    const issues = [];
    let score = 100; // Start with perfect score and subtract for issues
    
    // Check title
    if (!title) {
      issues.push({ severity: 'high', message: 'Missing title tag' });
      score -= 10;
    } else if (title.length < 10) {
      issues.push({ severity: 'medium', message: 'Title is too short' });
      score -= 5;
    } else if (title.length > 60) {
      issues.push({ severity: 'low', message: 'Title is too long' });
      score -= 2;
    }
    
    // Check meta description
    if (!metaDescription) {
      issues.push({ severity: 'medium', message: 'Missing meta description' });
      score -= 5;
    } else if (metaDescription.length < 50) {
      issues.push({ severity: 'low', message: 'Meta description is too short' });
      score -= 2;
    } else if (metaDescription.length > 160) {
      issues.push({ severity: 'low', message: 'Meta description is too long' });
      score -= 1;
    }
    
    // Check headings
    if (h1Count === 0) {
      issues.push({ severity: 'high', message: 'Missing H1 heading' });
      score -= 10;
    } else if (h1Count > 1) {
      issues.push({ severity: 'medium', message: 'Multiple H1 headings found' });
      score -= 5;
    }
    
    // Check images
    if (imgWithoutAlt > 0) {
      issues.push({ 
        severity: 'medium', 
        message: `${imgWithoutAlt} images missing alt attributes` 
      });
      score -= Math.min(10, imgWithoutAlt); // Cap at 10 points
    }
    
    // Check for SSL
    if (!url.startsWith('https://')) {
      issues.push({ severity: 'high', message: 'Site is not using HTTPS' });
      score -= 10;
    }
    
    // Check mobile viewport
    const hasViewport = $('meta[name="viewport"]').length > 0;
    if (!hasViewport) {
      issues.push({ severity: 'high', message: 'Missing viewport meta tag' });
      score -= 10;
    }
    
    // Ensure score stays within 0-100
    score = Math.max(0, Math.min(100, score));
    
    console.log(`Analysis complete for ${url}, score: ${score}`);
    
    // Return results
    return {
      url,
      score,
      title,
      metaDescription,
      h1: h1Text,
      metrics: {
        h1Count,
        h2Count,
        imgCount,
        imgWithoutAlt,
        wordCount
      },
      issues
    };
  } catch (error) {
    console.error(`Error analyzing ${url}:`, error.message);
    // Provide more specific error messages based on the error type
    if (error.code === 'ECONNABORTED') {
      throw new Error(`Timeout when connecting to ${url}`);
    }
    if (error.response) {
      throw new Error(`Failed to analyze ${url}: Received status ${error.response.status}`);
    }
    throw new Error(`Failed to analyze ${url}: ${error.message}`);
  }
}