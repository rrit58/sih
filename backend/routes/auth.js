const express = require('express')
const router = express.Router()
const User = require('../models/Registration')
const jwt = require('jsonwebtoken')
const verifyJWT = require('../middleware/auth')

// Validation helper
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isValidPassword = (password) => password.length >= 6

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, email, password, confirmPassword } = req.body

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }

    // Create new user (password will be hashed by schema pre-save hook)
    const user = new User({
      name,
      mobile: mobile || '',
      email: email.toLowerCase(),
      password,
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    })
  } catch (err) {
    console.error('Registration error:', err)
    return res.status(500).json({ success: false, message: 'Registration failed' })
  }
})

/**
 * POST /api/auth/login
 * Login user with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email not found. Please register first.' })
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ success: false, message: 'Login failed' })
  }
})

/**
 * GET /api/auth/me
 * Get current user (protected route)
 */
router.get('/me', verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    return res.json({ success: true, user: user.toJSON() })
  } catch (err) {
    console.error('Get user error:', err)
    return res.status(500).json({ success: false, message: 'Failed to fetch user' })
  }
})

module.exports = router
