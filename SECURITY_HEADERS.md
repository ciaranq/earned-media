# Security Headers Implementation

**Issue:** #43 - [ARCH] Security Headers for SEO
**Date Implemented:** 2025-12-04
**Target Score:** A or A+ on [SecurityHeaders.com](https://securityheaders.com/)

---

## Overview

This document describes the implementation of HTTP security headers for the Thrive platform to protect against common web vulnerabilities and achieve a high security score for SEO purposes.

## Implemented Headers

### 1. Strict-Transport-Security (HSTS)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

**Purpose:** Forces all connections to use HTTPS instead of HTTP.

**Configuration:**
- `max-age=63072000` - 2 years (730 days)
- `includeSubDomains` - Applies to all subdomains
- `preload` - Eligible for browser HSTS preload list

**Protection:** Prevents protocol downgrade attacks and cookie hijacking.

---

### 2. Content-Security-Policy (CSP)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self'
```

**Purpose:** Prevents Cross-Site Scripting (XSS) and data injection attacks by controlling which resources can be loaded.

**Directives Explained:**
- `default-src 'self'` - Only allow resources from same origin by default
- `script-src 'self' 'unsafe-eval' 'unsafe-inline'` - Allow scripts from same origin, eval(), and inline scripts (required for Next.js hydration)
- `style-src 'self' 'unsafe-inline'` - Allow styles from same origin and inline styles (required for Tailwind CSS)
- `img-src 'self' data: https:` - Allow images from same origin, data URIs, and any HTTPS source
- `font-src 'self' data:` - Allow fonts from same origin and data URIs
- `connect-src 'self'` - Allow fetch/XHR/WebSocket to same origin only
- `frame-ancestors 'self'` - Only allow framing from same origin
- `base-uri 'self'` - Restrict base tag to same origin
- `form-action 'self'` - Restrict form submissions to same origin

**Note:** This CSP is configured for Next.js with Tailwind CSS. If you add external scripts, fonts, or APIs, you'll need to update the CSP accordingly.

**Protection:** Mitigates XSS, clickjacking, and other code injection attacks.

---

### 3. X-Frame-Options

```
X-Frame-Options: SAMEORIGIN
```

**Purpose:** Prevents the page from being loaded in an iframe on other domains.

**Configuration:**
- `SAMEORIGIN` - Allows framing only from same origin

**Protection:** Prevents clickjacking attacks.

---

### 4. X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

**Purpose:** Prevents browsers from MIME-sniffing responses away from the declared content-type.

**Protection:** Mitigates MIME confusion attacks and reduces security risks from uploaded files.

---

### 5. X-XSS-Protection

```
X-XSS-Protection: 1; mode=block
```

**Purpose:** Enables the browser's built-in XSS filter (legacy header, but still useful for older browsers).

**Configuration:**
- `1` - Enable XSS filtering
- `mode=block` - Block the page if XSS is detected

**Protection:** Provides additional XSS protection for older browsers.

---

### 6. Referrer-Policy

```
Referrer-Policy: strict-origin-when-cross-origin
```

**Purpose:** Controls how much referrer information is sent with requests.

**Configuration:**
- `strict-origin-when-cross-origin` - Sends full URL for same-origin requests, only origin for cross-origin HTTPS requests, and no referrer for HTTP requests

**Protection:** Protects user privacy and prevents leaking sensitive URL information.

---

### 7. Permissions-Policy

```
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

**Purpose:** Controls which browser features and APIs can be used.

**Configuration:**
- `camera=()` - Disable camera access
- `microphone=()` - Disable microphone access
- `geolocation=()` - Disable geolocation
- `interest-cohort=()` - Disable Google's FLoC tracking

**Protection:** Reduces attack surface by disabling unnecessary browser features and protects user privacy.

---

## Implementation Details

### Location

Security headers are implemented in `next.config.js` using Next.js's built-in `headers()` configuration function.

### Code Location

```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',  // Apply to all routes
      headers: [ /* ... */ ]
    }
  ]
}
```

### Scope

Headers are applied to **all routes** (`/:path*`) including:
- Static pages
- Dynamic pages
- API routes
- Static assets

---

## Testing

### Local Testing

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Inspect headers in browser:**
   - Open DevTools → Network tab
   - Refresh page
   - Click on any request
   - Check "Response Headers"

### Production Testing

1. **Deploy to Vercel preview:**
   ```bash
   vercel
   ```

2. **Test with SecurityHeaders.com:**
   - Visit https://securityheaders.com/
   - Enter your preview URL
   - Verify A or A+ score

3. **Test with Mozilla Observatory:**
   - Visit https://observatory.mozilla.org/
   - Scan your domain
   - Verify high score

---

## Maintenance

### When to Update CSP

Update the Content-Security-Policy when adding:
- External scripts (Google Analytics, etc.)
- External fonts (Google Fonts, etc.)
- External images or CDNs
- Third-party APIs or services
- WebSocket connections

### Example: Adding Google Analytics

```javascript
"script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
"connect-src 'self' https://www.google-analytics.com",
```

### Example: Adding Google Fonts

```javascript
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
"font-src 'self' data: https://fonts.gstatic.com",
```

---

## Security Score Target

**Target:** A or A+ on SecurityHeaders.com

**Expected Scores:**
- ✅ Strict-Transport-Security
- ✅ Content-Security-Policy
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Referrer-Policy
- ✅ Permissions-Policy

---

## References

- [Next.js Headers Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [MDN - Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN - HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [SecurityHeaders.com](https://securityheaders.com/)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)

---

## Troubleshooting

### CSP Blocking Resources

If the CSP blocks legitimate resources:

1. **Check browser console** for CSP violation errors
2. **Identify the blocked resource** (script, style, image, etc.)
3. **Update the appropriate directive** in `next.config.js`
4. **Test thoroughly** after changes

### Vercel-Specific Considerations

Vercel automatically adds some headers. Our configuration in `next.config.js` will override or supplement these headers.

### Local vs. Production Behavior

HSTS only works over HTTPS. When testing locally (HTTP), this header won't have an effect. Always test on Vercel preview or production for full security header validation.

---

**Last Updated:** 2025-12-04
**Author:** Claude Code (via ciaranq)
**Status:** Implemented and tested
