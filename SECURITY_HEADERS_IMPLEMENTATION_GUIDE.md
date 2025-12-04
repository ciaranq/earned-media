# Security Headers Implementation Guide for Vercel/Next.js

**Goal:** Achieve an A or A+ score on [SecurityHeaders.com](https://securityheaders.com/)

**Date Created:** 2025-12-04
**Issue:** #43 - [ARCH] Security Headers for SEO
**Status:** ✅ Complete - A Score Achieved

---

## Overview

This guide provides step-by-step instructions for implementing HTTP security headers on a Vercel-deployed Next.js application to achieve a high security score (A or A+) on SecurityHeaders.com.

## Why Security Headers Matter

- **SEO Impact:** Search engines favor secure sites
- **User Trust:** Demonstrates commitment to security
- **Attack Prevention:** Protects against XSS, clickjacking, MIME sniffing, and other common attacks
- **Compliance:** Many security standards require proper headers

---

## Required Headers for A Score

To achieve an A score, you need these 7 critical headers:

1. **Strict-Transport-Security (HSTS)** - Force HTTPS
2. **Content-Security-Policy (CSP)** - Prevent XSS attacks
3. **X-Frame-Options** - Prevent clickjacking
4. **X-Content-Type-Options** - Prevent MIME sniffing
5. **X-XSS-Protection** - Legacy XSS protection
6. **Referrer-Policy** - Control referrer information
7. **Permissions-Policy** - Control browser features

---

## Implementation Steps

### Step 1: Choose Configuration Location

For Vercel deployments, you have two options:

**Option A: vercel.json (RECOMMENDED)**
- ✅ Applied at edge network level (faster)
- ✅ Works for all deployments (preview + production)
- ✅ Recommended by Vercel

**Option B: next.config.js**
- ⚠️ Applied at application level
- ⚠️ Can conflict with vercel.json
- ⚠️ Not recommended if using vercel.json

**⚡ Best Practice:** Use `vercel.json` only. Do NOT duplicate headers in both files.

---

### Step 2: Create or Update vercel.json

Create a `vercel.json` file in your project root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
        }
      ]
    }
  ]
}
```

---

### Step 3: Understanding Each Header

#### 1. Strict-Transport-Security (HSTS)

```json
{
  "key": "Strict-Transport-Security",
  "value": "max-age=63072000; includeSubDomains; preload"
}
```

**What it does:** Forces browsers to only connect via HTTPS

**Configuration:**
- `max-age=63072000` - 2 years (730 days)
- `includeSubDomains` - Apply to all subdomains
- `preload` - Eligible for browser preload list

**⚠️ Important:** Only add `preload` if you're committed to HTTPS forever

---

#### 2. Content-Security-Policy (CSP)

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
}
```

**What it does:** Prevents XSS attacks by controlling resource loading

**Directives Explained:**
- `default-src 'self'` - Only allow same-origin by default
- `script-src 'self' 'unsafe-eval' 'unsafe-inline'` - Required for Next.js hydration
- `style-src 'self' 'unsafe-inline'` - Required for Tailwind CSS and CSS-in-JS
- `img-src 'self' data: https:` - Allow images from same origin, data URIs, and HTTPS
- `font-src 'self' data:` - Allow fonts from same origin and data URIs
- `connect-src 'self'` - Restrict API calls to same origin
- `frame-ancestors 'self'` - Only allow framing from same origin
- `base-uri 'self'` - Restrict base tag to same origin
- `form-action 'self'` - Restrict form submissions to same origin

**⚠️ Customization Needed When Adding:**
- External scripts (Google Analytics, etc.) - add to `script-src`
- External fonts (Google Fonts) - add to `font-src` and `style-src`
- External APIs - add to `connect-src`
- CDN images - add to `img-src`

**Example: Adding Google Analytics**
```
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
connect-src 'self' https://www.google-analytics.com
```

---

#### 3. X-Frame-Options

```json
{
  "key": "X-Frame-Options",
  "value": "SAMEORIGIN"
}
```

**What it does:** Prevents clickjacking by controlling iframe embedding

**Options:**
- `DENY` - Never allow framing (most secure)
- `SAMEORIGIN` - Only allow framing from same origin (recommended for most apps)

**Use SAMEORIGIN if:** You need to embed your pages in iframes within your own site
**Use DENY if:** You never want your site in iframes

---

#### 4. X-Content-Type-Options

```json
{
  "key": "X-Content-Type-Options",
  "value": "nosniff"
}
```

**What it does:** Prevents MIME type sniffing

**Why it matters:** Stops browsers from interpreting files as a different MIME type (e.g., treating a text file as JavaScript)

**Value:** Always use `nosniff` - it's the only valid value

---

#### 5. X-XSS-Protection

```json
{
  "key": "X-XSS-Protection",
  "value": "1; mode=block"
}
```

**What it does:** Enables browser's built-in XSS filter (legacy)

**Configuration:**
- `1` - Enable XSS filtering
- `mode=block` - Block the page if XSS is detected

**Note:** This is a legacy header (modern browsers use CSP), but still required for A score and older browser support

---

#### 6. Referrer-Policy

```json
{
  "key": "Referrer-Policy",
  "value": "strict-origin-when-cross-origin"
}
```

**What it does:** Controls how much referrer information is sent

**Options:**
- `no-referrer` - Never send referrer (most private)
- `strict-origin-when-cross-origin` - Full URL for same-origin, origin only for cross-origin HTTPS (recommended)
- `same-origin` - Only send referrer for same-origin requests

**Recommended:** `strict-origin-when-cross-origin` - Good balance of privacy and analytics functionality

---

#### 7. Permissions-Policy

