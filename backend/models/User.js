import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['GRAM_PANCHAYAT', 'WARD_MEMBER', 'CSC_CENTER'],
    required: true
  },

  // ---------------------------------------------
  // PANCHAYAT FIELDS
  // ---------------------------------------------
  gramPanchayatName: String,
  district: String,
  state: String,
  activityType: String,

  // ---------------------------------------------
  // NGO FIELDS
  // ---------------------------------------------
  organizationName: String,
  registrationNumber: String,
  contactPersonName: String,
  phoneNumber: String,
  fullAddress: String,
  organizationDescription: String,

  // ---------------------------------------------
  // SCHOOL FIELDS (from your screenshot)
  // ---------------------------------------------
  institutionName: String,
  officialEmail: String,
  schoolContactPerson: String,
  schoolPhoneNumber: String,
  schoolState: String,
  schoolDistrict: String,
  institutionType: String,
  schoolFullAddress: String,
  aboutInstitution: String,

  // ---------------------------------------------
  // COMMON LOGIN FIELDS
  // ---------------------------------------------
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }

}, { timestamps: true });


export default mongoose.model("Login", userSchema);
