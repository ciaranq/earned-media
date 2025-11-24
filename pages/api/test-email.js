// pages/api/test-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow in development or with special key
  if (process.env.NODE_ENV !== 'development' && req.query.key !== process.env.TEST_EMAIL_KEY) {
    return res.status(403).json({ error: 'Forbidden in production without proper authentication' });
  }

  try {
    console.log('Testing email with config:', {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER?.slice(0, 3) + '***', // Log only first 3 chars for security
    });
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    // Verify the connection first
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    
    // Send a test email
    const info = await transporter.sendMail({
      from: `"Test Email" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: "Test Email from Next.js App",
      text: "If you're seeing this, your email configuration is working!",
      html: "<p>If you're seeing this, your email configuration is working!</p>",
    });
    
    console.log('Test email sent:', info.messageId);
    
    return res.status(200).json({ 
      success: true, 
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Test email failed:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    return res.status(500).json({ 
      error: 'Email test failed', 
      details: {
        message: error.message,
        code: error.code
      }
    });
  }
}
