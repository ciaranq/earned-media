import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from './index';

export default function KeywordStrategyBuilder() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState('keywords'); // 'keywords' or 'url'
  const [keywords, setKeywords] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeCluster, setActiveCluster] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Auto-run analysis if URL passed in query params
  useEffect(() => {
    if (router.isReady && router.query.url) {
      const urlFromQuery = router.query.url;
      setUrl(urlFromQuery);
      setInputMode('url');
      runAnalysis('url', null, urlFromQuery);
    }
  }, [router.isReady, router.query.url]);

  async function runAnalysis(mode, keywordInput, urlInput) {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/keyword-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          keywords: mode === 'keywords' ? keywordInput : null,
          url: mode === 'url' ? urlInput : null
        })
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Error: ${response.status}`);
      }

      setResults(data);
      if (data.clusters && data.clusters.length > 0) {
        setActiveCluster(data.clusters[0].id);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    runAnalysis(inputMode, keywords, url);
  }

  // Export functions
  function downloadCSV() {
    if (!results || !results.exportData) return;

    const blob = new Blob([results.exportData.csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-clusters.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  function downloadJSON() {
    if (!results || !results.exportData) return;

    const blob = new Blob([JSON.stringify(results.exportData.json, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-strategy.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Head>
        <title>Keyword Strategy Builder - SEO Agent for Earned Media</title>
        <meta name="description" content="AI-powered keyword clustering and content strategy tool. Transform your keywords into actionable topic clusters." />
      </Head>

      <Header currentUrl={url} />

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
          borderRadius: '12px',
          padding: '40px',
          marginBottom: '30px',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 15px 0', fontSize: '32px', fontWeight: 'bold' }}>
            Keyword Strategy Builder
          </h1>
          <p style={{ margin: 0, fontSize: '18px', opacity: 0.9, maxWidth: '700px' }}>
            Transform your keywords into actionable topic clusters. Powered by AI, this tool groups your keywords
            into topically related clusters to speed up content production and enhance your SEO strategy.
          </p>
        </div>

        {/* Input Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {/* Mode Toggle */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '14px', color: '#374151' }}>
              Input Method
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setInputMode('keywords')}
                style={{
                  padding: '10px 20px',
                  border: inputMode === 'keywords' ? '2px solid #3B82F6' : '2px solid #E5E7EB',
                  borderRadius: '6px',
                  backgroundColor: inputMode === 'keywords' ? '#EFF6FF' : 'white',
                  color: inputMode === 'keywords' ? '#3B82F6' : '#6B7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Enter Keywords
              </button>
              <button
                type="button"
                onClick={() => setInputMode('url')}
                style={{
                  padding: '10px 20px',
                  border: inputMode === 'url' ? '2px solid #3B82F6' : '2px solid #E5E7EB',
                  borderRadius: '6px',
                  backgroundColor: inputMode === 'url' ? '#EFF6FF' : 'white',
                  color: inputMode === 'url' ? '#3B82F6' : '#6B7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Extract from URL
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {inputMode === 'keywords' ? (
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="keywords" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#374151' }}>
                  Enter Your Keywords
                </label>
                <textarea
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords (one per line, or comma-separated)&#10;&#10;Example:&#10;seo services&#10;local seo&#10;keyword research&#10;content marketing&#10;link building strategy"
                  required={inputMode === 'keywords'}
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    resize: 'vertical',
                    lineHeight: '1.5'
                  }}
                />
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
                  Tip: Paste your keyword list from a spreadsheet, one keyword per line
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="url" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#374151' }}>
                  Website URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required={inputMode === 'url'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
                  We'll extract keywords from the page's titles, headings, and meta tags
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 30px',
                backgroundColor: loading ? '#9CA3AF' : '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Analyzing Keywords...
                </>
              ) : (
                'Build Keyword Strategy'
              )}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #EF4444',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#B91C1C', fontSize: '16px' }}>Error</h3>
            <p style={{ margin: 0, color: '#991B1B' }}>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div>
            {/* Summary Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <StatCard
                label="Total Keywords"
                value={results.totalKeywords}
                color="#3B82F6"
              />
              <StatCard
                label="Topic Clusters"
                value={results.clusters.length}
                color="#8B5CF6"
              />
              <StatCard
                label="High Priority"
                value={results.clusters.filter(c => c.priority === 'high').length}
                color="#EF4444"
              />
              <StatCard
                label="Quick Wins"
                value={results.strategy.reduce((sum, s) => sum + s.quickWins.length, 0)}
                color="#10B981"
              />
            </div>

            {/* Export Buttons */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontWeight: 'bold', color: '#374151' }}>Export:</span>
              <button
                onClick={downloadCSV}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Download CSV
              </button>
              <button
                onClick={downloadJSON}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6366F1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Download JSON
              </button>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '5px',
              marginBottom: '20px',
              borderBottom: '2px solid #E5E7EB',
              paddingBottom: '0'
            }}>
              {['overview', 'clusters', 'strategy', 'calendar'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderBottom: activeTab === tab ? '3px solid #3B82F6' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: activeTab === tab ? '#3B82F6' : '#6B7280',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textTransform: 'capitalize',
                    marginBottom: '-2px'
                  }}
                >
                  {tab === 'calendar' ? 'Content Calendar' : tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <OverviewTab results={results} />
            )}

            {activeTab === 'clusters' && (
              <ClustersTab
                clusters={results.clusters}
                activeCluster={activeCluster}
                setActiveCluster={setActiveCluster}
                copyToClipboard={copyToClipboard}
              />
            )}

            {activeTab === 'strategy' && (
              <StrategyTab strategy={results.strategy} />
            )}

            {activeTab === 'calendar' && (
              <CalendarTab calendar={results.contentCalendar} />
            )}
          </div>
        )}

        {/* How It Works Section (shown when no results) */}
        {!results && !loading && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ margin: '0 0 25px 0', fontSize: '24px', color: '#111827' }}>
              How It Works
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
              <FeatureCard
                number="1"
                title="Input Keywords"
                description="Paste your keyword list or enter a URL to extract keywords automatically from page content."
              />
              <FeatureCard
                number="2"
                title="AI Clustering"
                description="Our AI groups keywords into topically related clusters based on semantic similarity and search intent."
              />
              <FeatureCard
                number="3"
                title="Get Strategy"
                description="Receive actionable content recommendations, page suggestions, and a prioritized content calendar."
              />
            </div>

            <div style={{ marginTop: '40px', padding: '25px', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #22C55E' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#166534' }}>Benefits of Keyword Clustering</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#166534' }}>
                <li style={{ marginBottom: '10px' }}>Speed up content production by organizing keywords into actionable clusters</li>
                <li style={{ marginBottom: '10px' }}>Cover topics more deeply to create well-rounded, authoritative content</li>
                <li style={{ marginBottom: '10px' }}>Enhance SEO by strategically targeting keyword groups that improve site visibility</li>
                <li style={{ marginBottom: '0' }}>Identify quick wins and prioritize high-impact content opportunities</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animation for loading spinner */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, color }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>{value}</div>
      <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '5px' }}>{label}</div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ number, title, description }) {
  return (
    <div style={{ display: 'flex', gap: '15px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#3B82F6',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        flexShrink: 0
      }}>
        {number}
      </div>
      <div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#111827' }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>{description}</p>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ results }) {
  return (
    <div style={{ display: 'grid', gap: '25px' }}>
      {/* Summary */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#111827' }}>Summary</h3>
        <p style={{ margin: 0, fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
          {results.recommendations.summary}
        </p>
      </div>

      {/* Top Priorities */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#111827' }}>Top Priorities</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {results.recommendations.topPriorities.map((priority, idx) => (
            <div key={idx} style={{
              padding: '15px',
              backgroundColor: '#F9FAFB',
              borderRadius: '6px',
              borderLeft: '4px solid #3B82F6'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#111827' }}>{priority.title}</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>{priority.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#111827' }}>Recommended Timeline</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {Object.entries(results.recommendations.estimatedTimeline).map(([phase, data]) => (
            <div key={phase} style={{
              padding: '20px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#3B82F6' }}>{data.name}</h4>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#374151' }}>
                {data.activities.map((activity, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Content Gaps */}
      {results.recommendations.contentGaps.length > 0 && (
        <div style={{
          backgroundColor: '#FEF3C7',
          borderRadius: '8px',
          padding: '25px',
          border: '1px solid #F59E0B'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#92400E' }}>Content Gaps Identified</h3>
          {results.recommendations.contentGaps.map((gap, idx) => (
            <div key={idx} style={{ marginBottom: idx < results.recommendations.contentGaps.length - 1 ? '12px' : 0 }}>
              <strong style={{ color: '#92400E' }}>{gap.cluster}:</strong>
              <span style={{ color: '#78350F' }}> {gap.issue}. {gap.recommendation}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Clusters Tab Component
function ClustersTab({ clusters, activeCluster, setActiveCluster, copyToClipboard }) {
  const selectedCluster = clusters.find(c => c.id === activeCluster) || clusters[0];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '25px' }}>
      {/* Cluster List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        height: 'fit-content'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#6B7280', textTransform: 'uppercase' }}>
          Topic Clusters
        </h3>
        {clusters.map(cluster => (
          <button
            key={cluster.id}
            onClick={() => setActiveCluster(cluster.id)}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              marginBottom: '8px',
              border: activeCluster === cluster.id ? '2px solid #3B82F6' : '1px solid #E5E7EB',
              borderRadius: '6px',
              backgroundColor: activeCluster === cluster.id ? '#EFF6FF' : 'white',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
              {cluster.name}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              {cluster.keywords.length} keywords
              <span style={{
                marginLeft: '8px',
                padding: '2px 6px',
                backgroundColor: cluster.priority === 'high' ? '#FEE2E2' : cluster.priority === 'medium' ? '#FEF3C7' : '#F3F4F6',
                color: cluster.priority === 'high' ? '#991B1B' : cluster.priority === 'medium' ? '#92400E' : '#374151',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {cluster.priority}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Cluster Detail */}
      {selectedCluster && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#111827' }}>{selectedCluster.name}</h2>
              <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#6B7280' }}>
                <span>Intent: <strong>{selectedCluster.intent}</strong></span>
                <span>Type: <strong>{selectedCluster.contentType}</strong></span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(selectedCluster.keywords.join('\n'))}
              style={{
                padding: '8px 16px',
                backgroundColor: '#F3F4F6',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Copy Keywords
            </button>
          </div>

          {/* Keywords Grid */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151' }}>
              Keywords ({selectedCluster.keywords.length})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedCluster.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#EFF6FF',
                    color: '#1E40AF',
                    borderRadius: '20px',
                    fontSize: '13px'
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Sub-clusters */}
          {selectedCluster.subClusters && selectedCluster.subClusters.length > 0 && (
            <div>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#374151' }}>
                Sub-Topics
              </h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                {selectedCluster.subClusters.map((sub, idx) => (
                  <div key={idx} style={{
                    padding: '15px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                      {sub.suggestedPage.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                      Suggested URL: <code style={{ backgroundColor: '#E5E7EB', padding: '2px 6px', borderRadius: '4px' }}>{sub.suggestedPage.suggestedUrl}</code>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {sub.keywords.map((kw, kIdx) => (
                        <span key={kIdx} style={{
                          padding: '3px 8px',
                          backgroundColor: '#DBEAFE',
                          color: '#1E40AF',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Strategy Tab Component
function StrategyTab({ strategy }) {
  return (
    <div style={{ display: 'grid', gap: '25px' }}>
      {strategy.map((s, idx) => (
        <div key={idx} style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>{s.clusterName}</h3>
            <span style={{
              padding: '4px 12px',
              backgroundColor: s.priority === 'high' ? '#FEE2E2' : s.priority === 'medium' ? '#FEF3C7' : '#F3F4F6',
              color: s.priority === 'high' ? '#991B1B' : s.priority === 'medium' ? '#92400E' : '#374151',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {s.priority} Priority
            </span>
          </div>

          {/* Content Strategy */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3B82F6' }}>Content Strategy</h4>
            <div style={{ padding: '15px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#374151' }}>
                <strong>Approach:</strong> {s.contentStrategy.approach}
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#374151' }}>
                <strong>Frequency:</strong> {s.contentStrategy.frequency}
              </p>
              <div>
                <strong style={{ fontSize: '14px', color: '#374151' }}>Content Types:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  {s.contentStrategy.contentTypes.map((type, tIdx) => (
                    <li key={tIdx} style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>{type}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Page Recommendations */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3B82F6' }}>Page Recommendations</h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {s.pageRecommendations.slice(0, 4).map((page, pIdx) => (
                <div key={pIdx} style={{
                  padding: '15px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${page.priority === 'high' ? '#EF4444' : page.priority === 'medium' ? '#F59E0B' : '#6B7280'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{page.title}</span>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{page.type}</span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#6B7280' }}>{page.description}</p>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    Word count: {page.wordCount} | Keywords: {page.targetKeywords.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Wins */}
          {s.quickWins.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#10B981' }}>Quick Wins</h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                {s.quickWins.slice(0, 3).map((win, wIdx) => (
                  <div key={wIdx} style={{
                    padding: '12px',
                    backgroundColor: '#ECFDF5',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#065F46', marginBottom: '4px' }}>
                      "{win.keyword}"
                    </div>
                    <div style={{ fontSize: '12px', color: '#047857' }}>{win.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#3B82F6' }}>Action Items</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB' }}>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Priority</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Action</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Team</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Timeframe</th>
                  </tr>
                </thead>
                <tbody>
                  {s.actionItems.map((item, iIdx) => (
                    <tr key={iIdx}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB' }}>
                        <span style={{
                          padding: '2px 8px',
                          backgroundColor: '#DBEAFE',
                          color: '#1E40AF',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          P{item.priority}
                        </span>
                      </td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB', fontWeight: '500' }}>{item.action}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>{item.team}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>{item.timeframe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Calendar Tab Component
function CalendarTab({ calendar }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <h3 style={{ margin: '0 0 25px 0', fontSize: '20px', color: '#111827' }}>
        Content Calendar
      </h3>
      <div style={{ display: 'grid', gap: '20px' }}>
        {calendar.weeks.map((week, idx) => (
          <div key={idx} style={{
            padding: '20px',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            borderLeft: '4px solid #3B82F6'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', color: '#3B82F6' }}>Week {week.week}</h4>
              <span style={{
                padding: '4px 12px',
                backgroundColor: '#EFF6FF',
                color: '#1E40AF',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Focus: {week.focus}
              </span>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {week.contentPieces.map((piece, pIdx) => (
                <div key={pIdx} style={{
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{piece.title}</span>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: piece.type === 'Pillar Page' ? '#DBEAFE' : '#E5E7EB',
                      color: piece.type === 'Pillar Page' ? '#1E40AF' : '#374151',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {piece.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    <span style={{ marginRight: '15px' }}>Word count: ~{piece.wordCount}</span>
                    <span>Keywords: {piece.keywords.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
