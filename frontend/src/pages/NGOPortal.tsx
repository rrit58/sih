import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { submitNGORegistration, validationUtils } from '../services/registrationService'
import type { NGOFormData } from '../types/registration'

export default function NGOPortal() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    organizationName: '',
    registrationNumber: '',
    contactPersonName: '',
    email: '',
    phone: '',
    state: '',
    district: '',
    address: '',
    description: '',
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

  // Phone validation
  const isValidPhone = (phone: string) => {
    return validationUtils.isValidPhone(phone)
  }

  // Real-time field validation
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'organizationName':
        if (!value.trim()) {
          newErrors.organizationName = 'Organization name is required'
        } else {
          delete newErrors.organizationName
        }
        break
      case 'registrationNumber':
        if (!value.trim()) {
          newErrors.registrationNumber = 'Registration number is required'
        } else {
          delete newErrors.registrationNumber
        }
        break
      case 'contactPersonName':
        if (!value.trim()) {
          newErrors.contactPersonName = 'Contact person name is required'
        } else {
          delete newErrors.contactPersonName
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
      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required'
        } else if (!isValidPhone(value)) {
          newErrors.phone = 'Please enter a valid 10-digit phone number'
        } else {
          delete newErrors.phone
        }
        break
      case 'state':
        if (!value.trim()) {
          newErrors.state = 'State is required'
        } else {
          delete newErrors.state
        }
        break
      case 'district':
        if (!value.trim()) {
          newErrors.district = 'District is required'
        } else {
          delete newErrors.district
        }
        break
      case 'address':
        if (!value.trim()) {
          newErrors.address = 'Address is required'
        } else {
          delete newErrors.address
        }
        break
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Organization description is required'
        } else {
          delete newErrors.description
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    validateField(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')

    // Final validation
    const newErrors: Record<string, string> = {}

    if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization name is required'
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required'
    if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Contact person name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.district.trim()) newErrors.district = 'District is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (formData.email && !isValidEmail(formData.email)) newErrors.email = 'Please enter a valid email'
    if (formData.phone && !isValidPhone(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit phone number'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const response = await submitNGORegistration(formData)

      if (!response.success) {
        setErrors({ submit: response.error || response.message })
        setLoading(false)
        return
      }

      // Success
      setSuccessMessage('✓ NGO registration successful! Your account has been created. You can now login.')
      setFormData({
        organizationName: '',
        registrationNumber: '',
        contactPersonName: '',
        email: '',
        phone: '',
        state: '',
        district: '',
        address: '',
        description: '',
        password: '',
        confirmPassword: ''
      })
      setErrors({})

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err) {
      setErrors({ submit: 'Unable to connect to server. Please try again later.' })
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white">
      <div className="container-pad py-8">
        <h1 className="text-xl font-semibold">NGO & Volunteer Portal</h1>
        <p className="text-sm text-gray-600 mt-1">Register and verify NGOs and local volunteer groups for DBT awareness campaigns</p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-blue-50 text-blue-800 p-3 text-sm">
          All NGOs and volunteer groups must be verified before participating in awareness programs. Fake or unverified groups will not be allowed.
        </div>

        {/* Tabs (static) */}
        <div className="mt-4 flex gap-2 text-sm">
          <button className="px-3 py-1.5 rounded-md bg-brand text-white">Register</button>
          <button className="px-3 py-1.5 rounded-md border border-slate-300">Verified NGOs</button>
          <button className="px-3 py-1.5 rounded-md border border-slate-300">Benefits</button>
        </div>

        {/* Registration Form */}
        <div className="mt-6 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Information Section */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-25 rounded-lg p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span></span> Organization Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Organization Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Organization Name *</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="e.g., XYZ NGO Foundation"
                    className={`w-full rounded-md border px-4 py-2.5 text-slate-900 bg-white transition-all ${
                      errors.organizationName
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                    } focus:outline-none`}
                  />
                  {errors.organizationName && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.organizationName}
                    </p>
                  )}
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Registration Number *</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g., NGO/2024/12345"
                    className={`w-full rounded-md border px-4 py-2.5 text-slate-900 bg-white transition-all ${
                      errors.registrationNumber
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                    } focus:outline-none`}
                  />
                  {errors.registrationNumber && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.registrationNumber}
                    </p>
                  )}
                </div>

                {/* Contact Person Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Contact Person Name *</label>
                  <input
                    type="text"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    className={`w-full rounded-md border px-4 py-2.5 text-slate-900 bg-white transition-all ${
                      errors.contactPersonName
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                    } focus:outline-none`}
                  />
                  {errors.contactPersonName && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.contactPersonName}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className={`w-full rounded-md border px-4 py-2.5 text-slate-900 bg-white transition-all ${
                      errors.phone
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                    } focus:outline-none`}
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
                    placeholder="e.g., Bihar"
                    className={`w-full rounded-md border px-4 py-2.5 text-slate-900 bg-white transition-all ${
                      errors.state
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                    } focus:outline-none`}
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
                    placeholder="e.g., Patna"
                    className={`w-full rounded-md border px-4 py-2.5 text-slate-900 bg-white transition-all ${
                      errors.district
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                    } focus:outline-none`}
                  />
                  {errors.district && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.district}
                    </p>
                  )}
                </div>
              </div>

              {/* Full Address */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-800 mb-2">Full Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete office address"
                  rows={2}
                  className={`w-full rounded-md border px-4 py-2.5 text-slate-900 bg-white transition-all ${
                    errors.address
                      ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                  } focus:outline-none`}
                />
                {errors.address && (
                  <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <span>✕</span> {errors.address}
                  </p>
                )}
              </div>

              {/* Organization Description */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-800 mb-2">Organization Description & Goals *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your organization's mission and DBT awareness activities..."
                  rows={3}
                  className={`w-full rounded-md border px-4 py-2.5 text-slate-900 bg-white transition-all ${
                    errors.description
                      ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200'
                  } focus:outline-none`}
                />
                {errors.description && (
                  <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <span>✕</span> {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Account Information Section */}
            <div className="bg-gradient-to-br from-green-50 to-green-25 rounded-lg p-6 border border-green-100">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span></span> Account Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ngo@example.com"
                    className={`w-full rounded-md border px-4 py-2.5 text-slate-900 bg-white transition-all ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                        : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-200'
                    } focus:outline-none`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <span>✕</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      className={`w-full rounded-md border px-4 py-2.5 pr-10 text-slate-900 bg-white transition-all ${
                        errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                          : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-200'
                      } focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? 'Hide' : '👁️‍🗨️'}
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
                      className={`w-full rounded-md border px-4 py-2.5 pr-10 text-slate-900 bg-white transition-all ${
                        errors.confirmPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                          : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-200'
                      } focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showConfirmPassword ? 'Hide' : '👁️‍🗨️'}
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

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-md text-sm font-medium">
                {errors.submit}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-md text-sm font-medium">
                {successMessage}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-md font-semibold text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                }`}
              >
                {loading ? 'Registering...' : 'Register NGO'}
              </button>
              <button
                type="reset"
                className="flex-1 px-6 py-3 rounded-md font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all"
                onClick={() => {
                  setFormData({
                    organizationName: '',
                    registrationNumber: '',
                    contactPersonName: '',
                    email: '',
                    phone: '',
                    state: '',
                    district: '',
                    address: '',
                    description: '',
                    password: '',
                    confirmPassword: ''
                  })
                  setErrors({})
                }}
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
