import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from './index';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Strategy() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Auto-run analysis when URL is provided in query params
  useEffect(() => {
    if (router.isReady && router.query.url) {
      const urlFromQuery = router.query.url;
      setUrl(urlFromQuery);
      // Auto-run the analysis
      runAnalysis(urlFromQuery);
    }
  }, [router.isReady, router.query.url]);

  async function runAnalysis(targetUrl) {
    setLoading(true);
    setError(null);

    try {
      console.log("Sending strategy generation request for:", targetUrl);
      const response = await fetch('/api/strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: targetUrl })
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status} ${response.statusText}`);
      }

      setResults(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalysis(e) {
    e.preventDefault();
    runAnalysis(url);
  }

  return (
    <ErrorBoundary>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <Head>
          <title>SEO Strategy - SEO Agent for Earned Media</title>
          <meta name="description" content="Create a 1-3 month SEO strategy based on audit and research" />
        </Head>

        <Header currentUrl={url} />

      <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ color: "#333", marginBottom: "10px" }}>SEO Strategy</h1>
        <p style={{ color: "#666", marginBottom: "20px", lineHeight: "1.6" }}>
          Pick an avenue on the back of the audit & research to create a short 1-3 month strategy.
          This strategy can be supported by the Link Building & Content teams for implementation if needed.
        </p>

        {/* Visory Strategy Link */}
        <div style={{
          backgroundColor: "#EFF6FF",
          border: "2px solid #3B82F6",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h2 style={{ color: "#1E40AF", marginTop: 0, marginBottom: "10px", fontSize: "20px" }}>
            📋 Visory 3-Month SEO Strategy
          </h2>
          <p style={{ color: "#1E3A8A", marginBottom: "15px", lineHeight: "1.6" }}>
            View a detailed 3-month SEO and conversion strategy for Visory
          </p>
          <a
            href="/strategy/visory-strategy"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#3B82F6",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563EB"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3B82F6"}
          >
            View Visory Strategy →
          </a>
        </div>

        <form onSubmit={handleAnalysis} style={{ marginBottom: "30px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="url" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Website URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: loading ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? 'Generating Strategy...' : 'Generate Strategy'}
          </button>
        </form>

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
          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ margin: "0 0 20px 0", paddingBottom: "15px", borderBottom: "1px solid #eee" }}>
              SEO Strategy for {url}
            </h2>

            {/* Strategic Focus */}
            {results.focus && (
              <div style={{
                backgroundColor: "#EDE9FE",
                padding: "20px",
                borderRadius: "6px",
                marginBottom: "30px",
                border: "1px solid #A78BFA"
              }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "#5B21B6" }}>
                  Strategic Focus
                </h3>
                <p style={{ margin: 0, lineHeight: "1.6", fontSize: "16px", color: "#6B21A8" }}>
                  {results.focus}
                </p>
              </div>
            )}

            {/* Timeline Overview */}
            {results.timeline && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Timeline Overview
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "15px"
                }}>
                  {['month1', 'month2', 'month3'].map((month, index) => {
                    if (!results.timeline[month]) return null;
                    return (
                      <div key={month} style={{
                        backgroundColor: "#F0FDF4",
                        padding: "15px",
                        borderRadius: "6px",
                        border: "1px solid #86EFAC"
                      }}>
                        <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "10px", color: "#166534" }}>
                          Month {index + 1}
                        </div>
                        <div style={{ fontSize: "14px", color: "#15803D", lineHeight: "1.6" }}>
                          {results.timeline[month]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Items */}
            {results.actionItems && results.actionItems.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Action Items
                </h3>
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0
                }}>
                  {results.actionItems.map((item, index) => (
                    <li key={index} style={{
                      backgroundColor: "white",
                      padding: "15px",
                      marginBottom: "10px",
                      borderRadius: "6px",
                      border: "1px solid #D1D5DB",
                      borderLeft: "4px solid #3B82F6"
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px"
                      }}>
                        <div style={{ fontWeight: "600", color: "#1F2937" }}>
                          {item.title || item.action}
                        </div>
                        {item.priority && (
                          <span style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: item.priority === 'high' ? '#FEE2E2' : item.priority === 'medium' ? '#FEF3C7' : '#E5E7EB',
                            color: item.priority === 'high' ? '#991B1B' : item.priority === 'medium' ? '#92400E' : '#374151',
                            fontWeight: "600"
                          }}>
                            {item.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <div style={{ fontSize: "14px", color: "#6B7280", marginBottom: "8px" }}>
                          {item.description}
                        </div>
                      )}
                      {item.owner && (
                        <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
                          <strong>Owner:</strong> {item.owner}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Content Strategy */}
            {results.contentStrategy && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Content Strategy
                </h3>
                <div style={{
                  backgroundColor: "#FEF3C7",
                  padding: "15px",
                  borderRadius: "6px",
                  border: "1px solid #FCD34D"
                }}>
                  {typeof results.contentStrategy === 'string' ? (
                    <p style={{ margin: 0, lineHeight: "1.6", color: "#78350F" }}>
                      {results.contentStrategy}
                    </p>
                  ) : (
                    <div>
                      {results.contentStrategy.topics && (
                        <div style={{ marginBottom: "10px" }}>
                          <strong style={{ color: "#78350F" }}>Content Topics:</strong>
                          <ul style={{ margin: "5px 0 0 20px", color: "#92400E" }}>
                            {results.contentStrategy.topics.map((topic, index) => (
                              <li key={index}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {results.contentStrategy.frequency && (
                        <div style={{ color: "#78350F" }}>
                          <strong>Publishing Frequency:</strong> {results.contentStrategy.frequency}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Link Building Strategy */}
            {results.linkBuildingStrategy && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Link Building Strategy
                </h3>
                <div style={{
                  backgroundColor: "#DBEAFE",
                  padding: "15px",
                  borderRadius: "6px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: 0, lineHeight: "1.6", color: "#1E3A8A" }}>
                    {results.linkBuildingStrategy}
                  </p>
                </div>
              </div>
            )}

            {/* Expected Outcomes */}
            {results.expectedOutcomes && results.expectedOutcomes.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Expected Outcomes
                </h3>
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "15px"
                }}>
                  {results.expectedOutcomes.map((outcome, index) => (
                    <li key={index} style={{
                      backgroundColor: "#ECFDF5",
                      padding: "15px",
                      borderRadius: "6px",
                      border: "1px solid #6EE7B7",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px"
                    }}>
                      <span style={{ fontSize: "20px" }}>✓</span>
                      <span style={{ color: "#065F46", lineHeight: "1.6" }}>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* KPIs */}
            {results.kpis && results.kpis.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Key Performance Indicators
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px"
                }}>
                  {results.kpis.map((kpi, index) => (
                    <div key={index} style={{
                      backgroundColor: "#F9FAFB",
                      padding: "15px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      textAlign: "center"
                    }}>
                      <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px", color: "#111827" }}>
                        {kpi.metric || kpi}
                      </div>
                      {kpi.target && (
                        <div style={{ fontSize: "14px", color: "#6B7280" }}>
                          Target: {kpi.target}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {results.summary && (
              <div style={{
                backgroundColor: "#F0F9FF",
                padding: "15px",
                borderRadius: "6px",
                border: "1px solid #BAE6FD"
              }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "#0369A1" }}>
                  Strategy Summary
                </h3>
                <p style={{ margin: 0, lineHeight: "1.6", color: "#075985" }}>
                  {results.summary}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </ErrorBoundary>
  );
}
