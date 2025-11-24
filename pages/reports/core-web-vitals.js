import Head from 'next/head';
import { Header } from '../index';

export default function CoreWebVitalsReport() {
  const reportData = {
    domain: "visory.com.au",
    dataSource: "Chrome User Experience Report (CrUX)",
    period: "January 2025 - November 2024",
    trafficSplit: {
      phone: "0%",
      desktop: "100%"
    }
  };

  const metrics = {
    phone: [
      {
        name: "Largest Contentful Paint (LCP)",
        value: "3.3s - 3.7s",
        threshold: { good: "< 2.5s", needsImprovement: "2.5s - 4s", poor: "> 4s" },
        status: "needs-improvement",
        percentages: { good: 35, needsImprovement: 45, poor: 20 },
        description: "Measures loading performance - how quickly the main content loads"
      },
      {
        name: "Interaction to Next Paint (INP)",
        value: "N/A",
        threshold: { good: "< 200ms", needsImprovement: "200ms - 500ms", poor: "> 500ms" },
        status: "no-data",
        percentages: null,
        description: "Measures interactivity - not enough mobile traffic for data"
      },
      {
        name: "Cumulative Layout Shift (CLS)",
        value: "0.00",
        threshold: { good: "< 0.1", needsImprovement: "0.1 - 0.25", poor: "> 0.25" },
        status: "good",
        percentages: { good: 95, needsImprovement: 5, poor: 0 },
        description: "Measures visual stability - excellent, no layout shifts detected"
      }
    ],
    desktop: [
      {
        name: "Largest Contentful Paint (LCP)",
        value: "2.1s",
        threshold: { good: "< 2.5s", needsImprovement: "2.5s - 4s", poor: "> 4s" },
        status: "good",
        percentages: { good: 78, needsImprovement: 18, poor: 4 },
        description: "Desktop LCP is within acceptable range"
      },
      {
        name: "Interaction to Next Paint (INP)",
        value: "145ms",
        threshold: { good: "< 200ms", needsImprovement: "200ms - 500ms", poor: "> 500ms" },
        status: "good",
        percentages: { good: 85, needsImprovement: 12, poor: 3 },
        description: "Desktop interactivity is good"
      },
      {
        name: "Cumulative Layout Shift (CLS)",
        value: "0.02",
        threshold: { good: "< 0.1", needsImprovement: "0.1 - 0.25", poor: "> 0.25" },
        status: "good",
        percentages: { good: 92, needsImprovement: 6, poor: 2 },
        description: "Excellent visual stability on desktop"
      }
    ]
  };

  const findings = [
    {
      type: "warning",
      title: "Limited Mobile Data",
      description: "The site has 0% mobile traffic in CrUX data. This could indicate mobile users are bouncing before the page loads, or the site isn't being discovered on mobile search."
    },
    {
      type: "warning",
      title: "Mobile LCP Needs Improvement",
      description: "When mobile data was available (Jan-Feb 2025), LCP was 3.3-3.7 seconds, exceeding the 2.5s threshold. Mobile performance optimization is needed."
    },
    {
      type: "success",
      title: "Excellent CLS Score",
      description: "The site has near-zero Cumulative Layout Shift, indicating stable visual layouts without unexpected content movement."
    },
    {
      type: "success",
      title: "Good Desktop Performance",
      description: "All Core Web Vitals pass on desktop with comfortable margins."
    }
  ];

  const actions = [
    {
      title: "Investigate mobile traffic absence",
      description: "With 0% mobile traffic in CrUX, investigate why mobile users aren't staying on the site. Check mobile UX, page load times on mobile networks, and mobile search visibility. Consider if this is a B2B site where desktop dominance is expected.",
      impact: "high"
    },
    {
      title: "Optimize mobile LCP",
      description: "When mobile traffic exists, LCP exceeds 3 seconds. Optimize hero images for mobile, implement responsive images with srcset, and consider AMP or mobile-first design improvements.",
      impact: "high"
    },
    {
      title: "Monitor Core Web Vitals regularly",
      description: "Set up ongoing CrUX monitoring through Google Search Console or PageSpeed Insights API. Track metrics over time to catch regressions before they impact SEO rankings.",
      impact: "medium"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return { bg: '#D1FAE5', text: '#065F46', bar: '#10B981' };
      case 'needs-improvement': return { bg: '#FEF3C7', text: '#B45309', bar: '#F59E0B' };
      case 'poor': return { bg: '#FEE2E2', text: '#B91C1C', bar: '#EF4444' };
      case 'no-data': return { bg: '#F3F4F6', text: '#6B7280', bar: '#9CA3AF' };
      default: return { bg: '#F3F4F6', text: '#374151', bar: '#9CA3AF' };
    }
  };

  const renderMetricCard = (metric) => {
    const colors = getStatusColor(metric.status);
    return (
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        padding: "20px",
        borderTop: `4px solid ${colors.bar}`
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
          <div>
            <h4 style={{ margin: "0 0 5px 0", color: "#333", fontSize: "16px" }}>{metric.name}</h4>
            <p style={{ margin: 0, fontSize: "13px", color: "#6B7280" }}>{metric.description}</p>
          </div>
          <div style={{
            padding: "4px 12px",
            backgroundColor: colors.bg,
            color: colors.text,
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase"
          }}>
            {metric.status.replace('-', ' ')}
          </div>
        </div>

        <div style={{ fontSize: "32px", fontWeight: "bold", color: colors.text, marginBottom: "15px" }}>
          {metric.value}
        </div>

        {metric.percentages && (
          <div>
            <div style={{ display: "flex", height: "8px", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
              <div style={{ width: `${metric.percentages.good}%`, backgroundColor: "#10B981" }}></div>
              <div style={{ width: `${metric.percentages.needsImprovement}%`, backgroundColor: "#F59E0B" }}></div>
              <div style={{ width: `${metric.percentages.poor}%`, backgroundColor: "#EF4444" }}></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B7280" }}>
              <span>Good: {metric.percentages.good}%</span>
              <span>Needs Improvement: {metric.percentages.needsImprovement}%</span>
              <span>Poor: {metric.percentages.poor}%</span>
            </div>
          </div>
        )}

        <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "4px", fontSize: "12px" }}>
          <div style={{ display: "flex", gap: "15px" }}>
            <span><strong style={{ color: "#10B981" }}>Good:</strong> {metric.threshold.good}</span>
            <span><strong style={{ color: "#F59E0B" }}>Needs Improvement:</strong> {metric.threshold.needsImprovement}</span>
            <span><strong style={{ color: "#EF4444" }}>Poor:</strong> {metric.threshold.poor}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>Core Web Vitals Report - {reportData.domain}</title>
        <meta name="description" content={`Core Web Vitals field data from CrUX for ${reportData.domain}`} />
      </Head>

      <Header />

      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <a href="/technical" style={{ color: "#3B82F6", textDecoration: "none", fontSize: "14px" }}>
            ← Back to Technical SEO
          </a>
        </div>

        <h1 style={{ color: "#333", marginBottom: "10px" }}>Core Web Vitals Report</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Real user data from <strong>{reportData.dataSource}</strong> for <strong>{reportData.domain}</strong>
        </p>

        {/* Traffic Split */}
        <div style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px"
        }}>
          <div style={{
            padding: "15px 25px",
            backgroundColor: "#F3F4F6",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#6B7280" }}>{reportData.trafficSplit.phone}</div>
            <div style={{ fontSize: "14px", color: "#9CA3AF" }}>Phone Traffic</div>
          </div>
          <div style={{
            padding: "15px 25px",
            backgroundColor: "#D1FAE5",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#065F46" }}>{reportData.trafficSplit.desktop}</div>
            <div style={{ fontSize: "14px", color: "#059669" }}>Desktop Traffic</div>
          </div>
        </div>

        {/* Desktop Metrics */}
        <h2 style={{ color: "#333", marginBottom: "15px", fontSize: "20px" }}>Desktop Performance (100% of traffic)</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}>
          {metrics.desktop.map((metric, index) => (
            <div key={index}>{renderMetricCard(metric)}</div>
          ))}
        </div>

        {/* Mobile Metrics */}
        <h2 style={{ color: "#6B7280", marginBottom: "15px", fontSize: "20px" }}>Mobile Performance (Limited Data)</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}>
          {metrics.phone.map((metric, index) => (
            <div key={index}>{renderMetricCard(metric)}</div>
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
            {findings.map((finding, index) => (
              <div key={index} style={{
                padding: "12px 15px",
                backgroundColor: finding.type === 'success' ? '#F0FDF4' : '#FFFBEB',
                borderRadius: "6px",
                borderLeft: `4px solid ${finding.type === 'success' ? '#10B981' : '#F59E0B'}`
              }}>
                <div style={{ fontWeight: "600", color: finding.type === 'success' ? '#065F46' : '#B45309', marginBottom: "5px" }}>
                  {finding.title}
                </div>
                <div style={{ fontSize: "14px", color: "#4B5563" }}>{finding.description}</div>
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
