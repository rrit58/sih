import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { submitGramPanchayatRegistration, validationUtils } from '../services/registrationService'
import type { GramPanchayatFormData } from '../types/registration'

export default function GramPanchayat() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    panchayatId: '',
    gramPanchayatName: '',
    headName: '',
    phoneNumber: '',
    district: '',
    state: '',
    wardNumber: '',
    activityType: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Email validation
  const isValidEmail = (email: string) => {
    return validationUtils.isValidEmail(email)
  }

  // Real-time field validation
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'panchayatId':
        if (!value.trim()) {
          newErrors.panchayatId = 'Panchayat ID is required'
        } else {
          delete newErrors.panchayatId
        }
        break
      case 'headName':
        if (!value.trim()) {
          newErrors.headName = 'Head name is required'
        } else {
          delete newErrors.headName
        }
        break
      case 'phoneNumber':
        if (!value.trim()) {
          newErrors.phoneNumber = 'Phone number is required'
        } else if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ''))) {
          newErrors.phoneNumber = 'Please enter a valid 10-digit phone number'
        } else {
          delete newErrors.phoneNumber
        }
        break
      case 'wardNumber':
        if (!value.trim()) {
          newErrors.wardNumber = 'Ward number is required'
        } else {
          delete newErrors.wardNumber
        }
        break
      case 'gramPanchayatName':
        if (!value.trim()) {
          newErrors.gramPanchayatName = 'Gram Panchayat name is required'
        } else {
          delete newErrors.gramPanchayatName
        }
        break
      case 'district':
        if (!value.trim()) {
          newErrors.district = 'District is required'
        } else {
          delete newErrors.district
        }
        break
      case 'state':
        if (!value.trim()) {
          newErrors.state = 'State is required'
        } else {
          delete newErrors.state
        }
        break
      case 'activityType':
        if (!value.trim()) {
          newErrors.activityType = 'Activity type is required'
        } else {
          delete newErrors.activityType
        }
        break
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required'
        } else if (!isValidEmail(value)) {
          newErrors.email = 'Please enter a valid email address'
        } else {
          delete newErrors.email
        }
        break
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required'
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters'
        } else {
          delete newErrors.password
        }
        // Check confirm password if it exists
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        } else if (formData.confirmPassword && value === formData.confirmPassword) {
          delete newErrors.confirmPassword
        }
        break
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password'
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match'
        } else {
          delete newErrors.confirmPassword
        }
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    validateField(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')

    // Final validation
    const newErrors: Record<string, string> = {}

    if (!formData.gramPanchayatName.trim()) newErrors.gramPanchayatName = 'Gram Panchayat name is required'
    if (!formData.district.trim()) newErrors.district = 'District is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.activityType.trim()) newErrors.activityType = 'Activity type is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (formData.email && !isValidEmail(formData.email)) newErrors.email = 'Please enter a valid email'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const response = await submitGramPanchayatRegistration(formData)

      if (!response.success) {
        setErrors({ submit: response.error || response.message })
        setLoading(false)
        return
      }

      // Success
      setSuccessMessage('✓ Registration successful! Your account has been created.')
      setFormData({
        panchayatId: '',
        gramPanchayatName: '',
        headName: '',
        phoneNumber: '',
        district: '',
        state: '',
        wardNumber: '',
        activityType: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      setErrors({})

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setErrors({ submit: 'Unable to connect to server. Please try again later.' })
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#003B73] rounded-full mix-blend-multiply filter blur-3xl opacity-5" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-[#003B73]/10 border border-[#003B73]/30 rounded-full">
            <span className="text-sm font-semibold text-[#003B73]">📋 Gram Panchayat Registration</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 leading-tight">
            Join the <span className="bg-gradient-to-r from-[#003B73] to-[#0052A3] bg-clip-text text-transparent">Community</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Create your Gram Panchayat account to manage activities and engage with the community</p>
        </div>

        {/* Main Form Container */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Card - Left Side (2/3) */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-1 opacity-75" />
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Section 1: Panchayat Information */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded" />
                      <h2 className="text-2xl font-bold text-white">Panchayat Information</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Panchayat ID */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-slate-300 mb-2">Panchayat ID *</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="panchayatId"
                              value={formData.panchayatId}
                              onChange={handleChange}
                              placeholder="e.g., PN-12345"
                              className={`w-full rounded-lg border-2 px-4 py-3 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                                errors.panchayatId
                                  ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                                  : 'border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                              } focus:outline-none`}
                            />
                            {errors.panchayatId && (
                              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                <span></span> {errors.panchayatId}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Head Name */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-slate-300 mb-2">Head Name *</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="headName"
                              value={formData.headName}
                              onChange={handleChange}
                              placeholder="e.g., Sarpanch Name"
                              className={`w-full rounded-lg border-2 px-4 py-3 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                                errors.headName
                                  ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                                  : 'border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                              } focus:outline-none`}
                            />
                            {errors.headName && (
                              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                <span></span> {errors.headName}
                              </p>
                            )}
                          </div>
                        </div>
                      {/* Gram Panchayat Name */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Gram Panchayat Name *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="gramPanchayatName"
                            value={formData.gramPanchayatName}
                            onChange={handleChange}
                            placeholder="e.g., Rajpur Gram Panchayat"
                            className={`w-full rounded-lg border-2 px-4 py-3 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                              errors.gramPanchayatName
                                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                                : 'border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                            } focus:outline-none`}
                          />
                          {errors.gramPanchayatName && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                              <span></span> {errors.gramPanchayatName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* District */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">District *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            placeholder="e.g., Patna"
                            className={`w-full rounded-lg border-2 px-4 py-3 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                              errors.district
                                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                                : 'border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                            } focus:outline-none`}
                          />
                          {errors.district && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                              <span>⚠️</span> {errors.district}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 mt-6">
                      {/* State */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">State *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="e.g., Bihar"
                            className={`w-full rounded-lg border-2 px-4 py-3 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                              errors.state
                                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                                : 'border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                            } focus:outline-none`}
                          />
                          {errors.state && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                              <span>⚠️</span> {errors.state}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Ward Number */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Ward Number *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="wardNumber"
                            value={formData.wardNumber}
                            onChange={handleChange}
                            placeholder="e.g., 12"
                            className={`w-full rounded-lg border-2 px-4 py-3 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                              errors.wardNumber
                                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                                : 'border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                            } focus:outline-none`}
                          />
                          {errors.wardNumber && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                              <span>⚠️</span> {errors.wardNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Activity Type */}
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Activity Type *</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="activityType"
                            value={formData.activityType}
                            onChange={handleChange}
                            placeholder="e.g., Awareness Campaign"
                            className={`w-full rounded-lg border-2 px-4 py-3 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                              errors.activityType
                                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                                : 'border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                            } focus:outline-none`}
                          />
                          {errors.activityType && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                              <span>⚠️</span> {errors.activityType}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-slate-700 via-blue-500/50 to-slate-700" />

                  {/* Section 2: Account Credentials */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded" />
                      <h2 className="text-2xl font-bold text-white">Account Credentials</h2>
                    </div>

                    {/* Phone Number */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number *</label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="10-digit number"
                          className={`w-full rounded-lg border-2 px-4 py-3 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                            errors.phoneNumber
                              ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                              : 'border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30'
                          } focus:outline-none`}
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                            <span>⚠️</span> {errors.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center text-slate-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className={`w-full rounded-lg border-2 px-4 py-3 pl-12 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                            errors.email
                              ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                              : 'border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30'
                          } focus:outline-none`}
                        />
                        {errors.email && (
                          <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                            <span>⚠️</span> {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Password */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Password *</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min. 6 characters"
                            className={`w-full rounded-lg border-2 px-4 py-3 pl-12 pr-12 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                              errors.password
                                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                                : 'border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30'
                            } focus:outline-none`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                          >
                            {showPassword ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.604-3.778A9.98 9.98 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.079 10.079 0 01-9.543 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                          {errors.password && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                              <span></span> {errors.password}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm Password *</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            className={`w-full rounded-lg border-2 px-4 py-3 pl-12 pr-12 text-white bg-slate-800/50 placeholder-slate-500 transition-all duration-300 ${
                              errors.confirmPassword
                                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                                : 'border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30'
                            } focus:outline-none`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.604-3.778A9.98 9.98 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.079 10.079 0 01-9.543 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                          {errors.confirmPassword && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                              <span>⚠️</span> {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error/Success Messages */}
                  {errors.submit && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-lg flex items-start gap-3 animate-pulse">
                      <span className="text-xl mt-0.5">❌</span>
                      <p>{errors.submit}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-6 py-4 rounded-lg flex items-start gap-3 animate-pulse">
                      <span className="text-xl mt-0.5">{successMessage.split(' ')[0]}</span>
                      <p>{successMessage}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group ${
                      loading
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#003B73] to-[#0052A3] hover:from-[#003366] hover:to-[#004B95] active:scale-95 shadow-lg hover:shadow-xl hover:shadow-[#003B73]/50'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${!loading ? 'group-hover:opacity-20' : ''}`} />
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6" />
                        </svg>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Info Cards - Right Side (1/3) */}
          <div className="space-y-6">
            {/* Requirements Card */}
            <div className="bg-[#003B73]/5 backdrop-blur-xl border border-[#003B73]/20 rounded-xl p-6 hover:border-[#003B73]/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#003B73]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#003B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#003B73]">Requirements</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-[#003B73] font-bold mt-0.5">✓</span>
                  <span>Valid email address</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-[#003B73] font-bold mt-0.5">✓</span>
                  <span>Strong password (6+ chars)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-[#003B73] font-bold mt-0.5">✓</span>
                  <span>Matching passwords</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-[#003B73] font-bold mt-0.5">✓</span>
                  <span>All fields required</span>
                </li>
              </ul>
            </div>

            {/* Benefits Card */}
            <div className="bg-[#0052A3]/5 backdrop-blur-xl border border-[#0052A3]/20 rounded-xl p-6 hover:border-[#0052A3]/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0052A3]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0052A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#0052A3]">Benefits</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-[#0052A3] font-bold mt-0.5">→</span>
                  <span>Manage activities efficiently</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-[#0052A3] font-bold mt-0.5">→</span>
                  <span>Track community engagement</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-[#0052A3] font-bold mt-0.5">→</span>
                  <span>Build transparency</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-[#0052A3] font-bold mt-0.5">→</span>
                  <span>Gain recognition</span>
                </li>
              </ul>
            </div>

            {/* Security Card */}
            <div className="bg-emerald-50 backdrop-blur-xl border border-emerald-200 rounded-xl p-6 hover:border-emerald-300 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-emerald-900">Secure & Safe</h3>
              </div>
              <p className="text-sm text-slate-700 mb-3">Your data is encrypted and protected with:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="text-emerald-600"></span>
                  <span>Bcrypt password encryption</span>
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="text-emerald-600"></span>
                  <span>MongoDB secure storage</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-700/50">
          <p className="text-slate-400 text-sm">
            By registering, you agree to our <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}