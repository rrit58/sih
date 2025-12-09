/**
 * Unified Registration Type System
 * Supports three registration types: GRAM_PANCHAYAT, CSC_CENTER (NGO/PTA), WARD_MEMBER
 */

export type RegistrationType = 'GRAM_PANCHAYAT' | 'NGO' | 'SCHOOL_PTA' | 'WARD_MEMBER'

/**
 * Common registration payload structure
 * Maps frontend form fields to backend Registration model
 */
export interface RegistrationPayload {
  registrationType: RegistrationType
  // Gram Panchayat specific
  panchayatId?: string
  headName?: string
  wardNumber?: string
  // CSC Center (NGO/School) specific
  centerId?: string
  ownerName?: string
  serviceType?: string
  // Common fields
  phoneNumber: string
  district: string
  state: string
  address?: string
  // Optional fields
  email?: string
  password?: string
}

/**
 * Front-end form state interface (NGO)
 */
export interface NGOFormData {
  organizationName: string
  registrationNumber: string
  contactPersonName: string
  email: string
  phone: string
  state: string
  district: string
  address: string
  description: string
  password: string
  confirmPassword: string
}


/**
 * Front-end form state interface (Gram Panchayat)
 */
export interface GramPanchayatFormData {
  panchayatId: string
  gramPanchayatName: string
  headName: string
  phoneNumber: string
  district: string
  state: string
  wardNumber: string
  activityType: string
  email: string
  password: string
  confirmPassword: string
}

/**
 * Front-end form state interface (PTA/School)
 */
export interface PTAFormData {
  institutionName: string
  email: string
  contactPerson: string
  phone: string
  state: string
  district: string
  address: string
  institutionType: string
  about: string
  password: string
  confirmPassword: string
}

/**
 * Unified form errors
 */
export interface FormErrors {
  [key: string]: string
}

/**
 * Backend response structure
 */
export interface RegistrationResponse {
  success: boolean
  message: string
  data?: {
    _id?: string
    registrationType: RegistrationType
    createdAt?: string
  }
  error?: string
}

/**
 * Helper function to convert NGO form data to registration payload
 */
export function convertNGOToPayload(data: NGOFormData): RegistrationPayload {
  return {
    registrationType: 'NGO',
    centerId: data.registrationNumber || data.organizationName,
    ownerName: data.contactPersonName,
    phoneNumber: data.phone,
    district: data.district,
    state: data.state,
    address: data.address,
    serviceType: data.description,
    email: data.email,
    password: data.password
  }
}

/**
 * Helper function to convert Gram Panchayat form data to registration payload
 */
export function convertGramPanchayatToPayload(data: GramPanchayatFormData): RegistrationPayload {
  return {
    registrationType: 'GRAM_PANCHAYAT',
    panchayatId: data.panchayatId || data.gramPanchayatName,
    headName: data.headName || data.gramPanchayatName,
    phoneNumber: data.phoneNumber,
    district: data.district,
    state: data.state,
    wardNumber: data.wardNumber,
    address: data.activityType || data.gramPanchayatName,
    email: data.email,
    password: data.password
  }
}

/**
 * Helper function to convert PTA/School form data to registration payload
 */
export function convertPTAToPayload(data: PTAFormData): RegistrationPayload {
  return {
    registrationType: 'SCHOOL_PTA',
    centerId: data.institutionName,
    ownerName: data.contactPerson,
    phoneNumber: data.phone,
    district: data.district,
    state: data.state,
    address: data.address,
    serviceType: data.institutionType,
    email: data.email,
    password: data.password
  }
}
