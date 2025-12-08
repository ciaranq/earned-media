# Rollback Guide for Feature Integration (v1.1.0)

This guide documents all changes made to integrate new features. Follow these steps to roll back to the previous state if needed.

## Changes Summary

### Files Modified
1. `pages/api/keywords.js` - Added keyword difficulty scoring
2. `pages/api/technical.js` - Added Core Web Vitals analysis
3. `pages/keywords.js` - Added export buttons and difficulty display
4. `pages/technical.js` - Added export buttons and Core Web Vitals display
5. `pages/index.js` - Wrapped with ErrorBoundary
6. `pages/contact.js` - Wrapped with ErrorBoundary
7. `pages/strategy.js` - Wrapped with ErrorBoundary
8. `pages/about.js` - Wrapped with ErrorBoundary
9. `pages/tools.js` - Wrapped with ErrorBoundary
10. `pages/keyword-analysis.js` - Wrapped with ErrorBoundary
11. `pages/screaming-frog.js` - Wrapped with ErrorBoundary
12. `pages/seonaut.js` - Wrapped with ErrorBoundary

### Files Created (Keep for Future)
- `utils/keywordDifficulty.js` - New utility (keep)
- `utils/coreWebVitals.js` - New utility (keep)
- `utils/exportFormats.js` - New utility (keep)
- `components/ErrorBoundary.js` - New component (keep if rolling back)

---

## Rollback Instructions by File

### 1. Rollback `pages/api/keywords.js`

**What Changed:** Added keyword difficulty scoring to each keyword in the response

**To Rollback:**
1. Open `pages/api/keywords.js`
2. Find the line: `const { analyzeKeywordOpportunity } = require('../../utils/keywordDifficulty');`
3. Delete that entire line
4. In the response where keywords are returned, remove these properties from each keyword:
   - `difficulty`
   - `searchVolume`
   - `opportunity`
5. Save the file

**Git Command:** `git diff pages/api/keywords.js` to see exact changes

---

### 2. Rollback `pages/api/technical.js`

**What Changed:** Added Core Web Vitals analysis to the response

**To Rollback:**
1. Open `pages/api/technical.js`
2. Find the line: `const { assessCoreWebVitals } = require('../../utils/coreWebVitals');`
3. Delete that entire line
4. Find the section that adds `coreWebVitals` to the response
5. Remove the entire `coreWebVitals` object from the returned JSON
6. Remove any function calls to `assessCoreWebVitals()`
7. Save the file

**Git Command:** `git diff pages/api/technical.js` to see exact changes

---

### 3. Rollback `pages/keywords.js`

**What Changed:**
- Added import of export utilities
- Added export buttons to UI
- Added keyword difficulty display in results

**To Rollback:**
1. Open `pages/keywords.js`
2. Remove these imports at the top:
   ```javascript
   import { exportKeywordsAsCSV, downloadFile } from '../utils/exportFormats';
   import { analyzeKeywordOpportunity } from '../utils/keywordDifficulty';
   ```
3. Find and remove the export buttons section (looks for "Download" or "Export")
4. Remove any code that displays `difficulty` or `opportunity` scores
5. In the keywords display section, remove any new columns or properties
6. Save the file

**To Find Changes:** Search for `Export` or `difficulty` in the file

---

### 4. Rollback `pages/technical.js`

**What Changed:**
- Added import of export utilities
- Added import of Core Web Vitals utilities
- Added export buttons to UI
- Added Core Web Vitals display in results

**To Rollback:**
1. Open `pages/technical.js`
2. Remove these imports:
   ```javascript
   import { exportTechnicalAuditAsCSV, generateHTMLReport, downloadFile } from '../utils/exportFormats';
   import { assessCoreWebVitals } from '../utils/coreWebVitals';
   ```
3. Find and remove the export buttons section
4. Remove any Core Web Vitals display section (looks for LCP, FID, CLS)
5. Remove any function calls that assess Core Web Vitals
6. Save the file

**To Find Changes:** Search for `Export`, `Core Web Vitals`, or `LCP` in the file

---

### 5. Rollback Error Boundaries on All Pages

**What Changed:** All pages now wrapped with `<ErrorBoundary>` component

**Affected Files:**
- `pages/index.js`
- `pages/contact.js`
- `pages/strategy.js`
- `pages/about.js`
- `pages/tools.js`
- `pages/keyword-analysis.js`
- `pages/screaming-frog.js`
- `pages/seonaut.js`

