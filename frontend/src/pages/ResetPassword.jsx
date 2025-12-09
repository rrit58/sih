import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otp, setOtp] = useState('')
  const [sentOtp, setSentOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [show, setShow] = useState(false)
  const timerRef = useRef(null)

  const isValidEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)

  const sendOtp = () => {
    setError('')
    setSuccess('')
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    // simulate OTP generation and send
    const generated = (Math.floor(100000 + Math.random() * 900000)).toString()
    setSentOtp(generated)
    setOtpSent(true)
    setVerified(false)
    // eslint-disable-next-line no-alert
    alert(`Simulated OTP sent to ${email}: ${generated}`)
    // optional: start a resend timer (60s)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {}, 60000)
  }

  const verifyOtp = (e) => {
    e && e.preventDefault()
    setError('')
    if (!otpSent) {
      setError('Please request an OTP first.')
      return
    }
    if (otp !== sentOtp) {
      setError('Invalid OTP. Please check and try again.')
      return
    }
    // For security you'd normally receive a backend token; here we pass a simulated token.
    // Navigate to a dedicated Set New Password page and pass email + token in state.
    navigate('/reset-password/new', { state: { email, token: sentOtp } })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!verified) {
      setError('Please verify your email with the OTP before saving the new password.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    // TODO: Integrate with backend to actually reset password using email & OTP token
    setSuccess('Your password has been updated. Redirecting to login...')
    setTimeout(() => navigate('/login'), 1400)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">Reset Password</h2>
        <p className="text-sm text-slate-600 mb-4 text-center">Enter your registered email to receive a verification code.</p>

        <div className="flex flex-col gap-3">
          <label className="text-sm text-slate-700">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={sendOtp}
              className="flex-1 px-4 py-2 bg-[#003B73] hover:bg-[#003366] text-white rounded-lg text-sm"
            >
              {otpSent ? 'Resend OTP' : 'Send OTP'}
            </button>
            <button type="button" onClick={() => { setEmail(''); setOtp(''); setOtpSent(false); setVerified(false); setError(''); setSuccess('') }} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">Clear</button>
          </div>

          {otpSent && (
            <form onSubmit={verifyOtp} className="flex flex-col gap-2">
              <label className="text-sm text-slate-700">Verification code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 tracking-widest text-center"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">Verify OTP</button>
                <button type="button" onClick={sendOtp} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">Resend</button>
              </div>
            </form>
          )}

          {/* After successful OTP verification we navigate to a separate Set New Password page. */}

          <div className="text-center mt-3">
            <button type="button" onClick={() => navigate('/login')} className="text-sm text-slate-600 hover:underline">Back to login</button>
          </div>
        </div>
      </div>
    </div>
  )
}
