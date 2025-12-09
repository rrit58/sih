// models/Center.js
import mongoose from 'mongoose'

const centerSchema = new mongoose.Schema(
  {
    // id: {
    //   type: String,
    //   required: true,
    //   unique: true, // 'c1', 'c2', etc.
    // },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['CSC', 'Aadhaar Centre', 'Banking Correspondent', 'Other'],
      required: true,
    },
    services: {
      type: [String],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
//   {
//     collection: 'center', // your collection name
//     timestamps: true,
//   }
)

export default mongoose.model('Center', centerSchema)


