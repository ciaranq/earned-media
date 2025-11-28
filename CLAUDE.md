# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SEO Agent for Earned Media is a Next.js web application that provides comprehensive SEO analysis and strategy tools for Earned Media clients. The application offers three main analysis capabilities:
1. **Technical SEO Audit** - Identifies technical issues and prioritizes corrections
2. **Keyword Research** - Performs high-level keyword analysis
3. **SEO Strategy** - Generates 1-3 month strategic plans with support for Link Building & Content teams

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Technology Stack
- **Framework**: Next.js 14.0.3 (Pages Router)
- **Runtime**: Node.js with Next.js API routes
- **Styling**: Inline styles (no CSS framework currently used, despite Tailwind being in devDependencies)
- **Web Scraping**: axios + cheerio for HTML parsing
- **Email**: nodemailer with SMTP configuration

### Project Structure

```
pages/
├── index.js           # Main SEO analyzer page with shared Header component
├── technical.js       # Technical SEO audit page
├── keywords.js        # Keyword research page
├── strategy.js        # SEO strategy generation page
├── about.js           # About page
├── tools.js           # Tools listing page
├── contact.js         # Contact form
└── api/
    ├── analyze.js     # POST endpoint for basic SEO analysis
    ├── technical.js   # POST endpoint for technical SEO audit
    ├── keywords.js    # POST endpoint for keyword research
    ├── strategy.js    # POST endpoint for strategy generation
    ├── contact.js     # POST endpoint for contact form emails
    └── test-email.js  # Email testing endpoint
```

### Key Components

**Header Component** (pages/index.js:4-36)
- Shared navigation component exported from index.js
- Imported and reused across all pages
- Branding: "SEO Agent for Earned Media"
- Navigation links: Technical, Keywords, Strategy, About, Tools, Contact

**SEO Analysis Engine** (pages/api/analyze.js:39-168)
- `analyzeSEO()` function performs the core analysis
- Uses axios to fetch webpage HTML
- Parses with cheerio to extract SEO elements
- Analyzes: title, meta description, headings, images, alt text, HTTPS, viewport
- Returns score (0-100) and severity-categorized issues (high/medium/low)

**Email System** (pages/api/contact.js)
- Uses nodemailer with connection pooling
- SMTP configuration via environment variables
- Transporter initialized outside handler for connection reuse
- Sends contact form submissions to configured email address

**Technical SEO Audit Engine** (pages/api/technical.js)
- `performTechnicalAudit()` function runs comprehensive technical analysis
- Checks 20+ technical SEO factors including HTTPS, mobile optimization, structured data, meta tags, security headers, performance metrics
- Returns prioritized issues (critical/high/medium/low) with specific recommendations
- Includes detailed metrics: load time, heading structure, link counts, script counts
- Scoring system deducts points based on severity of issues found

**Keyword Research Engine** (pages/api/keywords.js)
- `performKeywordResearch()` function analyzes page content for keyword opportunities
- Extracts and analyzes word frequency, phrase frequency, and content patterns
- Identifies primary keywords (high frequency + importance), secondary keywords, and long-tail variations
- Infers industry/topic from content analysis
- Provides keyword opportunities and strategic recommendations
- Categorizes keywords by search intent (transactional/informational/navigational)

**SEO Strategy Generator** (pages/api/strategy.js)
- `generateSEOStrategy()` function creates comprehensive 1-3 month SEO plans
- Analyzes both technical issues and content quality to determine strategic focus
- Generates month-by-month timeline with specific milestones
- Creates prioritized action items with team ownership (Technical/Content/Link Building teams)
- Provides content strategy including topics and publishing frequency
- Defines link building approach tailored to industry
- Sets KPIs and expected outcomes for tracking success

### Environment Configuration

Required environment variables (see env-file.sh for reference):
```
SMTP_HOST          # SMTP server hostname
SMTP_PORT          # SMTP port (typically 465 or 587)
SMTP_SECURE        # 'true' for SSL/TLS
SMTP_USER          # SMTP authentication username
SMTP_PASSWORD      # SMTP authentication password
CONTACT_EMAIL      # Recipient email for contact form
```

**IMPORTANT**: env-file.sh contains sensitive credentials and should NEVER be committed. It's currently tracked in git but should be removed and added to .gitignore.

### Webpack Configuration

next.config.js excludes Node.js modules (fs, net, dns, tls, child_process) from client-side bundles to prevent webpack errors with server-only dependencies.

## Deployment

Currently deployed on Vercel with these settings:
- Output Directory: `.next` (not `public`)
- Build command: `next build`
- Main branch for deployments: `main`

## Development Notes

### Page Navigation
The Header component links to:
- `/technical` - Technical SEO Audit (comprehensive technical analysis with priority-based issue reporting)
- `/keywords` - Keyword Research (high-level keyword analysis and opportunity identification)
- `/strategy` - SEO Strategy (1-3 month strategic planning with team-specific action items)
- `/about` - About page
- `/tools` - Tools listing page
- `/contact` - Contact form
- `/` - Basic SEO Analyzer (legacy tool, still available)

### Earned Media Features

The application is specifically designed to support Earned Media's SEO workflow:

**Technical Audit Requirements**
- Identifies and prioritizes technical SEO issues
- Categorizes by priority: critical → high → medium → low
- Provides specific recommendations for each issue
- Covers: security (HTTPS), mobile optimization, meta tags, structured data, accessibility, performance, content structure

**Keyword Research Workflow**
- Industry detection from content analysis
- Primary keywords: high-frequency terms with strategic importance
- Secondary keywords: supporting terms for content expansion
- Long-tail keywords: specific phrases for easier ranking opportunities
- Search intent categorization for content planning

**Strategy Generation for Teams**
- Assigns action items to specific teams: Technical Team, Content Team, Link Building Team
- Creates 3-month timeline with monthly milestones
- Provides content calendar guidance (frequency, topics)
- Defines link building approach by industry
- Sets measurable KPIs for tracking progress

### SEO Analysis Scoring

**Basic Analyzer** (pages/api/analyze.js)
Starts at 100 and deducts points for issues:
- Missing title: -10 points (high severity)
- Missing meta description: -5 points (medium severity)
- Missing H1: -10 points (high severity)
- Multiple H1s: -5 points (medium severity)
- Images without alt text: -1 point per image (capped at -10, medium severity)
- No HTTPS: -10 points (high severity)
- Missing viewport meta tag: -10 points (high severity)

**Technical Audit** (pages/api/technical.js)
More comprehensive scoring (0-100):
- Critical issues (HTTPS, viewport): -10 to -15 points each
- High priority issues (title, H1, accessibility): -5 to -10 points each
- Medium priority issues (canonical, structured data, Open Graph): -3 to -5 points each
- Performance issues: -3 to -8 points based on severity
- Security headers, content quality: -3 to -5 points each

### Code Patterns
- All pages use inline styles (no CSS modules or styled-components)
- API routes follow standard Next.js pattern with error handling
- Form submissions use async/await with try/catch blocks
- No TypeScript (pure JavaScript project)
