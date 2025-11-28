Project Context
I have a Next.js app running on Vercel. I want to add a comprehensive technical SEO audit feature that analyzes any given URL and returns detailed SEO insights.
Current Setup

Framework: Next.js 14
Hosting: Vercel
Plan:  Free
Existing Structure:  Code currently exists that does the ui and some pages 

Feature Requirements for the technical pages
Core Functionality
Build a technical SEO audit tool that returns analysis covering:

Crawling & Indexing

Robots.txt analysis
XML sitemap detection and validation
Meta robots tags
Canonical tags
Indexability status


On-Page SEO Elements

Title tag (length, presence, uniqueness)
Meta description (length, presence)
H1-H6 header hierarchy
Image alt tags
Internal/external link counts
Schema markup detection


Core Web Vitals & Performance

Use Google PageSpeed Insights API
LCP, FID/INP, CLS scores
Performance score
Page load metrics
Image optimization issues


Mobile Optimization

Mobile-friendly test
Viewport configuration
Mobile usability issues


Technical Elements

HTTPS/SSL check
Canonical URL validation
Open Graph tags
Twitter Card tags
Structured data (JSON-LD, Microdata)


Content Analysis

Word count
Readability score (basic)
Duplicate content check (meta/title)
Content-to-code ratio


Site Structure (if multi-page crawl)

Internal link structure
Broken links detection
Redirect chains
Page depth analysis



Technical Implementation Requirements
API Routes Structure
/app/api/seo-audit/route.ts          # Main audit endpoint
/app/api/seo-audit/pagespeed/route.ts # PageSpeed API wrapper
/app/api/seo-audit/crawl/route.ts     # Page crawling logic
Libraries to Use

Crawling: cheerio for HTML parsing, node-fetch or native fetch
Performance: Google PageSpeed Insights API
Robots.txt: robots-parser
Sitemap: xml2js or native parsing
URL handling: Native URL API
SEO analysis: Custom logic + metascraper (optional)

Environment Variables Needed
GOOGLE_PAGESPEED_API_KEY=your_key_here
Response Format
Return JSON structure:
typescript{
  url: string;
  timestamp: string;
  status: 'success' | 'error';
  data: {
    onPage: {
      title: { value: string; length: number; issues: string[] };
      metaDescription: { value: string; length: number; issues: string[] };
      headings: { h1: string[]; h2: string[]; ... };
      // ... more
    };
    performance: {
      coreWebVitals: { lcp: number; fid: number; cls: number };
      scores: { performance: number; accessibility: number; ... };
      // ... more
    };
    technical: {
      https: boolean;
      robotsTxt: { exists: boolean; content: string; };
      sitemap: { exists: boolean; urls: string[]; };
      // ... more
    };
    // ... other sections
  };
  errors: string[];
}
Constraints & Requirements
Vercel Serverless Limits

Execution time: Must complete within 60 seconds (or 10 seconds on free tier)
Strategy: For MVP, analyze single page deeply. Multi-page crawl can be Phase 2
Error handling: Graceful failures with detailed error messages

Code Quality Standards

TypeScript with strict types
Proper error handling (try/catch blocks)
Rate limiting considerations for external APIs
Caching where possible (Vercel Edge Cache)
Progress indicators for long-running tasks

File Headers (Use my standard format)
typescript/*
Description: [Brief description]
Version: 1.0
Author: Ciaran Quinlan
Filename: [path/filename.ts]
Dependencies: [key libraries]
*/
Development Process
Step 1: Explain Architecture
Before writing code, explain:

File structure you'll create
API route organization
Data flow from frontend → API → external services → response
Which checks happen in parallel vs sequential
Error handling strategy
Rate limiting approach

Step 2: Create Core Files

Type definitions (types/seo-audit.ts)
Main API route (/app/api/seo-audit/route.ts)
Utility functions for each analysis type
PageSpeed API integration
HTML parsing and analysis functions

Step 3: Frontend Component (Optional for now)
Basic form to input URL and display results (can be simple MVP)
Specific Implementation Notes
Google PageSpeed Insights API

API Key required (free, 25,000 requests/day)
Endpoint: https://www.googleapis.com/pagespeedonline/v5/runPagespeed
Parameters: url, strategy (mobile/desktop), category (performance, accessibility, seo)

Crawling Strategy

Use cheerio to parse HTML
Set proper User-Agent header
Timeout requests after 30 seconds
Handle redirects properly
Respect robots.txt

Error Scenarios to Handle

URL doesn't resolve
Timeout
Blocked by robots.txt
No response / network error
Invalid HTML
PageSpeed API rate limit
SSL certificate errors

Testing Requirements

Test with various URLs (fast sites, slow sites, broken sites)
Test with HTTP and HTTPS
Test with sites that block crawlers
Verify all response data is properly typed

Success Criteria
✅ Can analyze any public URL
✅ Returns comprehensive SEO data
✅ Completes within Vercel timeout limits
✅ Proper error handling
✅ Well-typed TypeScript
✅ Clear, actionable insights
Questions for You (Claude Code might ask)

Do you want to store audit results in a database?
Should there be authentication/rate limiting per user?
Do you want PDF/CSV export of results?
Should it analyze multiple pages or just the input URL?
What's your priority: speed or depth of analysis?

Additional Context

This is part of a larger SEO analysis tool
Future features may include keyword analysis, competitor comparison
User experience should be clean and professional
Results should be actionable, not just data dumps


START BY: Analyzing the current project structure, then propose the file organization and architecture before writing any code. Get my approval on the approach before implementing.