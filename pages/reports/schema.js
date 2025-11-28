import Head from 'next/head';
import { Header } from '../index';

export default function SchemaReport() {
  const reportData = {
    domain: "visory.com.au",
    testDate: "November 2024",
    validatorUrl: "https://validator.schema.org/"
  };

  const detectedSchemas = [
    {
      type: "Organization",
      status: "valid",
      description: "Company/business structured data",
      properties: ["name", "url", "logo", "contactPoint"],
      coverage: "Homepage only",
      recommendation: "Good foundation - extend to include sameAs (social profiles), address, and foundingDate"
    },
    {
      type: "Person",
      status: "valid",
      description: "Team member/author structured data",
      properties: ["name", "jobTitle", "image"],
      coverage: "About/team pages",
      recommendation: "Add to blog posts as author schema for rich results"
    }
  ];

  const missingSchemas = [
    {
      type: "LocalBusiness",
      priority: "high",
      description: "Location-based business information",
      benefit: "Enables local search features and Google Maps integration",
      pages: "Location pages (Sydney, Melbourne, Brisbane, Perth bookkeeping)"
    },
    {
      type: "Article / BlogPosting",
      priority: "high",
      description: "Blog post and article structured data",
      benefit: "Enables rich snippets in search results with headline, image, and date",
      pages: "All blog posts"
    },
    {
      type: "FAQPage",
      priority: "high",
      description: "Frequently asked questions markup",
      benefit: "Enables FAQ rich results taking more SERP real estate",
      pages: "Service pages with FAQ sections"
    },
    {
      type: "BreadcrumbList",
      priority: "medium",
      description: "Navigation path markup",
      benefit: "Shows breadcrumb navigation in search results",
      pages: "All interior pages"
    },
    {
      type: "Service",
      priority: "medium",
      description: "Service offering structured data",
      benefit: "Helps search engines understand service offerings",
      pages: "Service pages (bookkeeping, payroll, etc.)"
    },
    {
      type: "Review / AggregateRating",
      priority: "medium",
      description: "Customer reviews and ratings",
      benefit: "Displays star ratings in search results",
      pages: "Homepage and service pages with testimonials"
    },
    {
      type: "WebSite",
      priority: "low",
      description: "Website-level information with search",
      benefit: "Enables sitelinks search box in search results",
      pages: "Homepage"
    },
    {
      type: "HowTo",
      priority: "low",
      description: "Step-by-step instructions",
      benefit: "Rich results for how-to content",
      pages: "Playbooks and guide pages"
    }
  ];

  const validationIssues = [
    {
      severity: "info",
      message: "No critical schema errors detected",
      description: "The existing Organization and Person schemas validate correctly without errors."
    },
    {
      severity: "warning",
      message: "Limited schema coverage",
      description: "Only 2 schema types detected across 101 pages. Industry best practice recommends 5-8 relevant schema types for comprehensive SEO."
    },
    {
      severity: "warning",
      message: "Missing rich result opportunities",
      description: "Blog posts, service pages, and FAQ sections lack schema markup, missing opportunities for enhanced search visibility."
    }
  ];

  const actions = [
    {
      title: "Implement Article schema on all blog posts",
      description: "Add Article or BlogPosting schema to all blog content. Include headline, datePublished, dateModified, author (link to Person schema), and image. Yoast SEO Premium can automate this if configured correctly.",
      impact: "high",
      effort: "low"
    },
    {
      title: "Add FAQPage schema to service pages",
      description: "Many service pages have FAQ sections. Wrap these in FAQPage schema to potentially capture FAQ rich results in search, significantly increasing SERP visibility and click-through rates.",
      impact: "high",
      effort: "medium"
    },
    {
      title: "Implement LocalBusiness schema for location pages",
      description: "Add LocalBusiness schema to Sydney, Melbourne, Brisbane, Perth, and NZ bookkeeping pages. Include address, geo coordinates, opening hours, and area served to improve local search visibility.",
      impact: "high",
      effort: "medium"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return { bg: '#FEE2E2', text: '#B91C1C', border: '#EF4444' };
      case 'medium': return { bg: '#FEF3C7', text: '#B45309', border: '#F59E0B' };
      case 'low': return { bg: '#F3F4F6', text: '#6B7280', border: '#9CA3AF' };
      default: return { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' };
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return { bg: '#FEE2E2', text: '#B91C1C', icon: 'X' };
      case 'warning': return { bg: '#FEF3C7', text: '#B45309', icon: '!' };
      case 'info': return { bg: '#D1FAE5', text: '#065F46', icon: '✓' };
      default: return { bg: '#F3F4F6', text: '#374151', icon: '•' };
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>Schema Markup Report - {reportData.domain}</title>
        <meta name="description" content={`Structured data and schema markup analysis for ${reportData.domain}`} />
      </Head>

      <Header />

      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <a href="/technical" style={{ color: "#3B82F6", textDecoration: "none", fontSize: "14px" }}>
            ← Back to Technical SEO
          </a>
        </div>

        <h1 style={{ color: "#333", marginBottom: "10px" }}>Schema Markup Report</h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Structured data validation for <strong>{reportData.domain}</strong> | {reportData.testDate}
        </p>

        {/* Summary Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "30px"
        }}>
          <div style={{ backgroundColor: "#D1FAE5", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#065F46" }}>
              {detectedSchemas.length}
            </div>
            <div style={{ color: "#059669" }}>Schema Types Detected</div>
          </div>
          <div style={{ backgroundColor: "#FEE2E2", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#B91C1C" }}>
              {missingSchemas.filter(s => s.priority === 'high').length}
            </div>
            <div style={{ color: "#DC2626" }}>High Priority Missing</div>
          </div>
          <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#B45309" }}>
              {missingSchemas.length}
            </div>
            <div style={{ color: "#D97706" }}>Total Opportunities</div>
          </div>
        </div>

        {/* Detected Schemas */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h2 style={{ color: "#333", marginBottom: "15px", fontSize: "20px" }}>Detected Schema Types</h2>
          <div style={{ display: "grid", gap: "15px" }}>
            {detectedSchemas.map((schema, index) => (
              <div key={index} style={{
                padding: "15px",
                backgroundColor: "#F0FDF4",
                borderRadius: "8px",
                borderLeft: "4px solid #10B981"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "#065F46", fontSize: "18px" }}>{schema.type}</h3>
                    <p style={{ margin: 0, color: "#4B5563", fontSize: "14px" }}>{schema.description}</p>
                  </div>
                  <span style={{
                    padding: "4px 12px",
                    backgroundColor: "#10B981",
                    color: "#fff",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase"
                  }}>
                    Valid
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "8px" }}>
                  <strong>Properties:</strong> {schema.properties.join(', ')}
                </div>
                <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "8px" }}>
                  <strong>Coverage:</strong> {schema.coverage}
                </div>
                <div style={{
                  padding: "8px 12px",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  fontSize: "13px",
                  color: "#059669"
                }}>
                  <strong>Recommendation:</strong> {schema.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Schemas */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h2 style={{ color: "#333", marginBottom: "15px", fontSize: "20px" }}>Missing Schema Opportunities</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {missingSchemas.map((schema, index) => {
              const colors = getPriorityColor(schema.priority);
              return (
                <div key={index} style={{
                  padding: "15px",
                  backgroundColor: colors.bg,
                  borderRadius: "8px",
                  borderLeft: `4px solid ${colors.border}`
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h4 style={{ margin: 0, color: "#333", fontSize: "16px" }}>{schema.type}</h4>
                    <span style={{
                      padding: "3px 10px",
                      backgroundColor: colors.border,
                      color: "#fff",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase"
                    }}>
                      {schema.priority} priority
                    </span>
                  </div>
                  <p style={{ margin: "0 0 8px 0", color: "#4B5563", fontSize: "14px" }}>{schema.description}</p>
                  <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "5px" }}>
                    <strong>Benefit:</strong> {schema.benefit}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6B7280" }}>
                    <strong>Add to:</strong> {schema.pages}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Validation Status */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h2 style={{ color: "#333", marginBottom: "15px", fontSize: "20px" }}>Validation Status</h2>
          <div style={{ display: "grid", gap: "10px" }}>
            {validationIssues.map((issue, index) => {
              const colors = getSeverityColor(issue.severity);
              return (
                <div key={index} style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px 15px",
                  backgroundColor: colors.bg,
                  borderRadius: "6px"
                }}>
                  <span style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: colors.text,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "14px",
                    flexShrink: 0
                  }}>
                    {colors.icon}
                  </span>
                  <div>
                    <div style={{ fontWeight: "600", color: colors.text, marginBottom: "3px" }}>{issue.message}</div>
                    <div style={{ fontSize: "14px", color: "#4B5563" }}>{issue.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Actions */}
        <div style={{
          backgroundColor: "#EFF6FF",
          border: "2px solid #3B82F6",
          borderRadius: "8px",
          padding: "20px"
        }}>
          <h2 style={{ color: "#1E40AF", margin: "0 0 20px 0", fontSize: "20px" }}>Top 3 Recommended Actions</h2>
          <div style={{ display: "grid", gap: "15px" }}>
            {actions.map((action, index) => (
              <div key={index} style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "6px",
                borderLeft: "4px solid #3B82F6"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{
                    backgroundColor: "#3B82F6",
                    color: "#fff",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}>{index + 1}</span>
                  <h3 style={{ margin: 0, color: "#1E40AF", fontSize: "16px" }}>{action.title}</h3>
                  <span style={{
                    marginLeft: "auto",
                    padding: "2px 8px",
                    backgroundColor: action.effort === 'low' ? '#D1FAE5' : '#FEF3C7',
                    color: action.effort === 'low' ? '#065F46' : '#B45309',
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "500"
                  }}>
                    {action.effort} effort
                  </span>
                </div>
                <p style={{ margin: 0, color: "#4B5563", lineHeight: "1.6", paddingLeft: "34px" }}>
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testing Tools */}
        <div style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#F9FAFB",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <p style={{ margin: "0 0 15px 0", color: "#6B7280" }}>
            Test your schema markup with these tools:
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
            <a
              href="https://validator.schema.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 16px",
                backgroundColor: "#3B82F6",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px"
              }}
            >
              Schema Validator
            </a>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 16px",
                backgroundColor: "#10B981",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px"
              }}
            >
              Rich Results Test
            </a>
            <a
              href="https://search.google.com/structured-data/testing-tool"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 16px",
                backgroundColor: "#6B7280",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px"
              }}
            >
              Structured Data Test
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
