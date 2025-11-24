import Head from 'next/head';
import { Header } from './index';

export default function ScreamingFrogResults() {
  const analysisData = {
    domain: "visory.com.au",
    totalPages: 101,
    indexablePages: 92,
    nonIndexablePages: 9,
    crawlDate: "November 2024"
  };

  const categories = [
    {
      title: "Page Titles",
      status: "warning",
      summary: "101 pages analyzed. Most titles are well-optimized, but some exceed recommended length.",
      issues: [
        { severity: "medium", description: "2 page titles exceed 60 characters and may be truncated in SERPs" },
        { severity: "low", description: "'Bookkeepers Near Me | Australia and New Zealand Bookkeeping | Visory' (68 chars, 640px)" },
        { severity: "low", description: "'Visory Bookkeeping and Financial Back Office for Franchise Businesses - Visory' (78 chars, 703px)" }
      ],
      actions: [
        "Shorten page titles exceeding 60 characters to prevent SERP truncation",
        "Ensure primary keywords appear in the first 50 characters",
        "Maintain consistent branding suffix (| Visory) across all titles"
      ]
    },
    {
      title: "H1 Headings",
      status: "critical",
      summary: "Multiple H1 issues detected. Several pages have duplicate H1 tags which dilutes SEO value.",
      issues: [
        { severity: "high", description: "/pricing - Has 8 H1 tags (should only have 1)" },
        { severity: "high", description: "/become-a-bookkeeper - Has 6 H1 tags" },
        { severity: "high", description: "/perth-bookkeeping - Has 5 H1 tags" },
        { severity: "high", description: "/franchise-conference - Has 5 H1 tags" },
        { severity: "medium", description: "/blog/category/insights, /blog/category/business-strategy, /blog/category/general - Missing H1 tags" }
      ],
      actions: [
        "Reduce each page to exactly ONE H1 tag containing the primary keyword",
        "Convert secondary H1 tags to H2 or H3 tags as appropriate",
        "Add descriptive H1 tags to category pages that are currently missing them"
      ]
    },
    {
      title: "Structured Data (Schema)",
      status: "critical",
      summary: "NO structured data found on any page. This is a significant missed opportunity for rich results.",
      issues: [
        { severity: "high", description: "0 out of 101 pages have Schema.org markup" },
        { severity: "high", description: "No rich result features detected" },
        { severity: "high", description: "Missing Organization, LocalBusiness, and Article schemas" }
      ],
      actions: [
        "Implement Organization schema on the homepage with company details",
        "Add LocalBusiness schema for location-based pages (Sydney, Melbourne, Brisbane, Perth)",
        "Implement Article schema for all blog posts to enable rich snippets in search results"
      ]
    },
    {
      title: "Meta Descriptions",
      status: "good",
      summary: "Most pages have meta descriptions. The deprecated meta keywords tag is correctly not used.",
      issues: [
        { severity: "low", description: "Some pages like /become-a-bookkeeper, /book-phone-meeting are missing meta descriptions" },
        { severity: "low", description: "Some blog category pages have empty meta descriptions" }
      ],
      actions: [
        "Add unique meta descriptions to pages currently missing them",
        "Ensure all descriptions are between 150-160 characters",
        "Include primary keywords and a clear call-to-action in each description"
      ]
    },
    {
      title: "Content Quality",
      status: "warning",
      summary: "Content readability varies significantly. Some pages may be too difficult to read for general audiences.",
      issues: [
        { severity: "medium", description: "Several pages rated as 'Hard' or 'Fairly Hard' readability" },
        { severity: "medium", description: "/product-page has 'Hard' readability (Flesch score: 41.957)" },
        { severity: "low", description: "Some thin content pages exist with under 300 words" }
      ],
      actions: [
        "Simplify content on pages with 'Hard' readability scores",
        "Aim for Flesch Reading Ease scores above 60 for better accessibility",
        "Expand thin content pages to at least 500 words with valuable information"
      ]
    },
    {
      title: "Canonical Tags",
      status: "good",
      summary: "All indexable pages have proper self-referencing canonical tags.",
      issues: [
        { severity: "low", description: "All canonicals are correctly implemented" },
        { severity: "low", description: "Non-indexable pages correctly omit canonical tags" }
      ],
      actions: [
        "Continue maintaining proper canonical tag implementation",
        "Monitor for any canonical conflicts in future crawls",
        "Ensure new pages follow the same canonical tag pattern"
      ]
    },
    {
      title: "Internal Linking",
      status: "good",
      summary: "Strong internal linking structure detected. Homepage has 99 unique inlinks.",
      issues: [
        { severity: "low", description: "Some newer blog posts have fewer than 10 inlinks" },
        { severity: "low", description: "Some service pages could benefit from more internal links from blog content" }
      ],
      actions: [
        "Add internal links from relevant blog posts to newer articles",
        "Link from high-traffic blog posts to service pages",
        "Create topic clusters linking related content together"
      ]
    },
    {
      title: "Redirects & Status Codes",
      status: "warning",
      summary: "Multiple 301 redirects detected from trailing slash URLs.",
      issues: [
        { severity: "medium", description: "17 URLs with trailing slashes redirect to non-trailing versions (301)" },
        { severity: "low", description: "e.g., /pricing/ → /pricing, /blog/ → /blog" }
      ],
      actions: [
        "Update internal links to use non-trailing slash URLs to avoid redirect chains",
        "Ensure sitemap uses the canonical (non-trailing slash) URLs",
        "Check Google Search Console for any crawl budget concerns"
      ]
    },
    {
      title: "Indexability & Robots",
      status: "good",
      summary: "Proper noindex implementation on sensitive pages. 92 of 101 pages are indexable.",
      issues: [
        { severity: "low", description: "9 pages correctly set as noindex (privacy policy, terms, disclaimers)" },
        { severity: "low", description: "All blog topic filter pages (/blog/operations, /blog/payroll, etc.) are noindexed" }
      ],
      actions: [
        "Review if topic filter pages should remain noindexed or be optimized for indexing",
        "Monitor for any accidental noindex tags on important pages",
        "Ensure robots.txt allows crawling of all important resources"
      ]
    },
    {
      title: "Images",
      status: "warning",
      summary: "273 images analyzed. Mix of SVG, PNG, and JPEG formats used across the site.",
      issues: [
        { severity: "medium", description: "Some images are reused across 99+ pages (likely header/footer images)" },
        { severity: "low", description: "Image optimization and alt text quality not fully assessed in this report" }
      ],
      actions: [
        "Audit all images for proper alt text implementation",
        "Consider lazy loading for images below the fold",
        "Convert large PNG images to WebP format for better performance"
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return { bg: '#FEE2E2', border: '#EF4444', text: '#B91C1C' };
      case 'warning': return { bg: '#FEF3C7', border: '#F59E0B', text: '#B45309' };
      case 'good': return { bg: '#D1FAE5', border: '#10B981', text: '#065F46' };
      default: return { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151' };
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#DC2626';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>ScreamingFrog SEO Analysis - {analysisData.domain}</title>
        <meta name="description" content={`Comprehensive SEO analysis for ${analysisData.domain} from ScreamingFrog crawl data`} />
      </Head>

      <Header />

      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#333", marginBottom: "10px" }}>ScreamingFrog SEO Analysis</h1>
        <p style={{ color: "#666", marginBottom: "20px", lineHeight: "1.6" }}>
          Comprehensive analysis of <strong>{analysisData.domain}</strong> based on ScreamingFrog crawl data
        </p>

        {/* Overview Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "30px"
        }}>
          <div style={{ backgroundColor: "#EFF6FF", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#1D4ED8" }}>{analysisData.totalPages}</div>
            <div style={{ color: "#1E40AF" }}>Total Pages Crawled</div>
          </div>
          <div style={{ backgroundColor: "#D1FAE5", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#059669" }}>{analysisData.indexablePages}</div>
            <div style={{ color: "#065F46" }}>Indexable Pages</div>
          </div>
          <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#D97706" }}>{analysisData.nonIndexablePages}</div>
            <div style={{ color: "#B45309" }}>Non-Indexable Pages</div>
          </div>
          <div style={{ backgroundColor: "#F3F4F6", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#374151" }}>{analysisData.crawlDate}</div>
            <div style={{ color: "#6B7280" }}>Crawl Date</div>
          </div>
        </div>

        {/* Priority Summary */}
        <div style={{
          backgroundColor: "#FEF2F2",
          border: "2px solid #EF4444",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h2 style={{ color: "#B91C1C", margin: "0 0 15px 0", fontSize: "20px" }}>Top Priority Issues</h2>
          <ol style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.8" }}>
            <li style={{ marginBottom: "10px" }}>
              <strong>Implement Structured Data:</strong> No Schema.org markup found on any page. Add Organization, LocalBusiness, and Article schemas to enable rich results.
            </li>
            <li style={{ marginBottom: "10px" }}>
              <strong>Fix Multiple H1 Tags:</strong> 8+ pages have multiple H1 tags. Each page should have exactly one H1 containing the primary keyword.
            </li>
            <li>
              <strong>Add Missing H1 Tags:</strong> Several category pages are missing H1 tags entirely.
            </li>
          </ol>
        </div>

        {/* Category Analysis */}
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Detailed Analysis by Category</h2>

        {categories.map((category, index) => {
          const colors = getStatusColor(category.status);
          return (
            <div key={index} style={{
              backgroundColor: "#fff",
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              marginBottom: "20px",
              overflow: "hidden"
            }}>
              {/* Category Header */}
              <div style={{
                backgroundColor: colors.bg,
                padding: "15px 20px",
                borderBottom: `1px solid ${colors.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <h3 style={{ margin: 0, color: colors.text, fontSize: "18px" }}>{category.title}</h3>
                <span style={{
                  backgroundColor: colors.border,
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textTransform: "uppercase"
                }}>
                  {category.status}
                </span>
              </div>

              {/* Category Content */}
              <div style={{ padding: "20px" }}>
                <p style={{ margin: "0 0 15px 0", color: "#4B5563", lineHeight: "1.6" }}>
                  {category.summary}
                </p>

                {/* Issues */}
                {category.issues.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#374151", fontSize: "14px", fontWeight: "600" }}>Issues Found:</h4>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {category.issues.map((issue, issueIndex) => (
                        <li key={issueIndex} style={{ marginBottom: "5px", color: "#6B7280" }}>
                          <span style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: getSeverityColor(issue.severity),
                            marginRight: "8px"
                          }}></span>
                          {issue.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                {category.actions.length > 0 && (
                  <div style={{
                    backgroundColor: "#F9FAFB",
                    padding: "15px",
                    borderRadius: "6px",
                    borderLeft: "4px solid #3B82F6"
                  }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#1D4ED8", fontSize: "14px", fontWeight: "600" }}>Recommended Actions:</h4>
                    <ol style={{ margin: 0, paddingLeft: "20px" }}>
                      {category.actions.map((action, actionIndex) => (
                        <li key={actionIndex} style={{ marginBottom: "5px", color: "#374151", lineHeight: "1.5" }}>
                          {action}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Quick Wins Section */}
        <div style={{
          backgroundColor: "#ECFDF5",
          border: "2px solid #10B981",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "30px"
        }}>
          <h2 style={{ color: "#065F46", margin: "0 0 15px 0", fontSize: "20px" }}>Quick Wins (Easy to Implement)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "6px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#059669" }}>1. Add Organization Schema</h4>
              <p style={{ margin: 0, color: "#374151", fontSize: "14px" }}>
                Add basic Organization JSON-LD to the homepage. Takes ~30 minutes and can improve brand visibility in search.
              </p>
            </div>
            <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "6px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#059669" }}>2. Fix Duplicate H1s on /pricing</h4>
              <p style={{ margin: 0, color: "#374151", fontSize: "14px" }}>
                Convert 7 of the 8 H1 tags to H2s. This page likely has the most impact on conversions.
              </p>
            </div>
            <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "6px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#059669" }}>3. Shorten Long Page Titles</h4>
              <p style={{ margin: 0, color: "#374151", fontSize: "14px" }}>
                Only 2 titles need shortening. Quick edit to prevent SERP truncation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#F9FAFB",
          borderRadius: "8px",
          textAlign: "center",
          color: "#6B7280"
        }}>
          <p style={{ margin: 0 }}>
            This analysis was generated from ScreamingFrog crawl data for <strong>{analysisData.domain}</strong>.
            <br />
            For the most accurate results, ensure you have the latest crawl data and review changes regularly.
          </p>
        </div>
      </div>
    </div>
  );
}
