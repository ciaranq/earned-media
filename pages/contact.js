import Head from 'next/head';
import { Header } from './index'; // Import Header from index.js
import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Head>
        <title>Contact Us - SEO Agent</title>
        <meta name="description" content="Contact the SEO Agent team" />
      </Head>
      
      <Header />
      
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#333", marginBottom: "20px" }}>Contact Us</h1>
        
        <p style={{ marginBottom: "20px", lineHeight: "1.5" }}>
          Have questions about our SEO tools? Want to provide feedback? Contact us using the form below.
        </p>
        
        {status === 'success' ? (
          <div style={{ 
            padding: "15px", 
            backgroundColor: "#d4edda", 
            color: "#155724", 
            borderRadius: "4px", 
            marginBottom: "20px" 
          }}>
            <p>Thank you for your message! We'll get back to you soon.</p>
            <button 
              onClick={() => setStatus('')}
              style={{ 
                marginTop: "10px",
                padding: "8px 16px", 
                backgroundColor: "#28a745", 
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form style={{ marginTop: "30px" }} onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="name" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="email" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="message" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ccc", 
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              ></textarea>
            </div>
            
            {status === 'error' && (
              <div style={{ 
                padding: "15px", 
                backgroundColor: "#f8d7da", 
                color: "#721c24", 
                borderRadius: "4px", 
                marginBottom: "20px" 
              }}>
                <p>{errorMessage}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{ 
                padding: "10px 20px", 
                backgroundColor: status === 'sending' ? "#6c757d" : "#0070f3", 
                color: "white", 
                border: "none", 
                borderRadius: "4px", 
                fontSize: "16px",
                cursor: status === 'sending' ? "not-allowed" : "pointer"
              }}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}