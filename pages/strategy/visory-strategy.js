import Head from 'next/head';
import { Header } from '../index';
import { marked } from 'marked';
import fs from 'fs';
import path from 'path';

export default function VisoryStrategy({ content, sections }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>Visory 3-Month SEO & Conversion Strategy - SEO Agent for Earned Media</title>
        <meta name="description" content="Executive summary of Visory's 3-month SEO and conversion optimization strategy" />
      </Head>

      <Header />

      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "15px" }}>
          <a href="/strategy" style={{ color: "#3B82F6", textDecoration: "none", fontSize: "14px" }}>
            ← Back to SEO Strategy
          </a>
        </div>

        {/* Header Section */}
        <div style={{
          backgroundColor: "#1E40AF",
          color: "white",
          padding: "30px",
          borderRadius: "8px",
          marginBottom: "30px"
        }}>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "32px" }}>
            Visory 3-Month SEO & Conversion Strategy
          </h1>
          <p style={{ margin: 0, fontSize: "18px", opacity: 0.9 }}>Executive Summary</p>
        </div>

        {/* Render markdown content with custom styling */}
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Back Link */}
        <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "30px" }}>
          <a
            href="/strategy"
            style={{
              display: "inline-block",
              padding: "12px 24px",
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
            ← Back to SEO Strategy
          </a>
        </div>
      </div>

      <style jsx global>{`
        /* Markdown content container */
        .markdown-content {
          background-color: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 30px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Headings */
        .markdown-content h1 {
          color: #111;
          font-size: 28px;
          margin: 0 0 20px 0;
          padding-bottom: 15px;
          border-bottom: 3px solid #3B82F6;
        }

        .markdown-content h2 {
          color: #111;
          font-size: 24px;
          margin: 30px 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #E5E7EB;
        }

        .markdown-content h2:first-child {
          margin-top: 0;
        }

        .markdown-content h3 {
          color: #374151;
          font-size: 18px;
          font-weight: 600;
          margin: 20px 0 12px 0;
        }

        /* Paragraphs */
        .markdown-content p {
          color: #374151;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        /* Lists */
        .markdown-content ul {
          color: #4B5563;
          line-height: 1.8;
          margin: 10px 0 20px 0;
          padding-left: 25px;
        }

        .markdown-content li {
          margin-bottom: 8px;
        }

        /* Emphasis and Strong */
        .markdown-content em {
          color: #6B7280;
          font-style: italic;
        }

        .markdown-content strong {
          color: #111;
          font-weight: 600;
        }

        /* Code blocks */
        .markdown-content code {
          background-color: #F3F4F6;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }

        @media print {
          a {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'strategy.md');

  try {
    const markdownContent = fs.readFileSync(filePath, 'utf-8');

    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true
    });

    // Convert markdown to HTML
    let htmlContent = marked(markdownContent);

    // Add inline styling to elements
    htmlContent = htmlContent
      // Style emphasis for goals
      .replace(/<em>Goal: (.*?)<\/em>/g, '<div style="background-color: #EFF6FF; padding: 12px; border-radius: 6px; margin: 15px 0;"><em style="color: #1E40AF; font-size: 16px;">Goal: $1</em></div>')
      // Remove horizontal rules
      .replace(/<hr\s*\/?>/g, '<div style="margin: 30px 0;"></div>');

    return {
      props: {
        content: htmlContent
      }
    };
  } catch (error) {
    console.error('Error reading strategy.md:', error);
    return {
      props: {
        content: '<p>Error loading strategy content.</p>'
      }
    };
  }
}
