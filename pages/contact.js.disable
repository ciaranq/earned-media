import Head from 'next/head';
import { Header } from './index'; // Import Header from index.js

export default function Contact() {
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
        
        <form style={{ marginTop: "30px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="name" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Name
            </label>
            <input
              type="text"
              id="name"
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
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid #ccc", 
                borderRadius: "4px",
                fontSize: "16px"
              }}
            ></textarea>
          </div>
          
          <button
            type="submit"
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#0070f3", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}