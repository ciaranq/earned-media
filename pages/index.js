import { useState } from 'react';
import Head from 'next/head';

function Header() {
  return (
    <header style={{ 
      borderBottom: '1px solid #e5e7eb', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      marginBottom: '20px',
      backgroundColor: 'white'
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0070f3' }}>SEO Agent</span>
          </a>
        </div>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/" style={{ fontSize: '14px', fontWeight: '600', color: '#111', textDecoration: 'none' }}>Home</a>
          <a href="/about" style={{ fontSize: '14px', fontWeight: '600', color: '#111', textDecoration: 'none' }}>About</a>
          <a href="/tools" style={{ fontSize: '14px', fontWeight: '600', color: '#111', textDecoration: 'none' }}>Tools</a>
          <a href="/contact" style={{ fontSize: '14px', fontWeight: '600', color: '#111', textDecoration: 'none' }}>Contact</a>
        </div>
      </nav>
    </header>
  );
}

export default function SEOAnalyzer() {
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
      
      // Get the raw text first
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      // Try to parse it as JSON
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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <Head>
        <title>SEO Analyzer - basic SEO agent by Ciaran Quinlan</title>
        <meta name="description" content="Analyze SEO factors of any website" />
      </Head>
    
    <Header />
  
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>

      <h1 style={{ color: "#333", marginBottom: "20px" }}>SEO Analyzer (AI SEO agent by Ciaran)</h1>
      
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
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "20px",
            paddingBottom: "15px",
            borderBottom: "1px solid #eee"
          }}>
            <h2 style={{ margin: 0 }}>Results for {url}</h2>
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "24px", 
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
            gridTemplateColumns: "1fr 1fr", 
            gap: "15px", 
            marginBottom: "25px" 
          }}>
            <div style={{ backgroundColor: "#F9FAFB", padding: "15px", borderRadius: "4px" }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Page Title</h3>
              <p style={{ fontFamily: "monospace", margin: "0", wordBreak: "break-word" }}>
                {results.title || 'None'}
              </p>
              {results.title && (
                <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>
                  {results.title.length} characters
                </p>
              )}
            </div>
            
            <div style={{ backgroundColor: "#F9FAFB", padding: "15px", borderRadius: "4px" }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Meta Description</h3>
              <p style={{ fontFamily: "monospace", margin: "0", wordBreak: "break-word" }}>
                {results.metaDescription || 'None'}
              </p>
              {results.metaDescription && (
                <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>
                  {results.metaDescription.length} characters
                </p>
              )}
            </div>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
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
                    padding: "10px 0", 
                    borderBottom: "1px solid #eee" 
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <span style={{ 
                        fontWeight: "bold", 
                        marginRight: "8px", 
                        color: issue.severity === 'high' ? "#EF4444" : 
                               issue.severity === 'medium' ? "#F59E0B" : "#EAB308"
                      }}>
                        {issue.severity.toUpperCase()}:
                      </span>
                      <span>{issue.message}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
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
      padding: "10px", 
      borderRadius: "4px",
      textAlign: "center" 
    }}>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "14px", color: "#666" }}>{label}</div>
    </div>
  );
}