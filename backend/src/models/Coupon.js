const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['eye_checkup', 'discount', 'gift'], default: 'eye_checkup' },
  discountType: { type: String, enum: ['percentage', 'flat', 'free_service'], default: 'free_service' },
  discountValue: { type: Number, default: 0 },
  validUntil: { type: Date },
  maxUses: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  claims: [{
    claimId:    { type: String, required: true },
    name:       { type: String },
    phone:      { type: String },
    ip:         { type: String, default: '' },  // for abuse detection
    claimedAt:  { type: Date, default: Date.now },
    redeemed:   { type: Boolean, default: false },
    redeemedAt: { type: Date },
  }],
  active: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Coupon', couponSchema);
