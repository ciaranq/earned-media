# SEO Agent API Documentation

## Overview

The SEO Agent provides comprehensive SEO analysis through RESTful API endpoints. All endpoints are POST-based and accept JSON request bodies.

### Base URL
```
/api
```

### Authentication
Currently no authentication required. Rate limiting is enabled (50 requests per 15 minutes per IP).

---

## Endpoints

### 1. Basic SEO Analysis

**Endpoint:** `POST /api/analyze`

Performs quick, baseline SEO analysis on a URL.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "score": 85,
  "title": "Page Title",
  "metaDescription": "Page description",
  "h1": "Main Heading",
  "metrics": {
    "h1Count": 1,
    "h2Count": 3,
    "imgCount": 5,
    "imgWithoutAlt": 0,
    "wordCount": 1250
  },
  "issues": [
    {
      "severity": "low",
      "message": "Title could be more descriptive"
    }
  ]
}
```

**Status Codes:**
- `200` - Analysis completed successfully
- `400` - Missing URL parameter
- `500` - Analysis failed

---

### 2. Technical SEO Audit

**Endpoint:** `POST /api/technical`

Comprehensive technical SEO audit analyzing 20+ factors.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "score": 72,
  "status": "good",
  "crawling": {
    "passed": true,
    "issues": [],
    "details": {
      "robotsExists": true,
      "sitemapExists": true,
      "canonicalTags": 1
    }
  },
  "onPage": {
    "passed": false,
    "issues": [
      {
        "severity": "high",
        "type": "meta-robots",
        "message": "Meta robots tag not found",
        "recommendation": "Add meta robots tag for indexing control"
      }
    ]
  },
  "performance": {
    "loadTime": 2850,
    "issues": []
  },
  "content": {
    "wordCount": 1850,
    "readingTime": "8 mins",
    "paragraphs": 12
  },
  "security": {
    "https": true,
    "issues": [
      {
        "severity": "medium",
        "header": "Content-Security-Policy",
        "message": "Missing recommended security header"
      }
    ]
  },
  "metadata": {
    "executionTime": 3240,
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "2.0"
  }
}
```

**Status Codes:**
- `200` - Audit completed successfully
- `400` - Missing URL parameter
- `500` - Audit failed

---

### 3. Keyword Research

**Endpoint:** `POST /api/keywords`

Analyzes page content for keyword opportunities.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "industry": "Technology",
  "contentAnalysis": {
    "totalWords": 1850,
    "uniqueWords": 425,
    "averageWordLength": 5.2
  },
  "primaryKeywords": [
    {
      "keyword": "SEO analysis",
      "frequency": 12,
      "intent": "informational",
      "competitiveness": "moderate"
    }
  ],
  "secondaryKeywords": [
    {
      "keyword": "technical SEO",
      "frequency": 8,
      "intent": "informational"
    }
  ],
  "longTailKeywords": [
    {
      "keyword": "best SEO analysis tools",
      "frequency": 2,
      "intent": "commercial"
    }
  ],
  "opportunities": [
    {
      "suggestion": "Content gap: keyword research tools",
      "type": "expansion",
      "priority": "high"
    }
  ],
  "recommendations": [
    "Target long-tail keywords with 3+ words for easier ranking",
    "Increase content depth for primary keywords"
  ]
}
```

**Status Codes:**
- `200` - Analysis completed successfully
- `400` - Missing URL parameter
- `500` - Analysis failed

---

### 4. SEO Strategy Generation

**Endpoint:** `POST /api/strategy`

Generates 1-3 month SEO action plan based on page analysis.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "duration": "3 months",
  "focus": "technical fixes + content expansion",
  "summary": "This site has solid fundamentals but needs...",
  "months": [
    {
      "month": 1,
      "focus": "Technical Fixes",
      "weeks": [
        {
          "week": 1,
          "theme": "Crawlability",
          "actionItems": [
            {
              "item": "Fix robots.txt configuration",
              "team": "Technical",
              "priority": "critical",
              "expectedOutcome": "Improve crawl efficiency by 40%"
            }
          ]
        }
      ]
    }
  ],
  "contentStrategy": {
    "topics": ["Topic 1", "Topic 2"],
    "publishingFrequency": "2x per week",
    "format": "Mix of guides and case studies"
  },
  "linkBuilding": {
    "approach": "Industry-focused outreach",
    "targets": "30-40 links per month"
  },
  "kpis": [
    {
      "metric": "Organic traffic",
      "baseline": 1200,
      "target": 3000,
      "timeline": "3 months"
    }
  ],
  "expectedResults": "30-50% organic traffic increase within 3 months"
}
```

**Status Codes:**
- `200` - Strategy generated successfully
- `400` - Missing URL parameter
- `500` - Generation failed

---

## Utility Modules

### Export Formats

Convert analysis results to multiple formats:

**Functions:**
- `exportAsJSON(data, filename)` - Export as JSON
- `exportTechnicalAuditAsCSV(auditData)` - Export audit as CSV
- `exportKeywordsAsCSV(keywordData)` - Export keywords as CSV
- `generateHTMLReport(data, domain)` - Generate printable HTML report

**Usage Example:**
```javascript
const { generateHTMLReport, downloadFile } = require('../utils/exportFormats');

const report = generateHTMLReport(analysisData, 'example.com');
downloadFile(report, 'report.html', 'text/html');
```

---

### Keyword Difficulty Scoring

Estimate keyword ranking difficulty and search volume:

**Functions:**
- `calculateDifficulty(keyword)` - Returns difficulty score (0-100)
- `estimateSearchVolume(keyword)` - Returns volume estimate and category
- `analyzeKeywordOpportunity(keyword)` - Complete keyword analysis

**Usage Example:**
```javascript
const { analyzeKeywordOpportunity } = require('../utils/keywordDifficulty');

const analysis = analyzeKeywordOpportunity('best SEO tools');
// Returns: { difficulty, searchVolume, opportunity, recommendation }
```

---

### Core Web Vitals Analysis

Analyze performance metrics:

**Functions:**
- `assessCoreWebVitals(pageMetrics)` - Complete Core Web Vitals assessment
- `analyzeLCP(loadTime)` - Largest Contentful Paint analysis
- `analyzeFID(resourceCount)` - First Input Delay analysis
- `analyzeCLS(pageData)` - Cumulative Layout Shift analysis

**Usage Example:**
```javascript
const { assessCoreWebVitals } = require('../utils/coreWebVitals');

const vitals = assessCoreWebVitals({
  loadTime: 2850,
  resourceCount: 45,
  imagesWithoutDimensions: 2
});
```

---

## Error Handling

All endpoints return consistent error responses:

**Error Response Format:**
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "stack": "(development only)"
}
```

**Common Errors:**
- `400 Bad Request` - Missing or invalid parameters
- `405 Method Not Allowed` - Wrong HTTP method (must be POST)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server-side processing error

---

## Rate Limiting

- **Limit:** 50 requests per 15 minutes per IP address
- **Headers:** Rate limit info included in response headers
- **Behavior:** Additional requests receive `429` status

---

## Best Practices

1. **URL Format:** Always include protocol (http:// or https://)
2. **Timeout:** Requests timeout after 10 seconds
3. **Redirects:** Up to 5 redirects are followed
4. **Cache:** Results are not cached; each request re-analyzes

---

## Webhook/Integration Support (Coming Soon)

Future versions will support:
- Google Search Console integration
- Google Analytics integration
- Scheduled monitoring
- Email reports

---

## Support

For issues or questions, contact the development team or open an issue on the project repository.
