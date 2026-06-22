const LensProduct = require('../models/LensProduct');

// GET /api/lens-products?brandId=xxx  (public)
exports.getAll = async (req, res, next) => {
  try {
    const filter = { active: true };
    if (req.query.brandId) filter.brandId = req.query.brandId;
    const data = await LensProduct.find(filter)
      .populate('brandId', 'name logo')
      .sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// GET /api/lens-products/admin  (admin — includes inactive)
exports.getAllAdmin = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.brandId) filter.brandId = req.query.brandId;
    const data = await LensProduct.find(filter)
      .populate('brandId', 'name logo')
      .sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// POST /api/lens-products  (admin)
exports.create = async (req, res, next) => {
  try {
    const doc = await LensProduct.create(req.body);
    const populated = await doc.populate('brandId', 'name logo');
    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
};

// PUT /api/lens-products/:id  (admin)
exports.update = async (req, res, next) => {
  try {
    const doc = await LensProduct.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('brandId', 'name logo');
    if (!doc) return res.status(404).json({ success: false, message: 'Lens product not found' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

// DELETE /api/lens-products/:id  (admin)
exports.remove = async (req, res, next) => {
  try {
    const doc = await LensProduct.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Lens product not found' });
    res.json({ success: true, message: 'Lens product deleted' });
  } catch (err) { next(err); }
};
