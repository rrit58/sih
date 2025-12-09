const mongoose = require('mongoose')

const CheckerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: false },
  email: { type: String, required: false },
  district: { type: String, required: false },
  panchayat: { type: String, required: false },
  description: { type: String, required: true },
  status: { type: String, enum: ['new', 'in_progress', 'resolved', 'closed'], default: 'new' },
  attachments: [{ type: String }], // store file URLs or paths
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

CheckerSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Checker', CheckerSchema)
