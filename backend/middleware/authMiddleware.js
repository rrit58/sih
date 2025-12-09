const jwt = require('jsonwebtoken')

/**
 * Middleware to verify JWT token
 * Usage: app.get('/protected-route', verifyJWT, (req, res) => { ... })
 */
const verifyJWT = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      })
    }

    const token = authHeader.slice(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    )

    // Attach user data to request
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      })
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Token verification failed',
    })
  }
}

module.exports = {
  verifyJWT,
}
