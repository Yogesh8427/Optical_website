const mongoose = require('mongoose');
const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  occasionName: { type: String, default: '' },
  discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
  discountValue: { type: Number, default: 0 },
  productIds:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Frame' }],
  brandIds:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }],
  categoryIds:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  lensBrandIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LensBrand' }],
  lensProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LensProduct' }],
  bannerImage: { type: String, default: '' },
  bgColor: { type: String, default: '#2563eb' },
  startDate: { type: Date },
  endDate: { type: Date },
  active: { type: Boolean, default: true },
}, { timestamps: true });
module.exports = mongoose.model('Offer', offerSchema);
