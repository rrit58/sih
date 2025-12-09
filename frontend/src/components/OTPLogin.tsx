import React, { useState } from 'react'
import { isValidEmail } from '../utils/authUtils'
import styles from './OTPLogin.module.css'

interface OTPLoginProps {
  onEmailSubmit: (email: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export default function OTPLogin({ onEmailSubmit, isLoading, error }: OTPLoginProps) {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [isValid, setIsValid] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setIsValid(isValidEmail(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) {
      setTouched(true)
      return
    }
    await onEmailSubmit(email)
  }

  const handleBlur = () => {
    setTouched(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Email OTP Login</h1>
          <p className={styles.subtitle}>
            Enter your email to receive a 6-digit verification code
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              placeholder="name@example.com"
              className={`${styles.input} ${touched && !isValid ? styles.inputError : ''}`}
              disabled={isLoading}
            />
            {touched && !isValid && email && (
              <p className={styles.errorText}>Please enter a valid email address</p>
            )}
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                Sending OTP...
              </>
            ) : (
              'Send OTP'
            )}
          </button>

          <p className={styles.helpText}>
            We'll send a 6-digit code to your email. It will expire in 5 minutes.
          </p>
        </form>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✓</span>
            <span>Secure & encrypted</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✓</span>
            <span>No password needed</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>✓</span>
            <span>Quick verification</span>
          </div>
        </div>
      </div>
    </div>
  )
}
