// controllers/registrationController.js
import Registration from '../models/Registration.js';
import bcrypt from 'bcryptjs';

// Utility to normalize various registrationType/userType inputs
function normalizeType(val) {
  if (!val) return null;
  const v = String(val).trim().toUpperCase();
  if (v === 'SCHOOL') return 'SCHOOL_PTA';
  if (v === 'SCHOOL_PTA') return 'SCHOOL_PTA';
  if (v === 'NGO') return 'NGO';
  if (v === 'GRAM_PANCHAYAT') return 'GRAM_PANCHAYAT';
  if (v === 'CSC_CENTER') return 'CSC_CENTER';
  if (v === 'WARD_MEMBER') return 'WARD_MEMBER';
  return v;
}

export async function registerUser(req, res) {
  console.log('📥 [registerUser] Request received');
  console.log('📥 [registerUser] Headers:', req.headers);
  console.log('📥 [registerUser] Body:', req.body);

  try {
    const payload = req.body || {};

    // Validate required fields
    if (!payload.email) {
      console.log('❌ [registerUser] Missing email');
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!payload.password) {
      console.log('❌ [registerUser] Missing password');
      return res.status(400).json({ error: 'Password is required' });
    }

    // Check if user already exists
    const existingUser = await Registration.findOne({ email: payload.email });
    if (existingUser) {
      console.log('❌ [registerUser] Email already registered:', payload.email);
      return res.status(409).json({ error: 'Email already registered' });
    }

    console.log('✅ [registerUser] Saving user:', payload.email);

    // Determine registrationType robustly. Normalize common aliases.
    const normalizeType = (val) => {
      if (!val) return null;
      const v = String(val).trim().toUpperCase();
      if (v === 'SCHOOL') return 'SCHOOL_PTA';
      if (v === 'SCHOOL_PTA') return 'SCHOOL_PTA';
      if (v === 'NGO') return 'NGO';
      if (v === 'GRAM_PANCHAYAT') return 'GRAM_PANCHAYAT';
      if (v === 'CSC_CENTER') return 'CSC_CENTER';
      if (v === 'WARD_MEMBER') return 'WARD_MEMBER';
      return v;
    };

    let regType = normalizeType(payload.registrationType || payload.userType || null);

    // If still missing or legacy 'CSC_CENTER', infer from presence of page-specific fields
    if (!regType || regType === 'CSC_CENTER') {
      if (payload.organizationName || payload.registrationNumber || payload.contactPersonName || payload.ownerName || payload.serviceType) {
        regType = 'NGO';
      } else if (payload.institutionName || payload.institutionType || payload.schoolContactPerson || payload.schoolPhoneNumber) {
        regType = 'SCHOOL_PTA';
      } else if (payload.panchayatId || payload.gramPanchayatName || payload.headName || payload.wardNumber) {
        regType = 'GRAM_PANCHAYAT';
      }
    }

    // Create new user document
    // Password will be automatically hashed by the pre-save hook
    const user = new Registration({
      email: payload.email,
      password: payload.password,
      registrationType: regType,
      
      // NGO / CSC_CENTER fields
      organizationName: payload.organizationName || null,
      registrationNumber: payload.registrationNumber || null,
      contactPersonName: payload.contactPersonName || null,
      centerId: payload.centerId || null,
      ownerName: payload.ownerName || null,
      serviceType: payload.serviceType || null,
      
      // Gram Panchayat fields
      panchayatId: payload.panchayatId || null,
      headName: payload.headName || null,
      gramPanchayatName: payload.gramPanchayatName || null,
      wardNumber: payload.wardNumber || null,
      
      // School / Institution fields
      institutionName: payload.institutionName || null,
      institutionType: payload.institutionType || null,
      
      // Common fields
      phoneNumber: payload.phoneNumber || null,
      phone: payload.phone || null,
      district: payload.district || null,
      state: payload.state || null,
      address: payload.address || null,
      description: payload.description || null,
      about: payload.about || null,
    });

    // Save to MongoDB
    // The pre-save hook will automatically hash the password
    const saved = await user.save();

    console.log('✅ [registerUser] User saved successfully:', saved._id);

    // Return success response (don't send password back)
    return res.status(201).json({
      message: 'Registration successful',
      data: {
        _id: saved._id,
        email: saved.email,
        registrationType: saved.registrationType,
        createdAt: saved.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ [registerUser] Error caught:', error.name, error.message);

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.log('❌ [registerUser] Validation error:', messages);
      return res.status(400).json({ error: messages[0] || 'Validation error' });
    }

    // Duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      console.log('❌ [registerUser] Duplicate key error:', field);
      return res.status(409).json({ error: `${field} already exists` });
    }

    // Other errors
    console.error('❌ [registerUser] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// -------------------------------------------------------------
// LOGIN: Validate userType + email + password using same schema
// -------------------------------------------------------------
export async function loginUser(req, res) {
  console.log('📥 [loginUser] Request received');
  console.log('📥 [loginUser] Body:', req.body);

  try {
    const payload = req.body || {};

    const userType = payload.userType || payload.registrationType;
    const email = payload.email;
    const password = payload.password;

    if (!userType) {
      return res.status(400).json({ error: 'userType is required' });
    }
    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'password is required' });
    }

    // Normalize incoming userType and find by email
    const requestedType = normalizeType(userType);

    // Need to select password explicitly because schema sets select: false
    const user = await Registration.findOne({ email: email }).select('+password');

    if (!user) {
      console.log('❌ [loginUser] User not found for', email);
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Check password first
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ [loginUser] Password mismatch for', email);
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Now verify that the requested category matches stored registrationType
    const storedType = normalizeType(user.registrationType);
    if (!requestedType || requestedType !== storedType) {
      console.log('❌ [loginUser] Category mismatch:', 'requested=', requestedType, 'stored=', storedType);
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Successful login
    console.log('✅ [loginUser] Login successful for', email);
    return res.status(200).json({
      message: 'Login successful',
      data: {
        _id: user._id,
        email: user.email,
        registrationType: user.registrationType,
        name: user.name || user.contactPersonName || user.ownerName || user.memberName || null,
      },
    });
  } catch (error) {
    console.error('❌ [loginUser] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
