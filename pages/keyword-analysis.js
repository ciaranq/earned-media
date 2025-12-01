import { useState } from 'react';
import Head from 'next/head';
import { Header } from './index';
import fs from 'fs';
import path from 'path';

// Helper function to format dates consistently (avoids hydration errors)
function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function KeywordAnalysis({ reports }) {
  const [selectedDomain, setSelectedDomain] = useState(null);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>Keyword Analysis Reports - SEO Agent for Earned Media</title>
        <meta name="description" content="View detailed keyword analysis reports for analyzed domains" />
      </Head>

      <Header currentUrl="" />

      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#333", marginBottom: "10px" }}>Keyword Analysis Reports</h1>
        <p style={{ color: "#666", marginBottom: "30px", lineHeight: "1.6" }}>
          View comprehensive keyword analysis reports for your analyzed domains. Reports include keyword frequency,
          density, meta tags analysis, heading structure, and SEO recommendations.
        </p>

        {/* Instructions Section */}
        <div style={{
          backgroundColor: "#F0F9FF",
          border: "1px solid #3B82F6",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h2 style={{ color: "#1E40AF", marginBottom: "15px", fontSize: "20px" }}>
            📋 How to Analyze a New Domain
          </h2>
          <p style={{ color: "#4B5563", marginBottom: "15px", lineHeight: "1.6" }}>
            To generate a new keyword analysis report, run the analyzer script locally:
          </p>
          <div style={{
            backgroundColor: "#1F2937",
            color: "#F9FAFB",
            padding: "15px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "14px",
            marginBottom: "15px"
          }}>
            npm run analyze-keywords yourdomain.com
          </div>
          <p style={{ color: "#4B5563", marginBottom: "10px", lineHeight: "1.6" }}>
            Optional: Specify max pages (default 20, max 50):
          </p>
          <div style={{
            backgroundColor: "#1F2937",
            color: "#F9FAFB",
            padding: "15px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "14px",
            marginBottom: "15px"
          }}>
            npm run analyze-keywords yourdomain.com 30
          </div>
          <div style={{
            backgroundColor: "#DBEAFE",
            border: "1px solid #60A5FA",
            borderRadius: "6px",
            padding: "12px",
            marginTop: "15px"
          }}>
            <p style={{ color: "#1E40AF", margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
              <strong>Note:</strong> The script will crawl your website, analyze keywords, and save reports to
              <code style={{
                backgroundColor: "#fff",
                padding: "2px 6px",
                borderRadius: "3px",
                fontFamily: "monospace"
              }}>/public/reports/[domain]/</code>.
              After running the script, commit and deploy to see the report here.
            </p>
          </div>
        </div>

        {/* Reports List */}
        {reports && reports.length > 0 ? (
          <div>
            <h2 style={{ color: "#333", marginBottom: "20px", fontSize: "24px" }}>
              Available Reports ({reports.length})
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px"
            }}>
              {reports.map((report, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.2s, border-color 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "#3B82F6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                    e.currentTarget.style.borderColor = "#E5E7EB";
                  }}
                >
                  <h3 style={{
                    color: "#111",
                    marginBottom: "10px",
                    fontSize: "18px",
                    fontWeight: "600"
                  }}>
                    {report.domain}
                  </h3>

                  {report.data && (
                    <div style={{ marginBottom: "15px" }}>
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        marginBottom: "10px"
                      }}>
                        <div style={{
                          backgroundColor: "#F9FAFB",
                          padding: "10px",
                          borderRadius: "4px"
                        }}>
                          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#3B82F6" }}>
                            {report.data.totalPages}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6B7280" }}>Pages</div>
                        </div>
                        <div style={{
                          backgroundColor: "#F9FAFB",
                          padding: "10px",
                          borderRadius: "4px"
                        }}>
                          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10B981" }}>
                            {report.data.topKeywords?.length || 0}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6B7280" }}>Keywords</div>
                        </div>
                      </div>

                      {report.data.topKeywords && report.data.topKeywords.length > 0 && (
                        <div style={{
                          backgroundColor: "#F0FDF4",
                          border: "1px solid #22C55E",
                          borderRadius: "4px",
                          padding: "10px",
                          marginBottom: "10px"
                        }}>
                          <div style={{ fontSize: "12px", color: "#15803D", marginBottom: "5px" }}>
                            Top Keyword:
                          </div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#166534" }}>
                            "{report.data.topKeywords[0].keyword}"
                          </div>
                          <div style={{ fontSize: "12px", color: "#15803D", marginTop: "3px" }}>
                            {report.data.topKeywords[0].frequency} occurrences • {report.data.topKeywords[0].density.toFixed(2)}% density
                          </div>
                        </div>
                      )}

                      <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "15px" }}>
                        Analyzed: {formatDate(report.data.analyzedAt)}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px" }}>
                    <a
                      href={`/reports/${report.domain}`}
                      style={{
                        flex: 1,
                        display: "block",
                        padding: "10px 15px",
                        backgroundColor: "#3B82F6",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "6px",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563EB"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3B82F6"}
                    >
                      View Report →
                    </a>
                    <a
                      href={`/reports/${report.domain}/keywords.json`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 15px",
                        backgroundColor: "#F3F4F6",
                        color: "#374151",
                        textDecoration: "none",
                        borderRadius: "6px",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        border: "1px solid #D1D5DB",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#E5E7EB"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
                    >
                      JSON
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: "#FEF3C7",
            border: "1px solid #F59E0B",
            borderRadius: "8px",
            padding: "30px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>📊</div>
            <h3 style={{ color: "#92400E", marginBottom: "10px", fontSize: "20px" }}>
              No Reports Available Yet
            </h3>
            <p style={{ color: "#78350F", marginBottom: "20px", lineHeight: "1.6" }}>
              Run the keyword analyzer script to generate your first report:
            </p>
            <div style={{
              backgroundColor: "#1F2937",
              color: "#F9FAFB",
              padding: "15px",
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "14px",
              display: "inline-block"
            }}>
              npm run analyze-keywords visory.com.au
            </div>
          </div>
        )}

        {/* Feature Overview */}
        <div style={{
          marginTop: "40px",
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: "8px",
          padding: "20px"
        }}>
          <h2 style={{ color: "#333", marginBottom: "15px", fontSize: "20px" }}>
            What's Included in Each Report
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "15px"
          }}>
            <div>
              <div style={{ fontWeight: "600", color: "#3B82F6", marginBottom: "5px" }}>
                📈 Keyword Analysis
              </div>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6", margin: 0 }}>
                Top 50 keywords with frequency and density metrics
              </p>
            </div>
            <div>
              <div style={{ fontWeight: "600", color: "#10B981", marginBottom: "5px" }}>
                🏷️ Meta Tags
              </div>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6", margin: 0 }}>
                Title, description, and keywords analysis
              </p>
            </div>
            <div>
              <div style={{ fontWeight: "600", color: "#8B5CF6", marginBottom: "5px" }}>
                📑 Heading Structure
              </div>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6", margin: 0 }}>
                H1-H6 distribution across all pages
              </p>
            </div>
            <div>
              <div style={{ fontWeight: "600", color: "#F59E0B", marginBottom: "5px" }}>
                💡 Recommendations
              </div>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6", margin: 0 }}>
                Actionable SEO improvements
              </p>
            </div>
          </div>
        </div>

        {/* Back to Keywords */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <a
            href="/keywords"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#8B5CF6",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#7C3AED"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#8B5CF6"}
          >
            ← Back to Keyword Research
          </a>
        </div>
      </div>
    </div>
  );
}

// Server-side props to read available reports
export async function getServerSideProps() {
  try {
    const reportsDir = path.join(process.cwd(), 'public', 'reports');

    // Check if reports directory exists
    if (!fs.existsSync(reportsDir)) {
      return {
        props: {
          reports: []
        }
      };
    }

    // Read all domain directories
    const domains = fs.readdirSync(reportsDir).filter(item => {
      const itemPath = path.join(reportsDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    // Read report data for each domain
    const reports = domains.map(domain => {
      const jsonPath = path.join(reportsDir, domain, 'keywords.json');
      let data = null;

      if (fs.existsSync(jsonPath)) {
        try {
          const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
          data = JSON.parse(jsonContent);
        } catch (error) {
          console.error(`Error reading report for ${domain}:`, error);
        }
      }

      return {
        domain,
        data
      };
    });

    // Sort by analyzed date (newest first)
    reports.sort((a, b) => {
      if (!a.data || !b.data) return 0;
      return new Date(b.data.analyzedAt).getTime() - new Date(a.data.analyzedAt).getTime();
    });

    return {
      props: {
        reports
      }
    };
  } catch (error) {
    console.error('Error loading reports:', error);
    return {
      props: {
        reports: []
      }
    };
  }
}
