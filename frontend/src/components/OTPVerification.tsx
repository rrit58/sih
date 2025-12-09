import React, { useState, useEffect } from 'react'
import styles from './OTPVerification.module.css'

interface OTPVerificationProps {
  email: string
  onOTPSubmit: (otp: string) => Promise<void> | void
  onResendOTP: () => Promise<void> | void
  onChangeEmail?: () => void
  isLoading?: boolean
  error?: string | null
}

export default function OTPVerification({
  email,
  onOTPSubmit,
  onResendOTP,
  onChangeEmail,
  isLoading,
  error,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`)
      nextInput?.focus()
    }

    setOtp(newOtp)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) return

    await onOTPSubmit(otpCode)
  }

  const handleResend = async () => {
    if (!canResend || isResending) return
    setIsResending(true)
    try {
      await onResendOTP()
      setTimeLeft(300)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const otpFilled = otp.every(digit => digit !== '')

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Verify Your Email</h1>
          <p className={styles.subtitle}>
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.otpInputGroup}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOTPChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className={styles.otpInput}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.timerBox}>
            <p className={styles.timerText}>
              Code expires in: <span className={styles.timer}>{formatTime(timeLeft)}</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={!otpFilled || isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isResending}
            className={styles.resendBtn}
          >
            {isResending ? 'Resending...' : "Didn't receive the code? Resend"}
          </button>

          {onChangeEmail && (
            <button
              type="button"
              onClick={onChangeEmail}
              disabled={isLoading}
              className={styles.changeEmailBtn}
            >
              Change Email Address
            </button>
          )}
        </form>

        <div className={styles.notes}>
          <p>
            <strong>Note:</strong> Check your spam folder if you don't see the email.
          </p>
        </div>
      </div>
    </div>
  )
}
