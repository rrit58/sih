import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
const router = express.Router()

// In-memory storage for OTPs (in production, use database like MongoDB)
const otpStorage = new Map()

// Email regex validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Hash OTP using SHA256
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

// Rate limiting: Simple in-memory tracker
const rateLimitTracker = new Map()

const checkRateLimit = (email, action = 'send-otp', limit = 3, windowMs = 60000) => {
  const key = `${email}:${action}`
  const now = Date.now()
  
  if (!rateLimitTracker.has(key)) {
    rateLimitTracker.set(key, { attempts: [], blockedUntil: null })
  }
  
  const tracker = rateLimitTracker.get(key)
  
  // Check if currently blocked
  if (tracker.blockedUntil && now < tracker.blockedUntil) {
    return {
      allowed: false,
      message: `Too many attempts. Please try again after ${Math.ceil((tracker.blockedUntil - now) / 1000)} seconds`,
    }
  }
  
  // Remove old attempts outside the window
  tracker.attempts = tracker.attempts.filter(time => now - time < windowMs)
  
  // Check if limit exceeded
  if (tracker.attempts.length >= limit) {
    tracker.blockedUntil = now + windowMs
    return {
      allowed: false,
      message: `Too many attempts. Please try again after ${Math.ceil(windowMs / 1000)} seconds`,
    }
  }
  
  // Allow this attempt
  tracker.attempts.push(now)
  return { allowed: true }
}

/**
 * POST /api/auth/send-otp
 * Send OTP to email
 * Body: { email }
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body

    // Validate email
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      })
    }

    // Check rate limit
    const rateLimit = checkRateLimit(email, 'send-otp', 3, 60000)
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: rateLimit.message,
      })
    }

    // Generate OTP
    const otp = generateOTP()
    const hashedOTP = hashOTP(otp)
    const createdAt = new Date()
    const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000) // 5 minutes

    // Store OTP (in-memory for now, use database in production)
    otpStorage.set(email, {
      hashedOTP,
      createdAt,
      expiresAt,
      attempts: 0,
      verified: false,
    })

    // TODO: Send email via SMTP (see email.service.js)
    // For development, log to console
    console.log(`[OTP SENT] Email: ${email}, OTP: ${otp}, Expires: ${expiresAt.toISOString()}`)

    // In production, integrate with sendOTPEmail from email.service.js
    // await sendOTPEmail(email, otp, expiresAt)

    // Return success (don't expose OTP in response)
    res.json({
      success: true,
      message: 'OTP sent successfully',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email
      expiresIn: 300, // 5 minutes in seconds
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again later.',
    })
  }
})

/**
 * POST /api/auth/verify-otp
 * Verify OTP and generate JWT token
 * Body: { email, otp }
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body

    // Validate inputs
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      })
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format',
      })
    }

    // Check if OTP exists for this email
    const otpRecord = otpStorage.get(email)
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP.',
      })
    }

    // Check if OTP is expired
    const now = new Date()
    if (now > otpRecord.expiresAt) {
      otpStorage.delete(email)
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
      })
    }

    // Check attempt limit (max 5 attempts per OTP)
    if (otpRecord.attempts >= 5) {
      otpStorage.delete(email)
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP attempts exceeded. Please request a new OTP.',
      })
    }

    // Verify OTP
    const hashedInputOTP = hashOTP(otp)
    if (hashedInputOTP !== otpRecord.hashedOTP) {
      otpRecord.attempts += 1
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`,
      })
    }

    // OTP verified successfully
    otpRecord.verified = true

    // Generate JWT token
    const token = jwt.sign(
      {
        email,
        verifiedAt: new Date().toISOString(),
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      {
        expiresIn: '24h', // Token valid for 24 hours
      }
    )

    // Clean up OTP storage
    otpStorage.delete(email)

    // Return success with token and user data
    res.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        email,
        name: email.split('@')[0], // Extract name from email
        verifiedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again later.',
    })
  }
})

/**
 * POST /api/auth/logout
 * Logout user (optional - mainly for frontend cleanup)
 */
router.post('/logout', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
    })
  }
})

export default router;
