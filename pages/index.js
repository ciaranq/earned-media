import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export function Header({ currentUrl }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const urlParam = currentUrl ? `?url=${encodeURIComponent(currentUrl)}` : '';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navLinks = [
    { href: `/technical${urlParam}`, label: 'Technical' },
    { href: `/keywords${urlParam}`, label: 'Keywords' },
    { href: `/keyword-strategy-builder${urlParam}`, label: 'Cluster Builder' },
    { href: `/strategy${urlParam}`, label: 'Strategy' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header style={{
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      marginBottom: '20px',
      backgroundColor: 'white',
      position: 'relative'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '12px 16px' : '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img
              src="/Earned-Media-Email-Sig-25%25.gif"
              alt="Earned Media Logo"
              style={{ height: isMobile ? '35px' : '50px', width: 'auto' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </a>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: isMobile ? '18px' : '28px', fontWeight: 'bold', lineHeight: '1.2' }}>
              <span style={{ color: '#ea401d' }}>SEO </span>
              <span style={{ color: '#22988d' }}>Agent</span>
            </div>
            <div style={{ fontSize: isMobile ? '14px' : '24px', fontWeight: 'bold', lineHeight: '1.2' }}>
              <span style={{ color: '#009bd8' }}>Earned </span>
              <span style={{ color: '#fd9c2c' }}>Media</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '24px' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{ fontSize: '14px', fontWeight: '600', color: '#111', textDecoration: 'none' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}
            aria-label="Toggle menu"
          >
            <span style={{
              display: 'block',
              width: '24px',
              height: '3px',
              backgroundColor: '#111',
              borderRadius: '2px',
              transition: 'transform 0.3s',
              transform: mobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none'
            }} />
            <span style={{
              display: 'block',
              width: '24px',
              height: '3px',
              backgroundColor: '#111',
              borderRadius: '2px',
              transition: 'opacity 0.3s',
              opacity: mobileMenuOpen ? 0 : 1
            }} />
            <span style={{
              display: 'block',
              width: '24px',
              height: '3px',
              backgroundColor: '#111',
              borderRadius: '2px',
              transition: 'transform 0.3s',
              transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none'
            }} />
          </button>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: 'block',
                padding: '16px 20px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#111',
                textDecoration: 'none',
                borderBottom: '1px solid #f3f4f6'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export default function SEOAnalyzer() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  async function handleAnalysis(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Sending analysis request for:", url);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
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

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: '100vh' }}>
      <Head>
        <title>SEO Agent for Earned Media</title>
        <meta name="description" content="Comprehensive SEO analysis for Earned Media clients" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header currentUrl={url} />

      <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#333", marginBottom: "10px", fontSize: "clamp(24px, 5vw, 32px)" }}>
          SEO Agent for Earned Media
        </h1>
        <p style={{ color: "#666", marginBottom: "30px", lineHeight: "1.6" }}>
          Enter a website URL to begin comprehensive SEO analysis
        </p>

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
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 20px",
              backgroundColor: loading ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Website'}
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
            <p style={{ margin: 0, wordBreak: "break-word" }}>{error}</p>
          </div>
        )}

        {results && (
          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginBottom: "20px",
              paddingBottom: "15px",
              borderBottom: "1px solid #eee"
            }}>
              <h2 style={{ margin: 0, fontSize: "18px", wordBreak: "break-word" }}>Results for {url}</h2>
              <div style={{
                textAlign: "center",
                padding: "15px",
                backgroundColor: "#F9FAFB",
                borderRadius: "8px"
              }}>
                <div style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color: results.score > 70 ? "#22C55E" : results.score > 50 ? "#F59E0B" : "#EF4444"
                }}>
                  {results.score}/100
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>SEO Score</div>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "15px",
              marginBottom: "25px"
            }}>
              <div style={{ backgroundColor: "#F9FAFB", padding: "15px", borderRadius: "4px" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Page Title</h3>
                <p style={{ fontFamily: "monospace", margin: "0", wordBreak: "break-word", fontSize: "14px" }}>
                  {results.title || 'None'}
                </p>
                {results.title && (
                  <p style={{ fontSize: "13px", color: "#666", margin: "5px 0 0 0" }}>
                    {results.title.length} characters
                  </p>
                )}
              </div>

              <div style={{ backgroundColor: "#F9FAFB", padding: "15px", borderRadius: "4px" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Meta Description</h3>
                <p style={{ fontFamily: "monospace", margin: "0", wordBreak: "break-word", fontSize: "14px" }}>
                  {results.metaDescription || 'None'}
                </p>
                {results.metaDescription && (
                  <p style={{ fontSize: "13px", color: "#666", margin: "5px 0 0 0" }}>
                    {results.metaDescription.length} characters
                  </p>
                )}
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
              gap: "10px",
              marginBottom: "25px"
            }}>
              <Metric label="H1 Tags" value={results.metrics.h1Count} />
              <Metric label="H2 Tags" value={results.metrics.h2Count} />
              <Metric label="Images" value={results.metrics.imgCount} />
              <Metric label="Missing Alt" value={results.metrics.imgWithoutAlt} />
              <Metric label="Words" value={results.metrics.wordCount} />
            </div>

            <div>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>
                Issues Found ({results.issues.length})
              </h3>

              {results.issues.length === 0 ? (
                <p style={{ color: "#22C55E" }}>No issues found! Great job!</p>
              ) : (
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  borderTop: "1px solid #eee"
                }}>
                  {results.issues.map((issue, index) => (
                    <li key={index} style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #eee"
                    }}>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "8px" }}>
                        <span style={{
                          fontWeight: "bold",
                          fontSize: "12px",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          backgroundColor: issue.severity === 'high' ? "#FEE2E2" :
                                 issue.severity === 'medium' ? "#FEF3C7" : "#FEF9C3",
                          color: issue.severity === 'high' ? "#B91C1C" :
                                 issue.severity === 'medium' ? "#92400E" : "#854D0E"
                        }}>
                          {issue.severity.toUpperCase()}
                        </span>
                        <span style={{ flex: 1, minWidth: "200px" }}>{issue.message}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Navigation to detailed analysis */}
            <div style={{
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "2px solid #E5E7EB"
            }}>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", color: "#333" }}>
                Continue with Detailed Analysis
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "12px"
              }}>
                <a
                  href={`/technical?url=${encodeURIComponent(url)}`}
                  style={{
                    display: "block",
                    padding: "16px 20px",
                    backgroundColor: "#3B82F6",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "6px",
                    textAlign: "center",
                    fontWeight: "600"
                  }}
                >
                  Technical Audit
                </a>
                <a
                  href={`/keywords?url=${encodeURIComponent(url)}`}
                  style={{
                    display: "block",
                    padding: "16px 20px",
                    backgroundColor: "#8B5CF6",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "6px",
                    textAlign: "center",
                    fontWeight: "600"
                  }}
                >
                  Keyword Research
                </a>
                <a
                  href={`/strategy?url=${encodeURIComponent(url)}`}
                  style={{
                    display: "block",
                    padding: "16px 20px",
                    backgroundColor: "#10B981",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "6px",
                    textAlign: "center",
                    fontWeight: "600"
                  }}
                >
                  SEO Strategy
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for metrics
function Metric({ label, value }) {
  return (
    <div style={{
      backgroundColor: "#F9FAFB",
      padding: "12px 8px",
      borderRadius: "4px",
      textAlign: "center"
    }}>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#666" }}>{label}</div>
    </div>
  );
}
