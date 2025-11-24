import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from './index';

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

  return (
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

        <div style={{ marginBottom: "25px", padding: "12px 18px", backgroundColor: "#F0FDF4", border: "1px solid #22C55E", borderRadius: "6px", display: "inline-block" }}>
          <a href="/screaming-frog" style={{ color: "#15803D", fontWeight: "600", textDecoration: "none", fontSize: "15px" }}>
            ScreamingFrog Results →
          </a>
          <span style={{ color: "#6B7280", marginLeft: "10px", fontSize: "14px" }}>View detailed SEO crawl analysis</span>
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
            <h2 style={{ margin: "0 0 20px 0", paddingBottom: "15px", borderBottom: "1px solid #eee" }}>
              Keyword Research for {url}
            </h2>

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
                        <div>Relevance: {keyword.relevance || 'High'}</div>
                        {keyword.searchIntent && <div>Intent: {keyword.searchIntent}</div>}
                        {keyword.difficulty && <div>Difficulty: {keyword.difficulty}</div>}
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
                        <div>Relevance: {keyword.relevance || 'Medium'}</div>
                        {keyword.searchIntent && <div>Intent: {keyword.searchIntent}</div>}
                        {keyword.difficulty && <div>Difficulty: {keyword.difficulty}</div>}
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
                      {keyword.keyword || keyword}
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
  );
}
