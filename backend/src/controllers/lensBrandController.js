const LensBrand = require('../models/LensBrand');
const { uploadToCloudinary } = require('../middleware/upload');

exports.getAll = async (_req, res, next) => {
  try {
    const data = await LensBrand.find({ active: true }).sort({ name: 1 });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, active } = req.body;
    let logo = '';
    if (req.file) logo = await uploadToCloudinary(req.file.buffer, 'lens-brands');
    const doc = await LensBrand.create({ name, logo, description, active });
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.logo = await uploadToCloudinary(req.file.buffer, 'lens-brands');
    const doc = await LensBrand.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Lens brand not found' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const doc = await LensBrand.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Lens brand not found' });
    res.json({ success: true, message: 'Lens brand deleted' });
  } catch (err) { next(err); }
};
