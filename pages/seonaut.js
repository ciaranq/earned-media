import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Header } from './index';

export default function SEONaut() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/seonaut');

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error loading SEONaut report:", err);
      setError(err.message || "Failed to load SEONaut report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>SEONaut Report - SEO Agent for Earned Media</title>
        <meta name="description" content="SEONaut technical audit results for visory.com.au" />
      </Head>

      <Header />

      <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ color: "#333", marginBottom: "10px" }}>SEONaut Technical Audit Report</h1>
        <p style={{ color: "#666", marginBottom: "20px", lineHeight: "1.6" }}>
          Comprehensive SEO audit for <strong>visory.com.au</strong> • Report Date: November 28, 2025
        </p>

        {loading && (
          <div style={{
            textAlign: "center",
            padding: "40px",
            fontSize: "18px",
            color: "#666"
          }}>
            Loading SEONaut report...
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: "#FEE2E2",
            border: "1px solid #EF4444",
            borderRadius: "4px",
            padding: "15px",
            marginBottom: "20px",
            color: "#B91C1C"
          }}>
            <p style={{ fontWeight: "bold", marginBottom: "5px" }}>Error:</p>
            <p>{error}</p>
          </div>
        )}

        {results && (
          <>
            {/* Summary Overview Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "15px",
              marginBottom: "30px"
            }}>
              <div style={{
                backgroundColor: "#FEE2E2",
                padding: "20px",
                borderRadius: "8px",
                border: "2px solid #EF4444"
              }}>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#B91C1C" }}>
                  {results.criticalCount}
                </div>
                <div style={{ fontSize: "13px", color: "#7F1D1D", marginTop: "5px" }}>
                  Critical Issues
                </div>
              </div>

              <div style={{
                backgroundColor: "#FEF3C7",
                padding: "20px",
                borderRadius: "8px",
                border: "2px solid #F59E0B"
              }}>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#D97706" }}>
                  {results.alertCount}
                </div>
                <div style={{ fontSize: "13px", color: "#92400E", marginTop: "5px" }}>
                  Alert Issues
                </div>
              </div>

              <div style={{
                backgroundColor: "#FEF9C3",
                padding: "20px",
                borderRadius: "8px",
                border: "2px solid #EAB308"
              }}>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#CA8A04" }}>
                  {results.warningCount}
                </div>
                <div style={{ fontSize: "13px", color: "#713F12", marginTop: "5px" }}>
                  Warning Issues
                </div>
              </div>

              <div style={{
                backgroundColor: "#E0E7FF",
                padding: "20px",
                borderRadius: "8px",
                border: "2px solid #6366F1"
              }}>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#4338CA" }}>
                  {results.uniquePages}
                </div>
                <div style={{ fontSize: "13px", color: "#3730A3", marginTop: "5px" }}>
                  Unique Pages w/ Issues
                </div>
              </div>

              <div style={{
                backgroundColor: "#DBEAFE",
                padding: "20px",
                borderRadius: "8px",
                border: "2px solid #3B82F6"
              }}>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1E40AF" }}>
                  {results.pageIssuesCount}
                </div>
                <div style={{ fontSize: "13px", color: "#1E3A8A", marginTop: "5px" }}>
                  Page-Level Issues
                </div>
              </div>

              <div style={{
                backgroundColor: "#F3F4F6",
                padding: "20px",
                borderRadius: "8px",
                border: "2px solid #9CA3AF"
              }}>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "#4B5563" }}>
                  {results.resourceIssuesCount}
                </div>
                <div style={{ fontSize: "13px", color: "#374151", marginTop: "5px" }}>
                  Resource Issues
                </div>
              </div>
            </div>

            {/* Top 3 Priority Actions */}
            <div style={{
              backgroundColor: "#FFF",
              border: "2px solid #0070f3",
              borderRadius: "8px",
              padding: "25px",
              marginBottom: "30px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{
                margin: "0 0 20px 0",
                fontSize: "24px",
                color: "#0070f3",
                paddingBottom: "15px",
                borderBottom: "2px solid #E5E7EB"
              }}>
                🎯 Top 3 Priority Actions
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {results.topActions.map((action, index) => (
                  <div key={index} style={{
                    backgroundColor: getPriorityColor(action.priority).bg,
                    border: `2px solid ${getPriorityColor(action.priority).border}`,
                    borderLeft: `6px solid ${getPriorityColor(action.priority).border}`,
                    borderRadius: "6px",
                    padding: "20px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <div style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: getPriorityColor(action.priority).text,
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}>
                          Action {index + 1} • {action.priority} Priority • {action.impact} Impact
                        </div>
                        <h3 style={{
                          margin: 0,
                          fontSize: "20px",
                          color: "#1F2937",
                          fontWeight: "bold"
                        }}>
                          {action.title}
                        </h3>
                      </div>
                      <div style={{
                        backgroundColor: getPriorityColor(action.priority).badge,
                        color: getPriorityColor(action.priority).text,
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: "600"
                      }}>
                        {action.category}
                      </div>
                    </div>
                    <p style={{
                      margin: "10px 0 0 0",
                      lineHeight: "1.6",
                      color: "#4B5563",
                      fontSize: "15px"
                    }}>
                      {action.description}
                    </p>
                    <div style={{
                      marginTop: "12px",
                      fontSize: "14px",
                      color: "#6B7280",
                      fontWeight: "500"
                    }}>
                      📊 Affected: {action.affectedUrls} {action.affectedUrls === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              borderBottom: "2px solid #E5E7EB",
              flexWrap: "wrap"
            }}>
              <TabButton
                label="Overview"
                isActive={selectedTab === 'overview'}
                onClick={() => setSelectedTab('overview')}
              />
              <TabButton
                label="All Issue Types"
                isActive={selectedTab === 'issues'}
                onClick={() => setSelectedTab('issues')}
              />
              <TabButton
                label="Pages with Most Issues"
                isActive={selectedTab === 'pages'}
                onClick={() => setSelectedTab('pages')}
              />
              <TabButton
                label="Critical Issues"
                isActive={selectedTab === 'critical'}
                onClick={() => setSelectedTab('critical')}
              />
            </div>

            {/* Tab Content */}
            {selectedTab === 'overview' && (
              <OverviewTab results={results} />
            )}

            {selectedTab === 'issues' && (
              <AllIssuesTab results={results} />
            )}

            {selectedTab === 'pages' && (
              <PagesWithMostIssuesTab results={results} />
            )}

            {selectedTab === 'critical' && (
              <CriticalIssuesTab results={results} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 20px",
        border: "none",
        borderBottom: isActive ? "3px solid #0070f3" : "3px solid transparent",
        backgroundColor: isActive ? "#EFF6FF" : "transparent",
        color: isActive ? "#0070f3" : "#6B7280",
        fontWeight: isActive ? "600" : "500",
        fontSize: "15px",
        cursor: "pointer",
        transition: "all 0.2s"
      }}
    >
      {label}
    </button>
  );
}

function OverviewTab({ results }) {
  return (
    <div>
      <div style={{
        backgroundColor: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        padding: "25px",
        marginBottom: "20px"
      }}>
        <h3 style={{ margin: "0 0 15px 0", fontSize: "20px" }}>Report Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", fontSize: "15px", lineHeight: "1.8" }}>
          <div>
            <strong>Total Issues:</strong> {results.totalIssues}
          </div>
          <div>
            <strong>Unique Pages:</strong> {results.uniquePages}
          </div>
          <div>
            <strong>Page Issues:</strong> {results.pageIssuesCount}
          </div>
          <div>
            <strong>Resource Issues:</strong> {results.resourceIssuesCount}
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "20px" }}>Top 10 Issue Types</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {results.topIssuesByType.slice(0, 10).map((issue, index) => (
          <div key={index} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FFF",
            padding: "18px",
            borderRadius: "6px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: "600",
                marginBottom: "8px",
                color: "#1F2937",
                fontSize: "15px"
              }}>
                {index + 1}. {issue.type}
              </div>
              <div style={{ display: "flex", gap: "15px", fontSize: "13px", color: "#6B7280" }}>
                <span>Priority: <span style={{
                  fontWeight: "600",
                  color: getPriorityColor(issue.priority).text
                }}>
                  {issue.priority}
                </span></span>
                <span>Pages: <strong>{issue.pageCount}</strong></span>
                <span>Resources: <strong>{issue.resourceCount}</strong></span>
              </div>
            </div>
            <div style={{
              backgroundColor: getPriorityColor(issue.priority).badge,
              color: getPriorityColor(issue.priority).text,
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: "bold",
              minWidth: "60px",
              textAlign: "center"
            }}>
              {issue.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AllIssuesTab({ results }) {
  return (
    <div>
      <p style={{ color: "#6B7280", marginBottom: "20px" }}>
        Detailed breakdown of all {results.issueTypes.length} issue types found in the audit.
      </p>

      {results.issueTypes.map((issue, index) => (
        <div key={index} style={{
          backgroundColor: "#FFF",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "15px",
          borderLeft: `4px solid ${getPriorityColor(issue.priority).border}`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "#111827" }}>
                {issue.type}
              </h4>
              <div style={{ display: "flex", gap: "15px", fontSize: "14px", color: "#6B7280" }}>
                <span style={{
                  backgroundColor: getPriorityColor(issue.priority).badge,
                  color: getPriorityColor(issue.priority).text,
                  padding: "4px 10px",
                  borderRadius: "4px",
                  fontWeight: "600",
                  fontSize: "12px"
                }}>
                  {issue.priority}
                </span>
                <span>Total: <strong>{issue.count}</strong></span>
                <span>Pages: <strong>{issue.pageCount}</strong></span>
                <span>Resources: <strong>{issue.resourceCount}</strong></span>
              </div>
            </div>
            <div style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: getPriorityColor(issue.priority).text
            }}>
              {issue.count}
            </div>
          </div>

          {issue.samplePages.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                Sample Affected Pages:
              </div>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#6B7280" }}>
                {issue.samplePages.slice(0, 5).map((url, idx) => (
                  <li key={idx} style={{ marginBottom: "4px", wordBreak: "break-all" }}>
                    <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#3B82F6" }}>
                      {url}
                    </a>
                  </li>
                ))}
                {issue.pageCount > 5 && (
                  <li style={{ color: "#9CA3AF", fontStyle: "italic" }}>
                    ... and {issue.pageCount - 5} more pages
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PagesWithMostIssuesTab({ results }) {
  return (
    <div>
      <p style={{ color: "#6B7280", marginBottom: "20px" }}>
        Pages ranked by severity and number of issues. Critical issues are prioritized first.
      </p>

      {results.pagesWithMostIssues.map((page, index) => (
        <div key={index} style={{
          backgroundColor: "#FFF",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "15px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div style={{ fontSize: "14px", color: "#9CA3AF", marginBottom: "5px" }}>
                Page #{index + 1}
              </div>
              <a href={page.url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: "15px",
                color: "#3B82F6",
                wordBreak: "break-all",
                textDecoration: "none",
                fontWeight: "500"
              }}>
                {page.url}
              </a>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {page.criticalCount > 0 && (
                <div style={{
                  backgroundColor: "#FEE2E2",
                  color: "#B91C1C",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}>
                  {page.criticalCount} Critical
                </div>
              )}
              {page.alertCount > 0 && (
                <div style={{
                  backgroundColor: "#FEF3C7",
                  color: "#D97706",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}>
                  {page.alertCount} Alert
                </div>
              )}
              {page.warningCount > 0 && (
                <div style={{
                  backgroundColor: "#FEF9C3",
                  color: "#CA8A04",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}>
                  {page.warningCount} Warning
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
              Issues ({page.issues.length}):
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {page.issues.map((issue, idx) => (
                <span key={idx} style={{
                  backgroundColor: "#F3F4F6",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#4B5563",
                  border: `1px solid ${getPriorityColor(issue.priority).border}`,
                  borderLeft: `3px solid ${getPriorityColor(issue.priority).border}`
                }}>
                  {issue.type}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CriticalIssuesTab({ results }) {
  if (results.criticalIssues.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#F0FDF4",
        borderRadius: "8px",
        border: "1px solid #22C55E"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "15px" }}>✅</div>
        <h3 style={{ color: "#15803D", margin: "0 0 10px 0" }}>No Critical Issues Found</h3>
        <p style={{ color: "#166534", margin: 0 }}>Great job! There are no critical issues detected in this audit.</p>
      </div>
    );
  }

  const criticalByType = {};
  results.criticalIssues.forEach(issue => {
    if (!criticalByType[issue.issueType]) {
      criticalByType[issue.issueType] = [];
    }
    criticalByType[issue.issueType].push(issue.url);
  });

  return (
    <div>
      <div style={{
        backgroundColor: "#FEE2E2",
        border: "1px solid #EF4444",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "20px"
      }}>
        <p style={{ margin: 0, color: "#B91C1C", fontWeight: "600" }}>
          ⚠️ {results.criticalIssues.length} Critical Issues Require Immediate Attention
        </p>
      </div>

      {Object.entries(criticalByType).map(([type, urls], index) => (
        <div key={index} style={{
          backgroundColor: "#FFF",
          border: "2px solid #EF4444",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "15px"
        }}>
          <h4 style={{ margin: "0 0 15px 0", fontSize: "18px", color: "#B91C1C" }}>
            {type} ({urls.length} {urls.length === 1 ? 'URL' : 'URLs'})
          </h4>

          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#6B7280" }}>
            {urls.map((url, idx) => (
              <li key={idx} style={{ marginBottom: "8px", wordBreak: "break-all" }}>
                <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#3B82F6" }}>
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function getPriorityColor(priority) {
  const colors = {
    'Critical': {
      bg: '#FEE2E2',
      border: '#EF4444',
      text: '#B91C1C',
      badge: '#FEE2E2'
    },
    'Alert': {
      bg: '#FEF3C7',
      border: '#F59E0B',
      text: '#D97706',
      badge: '#FEF3C7'
    },
    'Warning': {
      bg: '#FEF9C3',
      border: '#EAB308',
      text: '#CA8A04',
      badge: '#FEF9C3'
    }
  };
  return colors[priority] || colors['Warning'];
}
