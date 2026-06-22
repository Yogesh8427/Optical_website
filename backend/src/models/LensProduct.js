const mongoose = require('mongoose');

const lensProductSchema = new mongoose.Schema(
  {
    brandId:     { type: mongoose.Schema.Types.ObjectId, ref: 'LensBrand', required: true },
    lensTypeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'LensType', default: null },
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price:       { type: Number, required: true, min: 0 },
    active:      { type: Boolean, default: true },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LensProduct', lensProductSchema);
