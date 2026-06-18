const mongoose = require('mongoose');

const eyeSchema = new mongoose.Schema(
  {
    sph: { type: String, default: '' },
    cyl: { type: String, default: '' },
    axis: { type: String, default: '' },
  },
  { _id: false }
);

const inquirySchema = new mongoose.Schema(
  {
    frameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Frame', required: true },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', lowercase: true },
    city: { type: String, default: '' },
    powerRequired: { type: Boolean, default: false },
    prescriptionFile: { type: String, default: '' },
    rightEye: { type: eyeSchema, default: () => ({}) },
    leftEye: { type: eyeSchema, default: () => ({}) },
    add: { type: String, default: '' },
    selectedColor: { type: String, default: '' },
    selectedSize: { type: String, default: '' },
    lensBrandId: { type: mongoose.Schema.Types.ObjectId, ref: 'LensBrand', default: null },
    lensTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LensType' }],
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'completed', 'cancelled'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
