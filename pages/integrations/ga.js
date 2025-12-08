import Head from 'next/head';
import { Header } from '../index';

export default function GAIntegration() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>Google Analytics Integration - SEO Agent</title>
        <meta name="description" content="Connect your Google Analytics data to track SEO impact on business metrics" />
      </Head>

      <Header />

      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: '#ea401d', marginBottom: '10px' }}>Google Analytics Integration</h1>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
          See how your SEO improvements directly impact organic traffic, user behavior, and business outcomes.
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
            We're building deep Google Analytics integration to show you the real business impact of your SEO efforts:
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
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>👥</div>
              <strong>Organic Traffic Trends</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                Track organic sessions and users over time
              </p>
            </li>

            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>💰</div>
              <strong>Revenue Attribution</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                See conversions and revenue from organic search
              </p>
            </li>

            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
              <strong>User Behavior Metrics</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                Bounce rate, pages per session, engagement metrics
              </p>
            </li>

            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎯</div>
              <strong>Goal Conversions</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                Track custom goals and conversion funnels
              </p>
            </li>

            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📱</div>
              <strong>Device & Channel Performance</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                See how desktop, mobile, and tablet users engage
              </p>
            </li>

            <li style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
              <strong>ROI Dashboard</strong>
              <p style={{ fontSize: '14px', margin: '10px 0 0 0', color: '#666' }}>
                Measure the return on your SEO investments
              </p>
            </li>
          </ul>
        </div>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#22988d', borderBottom: '3px solid #fd9c2c', paddingBottom: '10px', marginBottom: '20px' }}>
            The Business Impact
          </h2>
          <p style={{ lineHeight: '1.6', fontSize: '16px', marginBottom: '20px' }}>
            Our tools help you optimize your website, but the real question is: does it matter to your business?
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              borderLeft: '4px solid #22988d'
            }}>
              <h3 style={{ marginTop: 0, color: '#22988d' }}>Before GA Integration</h3>
              <ul style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                <li>✓ See technical issues</li>
                <li>✓ Find keyword opportunities</li>
                <li>✓ Get action recommendations</li>
                <li>✗ Can't prove ROI</li>
                <li>✗ Can't track progress</li>
              </ul>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#e8f4f8',
              borderRadius: '4px',
              borderLeft: '4px solid #009bd8'
            }}>
              <h3 style={{ marginTop: 0, color: '#009bd8' }}>With GA Integration</h3>
              <ul style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                <li>✓ See technical issues</li>
                <li>✓ Find keyword opportunities</li>
                <li>✓ Get action recommendations</li>
                <li>✓ Prove SEO ROI with traffic data</li>
                <li>✓ Track impact month-by-month</li>
              </ul>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#22988d', borderBottom: '3px solid #fd9c2c', paddingBottom: '10px', marginBottom: '20px' }}>
            Real-World Example
          </h2>
          <div style={{
            padding: '20px',
            backgroundColor: '#f0f8f9',
            borderRadius: '4px',
            border: '1px solid #009bd8'
          }}>
            <p style={{ margin: '0 0 15px 0', lineHeight: '1.6', fontSize: '16px' }}>
              <strong>Month 1:</strong> You fix 12 technical issues we identify. Nothing changes in Google yet.
            </p>
            <p style={{ margin: '0 0 15px 0', lineHeight: '1.6', fontSize: '16px' }}>
              <strong>Month 2:</strong> You publish 4 articles targeting the keywords we recommended. GA Integration shows
              100 additional organic sessions from these new pages.
            </p>
            <p style={{ margin: '0 0 15px 0', lineHeight: '1.6', fontSize: '16px' }}>
              <strong>Month 3:</strong> Your ranking position for target keywords improves. GA Integration reveals:
              <br />• 35% increase in organic traffic
              <br />• 12 new conversions from organic search
              <br />• $2,400 revenue attributed to organic channel
            </p>
            <p style={{ margin: 0, lineHeight: '1.6', fontSize: '16px', color: '#009bd8', fontWeight: 'bold' }}>
              Your SEO efforts delivered measurable business results.
            </p>
          </div>
        </section>

        <section style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>What Data We'll Access</h3>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 15px 0' }}>
            We use Google's OAuth to connect your Analytics 4 property. We access:
          </p>
          <ul style={{ fontSize: '14px', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
            <li>Organic traffic sessions and users</li>
            <li>Organic search traffic by page</li>
            <li>Conversion and goal completion data</li>
            <li>Revenue if eCommerce is enabled</li>
            <li>Device and geographic data</li>
          </ul>
          <p style={{ fontSize: '12px', color: '#999', margin: '15px 0 0 0' }}>
            We only read your data—we never write to or modify your Analytics account.
          </p>
        </section>

        <section style={{
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderLeft: '4px solid #ffc107',
          borderRadius: '4px'
        }}>
          <h3 style={{ marginTop: 0, color: '#856404' }}>Ready When You Are</h3>
          <p style={{ margin: '10px 0', lineHeight: '1.6', color: '#856404' }}>
            GA integration is coming soon. In the meantime, focus on implementing our technical and keyword recommendations.
            When this launches, you'll have the data to show exactly how much impact your SEO efforts are making.
          </p>
          <a href="/contact" style={{
            display: 'inline-block',
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#ea401d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            Request Early Access
          </a>
        </section>
      </div>
    </div>
  );
}
