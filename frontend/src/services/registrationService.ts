import {
  RegistrationPayload,
  RegistrationResponse,
  NGOFormData,
  GramPanchayatFormData,
  PTAFormData,
  convertNGOToPayload,
  convertGramPanchayatToPayload,
  convertPTAToPayload
} from '../types/registration'

/**
 * Registration Service
 * Centralized API communication for all registration types
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Submits a registration payload to the backend
 * @param payload - RegistrationPayload object
 * @returns Promise with RegistrationResponse
 */
export async function submitRegistration(payload: RegistrationPayload): Promise<RegistrationResponse> {
  try {
    const url = `${API_BASE_URL}/api/register`
    console.debug('[registrationService] POST', url, payload)

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    let data: any = null
    try {
      data = await response.json()
    } catch (jsonErr) {
      console.warn('[registrationService] Response JSON parse failed', jsonErr)
    }

    console.debug('[registrationService] response', response.status, data)

    if (!response.ok) {
      return {
        success: false,
        message: data.message || data.error || 'Registration failed',
        error: data.error || data.message || 'Unknown error'
      }
    }

    return {
      success: true,
      message: data.message || 'Registration successful',
      data: data.data
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error'
    return {
      success: false,
      message: `Unable to connect to server: ${errorMessage}`,
      error: errorMessage
    }
  }
}

/**
 * NGO Registration Handler
 */
export async function submitNGORegistration(formData: NGOFormData): Promise<RegistrationResponse> {
  const payload = convertNGOToPayload(formData)
  return submitRegistration(payload)
}

/**
 * Gram Panchayat Registration Handler
 */
export async function submitGramPanchayatRegistration(formData: GramPanchayatFormData): Promise<RegistrationResponse> {
  const payload = convertGramPanchayatToPayload(formData)
  return submitRegistration(payload)
}

/**
 * PTA/School Registration Handler
 */
export async function submitPTARegistration(formData: PTAFormData): Promise<RegistrationResponse> {
  const payload = convertPTAToPayload(formData)
  return submitRegistration(payload)
}

/**
 * Validation utilities
 */

export const validationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  },

  isValidPassword: (password: string): boolean => {
    return password.length >= 6
  },

  passwordsMatch: (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword
  }
}
