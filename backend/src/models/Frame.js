const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    framePrice: { type: Number, required: true, min: 0 },
    material: { type: String, default: '' },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'unisex' },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    requiresLens: { type: Boolean, default: true },
  },
  { timestamps: true }
);

frameSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Frame', frameSchema);
