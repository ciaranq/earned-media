import Head from 'next/head';
import { Header } from './index'; // Import Header from index.js

export default function About() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>About - SEO Agent</title>
        <meta name="description" content="About our SEO analysis tools" />
      </Head>
      
      <Header />
      
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#333", marginBottom: "20px" }}>About SEO Agent</h1>
        
        <p style={{ marginBottom: "20px", lineHeight: "1.5" }}>
          SEO Agent provides powerful tools to analyze and improve your website's search engine optimization.
          Our tools help you identify issues that might be affecting your search rankings and provide
          recommendations to fix them.
        </p>
        
        <p style={{ marginBottom: "20px", lineHeight: "1.5" }}>
          Whether you're a small business owner, a blogger, or an SEO professional, our tools can help you
          improve your website's visibility in search engines.
        </p>
      </div>
    </div>
  );
}