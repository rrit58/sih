// models/Registration.js
// This is the Login/User schema that stores all registration data
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const registrationSchema = new Schema(
  {
    // Registration type for categorizing users
    registrationType: {
      type: String,
      // Expanded enum to include NGO and SCHOOL_PTA so backend can store
      // values coming from different registration pages.
      enum: ['GRAM_PANCHAYAT', 'WARD_MEMBER', 'CSC_CENTER', 'NGO', 'SCHOOL_PTA'],
      trim: true,
    },

    // ===== LOGIN FIELDS (REQUIRED) =====
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },

    // ===== GRAM_PANCHAYAT FIELDS =====
    panchayatId: { type: String, trim: true },
    headName: { type: String, trim: true },
    gramPanchayatName: { type: String, trim: true },
    wardNumber: { type: String, trim: true },

    // ===== WARD_MEMBER FIELDS =====
    NGOId: { type: String, trim: true },
    memberName: { type: String, trim: true },

    // ===== CSC_CENTER / NGO / SCHOOL FIELDS =====
    SchoolId: { type: String, trim: true },
    ownerName: { type: String, trim: true },
    contactPersonName: { type: String, trim: true },
    organizationName: { type: String, trim: true },
    institutionName: { type: String, trim: true },
    registrationNumber: { type: String, trim: true },
    serviceType: { type: String, trim: true },
    institutionType: { type: String, trim: true },

    // ===== COMMON FIELDS =====
    phoneNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow optional
          return /^\d{10}$/.test(v.replace(/\D/g, ''));
        },
        message: 'Phone number must be 10 digits',
      },
    },

    // Generic display name for the user (ownerName/memberName/institution contact)
    name: { type: String, trim: true },

    district: { type: String, trim: true },
    state: { type: String, trim: true },
    address: { type: String, trim: true },
    description: { type: String, trim: true },
    about: { type: String, trim: true },

    // ===== STATUS FIELDS =====
    verified: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
registrationSchema.pre('save', async function () {
  try {
    if (!this.isModified('password')) {
      return;
    }

    // Hash the password using bcryptjs
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  } catch (error) {
    console.error('❌ Password hashing error:', error.message);
    throw error;
  }
});

// Method to compare passwords for login
registrationSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('❌ Password comparison error:', error.message);
    return false;
  }
};

export default mongoose.model('Login', registrationSchema);