```json
{
  "key": "Permissions-Policy",
  "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
}
```

**What it does:** Controls which browser features/APIs can be used

**Configuration:**
- `camera=()` - Disable camera access
- `microphone=()` - Disable microphone access
- `geolocation=()` - Disable geolocation
- `interest-cohort=()` - Disable FLoC tracking (privacy)

**⚠️ Customize if you need these features:**
- `camera=(self)` - Allow camera on your domain only
- `geolocation=(self "https://maps.google.com")` - Allow geolocation on your domain and Google Maps

---

### Step 4: Remove Conflicting Configurations

If you have headers in `next.config.js`, remove them to avoid conflicts:

**❌ Remove this from next.config.js:**
```javascript
// DON'T DO THIS if using vercel.json
async headers() {
  return [
    {
      source: '/:path*',
      headers: [ /* ... */ ]
    }
  ]
}
```

**✅ Keep next.config.js simple:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

---

### Step 5: Test Locally

```bash
# Build the application
npm run build

# Start production server
npm start
```

**Check headers in browser:**
1. Open DevTools → Network tab
2. Refresh the page
3. Click any request
4. Check "Response Headers" section
5. Verify all 7 security headers are present

---

### Step 6: Deploy to Vercel

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**⚠️ Important:** Vercel's password-protected preview deployments won't show custom headers on the authentication page (401 response). Always test on production or authenticated pages.

---

### Step 7: Verify on SecurityHeaders.com

1. Go to https://securityheaders.com/
2. Enter your production URL (e.g., `https://your-site.vercel.app/login`)
3. Click "Scan"
4. Verify A or A+ score

**✅ Expected Result:**
- All 7 headers present and correctly configured
- Score: A or A+

---

## Testing Checklist

### Before Deploying

- [ ] `vercel.json` created with all 7 headers
- [ ] Headers removed from `next.config.js` (if present)
- [ ] Local build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors

### After Deploying

- [ ] Production deployment successful
- [ ] Site loads correctly (no broken functionality)
- [ ] All pages work (test navigation, forms, images)
- [ ] Browser DevTools shows all 7 headers
- [ ] SecurityHeaders.com scan shows A or A+ score
- [ ] No CSP violations in browser console

---

## Common Issues and Solutions

### Issue: Headers not showing up

**Cause:** Testing on password-protected preview deployment
**Solution:** Test on production URL or authenticated pages (e.g., `/login`)

### Issue: CSP blocking resources

**Symptom:** Blank page, browser console shows CSP violations
**Solution:** Update CSP directives to allow the blocked resources

**Example - External Script Blocked:**
```
Refused to load the script 'https://example.com/script.js'
because it violates the following Content Security Policy directive: "script-src 'self'"
```

**Fix:** Add to CSP:
```json
"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://example.com"
```

### Issue: Different headers on preview vs production

**Cause:** Vercel's authentication page (401) doesn't apply custom headers
**Solution:** Normal - custom headers only apply to your app's responses (200, 404, etc.)

### Issue: X-Frame-Options shows DENY instead of SAMEORIGIN

**Cause:** Vercel's authentication page overrides this for security
**Solution:** Check on authenticated pages - your configured value will apply there

### Issue: Score is B instead of A

**Cause:** One or more headers are missing
**Solution:** Check SecurityHeaders.com report for which headers are missing and add them

---

## Maintenance

### When to Update CSP

Update the Content-Security-Policy whenever you add:

- ✏️ External JavaScript (analytics, chat widgets, etc.)
- ✏️ External fonts (Google Fonts, etc.)
- ✏️ External images or CDNs
- ✏️ Third-party APIs
- ✏️ WebSocket connections
- ✏️ Iframe embeds

### Monitoring

Set up regular checks:

1. **Monthly:** Scan on SecurityHeaders.com
2. **After deployments:** Check headers in DevTools
3. **When adding features:** Test for CSP violations

---

## Quick Reference

### File: vercel.json

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'" }
      ]
    }
  ]
}
```

### Deployment Commands

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Check deployment status
vercel ls

# View deployment headers
curl -I https://your-site.vercel.app
```

### Test URLs

```bash
# Test production headers
curl -I https://your-production-url.vercel.app/login | grep -i "content-security\|referrer\|permissions\|x-content\|x-frame\|strict-transport\|x-xss"

# Should show all 7 headers
```

---

## Security Score Breakdown

| Header | Points | Status |
|--------|--------|--------|
| Strict-Transport-Security | Required for A | ✅ |
| Content-Security-Policy | Required for A | ✅ |
| X-Frame-Options | Required for A | ✅ |
| X-Content-Type-Options | Required for A | ✅ |
| Referrer-Policy | Required for A | ✅ |
| Permissions-Policy | Required for A | ✅ |
| X-XSS-Protection | Bonus (legacy) | ✅ |

**Target Score:** A or A+
**Current Score:** ✅ A (All requirements met)

---

## Resources

- [SecurityHeaders.com](https://securityheaders.com/) - Test your site
- [Vercel Headers Documentation](https://vercel.com/docs/projects/project-configuration#headers)
- [MDN - Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/) - Test your CSP

---

## Summary

**✅ Implementation Complete:**
- 7 security headers configured in `vercel.json`
- Headers apply at Vercel's edge network
- A score achieved on SecurityHeaders.com
- No conflicts with Next.js configuration
- Production-ready and tested

**⏱️ Time Required:** ~30 minutes (first time), ~10 minutes (subsequent projects)

**🎯 Result:** A or A+ score on SecurityHeaders.com

---

**Last Updated:** 2025-12-04
**Tested On:** Thrive Health AI (Next.js 14.2.33, Vercel)
**Author:** Claude Code (via ciaranq)
