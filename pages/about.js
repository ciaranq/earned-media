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
      
      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ color: "#ea401d", marginBottom: "10px", fontSize: "36px" }}>About SEO Agent for Earned Media</h1>
        <p style={{ color: "#666", fontSize: "18px", marginBottom: "30px", fontStyle: "italic" }}>
          Professional SEO analysis and strategy tools built for modern marketing teams
        </p>

        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#22988d", borderBottom: "3px solid #fd9c2c", paddingBottom: "10px", marginBottom: "20px" }}>
            Our Mission
          </h2>
          <p style={{ marginBottom: "15px", lineHeight: "1.6", fontSize: "16px" }}>
            We empower marketing teams to understand, improve, and maintain their website's search engine performance.
            Our tools provide actionable insights that help you make data-driven decisions about technical SEO, keyword strategy,
            and content planning.
          </p>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#22988d", borderBottom: "3px solid #fd9c2c", paddingBottom: "10px", marginBottom: "20px" }}>
            Our Specialties
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderLeft: "4px solid #ea401d",
              borderRadius: "4px"
            }}>
              <h3 style={{ color: "#ea401d", marginTop: 0 }}>Technical SEO Audit</h3>
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                Comprehensive analysis of 20+ technical factors including HTTPS, mobile optimization,
                structured data, security headers, Core Web Vitals, and performance metrics.
              </p>
            </div>

            <div style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderLeft: "4px solid #009bd8",
              borderRadius: "4px"
            }}>
              <h3 style={{ color: "#009bd8", marginTop: 0 }}>Keyword Research</h3>
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                Advanced keyword analysis with difficulty scoring, search volume estimation,
                intent classification, and opportunity ranking for strategic content planning.
              </p>
            </div>

            <div style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderLeft: "4px solid #22988d",
              borderRadius: "4px"
            }}>
              <h3 style={{ color: "#22988d", marginTop: 0 }}>SEO Strategy</h3>
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                Month-by-month action plans with team assignments, content calendar guidance,
                link building strategies, and KPI tracking for measurable results.
              </p>
            </div>

            <div style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderLeft: "4px solid #fd9c2c",
              borderRadius: "4px"
            }}>
              <h3 style={{ color: "#fd9c2c", marginTop: 0 }}>Analytics Integration</h3>
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                Integration with Google Search Console and Google Analytics (coming soon)
                to tie SEO improvements directly to organic traffic and business outcomes.
              </p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#22988d", borderBottom: "3px solid #fd9c2c", paddingBottom: "10px", marginBottom: "20px" }}>
            Why Choose SEO Agent?
          </h2>
          <ul style={{ lineHeight: "1.8", fontSize: "16px" }}>
            <li><strong>Team-Focused:</strong> Action items assigned to specific teams (Technical, Content, Link Building) for clear ownership</li>
            <li><strong>Actionable Insights:</strong> Not just scores—specific recommendations with implementation guidance</li>
            <li><strong>Strategic Thinking:</strong> Beyond quick wins, we provide 3-month planning for sustainable growth</li>
            <li><strong>Industry Context:</strong> Recommendations tailored to your specific industry and competitive landscape</li>
            <li><strong>Multi-Format Reports:</strong> Export analysis as JSON, CSV, or printable HTML reports</li>
            <li><strong>Fast Analysis:</strong> Comprehensive audits completed in seconds, not hours</li>
          </ul>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#22988d", borderBottom: "3px solid #fd9c2c", paddingBottom: "10px", marginBottom: "20px" }}>
            Built for Teams
          </h2>
          <p style={{ marginBottom: "15px", lineHeight: "1.6", fontSize: "16px" }}>
            Whether you're a solo marketer or managing a full SEO team, our tools scale with your needs:
          </p>
          <ul style={{ lineHeight: "1.8", fontSize: "16px" }}>
            <li><strong>Technical Teams:</strong> Get detailed technical audits with prioritized issues and security analysis</li>
            <li><strong>Content Teams:</strong> Discover keyword opportunities and content strategy recommendations</li>
            <li><strong>Link Building Teams:</strong> Understand industry-specific link building approaches and targets</li>
            <li><strong>Marketing Leaders:</strong> Track KPIs and measure ROI of SEO improvements</li>
          </ul>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#22988d", borderBottom: "3px solid #fd9c2c", paddingBottom: "10px", marginBottom: "20px" }}>
            Getting Started
          </h2>
          <p style={{ marginBottom: "20px", lineHeight: "1.6", fontSize: "16px" }}>
            Start with a technical audit to understand your current standing, then dive into keyword research to identify opportunities.
            Use the strategy generator to create a comprehensive 3-month action plan tailored to your site.
          </p>
          <div style={{
            padding: "15px",
            backgroundColor: "#e8f4f8",
            borderLeft: "4px solid #009bd8",
            borderRadius: "4px"
          }}>
            <p style={{ margin: 0, fontSize: "14px" }}>
              <strong>New to SEO?</strong> Start with our Technical Audit to identify quick wins,
              then use Keyword Research to uncover growth opportunities.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#22988d", borderBottom: "3px solid #fd9c2c", paddingBottom: "10px", marginBottom: "20px" }}>
            Upcoming Features
          </h2>
          <ul style={{ lineHeight: "1.8", fontSize: "16px" }}>
            <li>Google Search Console integration for real search data</li>
            <li>Google Analytics integration to tie SEO to business metrics</li>
            <li>Competitor keyword analysis and gap reports</li>
            <li>Historical tracking to monitor improvements over time</li>
            <li>Batch URL analysis for multi-page audits</li>
            <li>Custom report branding for agencies</li>
          </ul>
        </section>

        <section style={{
          padding: "20px",
          backgroundColor: "#f0f8f9",
          borderRadius: "8px",
          borderTop: "4px solid #22988d"
        }}>
          <h3 style={{ color: "#22988d", marginTop: 0 }}>Questions? Contact Us</h3>
          <p style={{ marginBottom: "10px", lineHeight: "1.6" }}>
            Have questions about SEO Agent or need custom solutions? We'd love to hear from you.
          </p>
          <a href="/contact" style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#ea401d",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            transition: "background-color 0.3s"
          }}>
            Get in Touch
          </a>
        </section>
      </div>
    </div>
  );
}