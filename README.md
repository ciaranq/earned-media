# SEO Agent for Earned Media

A comprehensive Next.js web application that provides SEO analysis and strategy tools for Earned Media clients.

## Features

### 🔍 Technical SEO Audit
Identifies technical SEO issues and prioritizes corrections including:
- HTTPS security
- Mobile optimization
- Meta tags analysis
- Structured data validation
- Accessibility checks
- Performance metrics
- Content structure analysis

### 📊 Keyword Research
High-level keyword analysis with support for:
- Primary, secondary, and long-tail keyword identification
- Industry and topic detection
- Search intent categorization
- Keyword opportunities
- Integration with ScreamingFrog and SEONaut reports

### 📈 Keyword Analysis Reports (NEW)
Deep keyword analysis with multi-page crawling:
- Keyword frequency and density analysis (top 50 keywords)
- Meta tags comprehensive analysis (title, description, keywords)
- Heading structure distribution (H1-H6)
- Keyword visualization with tables and metrics
- SEO recommendations based on findings
- Configurable crawl depth (default 20 pages, max 50 pages)
- Professional HTML reports with Tailwind CSS styling
- JSON data export for API integration

### 🎯 SEO Strategy Generator
Creates 1-3 month strategic SEO plans with:
- Monthly timelines and milestones
- Team-specific action items (Technical, Content, Link Building)
- Content calendar guidance
- Industry-specific link building strategies
- Measurable KPIs

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd EarnedMedia-SEO-Agent

# Install dependencies
npm install

# Set up environment variables (see Configuration section)
cp env-file.sh.example env-file.sh
# Edit env-file.sh with your SMTP credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Configuration

### Environment Variables

Create an `env-file.sh` with the following variables:

```bash
export SMTP_HOST="your-smtp-host"
export SMTP_PORT="465"
export SMTP_SECURE="true"
export SMTP_USER="your-email@domain.com"
export SMTP_PASSWORD="your-password"
export CONTACT_EMAIL="recipient@domain.com"
```

**⚠️ Important:** Never commit `env-file.sh` to version control. Add it to `.gitignore`.

## Using the Keyword Analysis Tool

### Generate a New Report

Run the keyword analyzer script locally to crawl a website and generate a comprehensive keyword analysis:

```bash
# Analyze a domain (default: 20 pages)
npm run analyze-keywords visory.com.au

# Specify custom page limit (max 50)
npm run analyze-keywords visory.com.au 30
```

### What the Script Does

1. **Crawls the website** - Discovers and visits up to 50 pages from the domain
2. **Extracts content** - Parses HTML, meta tags, headings, and body text
3. **Analyzes keywords** - Uses NLP (Compromise.js) to identify meaningful keywords
4. **Calculates metrics** - Frequency, density, and distribution across pages
5. **Generates reports** - Creates both JSON data and HTML visualization

### Output Files

Reports are saved to `/public/reports/[domain]/`:

```
public/reports/visory.com.au/
├── keywords.json          # Machine-readable data for API use
└── index.html            # Professional HTML report (Tailwind-styled)
```

### View Reports

After generating reports:

1. **Locally**: Visit `http://localhost:3000/keyword-analysis`
2. **Production**: Visit `https://yourapp.vercel.app/keyword-analysis`

Each report includes:
- ✅ Top 50 keywords with frequency and density
- ✅ Meta tags analysis (coverage, length, quality)
- ✅ Heading structure distribution (H1-H6)
- ✅ Page-by-page breakdown
- ✅ Actionable SEO recommendations
- ✅ Visual metrics and progress bars

### Deploy Reports to Production

```bash
# Commit the new report files
git add public/reports/
git commit -m "Add keyword analysis for visory.com.au"
git push

# Vercel will automatically deploy with the new reports
```

## Project Structure

