import Head from 'next/head';
import { Header } from '../index';
import fs from 'fs';
import path from 'path';

export default function KeywordReport({ reportData, domain }) {
  if (!reportData) {
    return (
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <Head>
          <title>Report Not Found - SEO Agent for Earned Media</title>
        </Head>
        <Header />
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ color: "#333" }}>Report Not Found</h1>
          <p style={{ color: "#666" }}>The keyword analysis report for {domain} could not be found.</p>
          <a href="/keyword-analysis" style={{ color: "#3B82F6", textDecoration: "none" }}>
            ← Back to Keyword Analysis Reports
          </a>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${month} ${day}, ${year} at ${displayHours}:${minutes} ${ampm}`;
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return '#10B981';
    if (percentage >= 90) return '#F59E0B';
    return '#6B7280';
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>Keyword Analysis Report - {domain}</title>
        <meta name="description" content={`Comprehensive keyword analysis report for ${domain}`} />
      </Head>

      <Header />

      <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <a href="/keyword-analysis" style={{ color: "#3B82F6", textDecoration: "none", fontSize: "14px" }}>
            ← Back to Keyword Analysis Reports
          </a>
        </div>

        {/* Header */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          padding: "30px",
          marginBottom: "20px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
            <div>
              <h1 style={{ color: "#111", marginBottom: "8px", fontSize: "32px" }}>Keyword Analysis Report</h1>
              <p style={{ color: "#3B82F6", fontSize: "20px", marginBottom: "8px" }}>{domain}</p>
              <p style={{ color: "#6B7280", fontSize: "14px" }}>Generated: {formatDate(reportData.analyzedAt)}</p>
            </div>
            <button
              onClick={() => window.print()}
              style={{
                backgroundColor: "#3B82F6",
                color: "white",
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563EB"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3B82F6"}
            >
              Print Report
            </button>
          </div>

          {/* Summary Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "20px"
          }}>
            <div style={{
              backgroundColor: "#DBEAFE",
              borderRadius: "6px",
              padding: "15px",
              border: "1px solid #93C5FD"
            }}>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1E40AF" }}>{reportData.totalPages}</div>
              <div style={{ fontSize: "14px", color: "#1E3A8A", marginTop: "4px" }}>Pages Analyzed</div>
            </div>
            <div style={{
              backgroundColor: "#D1FAE5",
              borderRadius: "6px",
              padding: "15px",
              border: "1px solid #6EE7B7"
            }}>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#047857" }}>{reportData.totalWords?.toLocaleString() || 0}</div>
              <div style={{ fontSize: "14px", color: "#065F46", marginTop: "4px" }}>Total Words</div>
            </div>
            <div style={{
              backgroundColor: "#E9D5FF",
              borderRadius: "6px",
              padding: "15px",
              border: "1px solid #C084FC"
            }}>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#6B21A8" }}>{reportData.topKeywords?.length || 0}</div>
              <div style={{ fontSize: "14px", color: "#581C87", marginTop: "4px" }}>Unique Keywords</div>
            </div>
            <div style={{
              backgroundColor: "#FED7AA",
              borderRadius: "6px",
              padding: "15px",
              border: "1px solid #FDBA74"
            }}>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#92400E" }}>
                {Math.round(reportData.totalWords / reportData.totalPages) || 0}
              </div>
              <div style={{ fontSize: "14px", color: "#78350F", marginTop: "4px" }}>Avg Words/Page</div>
            </div>
          </div>
        </div>

        {/* Meta Analysis */}
        {reportData.metaAnalysis && (
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "30px",
            marginBottom: "20px"
          }}>
            <h2 style={{ color: "#111", marginBottom: "20px", fontSize: "24px" }}>Meta Tags Analysis</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px"
            }}>
              <div>
                <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px" }}>Pages with Title Tags</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>
                    {reportData.metaAnalysis.titlesCount}
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B7280", marginLeft: "8px" }}>
                    / {reportData.totalPages}
                  </div>
                  <div style={{
                    marginLeft: "auto",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: getStatusColor((reportData.metaAnalysis.titlesCount / reportData.totalPages) * 100)
                  }}>
                    {Math.round((reportData.metaAnalysis.titlesCount / reportData.totalPages) * 100)}%
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                  Avg length: {reportData.metaAnalysis.avgTitleLength} chars
                </div>
              </div>
              <div>
                <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px" }}>Pages with Meta Description</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>
                    {reportData.metaAnalysis.descriptionsCount}
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B7280", marginLeft: "8px" }}>
                    / {reportData.totalPages}
                  </div>
                  <div style={{
                    marginLeft: "auto",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: getStatusColor((reportData.metaAnalysis.descriptionsCount / reportData.totalPages) * 100)
                  }}>
                    {Math.round((reportData.metaAnalysis.descriptionsCount / reportData.totalPages) * 100)}%
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                  Avg length: {reportData.metaAnalysis.avgDescLength} chars
                </div>
              </div>
              <div>
                <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px" }}>Pages with Meta Keywords</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>
                    {reportData.metaAnalysis.keywordsCount}
                  </div>
                  <div style={{ fontSize: "14px", color: "#6B7280", marginLeft: "8px" }}>
                    / {reportData.totalPages}
                  </div>
                  <div style={{
                    marginLeft: "auto",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#6B7280"
                  }}>
                    {Math.round((reportData.metaAnalysis.keywordsCount / reportData.totalPages) * 100)}%
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                  Meta keywords are deprecated
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heading Distribution */}
        {reportData.headingDistribution && (
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "30px",
            marginBottom: "20px"
          }}>
            <h2 style={{ color: "#111", marginBottom: "20px", fontSize: "24px" }}>Heading Structure Distribution</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "15px"
            }}>
              {Object.entries(reportData.headingDistribution).map(([heading, count]) => (
                <div key={heading} style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "6px",
                  padding: "15px",
                  border: "1px solid #E5E7EB",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "12px", color: "#6B7280", textTransform: "uppercase", marginBottom: "4px" }}>
                    {heading.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#111" }}>{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Keywords */}
        {reportData.topKeywords && reportData.topKeywords.length > 0 && (
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "30px",
            marginBottom: "20px"
          }}>
            <h2 style={{ color: "#111", marginBottom: "20px", fontSize: "24px" }}>
              Top {Math.min(50, reportData.topKeywords.length)} Keywords
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F9FAFB", borderBottom: "2px solid #E5E7EB" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>#</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>Keyword</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>Frequency</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>Density</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.topKeywords.slice(0, 50).map((keyword, index) => {
                    const maxFreq = reportData.topKeywords[0].frequency;
                    const widthPercent = (keyword.frequency / maxFreq) * 100;
                    return (
                      <tr key={index} style={{
                        backgroundColor: index % 2 === 0 ? "#F9FAFB" : "#fff",
                        borderBottom: "1px solid #F3F4F6"
                      }}>
                        <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600", color: "#111" }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px", color: "#111" }}>
                          {keyword.keyword}
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px", color: "#6B7280" }}>
                          {keyword.frequency}
                        </td>
                        <td style={{ padding: "12px", fontSize: "14px", color: "#6B7280" }}>
                          {keyword.density.toFixed(2)}%
                        </td>
                        <td style={{ padding: "12px" }}>
                          <div style={{
                            width: "100%",
                            backgroundColor: "#E5E7EB",
                            borderRadius: "9999px",
                            height: "8px",
                            overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${widthPercent}%`,
                              backgroundColor: "#3B82F6",
                              height: "100%",
                              borderRadius: "9999px"
                            }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {reportData.recommendations && reportData.recommendations.length > 0 && (
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "30px",
            marginBottom: "20px"
          }}>
            <h2 style={{ color: "#111", marginBottom: "20px", fontSize: "24px" }}>SEO Recommendations</h2>
            <div style={{ display: "grid", gap: "12px" }}>
              {reportData.recommendations.map((rec, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "start",
                  padding: "15px",
                  backgroundColor: "#EFF6FF",
                  border: "1px solid #93C5FD",
                  borderRadius: "6px"
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#3B82F6",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginRight: "12px",
                    marginTop: "2px"
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ margin: 0, color: "#1E40AF", lineHeight: "1.6" }}>{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page Details */}
        {reportData.pages && reportData.pages.length > 0 && (
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "30px",
            marginBottom: "20px"
          }}>
            <h2 style={{ color: "#111", marginBottom: "20px", fontSize: "24px" }}>Page Details</h2>
            <div style={{ display: "grid", gap: "15px" }}>
              {reportData.pages.map((page, index) => (
                <div key={index} style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  padding: "15px",
                  transition: "border-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#3B82F6"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E5E7EB"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                    <h3 style={{ color: "#111", fontSize: "16px", fontWeight: "600", margin: 0, flex: 1 }}>
                      {page.title || 'Untitled Page'}
                    </h3>
                    <span style={{ fontSize: "14px", color: "#6B7280", marginLeft: "15px" }}>
                      {page.wordCount} words
                    </span>
                  </div>
                  <a
                    href={page.url}
                    style={{ fontSize: "14px", color: "#3B82F6", display: "block", marginBottom: "8px" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {page.url}
                  </a>
                  {page.description ? (
                    <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px", lineHeight: "1.5" }}>
                      {page.description}
                    </p>
                  ) : (
                    <p style={{ fontSize: "14px", color: "#F59E0B", marginBottom: "8px" }}>
                      Missing meta description
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {page.headings && Object.entries(page.headings).map(([heading, count]) => {
                      let bgColor = "#E5E7EB";
                      let textColor = "#374151";
                      if (heading === 'h1') {
                        bgColor = count === 1 ? "#D1FAE5" : count > 1 ? "#FEE2E2" : "#E5E7EB";
                        textColor = count === 1 ? "#047857" : count > 1 ? "#B91C1C" : "#374151";
                      } else if (heading === 'h2') {
                        bgColor = "#DBEAFE";
                        textColor = "#1E40AF";
                      } else if (heading === 'h3') {
                        bgColor = "#E9D5FF";
                        textColor = "#6B21A8";
                      }
                      return (
                        <span
                          key={heading}
                          style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500"
                          }}
                        >
                          {heading.toUpperCase()}: {count}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", fontSize: "14px", color: "#9CA3AF", marginTop: "30px", paddingBottom: "30px" }}>
          <p style={{ margin: "0 0 4px 0" }}>Generated by SEO Agent for Earned Media</p>
          <p style={{ margin: 0 }}>Keyword Analysis Tool v1.0</p>
        </div>
      </div>

      <style jsx>{`
        @media print {
          button {
            display: none !important;
          }
          a[href^="/"]:not([href^="//"]) {
            color: #111 !important;
            text-decoration: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { domain } = params;
  const reportsDir = path.join(process.cwd(), 'public', 'reports', domain);
  const jsonPath = path.join(reportsDir, 'keywords.json');

  if (!fs.existsSync(jsonPath)) {
    return {
      props: {
        reportData: null,
        domain
      }
    };
  }

  try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const reportData = JSON.parse(jsonContent);

    return {
      props: {
        reportData,
        domain
      }
    };
  } catch (error) {
    console.error('Error reading report:', error);
    return {
      props: {
        reportData: null,
        domain
      }
    };
  }
}
