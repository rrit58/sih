import { useState } from 'react'
import OTPLogin from './OTPLogin'
import OTPVerification from './OTPVerification'
import { saveAuthToken, saveUserInfo, generateOTP } from '../utils/authUtils'
import styles from './OTPAuthPage.module.css'

interface OTPAuthPageProps {
  onSuccess?: () => void
}

export default function OTPAuthPage({ onSuccess }: OTPAuthPageProps) {
  const [stage, setStage] = useState<'email' | 'verification'>('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otp, setOtp] = useState('')

  const handleEmailSubmit = async (submittedEmail: string) => {
    setLoading(true)
    setError('')

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(submittedEmail)) {
        throw new Error('Invalid email format')
      }

      // Call backend to send OTP
      const response = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: submittedEmail }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to send OTP')
      }

      // Store email locally for verification stage
      setEmail(submittedEmail)
      // Move to verification stage
      setStage('verification')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.')
      console.error('Email submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (submittedOTP: string) => {
    setLoading(true)
    setError('')

    try {
      // Validate OTP format
      if (!/^\d{6}$/.test(submittedOTP)) {
        throw new Error('Invalid OTP format')
      }

      // Call backend to verify OTP
      const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: submittedOTP,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Invalid OTP')
      }

      const data = await response.json()

      // Save JWT token and user info
      if (data.token) {
        saveAuthToken(data.token)
      }

      if (data.user) {
        saveUserInfo(data.user)
      }

      setOtp(submittedOTP)

      // Show success message and redirect
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          // Default redirect to dashboard
          window.location.href = '/dashboard'
        }
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP. Please try again.')
      console.error('OTP verification error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to resend OTP')
      }

      setError('') // Clear previous error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP. Please try again.')
      console.error('Resend OTP error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeEmail = () => {
    setStage('email')
    setEmail('')
    setError('')
  }

  if (stage === 'email') {
    return (
      <OTPLogin
        onEmailSubmit={handleEmailSubmit}
        isLoading={loading}
        error={error}
      />
    )
  }

  return (
    <OTPVerification
      email={email}
      onOTPSubmit={handleOTPSubmit}
      onResendOTP={handleResendOTP}
      onChangeEmail={handleChangeEmail}
      isLoading={loading}
      error={error}
    />
  )
}
