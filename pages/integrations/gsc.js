import Head from 'next/head';
import { Header } from '../index';

export default function GSCIntegration() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>Google Search Console Integration - SEO Agent</title>
        <meta name="description" content="Connect your Google Search Console data to SEO Agent" />
      </Head>

      <Header />

      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: '#ea401d', marginBottom: '10px' }}>Google Search Console Integration</h1>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
          Connect your real search data to get insights into how your pages are performing in Google Search results.
        </p>

        <div style={{
          padding: '30px',
          backgroundColor: '#f0f8f9',
          borderRadius: '8px',
          border: '2px dashed #009bd8',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#009bd8', marginTop: 0 }}>Coming Soon</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
            We're working on seamless Google Search Console integration. This feature will let you:
          </p>

          <ul style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            listStyle: 'none',
            padding: 0,
            margin: '20px 0'
          }}>
            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
              <strong>Real Search Data</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                See impressions, clicks, and CTR for all your keywords
              </p>
            </li>

            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎯</div>
              <strong>Ranking Position Tracking</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                Monitor how your pages rank over time
              </p>
            </li>

            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📈</div>
              <strong>Performance Insights</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                Identify top performing pages and improvement opportunities
              </p>
            </li>

            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔗</div>
              <strong>Link Analysis</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                See your top linking domains and backlink opportunities
              </p>
            </li>

            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
              <strong>Mobile Usability</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                Get alerts about mobile issues affecting your rankings
              </p>
            </li>

            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📋</div>
              <strong>Index Coverage</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                Monitor indexed pages and resolve crawl errors
              </p>
            </li>
          </ul>
        </div>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#22988d', borderBottom: '3px solid #fd9c2c', paddingBottom: '10px', marginBottom: '20px' }}>
            How It Will Work
          </h2>
          <ol style={{ lineHeight: '1.8', fontSize: '16px' }}>
            <li>
              <strong>Connect Your GSC Account:</strong> One-click OAuth authentication with your Google Search Console property
            </li>
            <li>
              <strong>Sync Your Data:</strong> Automatically fetch 16 months of historical search performance data
            </li>
            <li>
              <strong>Get Insights:</strong> See which keywords are driving traffic and where you can improve
            </li>
            <li>
              <strong>Take Action:</strong> Use our strategy recommendations to target underperforming keywords
            </li>
            <li>
              <strong>Track Progress:</strong> Monitor improvement month-over-month as you implement changes
            </li>
          </ol>
        </section>

        <section style={{
          padding: '20px',
          backgroundColor: '#e8f4f8',
          borderLeft: '4px solid #009bd8',
          borderRadius: '4px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginTop: 0, color: '#009bd8' }}>Why This Matters</h3>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            Currently, our tools analyze your website's technical capabilities and content. Adding Google Search Console data
            lets us show you the actual impact—which keywords are working, which need improvement, and where to focus your efforts
            for maximum ROI.
          </p>
        </section>

        <section style={{
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderLeft: '4px solid #ffc107',
          borderRadius: '4px'
        }}>
          <h3 style={{ marginTop: 0, color: '#856404' }}>Want Early Access?</h3>
          <p style={{ margin: '10px 0', lineHeight: '1.6', color: '#856404' }}>
            We're prioritizing GSC integration based on user demand. If you'd like early access when it launches,
            <a href="/contact" style={{ color: '#ea401d', fontWeight: 'bold', marginLeft: '5px' }}>
              let us know on our contact form
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
