/*
Description: Enhanced Technical SEO Results Display Component
Version: 2.0
Author: Ciaran Quinlan
*/

export default function TechnicalResults({ results, url }) {
  if (!results) return null;

  return (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      {/* Header with Score */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        paddingBottom: "20px",
        borderBottom: "2px solid #eee"
      }}>
        <div>
          <h2 style={{ margin: "0 0 5px 0" }}>Technical Audit Complete</h2>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
            {results.metadata?.timestamp && new Date(results.metadata.timestamp).toLocaleString()}
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: results.score >= 80 ? "#22C55E" : results.score >= 60 ? "#F59E0B" : "#EF4444"
          }}>
            {results.score}
          </div>
          <div style={{ fontSize: "16px", color: "#666", fontWeight: "600" }}>Technical Score</div>
          <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
            {results.metadata?.executionTime}ms analysis time
          </div>
        </div>
      </div>

      {/* Summary */}
      {results.summary && (
        <div style={{
          backgroundColor: "#F0F9FF",
          padding: "15px 20px",
          borderRadius: "6px",
          marginBottom: "30px",
          border: "1px solid #BAE6FD"
        }}>
          <p style={{ margin: 0, color: "#075985", lineHeight: "1.6", fontSize: "15px" }}>
            {results.summary}
          </p>
        </div>
      )}

      {/* Crawling & Indexing Section */}
      <Section title="Crawling & Indexing">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <InfoCard
            title="Robots.txt"
            status={results.data?.crawling?.robotsTxt?.exists}
            details={[
              { label: "Status", value: results.data?.crawling?.robotsTxt?.exists ? "Found" : "Not Found" },
              { label: "Allows Crawling", value: results.data?.crawling?.robotsTxt?.allows ? "Yes" : "No" },
              { label: "Sitemaps Listed", value: results.data?.crawling?.robotsTxt?.sitemaps?.length || 0 }
            ]}
          />
          <InfoCard
            title="XML Sitemap"
            status={results.data?.crawling?.sitemap?.exists}
            details={[
              { label: "Status", value: results.data?.crawling?.sitemap?.exists ? "Found" : "Not Found" },
              { label: "Type", value: results.data?.crawling?.sitemap?.isSitemapIndex ? "Sitemap Index" : "Regular Sitemap" },
              { label: "URL Count", value: results.data?.crawling?.sitemap?.count || results.data?.crawling?.sitemap?.childSitemaps?.length || 0 }
            ]}
          />
        </div>

        {results.data?.crawling?.sitemap?.childSitemaps && results.data.crawling.sitemap.childSitemaps.length > 0 && (
          <div style={{ marginTop: "15px", padding: "15px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
            <div style={{ fontWeight: "600", marginBottom: "10px", fontSize: "14px" }}>Child Sitemaps:</div>
            <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#666" }}>
              {results.data.crawling.sitemap.childSitemaps.slice(0, 5).map((sitemap, i) => (
                <li key={i} style={{ marginBottom: "5px" }}>{sitemap}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
          <InfoCard
            title="Meta Robots"
            status={results.data?.crawling?.metaRobots?.index}
            details={[
              { label: "Index", value: results.data?.crawling?.metaRobots?.index ? "✓ Allowed" : "✗ Blocked" },
              { label: "Follow", value: results.data?.crawling?.metaRobots?.follow ? "✓ Allowed" : "✗ Blocked" }
            ]}
          />
          <InfoCard
            title="Canonical URL"
            status={results.data?.crawling?.canonical?.exists}
            details={[
              { label: "Status", value: results.data?.crawling?.canonical?.exists ? "Present" : "Missing" },
              { label: "URL", value: results.data?.crawling?.canonical?.value ? "Set" : "Not Set" }
            ]}
          />
        </div>
      </Section>

      {/* Performance Section */}
      <Section title="Performance & Resources">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
          <MetricCard label="Page Load" value={`${results.data?.technical?.loadTime || 'N/A'}ms`} />
          <MetricCard label="HTML Size" value={`${results.data?.performance?.sizes?.htmlKB || '0'}KB`} />
          <MetricCard label="Scripts" value={results.data?.performance?.resources?.totalScripts || 0} />
          <MetricCard label="Stylesheets" value={results.data?.performance?.resources?.totalStylesheets || 0} />
          <MetricCard label="Images" value={results.data?.performance?.resources?.totalImages || 0} />
          <MetricCard label="Content Ratio" value={`${results.data?.performance?.metrics?.contentToCodeRatio || 0}%`} />
        </div>

        {results.data?.performance?.images && (
          <div style={{ marginTop: "15px", padding: "15px", backgroundColor: "#FEF3C7", borderRadius: "6px", border: "1px solid #FCD34D" }}>
            <div style={{ fontWeight: "600", marginBottom: "10px", fontSize: "14px", color: "#78350F" }}>
              Image Optimization
            </div>
            <div style={{ fontSize: "13px", color: "#92400E" }}>
              • {results.data.performance.images.withoutAlt} images missing alt text<br />
              • {results.data.performance.images.lazyLoaded} images using lazy loading<br />
              • {results.data.performance.images.withoutDimensions} images without dimensions
            </div>
          </div>
        )}
      </Section>

      {/* Content Analysis Section */}
      <Section title="Content Analysis">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
          <MetricCard label="Word Count" value={results.data?.content?.wordCount || 0} />
          <MetricCard label="Reading Time" value={results.data?.content?.readingTime?.text || 'N/A'} />
          <MetricCard label="Paragraphs" value={results.data?.content?.paragraphCount || 0} />
          <MetricCard label="Avg Sentence" value={`${results.data?.content?.avgSentenceLength || 0} words`} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
          <InfoCard
            title="Readability"
            details={[
              { label: "Score", value: `${results.data?.content?.readability?.score || 0}/100` },
              { label: "Level", value: results.data?.content?.readability?.level || 'Unknown' }
            ]}
          />
          <InfoCard
            title="Headings Structure"
            details={[
              { label: "H1", value: results.data?.content?.headings?.h1 || 0 },
              { label: "H2", value: results.data?.content?.headings?.h2 || 0 },
              { label: "H3", value: results.data?.content?.headings?.h3 || 0 }
            ]}
          />
        </div>
      </Section>

      {/* On-Page SEO Section */}
      <Section title="On-Page SEO Elements">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
          <div style={{ backgroundColor: "#F9FAFB", padding: "15px", borderRadius: "6px" }}>
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>Title Tag ({results.data?.onPage?.title?.length || 0} characters)</div>
            <div style={{ fontFamily: "monospace", fontSize: "14px", color: "#4B5563" }}>
              {results.data?.onPage?.title?.value || 'Not found'}
            </div>
          </div>

          <div style={{ backgroundColor: "#F9FAFB", padding: "15px", borderRadius: "6px" }}>
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>Meta Description ({results.data?.onPage?.metaDescription?.length || 0} characters)</div>
            <div style={{ fontFamily: "monospace", fontSize: "14px", color: "#4B5563" }}>
              {results.data?.onPage?.metaDescription?.value || 'Not found'}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginTop: "15px" }}>
          <InfoCard
            title="Structured Data"
            status={results.data?.onPage?.structuredData?.count > 0}
            details={[
              { label: "JSON-LD Scripts", value: results.data?.onPage?.structuredData?.count || 0 }
            ]}
          />
          <InfoCard
            title="Open Graph"
            status={!!results.data?.onPage?.openGraph?.title}
            details={[
              { label: "Title", value: results.data?.onPage?.openGraph?.title ? "✓" : "✗" },
              { label: "Image", value: results.data?.onPage?.openGraph?.image ? "✓" : "✗" }
            ]}
          />
          <InfoCard
            title="Twitter Card"
            status={!!results.data?.onPage?.twitterCard?.card}
            details={[
              { label: "Type", value: results.data?.onPage?.twitterCard?.card || "Not set" }
            ]}
          />
        </div>
      </Section>

      {/* Priority Issues Section */}
      <Section title={`Issues Found (${results.issues?.length || 0})`}>
        {results.issues && results.issues.length > 0 ? (
          <IssuesList issues={results.issues} />
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "#22C55E" }}>
            ✓ No critical issues found! Excellent technical SEO.
          </div>
        )}
      </Section>
    </div>
  );
}

// Helper Components
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color: "#333", borderBottom: "2px solid #E5E7EB", paddingBottom: "8px" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoCard({ title, status, details }) {
  return (
    <div style={{
      backgroundColor: "#F9FAFB",
      padding: "15px",
      borderRadius: "6px",
      border: "1px solid #E5E7EB"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ fontWeight: "600", fontSize: "14px" }}>{title}</div>
        {status !== undefined && (
          <div style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: status ? "#22C55E" : "#EF4444"
          }} />
        )}
      </div>
      {details.map((detail, i) => (
        <div key={i} style={{ fontSize: "13px", color: "#6B7280", marginTop: "5px" }}>
          <strong>{detail.label}:</strong> {detail.value}
        </div>
      ))}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div style={{
      backgroundColor: "#F9FAFB",
      padding: "15px",
      borderRadius: "6px",
      textAlign: "center",
      border: "1px solid #E5E7EB"
    }}>
      <div style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>{value}</div>
      <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "5px" }}>{label}</div>
    </div>
  );
}

