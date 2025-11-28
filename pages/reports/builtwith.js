import Head from 'next/head';
import { Header } from '../index';

export default function BuiltWithReport() {
  const reportData = {
    domain: "visory.com.au",
    lastUpdated: "November 2024"
  };

  const categories = [
    {
      name: "Content Management",
      technologies: [
        { name: "WordPress", description: "Open-source CMS powering the site", status: "core" },
        { name: "Enfold Theme", description: "Premium WordPress theme from ThemeForest", status: "core" },
        { name: "Yoast SEO Premium", description: "SEO plugin for WordPress optimization", status: "active" }
      ]
    },
    {
      name: "Analytics & Tracking",
      technologies: [
        { name: "Google Analytics 4", description: "Latest version of Google Analytics", status: "active" },
        { name: "Google Universal Analytics", description: "Legacy analytics (should migrate)", status: "warning" },
        { name: "HubSpot", description: "CRM and marketing automation", status: "active" },
        { name: "HubSpot Analytics", description: "Customer interaction tracking", status: "active" },
        { name: "Hotjar", description: "Heatmaps and session recordings", status: "active" },
        { name: "Facebook Pixel", description: "Conversion tracking for Facebook ads", status: "active" },
        { name: "LinkedIn Insights", description: "B2B conversion tracking", status: "active" },
        { name: "TikTok Pixel", description: "Conversion tracking for TikTok ads", status: "active" },
        { name: "Bing UET", description: "Microsoft advertising tracking", status: "active" }
      ]
    },
    {
      name: "Marketing & CRM",
      technologies: [
        { name: "HubSpot Forms", description: "Lead capture forms", status: "active" },
        { name: "HubSpot CTA", description: "Call-to-action buttons", status: "active" },
        { name: "SalesLoft", description: "Sales engagement platform", status: "active" },
        { name: "Freshworks CRM", description: "Customer relationship management", status: "active" },
        { name: "Zarget", description: "A/B testing and conversion optimization", status: "active" }
      ]
    },
    {
      name: "Performance & Infrastructure",
      technologies: [
        { name: "WPEngine", description: "Managed WordPress hosting", status: "core" },
        { name: "Cloudflare", description: "CDN and security", status: "active" },
        { name: "Autoptimize", description: "Script concatenation and optimization", status: "active" },
        { name: "nginx", description: "Web server", status: "core" }
      ]
    },
    {
      name: "JavaScript Libraries",
      technologies: [
        { name: "jQuery", description: "JavaScript library", status: "active" },
        { name: "React", description: "UI component library", status: "active" },
        { name: "MobX", description: "State management", status: "active" },
        { name: "Material UI", description: "React UI framework", status: "active" },
        { name: "Masonry", description: "Grid layout library", status: "active" },
        { name: "PhotoSwipe", description: "Image gallery", status: "active" }
      ]
    },
    {
      name: "Structured Data",
      technologies: [
        { name: "Organization Schema", description: "Company structured data", status: "active" },
        { name: "Person Schema", description: "People/team structured data", status: "active" }
      ]
    },
    {
      name: "WordPress Plugins",
      technologies: [
        { name: "Header Footer Code Manager", description: "Code snippet management", status: "active" },
        { name: "Google Fonts Plugin", description: "Typography customization", status: "active" },
        { name: "HubSpot WordPress Plugin", description: "HubSpot integration", status: "active" }
      ]
    },
    {
      name: "Security",
      technologies: [
        { name: "Let's Encrypt", description: "SSL certificate provider", status: "active" },
        { name: "KnowBe4", description: "Security awareness/fraud prevention", status: "active" },
        { name: "DMARC", description: "Email authentication", status: "active" },
        { name: "SPF", description: "Email sender verification", status: "active" }
      ]
    }
  ];

  const findings = [
    {
      type: "warning",
      title: "Multiple Analytics Overlapping",
      description: "Both GA4 and Universal Analytics are running. Universal Analytics was sunset in July 2023. Ensure only GA4 is needed and remove legacy tracking to reduce page weight."
    },
    {
      type: "warning",
      title: "Heavy Marketing Tech Stack",
      description: "9+ tracking/marketing scripts detected (HubSpot, Hotjar, Facebook, LinkedIn, TikTok, Bing, etc.). This can significantly impact page load performance."
    },
    {
      type: "info",
      title: "Premium WordPress Setup",
      description: "Using WPEngine hosting with Enfold theme and Yoast SEO Premium - a solid, professional WordPress foundation."
    },
    {
      type: "success",
      title: "Good Schema Implementation",
      description: "Organization and Person schemas are implemented, helping search engines understand company information."
    }
  ];

  const actions = [
    {
      title: "Audit and consolidate tracking scripts",
      description: "With 9+ analytics/marketing scripts, evaluate which are essential. Consider using Google Tag Manager to load scripts conditionally and defer non-critical tracking. Remove duplicate/legacy scripts like Universal Analytics.",
      impact: "high"
    },
    {
      title: "Implement script loading optimization",
      description: "Many tracking scripts are render-blocking. Use async/defer loading, implement tag management with GTM, and consider loading non-essential scripts after user interaction to improve Core Web Vitals.",
      impact: "high"
    },
    {
      title: "Expand structured data coverage",
      description: "While Organization and Person schemas exist, consider adding LocalBusiness schema for location pages, Article schema for blog posts, FAQPage schema for FAQ sections, and Review schema for testimonials.",
      impact: "medium"
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      core: { bg: '#DBEAFE', color: '#1E40AF', label: 'Core' },
      active: { bg: '#D1FAE5', color: '#065F46', label: 'Active' },
      warning: { bg: '#FEF3C7', color: '#B45309', label: 'Review' }
    };
    const s = styles[status] || styles.active;
    return (
      <span style={{
        padding: "2px 8px",
        backgroundColor: s.bg,
        color: s.color,
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: "600"
      }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>BuiltWith Technology Report - {reportData.domain}</title>
        <meta name="description" content={`Technology stack analysis for ${reportData.domain}`} />
      </Head>

      <Header />

      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <a href="/technical" style={{ color: "#3B82F6", textDecoration: "none", fontSize: "14px" }}>
            ← Back to Technical SEO
          </a>
        </div>

        <h1 style={{ color: "#333", marginBottom: "10px" }}>BuiltWith Technology Report</h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Technology stack analysis for <strong>{reportData.domain}</strong> | {reportData.lastUpdated}
        </p>

        {/* Summary Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginBottom: "30px"
        }}>
          <div style={{ backgroundColor: "#EFF6FF", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1E40AF" }}>
              {categories.reduce((acc, cat) => acc + cat.technologies.length, 0)}
            </div>
            <div style={{ color: "#4B5563", fontSize: "14px" }}>Technologies</div>
          </div>
          <div style={{ backgroundColor: "#F0FDF4", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#065F46" }}>
              {categories.length}
            </div>
            <div style={{ color: "#4B5563", fontSize: "14px" }}>Categories</div>
          </div>
          <div style={{ backgroundColor: "#FEF3C7", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#B45309" }}>
              9+
            </div>
            <div style={{ color: "#4B5563", fontSize: "14px" }}>Tracking Scripts</div>
          </div>
        </div>

        {/* Technology Categories */}
        <div style={{ display: "grid", gap: "20px", marginBottom: "30px" }}>
          {categories.map((category, catIndex) => (
            <div key={catIndex} style={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              overflow: "hidden"
            }}>
              <div style={{
                backgroundColor: "#F9FAFB",
                padding: "12px 15px",
                borderBottom: "1px solid #E5E7EB"
              }}>
                <h3 style={{ margin: 0, color: "#333", fontSize: "16px" }}>
                  {category.name}
                  <span style={{ marginLeft: "10px", color: "#6B7280", fontWeight: "400", fontSize: "14px" }}>
                    ({category.technologies.length})
                  </span>
                </h3>
              </div>
              <div style={{ padding: "10px" }}>
                {category.technologies.map((tech, techIndex) => (
                  <div key={techIndex} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    borderBottom: techIndex < category.technologies.length - 1 ? "1px solid #F3F4F6" : "none"
                  }}>
                    <div>
                      <div style={{ fontWeight: "500", color: "#333" }}>{tech.name}</div>
                      <div style={{ fontSize: "13px", color: "#6B7280" }}>{tech.description}</div>
                    </div>
                    {getStatusBadge(tech.status)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Key Findings */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h2 style={{ color: "#333", marginBottom: "15px", fontSize: "20px" }}>Key Findings</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {findings.map((finding, index) => {
              const colors = {
                warning: { bg: '#FFFBEB', border: '#F59E0B', text: '#B45309' },
                info: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF' },
                success: { bg: '#F0FDF4', border: '#10B981', text: '#065F46' }
              };
              const c = colors[finding.type];
              return (
                <div key={index} style={{
                  padding: "12px 15px",
                  backgroundColor: c.bg,
                  borderRadius: "6px",
                  borderLeft: `4px solid ${c.border}`
                }}>
                  <div style={{ fontWeight: "600", color: c.text, marginBottom: "5px" }}>
                    {finding.title}
                  </div>
                  <div style={{ fontSize: "14px", color: "#4B5563" }}>{finding.description}</div>
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
                </div>
                <p style={{ margin: 0, color: "#4B5563", lineHeight: "1.6", paddingLeft: "34px" }}>
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