```
├── pages/
│   ├── index.js              # Main SEO analyzer
│   ├── technical.js          # Technical audit page
│   ├── keywords.js           # Keyword research page
│   ├── keyword-analysis.js   # Keyword analysis reports viewer (NEW)
│   ├── strategy.js           # SEO strategy page
│   └── api/
│       ├── analyze.js        # Basic SEO analysis endpoint
│       ├── technical.js      # Technical audit endpoint
│       ├── keywords.js       # Keyword research endpoint
│       ├── strategy.js       # Strategy generation endpoint
│       └── contact.js        # Contact form endpoint
├── components/
│   └── TechnicalResults.js   # Technical audit results component
├── public/
│   └── reports/              # Generated keyword analysis reports
├── keyword-analyzer.ts       # TypeScript keyword analysis script (NEW)
├── package.json
└── next.config.js
```

## Available Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Keyword Analysis (NEW)
npm run analyze-keywords [domain] [maxPages]
```

## Technology Stack

- **Framework**: Next.js 14.0.3 (Pages Router)
- **Runtime**: Node.js
- **Styling**: Inline styles + Tailwind CSS (for reports)
- **Web Scraping**: Axios + Cheerio
- **NLP**: Compromise.js
- **Email**: Nodemailer
- **TypeScript**: For keyword analyzer script

## Deployment

### Vercel (Recommended)

The application is optimized for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Important Vercel Settings:**
- Build Command: `next build`
- Output Directory: `.next`
- Main Branch: `main`
- Environment Variables: Add SMTP credentials in Vercel dashboard

### Other Platforms

Works with any Node.js hosting platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean App Platform

## Development Notes

### Adding New Features

The codebase uses:
- **Pages Router** (not App Router)
- **JavaScript** for pages (TypeScript for scripts)
- **Inline styles** for most UI (matching existing pattern)
- **Shared Header component** exported from `pages/index.js`

### Code Patterns

```javascript
// Import shared header
import { Header } from './index';

// Use inline styles matching existing pages
style={{
  padding: "20px",
  backgroundColor: "#fff",
  borderRadius: "8px"
}}

// Handle URL query params for auto-analysis
useEffect(() => {
  if (router.isReady && router.query.url) {
    runAnalysis(router.query.url);
  }
}, [router.isReady, router.query.url]);
```

## API Endpoints

### POST /api/analyze
Basic SEO analysis for a single page
```javascript
{ "url": "https://example.com" }
```

### POST /api/technical
Comprehensive technical SEO audit
```javascript
{ "url": "https://example.com" }
```

### POST /api/keywords
High-level keyword research
```javascript
{ "url": "https://example.com" }
```

### POST /api/strategy
Generate 1-3 month SEO strategy
```javascript
{ "url": "https://example.com" }
```

### POST /api/contact
Send contact form email
```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello..."
}
```

## Keyword Analyzer Configuration

Edit `keyword-analyzer.ts` to customize:

```typescript
const MAX_PAGES = 50;           // Maximum pages to crawl
const DEFAULT_PAGES = 20;       // Default if not specified
const CONCURRENT_REQUESTS = 3;  // Parallel requests
const REQUEST_DELAY = 500;      // ms between requests
```

## Troubleshooting

### Keyword Analyzer Issues

**Error: "ts-node: command not found"**
```bash
npm install
```

**Error: "Cannot find module 'compromise'"**
```bash
npm install compromise
```

**No pages found during crawl**
- Check domain accessibility
- Verify robots.txt allows crawling
- Try with `https://` prefix

**Script timeout/slow crawling**
- Reduce max pages: `npm run analyze-keywords domain.com 10`
- Increase REQUEST_DELAY in keyword-analyzer.ts
- Check internet connection

### General Issues

**SMTP errors**
- Verify environment variables are set
- Check SMTP credentials
- Ensure SMTP_SECURE matches port (465=true, 587=false)

**Build errors**
- Clear `.next` folder: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (18+)

## Contributing

This is a proprietary tool for Earned Media. Internal contributions welcome.

## License

Proprietary - Earned Media

## Support

For issues or questions, contact the development team.

---

**Last Updated:** November 2025
**Version:** 1.1.0 (with Keyword Analysis Tool)
