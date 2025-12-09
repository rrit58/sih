/**
 * OTP Authentication Utilities
 * Handles JWT tokens, session storage, and OTP validation
 */

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Generate a 6-digit random OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Hash OTP for secure storage
 * Simple SHA256 hash (in production, use bcrypt)
 */
export async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(otp)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify OTP against hash
 */
export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  const otpHash = await hashOTP(otp)
  return otpHash === hash
}

/**
 * Check if OTP has expired (5 minutes default)
 */
export function isOTPExpired(createdAt: Date, expiryMinutes: number = 5): boolean {
  const now = new Date()
  const diffMs = now.getTime() - createdAt.getTime()
  const diffMinutes = diffMs / (1000 * 60)
  return diffMinutes > expiryMinutes
}

/**
 * Save auth token to localStorage
 */
export function saveAuthToken(token: string): void {
  localStorage.setItem('auth_token', token)
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
  localStorage.removeItem('auth_token')
}

/**
 * Save user info to localStorage
 */
export function saveUserInfo(user: { email: string; id?: string }): void {
  localStorage.setItem('user_info', JSON.stringify(user))
}

/**
 * Get user info from localStorage
 */
export function getUserInfo(): { email: string; id?: string } | null {
  const data = localStorage.getItem('user_info')
  return data ? JSON.parse(data) : null
}

/**
 * Remove user info from localStorage
 */
export function removeUserInfo(): void {
  localStorage.removeItem('user_info')
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Clear all auth data (logout)
 */
export function clearAllAuthData(): void {
  removeAuthToken()
  removeUserInfo()
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}
