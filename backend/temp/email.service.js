const nodemailer = require('nodemailer')

/**
 * Email service for sending OTP emails via SMTP
 * Configure SMTP credentials in .env file
 */

// Initialize transporter (configure with your email provider)
let transporter = null

const initializeTransporter = () => {
  if (transporter) return transporter

  // For Gmail: Use App Password (not regular password)
  // For other providers: Configure accordingly
  const smtpConfig = {
    service: process.env.SMTP_SERVICE || 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  }

  transporter = nodemailer.createTransport(smtpConfig)
  return transporter
}

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {Date} expiresAt - OTP expiry time
 * @returns {Promise<boolean>} - Success status
 */
const sendOTPEmail = async (email, otp, expiresAt) => {
  try {
    // Only send if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('[EMAIL] SMTP not configured. OTP logged to console instead.')
      console.log(`[OTP - ${email}]: ${otp}`)
      return true // Return true to not block flow in development
    }

    const transporter = initializeTransporter()

    // Calculate minutes remaining
    const now = new Date()
    const minutesRemaining = Math.ceil((expiresAt - now) / (1000 * 60))

    // HTML email template
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f9fafb;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .logo {
      color: #667eea;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .header {
      margin-bottom: 24px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      color: #0f172a;
    }
    .header p {
      margin: 8px 0 0 0;
      color: #64748b;
      font-size: 14px;
    }
    .otp-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-label {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      margin-bottom: 8px;
    }
    .otp-code {
      color: white;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }
    .otp-expiry {
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
      margin-top: 8px;
    }
    .content {
      margin: 24px 0;
      color: #0f172a;
    }
    .content p {
      margin: 12px 0;
      font-size: 14px;
    }
    .warning {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px;
      border-radius: 4px;
      font-size: 13px;
      color: #78350f;
      margin: 16px 0;
    }
    .footer {
      text-align: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      margin-top: 24px;
      color: #94a3b8;
      font-size: 12px;
    }
    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">SIH 2025</div>
      
      <div class="header">
        <h1>Verify Your Email</h1>
        <p>Your one-time password is ready</p>
      </div>

      <div class="otp-box">
        <div class="otp-label">Your OTP Code</div>
        <div class="otp-code">${otp}</div>
        <div class="otp-expiry">Expires in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}</div>
      </div>

      <div class="content">
        <p>This OTP will expire at <strong>${expiresAt.toLocaleTimeString()}</strong>.</p>
        <p>Please do not share this code with anyone.</p>
      </div>

      <div class="warning">
        <strong>Security Note:</strong> We will never ask you to share your OTP. If you did not request this email, please ignore it.
      </div>

      <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
        <p>© 2025 SIH. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `

    // Plain text alternative
    const plainText = `
Your OTP Code: ${otp}

This code will expire in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}.

Please do not share this code with anyone.

This is an automated email. Please do not reply to this message.
    `

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: `Your OTP Code: ${otp}`,
      text: plainText,
      html: htmlTemplate,
    })

    console.log(`[EMAIL SENT] Message ID: ${info.messageId}, To: ${email}`)
    return true
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send OTP to ${email}:`, error.message)

    // Log OTP as fallback in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[OTP FALLBACK - ${email}]: ${otp}`)
    }

    // In development, we want to continue (return true)
    // In production, you might want to handle this differently
    return process.env.NODE_ENV === 'development'
  }
}

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetLink - Password reset link
 * @returns {Promise<boolean>} - Success status
 */
const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('[EMAIL] SMTP not configured. Reset link logged to console instead.')
      console.log(`[PASSWORD RESET - ${email}]: ${resetLink}`)
      return true
    }

    const transporter = initializeTransporter()

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f9fafb;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>Reset Your Password</h1>
      <p>Click the button below to reset your password:</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p>If you didn't request a password reset, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
    `

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset Request',
      html: htmlTemplate,
    })

    console.log(`[EMAIL SENT] Password reset to: ${email}`)
    return true
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send password reset to ${email}:`, error.message)
    return false
  }
}

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
}
