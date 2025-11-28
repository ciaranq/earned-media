# Keyword Analysis Feature - Quick Start Guide

## 🎉 What's Been Added

A comprehensive keyword analysis tool that crawls your website and generates professional SEO reports with:

✅ **Top 50 keywords** with frequency and density metrics
✅ **Meta tags analysis** (title, description coverage and quality)
✅ **Heading structure** (H1-H6 distribution)
✅ **SEO recommendations** based on actual data
✅ **Beautiful HTML reports** with Tailwind CSS styling
✅ **JSON data export** for API integration

## 📁 Files Created

### Core Files
- `keyword-analyzer.ts` - TypeScript crawler and analyzer script
- `pages/keyword-analysis.js` - Report viewer page
- `tsconfig.json` - TypeScript configuration
- `README.md` - Complete project documentation
- `public/reports/` - Directory for generated reports

### Modified Files
- `package.json` - Added dependencies and npm script
- `pages/keywords.js` - Added link to keyword analysis reports

## 🚀 Quick Start

### 1. Install Dependencies (Already Done)
```bash
npm install
```

### 2. Analyze Your First Domain
```bash
# Analyze visory.com.au (default 20 pages)
npm run analyze-keywords visory.com.au

# Or specify custom page limit (max 50)
npm run analyze-keywords visory.com.au 30
```

### 3. View the Report

**Development:**
```bash
npm run dev
# Visit: http://localhost:3000/keyword-analysis
```

**Production:**
After pushing to GitHub, Vercel will deploy automatically.
Visit: `https://your-app.vercel.app/keyword-analysis`

## 📊 What the Script Does

```
1. 🕷️  Crawls website (discovers internal links)
2. 📄 Analyzes each page (meta tags, headings, content)
3. 🔤 Extracts keywords using NLP (Compromise.js)
4. 📈 Calculates frequency and density
5. 💾 Saves JSON data to /public/reports/[domain]/keywords.json
6. 🎨 Generates HTML report to /public/reports/[domain]/index.html
```

## 📦 Report Contents

Each generated report includes:

### Summary Statistics
- Total pages analyzed
- Total word count
- Unique keywords found
- Average words per page

### Meta Analysis
- Pages with title tags (%)
- Pages with meta descriptions (%)
- Average title length
- Average description length

### Heading Distribution
- H1, H2, H3, H4, H5, H6 counts across all pages

### Top 50 Keywords Table
- Keyword name
- Frequency (total occurrences)
- Density (%)
- Visual progress bar

### SEO Recommendations
Smart recommendations based on findings:
- Missing meta descriptions
- Title/description length issues
- Missing or multiple H1 tags
- Thin content warnings
- Keyword density issues

### Page Details
Individual page breakdown showing:
- Page title and URL
- Word count
- Meta description status
- Heading structure

## 🎯 Example Usage

### Analyze a Client Website
```bash
npm run analyze-keywords clientdomain.com
```

### Review the Report
1. Navigate to `/keyword-analysis` page
2. Click "View Report" for the domain
3. Share the report URL with clients (e.g., `/reports/clientdomain.com/index.html`)

### Use JSON Data
The JSON file can be used for:
- API integration
- Custom visualizations
- Data exports
- Automated reporting

## 🔧 Configuration

Edit `keyword-analyzer.ts` to customize:

```typescript
const MAX_PAGES = 50;           // Maximum pages to crawl
const DEFAULT_PAGES = 20;       // Default if not specified
const CONCURRENT_REQUESTS = 3;  // Parallel requests
const REQUEST_DELAY = 500;      // ms between requests
```

## 🌐 Accessing from Keywords Page

The Keywords page now has a prominent link to the Keyword Analysis Reports:

**Keywords Page** → **"📊 Keyword Analysis Reports"** → **Report Viewer**

## 📋 Workflow for Team

### For Developers
1. Run script locally: `npm run analyze-keywords domain.com`
2. Review generated report in `/public/reports/`
3. Commit files: `git add public/reports/ && git commit -m "Add keyword analysis for domain.com"`
4. Push to GitHub: `git push`
5. Vercel auto-deploys

### For SEO Team
1. Request developer to run analysis OR run locally if set up
2. View report at `/keyword-analysis` page
3. Download JSON for further analysis if needed
4. Share HTML report URL with clients

## 🎨 Report Features

- **Print-friendly** - Professional layout for PDF exports
- **Responsive** - Works on desktop, tablet, mobile
- **Shareable** - Direct link to HTML report
- **Professional** - Tailwind CSS styling with charts and metrics
- **Detailed** - Comprehensive data presentation

## 🔍 Troubleshooting

### Script won't run
```bash
# Make sure dependencies are installed
npm install

# Check Node.js version (needs 18+)
node --version
```

### No pages found
- Verify domain is accessible
- Check robots.txt
- Try with https:// prefix
- Check firewall/VPN settings

### Script is slow
- Reduce page count: `npm run analyze-keywords domain.com 10`
- Increase delay in script (edit REQUEST_DELAY)
- Check internet connection

### Can't see reports in app
- Make sure files are in `/public/reports/[domain]/`
- Restart dev server: Ctrl+C then `npm run dev`
- Check file permissions

## 📝 Next Steps

1. ✅ Test with visory.com.au: `npm run analyze-keywords visory.com.au`
2. ✅ View the report: `http://localhost:3000/keyword-analysis`
3. ✅ Review recommendations and metrics
4. ✅ Deploy to production: `git push`
5. ✅ Share with team

## 💡 Pro Tips

- Run analysis periodically to track keyword changes over time
- Compare reports before/after SEO improvements
- Use JSON data for custom dashboards
- Share HTML reports directly with clients (looks professional!)
- Keep reports in git for historical tracking

## 🎓 Learning More

- See `README.md` for full project documentation
- Check `keyword-analyzer.ts` for code comments
- Review `pages/keyword-analysis.js` for UI patterns

---

**Ready to analyze?** Run: `npm run analyze-keywords visory.com.au`
