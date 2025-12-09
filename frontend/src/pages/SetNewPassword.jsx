import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function SetNewPassword() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    // If user arrives here without verification state, send them back
    if (!state || !state.email || !state.token) {
      navigate('/reset-password')
    }
  }, [state, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    // TODO: send password + email + token to backend to complete reset
    setSuccess('Password updated successfully. Redirecting to login...')
    setTimeout(() => navigate('/login'), 1400)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">Create New Password</h2>
        <p className="text-sm text-slate-600 mb-4 text-center">Set a new password for <strong>{state?.email}</strong></p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-700">New Password</label>
            <div className="relative mt-1">
              <input
                type={show ? 'text' : 'password'}
                placeholder="Enter new password"
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShow(s => !s)} className="absolute right-2 top-2 text-sm text-slate-500">{show ? 'Hide' : 'Show'}</button>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-700">Confirm Password</label>
            <input
              type={show ? 'text' : 'password'}
              placeholder="Confirm password"
              className="w-full border border-slate-200 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}

          <button className="mt-2 px-6 py-2 bg-[#003B73] hover:bg-[#003366] text-white rounded-lg font-medium transition-colors">Save Password</button>

          <div className="text-center mt-3">
            <button type="button" onClick={() => navigate('/reset-password')} className="text-sm text-slate-600 hover:underline">Back</button>
          </div>
        </form>
      </div>
    </div>
  )
}
