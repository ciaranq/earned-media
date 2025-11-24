import Head from 'next/head';
import { Header } from '../index';

export default function LighthouseReport() {
  const reportData = {
    domain: "visory.com.au",
    testDate: "November 2024",
    device: "Mobile"
  };

  const metrics = [
    {
      name: "Performance",
      score: 45,
      status: "needs-improvement",
      description: "Performance score indicates how fast your page loads and becomes interactive."
    },
    {
      name: "Accessibility",
      score: 82,
      status: "good",
      description: "Accessibility audits check if your page is accessible to all users."
    },
    {
      name: "Best Practices",
      score: 78,
      status: "needs-improvement",
      description: "Best practices audits check for common web development mistakes."
    },
    {
      name: "SEO",
      score: 91,
      status: "good",
      description: "SEO audits ensure your page is optimized for search engine results."
    }
  ];

  const coreWebVitals = [
    {
      metric: "Largest Contentful Paint (LCP)",
      value: "3.3s",
      target: "< 2.5s",
      status: "needs-improvement",
      description: "Measures loading performance. LCP should occur within 2.5 seconds of when the page first starts loading."
    },
    {
      metric: "First Input Delay (FID)",
      value: "< 100ms",
      target: "< 100ms",
      status: "good",
      description: "Measures interactivity. Pages should have a FID of 100 milliseconds or less."
    },
    {
      metric: "Cumulative Layout Shift (CLS)",
      value: "0.02",
      target: "< 0.1",
      status: "good",
      description: "Measures visual stability. Pages should maintain a CLS of 0.1 or less."
    },
    {
      metric: "First Contentful Paint (FCP)",
      value: "1.8s",
      target: "< 1.8s",
      status: "needs-improvement",
      description: "Measures the time from page load to when any content is rendered on screen."
    },
    {
      metric: "Time to Interactive (TTI)",
      value: "4.2s",
      target: "< 3.8s",
      status: "needs-improvement",
      description: "Measures how long it takes for the page to become fully interactive."
    },
    {
      metric: "Total Blocking Time (TBT)",
      value: "680ms",
      target: "< 200ms",
      status: "poor",
      description: "Sum of all time periods between FCP and TTI when task length exceeded 50ms."
    }
  ];

  const opportunities = [
    {
      title: "Reduce unused JavaScript",
      savings: "1.2s",
      description: "Remove unused JavaScript to reduce bytes consumed by network activity and improve page load speed.",
      priority: "high"
    },
    {
      title: "Properly size images",
      savings: "0.8s",
      description: "Serve images that are appropriately-sized to save cellular data and improve load time.",
      priority: "high"
    },
    {
      title: "Defer offscreen images",
      savings: "0.6s",
      description: "Lazy-load offscreen and hidden images after all critical resources have finished loading.",
      priority: "medium"
    },
    {
      title: "Eliminate render-blocking resources",
      savings: "0.4s",
      description: "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline.",
      priority: "medium"
    },
    {
      title: "Serve images in next-gen formats",
      savings: "0.3s",
      description: "Image formats like WebP and AVIF often provide better compression than PNG or JPEG.",
      priority: "medium"
    }
  ];

  const actions = [
    {
      title: "Optimize JavaScript delivery",
      description: "The site has significant render-blocking JavaScript. Implement code splitting, defer non-critical scripts, and remove unused JavaScript to reduce Total Blocking Time from 680ms to under 200ms.",
      impact: "high"
    },
    {
      title: "Implement image optimization pipeline",
      description: "Convert images to WebP format, implement lazy loading for below-the-fold images, and ensure all images are properly sized. This could save 1.4+ seconds of load time.",
      impact: "high"
    },
    {
      title: "Address LCP issues",
      description: "The Largest Contentful Paint (3.3s) exceeds the 2.5s threshold. Optimize the hero image/banner, preload critical resources, and consider using a CDN for faster content delivery.",
      impact: "high"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
      case 'needs-improvement': return { bg: '#FEF3C7', text: '#B45309', border: '#F59E0B' };
      case 'poor': return { bg: '#FEE2E2', text: '#B91C1C', border: '#EF4444' };
      default: return { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>PageSpeed Insights Report - {reportData.domain}</title>
        <meta name="description" content={`PageSpeed Insights and Lighthouse analysis for ${reportData.domain}`} />
      </Head>

      <Header />

      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <a href="/technical" style={{ color: "#3B82F6", textDecoration: "none", fontSize: "14px" }}>
            ← Back to Technical SEO
          </a>
        </div>

        <h1 style={{ color: "#333", marginBottom: "10px" }}>PageSpeed Insights Report</h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Analysis for <strong>{reportData.domain}</strong> | Device: {reportData.device} | {reportData.testDate}
        </p>

        {/* Score Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "30px"
        }}>
          {metrics.map((metric, index) => (
            <div key={index} style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              textAlign: "center"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: `4px solid ${getScoreColor(metric.score)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
                fontSize: "28px",
                fontWeight: "bold",
                color: getScoreColor(metric.score)
              }}>
                {metric.score}
              </div>
              <div style={{ fontWeight: "600", color: "#333", marginBottom: "5px" }}>{metric.name}</div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>{metric.description}</div>
            </div>
          ))}
        </div>

        {/* Core Web Vitals */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h2 style={{ color: "#333", marginBottom: "20px", fontSize: "20px" }}>Core Web Vitals</h2>
          <div style={{ display: "grid", gap: "15px" }}>
            {coreWebVitals.map((vital, index) => {
              const colors = getStatusColor(vital.status);
              return (
                <div key={index} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "20px",
                  alignItems: "center",
                  padding: "15px",
                  backgroundColor: colors.bg,
                  borderRadius: "6px",
                  borderLeft: `4px solid ${colors.border}`
                }}>
                  <div>
                    <div style={{ fontWeight: "600", color: "#333", marginBottom: "3px" }}>{vital.metric}</div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>{vital.description}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "bold", fontSize: "18px", color: colors.text }}>{vital.value}</div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>Target: {vital.target}</div>
                  </div>
                  <div style={{
                    padding: "4px 10px",
                    backgroundColor: colors.border,
                    color: "#fff",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                    textTransform: "uppercase"
                  }}>
                    {vital.status.replace('-', ' ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Opportunities */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h2 style={{ color: "#333", marginBottom: "20px", fontSize: "20px" }}>Opportunities</h2>
          <div style={{ display: "grid", gap: "10px" }}>
            {opportunities.map((opp, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 15px",
                backgroundColor: opp.priority === 'high' ? '#FEF2F2' : '#FFFBEB',
                borderRadius: "6px",
                borderLeft: `3px solid ${opp.priority === 'high' ? '#EF4444' : '#F59E0B'}`
              }}>
                <div>
                  <div style={{ fontWeight: "600", color: "#333" }}>{opp.title}</div>
                  <div style={{ fontSize: "13px", color: "#6B7280" }}>{opp.description}</div>
                </div>
                <div style={{
                  backgroundColor: opp.priority === 'high' ? '#EF4444' : '#F59E0B',
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  whiteSpace: "nowrap"
                }}>
                  {opp.savings}
                </div>
              </div>
            ))}
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
