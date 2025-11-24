import Head from 'next/head';
import { Header } from './index'; // Import Header from index.js

export default function Tools() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>SEO Tools - SEO Agent</title>
        <meta name="description" content="Our SEO analysis tools" />
      </Head>
      
      <Header />
      
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#333", marginBottom: "20px" }}>SEO Tools</h1>
        
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>SEO Analyzer</h2>
          <p style={{ marginBottom: "15px", lineHeight: "1.5" }}>
            Our main SEO analysis tool. Analyze any website for common SEO issues and get recommendations.
          </p>
          <a href="/" style={{ color: "#0070f3", textDecoration: "none", fontWeight: "500" }}>Try SEO Analyzer →</a>
        </div>
        
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Keyword Research (Coming Soon)</h2>
          <p style={{ marginBottom: "15px", lineHeight: "1.5" }}>
            Find the best keywords for your content with our advanced keyword research tool.
          </p>
        </div>
        
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Backlink Checker (Coming Soon)</h2>
          <p style={{ marginBottom: "15px", lineHeight: "1.5" }}>
            Analyze your website's backlink profile and find opportunities for improvement.
          </p>
        </div>
      </div>
    </div>
  );
}