import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from './index';
import ErrorBoundary from '../components/ErrorBoundary';
import { exportKeywordsAsCSV, exportAsJSON, downloadFile } from '../utils/exportFormats';

export default function Keywords() {
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
      console.log("Sending keyword research request for:", targetUrl);
      const response = await fetch('/api/keywords', {
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

  function handleExportCSV() {
    if (!results) return;
    const csv = exportKeywordsAsCSV(results);
    const domain = new URL(url).hostname;
    downloadFile(csv, `keywords-${domain}.csv`, 'text/csv');
  }

  function handleExportJSON() {
    if (!results) return;
    const json = exportAsJSON(results);
    const domain = new URL(url).hostname;
    downloadFile(json, `keywords-${domain}.json`, 'application/json');
  }

  return (
    <ErrorBoundary>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <Head>
          <title>Keyword Research - SEO Agent for Earned Media</title>
          <meta name="description" content="High level keyword research for the website" />
        </Head>

        <Header currentUrl={url} />

      <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ color: "#333", marginBottom: "10px" }}>Keyword Research</h1>
        <p style={{ color: "#666", marginBottom: "15px", lineHeight: "1.6" }}>
          High level keyword research for the website
        </p>

        <div style={{ marginBottom: "25px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={{ padding: "12px 18px", backgroundColor: "#FEF3C7", border: "1px solid #F59E0B", borderRadius: "6px" }}>
            <a href="/keyword-analysis" style={{ color: "#92400E", fontWeight: "600", textDecoration: "none", fontSize: "15px" }}>
              📊 Keyword Analysis Reports →
            </a>
            <span style={{ color: "#6B7280", marginLeft: "10px", fontSize: "14px" }}>Deep keyword analysis with crawl data</span>
          </div>

          <div style={{ padding: "12px 18px", backgroundColor: "#F0FDF4", border: "1px solid #22C55E", borderRadius: "6px" }}>
            <a href="/screaming-frog" style={{ color: "#15803D", fontWeight: "600", textDecoration: "none", fontSize: "15px" }}>
              ScreamingFrog Results →
            </a>
            <span style={{ color: "#6B7280", marginLeft: "10px", fontSize: "14px" }}>View detailed SEO crawl analysis</span>
          </div>

          <div style={{ padding: "12px 18px", backgroundColor: "#EFF6FF", border: "1px solid #3B82F6", borderRadius: "6px" }}>
            <a href="/seonaut" style={{ color: "#1E40AF", fontWeight: "600", textDecoration: "none", fontSize: "15px" }}>
              SEONaut Report →
            </a>
            <span style={{ color: "#6B7280", marginLeft: "10px", fontSize: "14px" }}>Technical audit results (Nov 28, 2025)</span>
          </div>
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
            {loading ? 'Analyzing...' : 'Research Keywords'}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #eee", flexWrap: "wrap", gap: "10px" }}>
              <h2 style={{ margin: 0, flex: 1, minWidth: "300px" }}>
                Keyword Research for {url}
              </h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={handleExportCSV}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                >
                  📥 Download CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#8B5CF6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                >
                  📥 Download JSON
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "20px", padding: "10px 15px", backgroundColor: "#F0FDF4", border: "1px solid #22C55E", borderRadius: "6px" }}>
              <a href="/screaming-frog" style={{ color: "#15803D", fontWeight: "600", textDecoration: "none" }}>
                View ScreamingFrog Results →
              </a>
            </div>

            {/* Industry & Topic Analysis */}
            {results.industry && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Industry & Topic Analysis
                </h3>
                <div style={{
                  backgroundColor: "#F9FAFB",
                  padding: "15px",
                  borderRadius: "6px",
                  border: "1px solid #E5E7EB"
                }}>
                  <p style={{ margin: 0, lineHeight: "1.6" }}>
                    <strong>Industry:</strong> {results.industry}
                  </p>
                  {results.topics && results.topics.length > 0 && (
                    <p style={{ margin: "10px 0 0 0", lineHeight: "1.6" }}>
                      <strong>Main Topics:</strong> {results.topics.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Primary Keywords */}
            {results.primaryKeywords && results.primaryKeywords.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Primary Keywords
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "15px"
                }}>
                  {results.primaryKeywords.map((keyword, index) => (
                    <div key={index} style={{
                      backgroundColor: "#DBEAFE",
                      padding: "15px",
                      borderRadius: "6px",
                      border: "1px solid #3B82F6"
                    }}>
                      <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px", color: "#1E40AF" }}>
                        {keyword.keyword}
                      </div>
                      <div style={{ fontSize: "14px", color: "#1E3A8A" }}>
                        <div>Frequency: {keyword.frequency || 0}</div>
                        {keyword.intent && <div>Intent: {keyword.intent}</div>}
                        {keyword.difficulty && (
                          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(59,130,246,0.2)" }}>
                            <div><strong>Difficulty:</strong> {keyword.difficulty.level} ({keyword.difficulty.score}/100)</div>
                            {keyword.searchVolume && (
                              <div><strong>Volume:</strong> {keyword.searchVolume.category} ({keyword.searchVolume.range})</div>
                            )}
                            {keyword.opportunity && (
                              <div style={{ color: "#059669", fontWeight: "bold" }}>
                                <strong>Opportunity:</strong> {keyword.opportunity.level} ({keyword.opportunity.score}/100)
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Keywords */}
            {results.secondaryKeywords && results.secondaryKeywords.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Secondary Keywords
                </h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "15px"
                }}>
                  {results.secondaryKeywords.map((keyword, index) => (
                    <div key={index} style={{
                      backgroundColor: "#E0F2FE",
                      padding: "15px",
                      borderRadius: "6px",
                      border: "1px solid #7DD3FC"
                    }}>
                      <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px", color: "#075985" }}>
                        {keyword.keyword}
                      </div>
                      <div style={{ fontSize: "14px", color: "#0C4A6E" }}>
                        <div>Frequency: {keyword.frequency || 0}</div>
                        {keyword.intent && <div>Intent: {keyword.intent}</div>}
                        {keyword.difficulty && (
                          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(125,211,252,0.3)" }}>
                            <div><strong>Difficulty:</strong> {keyword.difficulty.level}</div>
                            {keyword.searchVolume && (
                              <div><strong>Volume:</strong> {keyword.searchVolume.category}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Long-tail Keywords */}
            {results.longTailKeywords && results.longTailKeywords.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Long-tail Keywords
                </h3>
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "10px"
                }}>
                  {results.longTailKeywords.map((keyword, index) => (
                    <li key={index} style={{
                      backgroundColor: "#F3F4F6",
                      padding: "12px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      border: "1px solid #D1D5DB"
                    }}>
                      <div style={{ fontWeight: "500", marginBottom: "6px" }}>
                        {keyword.keyword || keyword}
                      </div>
                      {keyword.difficulty && (
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          <div>Difficulty: {keyword.difficulty.level}</div>
                          {keyword.searchVolume && (
                            <div>Volume: {keyword.searchVolume.category}</div>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Opportunities */}
            {results.opportunities && results.opportunities.length > 0 && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "20px", color: "#333" }}>
                  Keyword Opportunities
                </h3>
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0
                }}>
                  {results.opportunities.map((opportunity, index) => (
                    <li key={index} style={{
                      backgroundColor: "#ECFDF5",
                      padding: "15px",
                      marginBottom: "10px",
                      borderRadius: "6px",
                      border: "1px solid #10B981",
                      borderLeft: "4px solid #10B981"
                    }}>
                      <div style={{ fontWeight: "600", marginBottom: "5px", color: "#065F46" }}>
                        {opportunity.title || opportunity}
                      </div>
                      {opportunity.description && (
                        <div style={{ fontSize: "14px", color: "#047857" }}>
                          {opportunity.description}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {results.recommendations && (
              <div style={{
                backgroundColor: "#F0F9FF",
                padding: "15px",
                borderRadius: "6px",
                border: "1px solid #BAE6FD"
              }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "#0369A1" }}>
                  Recommendations
                </h3>
                <p style={{ margin: 0, lineHeight: "1.6", color: "#075985" }}>
                  {results.recommendations}
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
