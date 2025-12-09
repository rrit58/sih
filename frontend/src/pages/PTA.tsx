import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { submitPTARegistration, validationUtils } from '../services/registrationService'
import type { PTAFormData } from '../types/registration'

export default function PTA() {
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    institutionName: '',
    email: '',
    contactPerson: '',
    phone: '',
    state: '',
    district: '',
    address: '',
    institutionType: '',
    about: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validation helpers
  const isValidEmail = (email: string) => {
    return validationUtils.isValidEmail(email)
  }

  const isValidPhone = (phone: string) => {
    return validationUtils.isValidPhone(phone)
  }

  // Validate individual field
  const validateField = (name: string, value: string) => {
    let error = ''

    if (!value.trim()) {
      error = `${name} is required`
    } else if (name === 'email' && !isValidEmail(value)) {
      error = 'Please provide a valid email address'
    } else if (name === 'phone' && !isValidPhone(value)) {
      error = 'Phone number must be 10 digits'
    } else if (name === 'password' && value.length < 6) {
      error = 'Password must be at least 6 characters'
    } else if (name === 'confirmPassword' && value !== formData.password) {
      error = 'Passwords do not match'
    }

    return error
  }

  // Handle form input changes with real-time validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Real-time validation
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))

    // Clear confirmPassword error when password changes
    if (name === 'password' && errors.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        const error = validateField(key, formData[key as keyof typeof formData])
        if (error) newErrors[key] = error
      }
    })

    // Additional validation for confirmPassword
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const response = await submitPTARegistration(formData)

      if (!response.success) {
        setErrors({ submit: response.error || response.message })
        setLoading(false)
        return
      }

      // Success
      setSuccessMessage(response.message || 'School registered successfully!')
      setFormData({
        institutionName: '',
        email: '',
        contactPerson: '',
        phone: '',
        state: '',
        district: '',
        address: '',
        institutionType: '',
        about: '',
        password: '',
        confirmPassword: ''
      })
      setErrors({})

      // Auto-hide success message
      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    } catch (error) {
      console.error('Submission error:', error)
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFormData({
      institutionName: '',
      email: '',
      contactPerson: '',
      phone: '',
      state: '',
      district: '',
      address: '',
      institutionType: '',
      about: '',
      password: '',
      confirmPassword: ''
    })
    setErrors({})
    setSuccessMessage('')
  }

  return (
    <div className="container-pad py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">School Registration Portal</h1>
          <p className="text-gray-600">Register your institution to join our network of educational partners</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg">
            <p className="text-green-800 font-medium">✓ {successMessage}</p>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-red-800 font-medium">✕ {errors.submit}</p>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Institution Information Section */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-25 rounded-lg p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span></span> Institution Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Institution Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Institution Name *</label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="e.g., ABC Senior Secondary School"
                    className={`w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 transition ${
                      errors.institutionName
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500/20 bg-white'
                    }`}
                  />
                  {errors.institutionName && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.institutionName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Official Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="school@example.edu"
                    className={`w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 transition ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500/20 bg-white'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Contact Person Name *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    className={`w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 transition ${
                      errors.contactPerson
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500/20 bg-white'
                    }`}
                  />
                  {errors.contactPerson && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.contactPerson}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className={`w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 transition ${
                      errors.phone
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500/20 bg-white'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.phone}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g., Karnataka"
                    className={`w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 transition ${
                      errors.state
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500/20 bg-white'
                    }`}
                  />
                  {errors.state && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.state}
                    </p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">District *</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g., Bangalore"
                    className={`w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 transition ${
                      errors.district
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500/20 bg-white'
                    }`}
                  />
                  {errors.district && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.district}
                    </p>
                  )}
                </div>

                {/* Institution Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Institution Type *</label>
                  <select
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    title="Select your institution type"
                    className={`w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 transition ${
                      errors.institutionType
                        ? 'border-red-300 focus:ring-red-200 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500/20 bg-white'
                    }`}
                  >
                    <option value="">Select Institution Type</option>
                    <option value="School">School</option>
                    <option value="College">College</option>
                    <option value="Coaching">Coaching</option>
                    <option value="Training Center">Training Center</option>
                  </select>
                  {errors.institutionType && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.institutionType}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-800 mb-2">Full Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete address of your institution"
                  rows={2}
                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 transition ${
                    errors.address
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500/20 bg-white'
                  }`}
                />
                {errors.address && (
                  <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <span>✕</span> {errors.address}
                  </p>
                )}
              </div>

              {/* About/Description */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-800 mb-2">About Your Institution *</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Describe your institution, its mission, and goals"
                  rows={3}
                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 transition ${
                    errors.about
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500/20 bg-white'
                  }`}
                />
                {errors.about && (
                  <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <span>✕</span> {errors.about}
                  </p>
                )}
              </div>
            </div>

            {/* Login Credentials Section */}
            <div className="bg-gradient-to-br from-green-50 to-green-25 rounded-lg p-6 border border-green-100">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span></span> Login Credentials
              </h2>

              <div className="space-y-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className={`w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 transition ${
                        errors.password
                          ? 'border-red-300 focus:ring-red-200 bg-red-50'
                          : 'border-gray-300 focus:ring-green-500/20 bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? 'hide' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className={`w-full h-10 rounded-md border px-3 focus:outline-none focus:ring-2 transition ${
                        errors.confirmPassword
                          ? 'border-red-300 focus:ring-red-200 bg-red-50'
                          : 'border-gray-300 focus:ring-green-500/20 bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? 'hide' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 h-10 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:opacity-95 disabled:opacity-70 transition"
              >
                {loading ? 'Registering...' : 'Register School'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-6 h-10 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