function IssuesList({ issues }) {
  const priorityColors = {
    critical: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B' },
    high: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
    medium: { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
    low: { bg: '#E5E7EB', border: '#6B7280', text: '#374151' }
  };

  return (
    <div>
      {['critical', 'high', 'medium', 'low'].map(priority => {
        const priorityIssues = issues.filter(i => i.priority === priority);
        if (priorityIssues.length === 0) return null;

        const colors = priorityColors[priority];

        return (
          <div key={priority} style={{ marginBottom: "20px" }}>
            <div style={{
              backgroundColor: colors.bg,
              padding: "10px 15px",
              borderRadius: "6px 6px 0 0",
              fontWeight: "bold",
              color: colors.text,
              textTransform: "uppercase",
              fontSize: "13px",
              border: `1px solid ${colors.border}`,
              borderBottom: "none"
            }}>
              {priority} Priority ({priorityIssues.length})
            </div>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              border: `1px solid ${colors.border}`,
              borderTop: "none",
              borderRadius: "0 0 6px 6px"
            }}>
              {priorityIssues.map((issue, index) => (
                <li key={index} style={{
                  padding: "12px 15px",
                  borderBottom: index < priorityIssues.length - 1 ? "1px solid #eee" : "none",
                  backgroundColor: "white"
                }}>
                  <div style={{ fontWeight: "600", marginBottom: "5px", fontSize: "14px" }}>
                    {issue.category}: {issue.issue}
                  </div>
                  {issue.recommendation && (
                    <div style={{ fontSize: "13px", color: "#0070f3", marginTop: "5px" }}>
                      💡 {issue.recommendation}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