**To Rollback Each Page:**
1. Open the page file
2. Find the import: `import ErrorBoundary from '../components/ErrorBoundary';`
3. Delete that line
4. Find `<ErrorBoundary>` wrapper around page content
5. Remove the opening `<ErrorBoundary>` tag
6. Remove the closing `</ErrorBoundary>` tag
7. Save the file

**Example of what to remove:**
```javascript
// REMOVE THIS:
import ErrorBoundary from '../components/ErrorBoundary';

// REMOVE THESE TAGS:
<ErrorBoundary>
  {/* page content */}
</ErrorBoundary>

// KEEP JUST:
{/* page content */}
```

---

## Fastest Rollback Method: Git

If you've committed these changes and want to roll back:

```bash
# Rollback to before integration
git revert HEAD~X  # X = number of commits since integration

# Or reset to specific commit
git reset --hard <commit-hash>

# Or just restore specific files
git checkout HEAD~1 -- pages/keywords.js pages/technical.js
```

---

## Testing After Rollback

After rolling back, test these:

1. **Keywords Page:**
   ```bash
   curl -X POST http://localhost:3000/api/keywords -H "Content-Type: application/json" -d '{"url":"https://example.com"}'
   ```
   Should NOT include `difficulty`, `searchVolume`, or `opportunity` in response

2. **Technical Page:**
   ```bash
   curl -X POST http://localhost:3000/api/technical -H "Content-Type: application/json" -d '{"url":"https://example.com"}'
   ```
   Should NOT include `coreWebVitals` in response

3. **Pages Should Load:**
   - Visit `/keywords` - should load without export buttons
   - Visit `/technical` - should load without export buttons
   - Check browser console for no errors related to ErrorBoundary or export functions

---

## What NOT to Rollback

Keep these files—they're useful utilities:
- `utils/keywordDifficulty.js` ✓ Keep
- `utils/coreWebVitals.js` ✓ Keep
- `utils/exportFormats.js` ✓ Keep
- `components/ErrorBoundary.js` ✓ Keep
- `utils/seoThresholds.js` ✓ Keep
- `utils/seoValidation.js` ✓ Keep
- `utils/rateLimiter.js` ✓ Keep

These can be safely left in the codebase even if you rollback the UI integration.

---

## Partial Rollback Scenarios

### Only Rollback Core Web Vitals (Keep Keywords Difficulty)
Follow step 4 (Technical) but keep step 3 (Keywords)

### Only Rollback Export Buttons (Keep Difficulty/Vitals)
Remove the export button code from keywords.js and technical.js, but keep the data in API responses

### Only Rollback Error Boundaries (Keep Everything Else)
Follow step 5 only, skip steps 1-4

---

## What Each Feature Does (For Reference)

### Keyword Difficulty
- Adds to `/api/keywords` response:
  ```json
  {
    "keyword": "best SEO tools",
    "difficulty": {
      "score": 35,
      "level": "Easy"
    },
    "searchVolume": {
      "category": "high",
      "estimate": 8500,
      "range": "5k-10k"
    },
    "opportunity": {
      "score": 82,
      "level": "excellent"
    }
  }
  ```

### Core Web Vitals
- Adds to `/api/technical` response:
  ```json
  {
    "coreWebVitals": {
      "status": "good",
      "metrics": {
        "lcp": { "value": 2500, "status": "good" },
        "fid": { "estimatedValue": 100, "status": "good" },
        "cls": { "estimatedValue": 0.05, "status": "good" }
      },
      "issues": [],
      "passedAllTests": true
    }
  }
  ```

### Export Buttons
- Adds UI buttons to download results as:
  - CSV (for spreadsheets)
  - JSON (for APIs)
  - HTML (for printing/sharing)

### Error Boundaries
- Catches React component errors
- Shows friendly error message instead of white screen
- Allows users to retry without page refresh

---

## Need Help?

If rollback goes wrong:

1. **Check git status:**
   ```bash
   git status
   git log --oneline -10
   ```

2. **Revert to previous commit:**
   ```bash
   git revert <commit-hash>
   git push
   ```

3. **Verify changes:**
   ```bash
   git diff HEAD~1..HEAD
   ```

4. **Contact developer** with the output of `git log`

---

## Change Log

| Date | Change | File(s) | Reversible |
|------|--------|---------|-----------|
| [Integration] | Add keyword difficulty | api/keywords.js | ✓ Yes |
| [Integration] | Add Core Web Vitals | api/technical.js | ✓ Yes |
| [Integration] | Add export to keywords | pages/keywords.js | ✓ Yes |
| [Integration] | Add export to technical | pages/technical.js | ✓ Yes |
| [Integration] | Add error boundaries | pages/*.js (8 files) | ✓ Yes |

All changes are fully reversible following this guide.
