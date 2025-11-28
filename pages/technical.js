import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from './index';
import TechnicalResults from '../components/TechnicalResults';

export default function TechnicalSEO() {
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
      console.log("Sending technical audit request for:", targetUrl);
      const response = await fetch('/api/technical', {
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

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>Technical SEO Audit - SEO Agent for Earned Media</title>
        <meta name="description" content="Comprehensive technical SEO audit identifying issues and prioritising corrections" />
      </Head>

      <Header currentUrl={url} />

      <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ color: "#333", marginBottom: "10px" }}>
          Technical SEO Audit {url && `for ${url}`}
        </h1>

        {loading && (
          <div style={{
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#F0F9FF",
            borderRadius: "8px",
            marginBottom: "20px"
          }}>
            <p style={{ margin: 0, color: "#0369A1", fontSize: "16px" }}>
              🔄 Analyzing website...
            </p>
          </div>
        )}

        {/* Methodology Section */}
        <div style={{
          backgroundColor: "#F9FAFB",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #E5E7EB"
        }}>
          <h2 style={{ color: "#333", marginBottom: "15px", fontSize: "20px" }}>Methodology</h2>
          <p style={{ color: "#4B5563", lineHeight: "1.8", marginBottom: "15px" }}>
            I manually analysed the website using these tools to get a comprehensive handle on the site:
          </p>
          <ul style={{ color: "#4B5563", lineHeight: "1.8", marginLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}>
              <a
                href={url ? `https://builtwith.com/${new URL(url).hostname}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0070f3", textDecoration: "none", fontWeight: "500" }}
              >
                BuiltWith
              </a> - to identify platform, CMS, frameworks (e.g., WordPress with plugins, tech stack)
            </li>
            <li style={{ marginBottom: "10px" }}>
              <a
                href={url ? `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0070f3", textDecoration: "none", fontWeight: "500" }}
              >
                Lighthouse / PageSpeed Insights
              </a> - to get an idea of speed, bottlenecks and Core Web Vitals
            </li>
            <li style={{ marginBottom: "10px" }}>
              Additional tools for deeper analysis:
              <a
                href={url ? `https://tools.pingdom.com/#${url}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0070f3", textDecoration: "none", fontWeight: "500", marginLeft: "5px" }}
              >
                Pingdom
              </a>,
              <a
                href={url ? `https://gtmetrix.com/?url=${encodeURIComponent(url)}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0070f3", textDecoration: "none", fontWeight: "500", marginLeft: "5px" }}
              >
                GTmetrix
              </a>, and WordPress plugin identifiers
            </li>
          </ul>
        </div>

        {/* SEO Reports Section */}
        <div style={{
          backgroundColor: "#EFF6FF",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #3B82F6"
        }}>
          <h2 style={{ color: "#1E40AF", marginBottom: "15px", fontSize: "20px" }}>SEO Analysis Reports</h2>
          <p style={{ color: "#4B5563", lineHeight: "1.6", marginBottom: "15px" }}>
            Detailed analysis reports from third-party SEO tools:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            <a href="/reports/lighthouse" style={{
              display: "block",
              padding: "15px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "1px solid #E5E7EB",
              textDecoration: "none",
              transition: "box-shadow 0.2s"
            }}>
              <div style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "5px" }}>PageSpeed Insights</div>
              <div style={{ fontSize: "13px", color: "#6B7280" }}>Performance, accessibility, SEO scores</div>
            </a>
            <a href="/reports/core-web-vitals" style={{
              display: "block",
              padding: "15px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "1px solid #E5E7EB",
              textDecoration: "none",
              transition: "box-shadow 0.2s"
            }}>
              <div style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "5px" }}>Core Web Vitals</div>
              <div style={{ fontSize: "13px", color: "#6B7280" }}>LCP, INP, CLS field data</div>
            </a>
            <a href="/reports/builtwith" style={{
              display: "block",
              padding: "15px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "1px solid #E5E7EB",
              textDecoration: "none",
              transition: "box-shadow 0.2s"
            }}>
              <div style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "5px" }}>BuiltWith Report</div>
              <div style={{ fontSize: "13px", color: "#6B7280" }}>Technology stack analysis</div>
            </a>
            <a href="/reports/schema" style={{
              display: "block",
              padding: "15px",
              backgroundColor: "#fff",
              borderRadius: "6px",
              border: "1px solid #E5E7EB",
              textDecoration: "none",
              transition: "box-shadow 0.2s"
            }}>
              <div style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "5px" }}>Schema Markup</div>
              <div style={{ fontSize: "13px", color: "#6B7280" }}>Structured data validation</div>
            </a>
          </div>
        </div>

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

        <TechnicalResults results={results} url={url} />
      </div>
    </div>
  );
}
