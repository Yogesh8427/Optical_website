const Brand = require('../models/Brand');
const generateSlug = require('../utils/generateSlug');
const { uploadToCloudinary } = require('../middleware/upload');

exports.getAll = async (_req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json({ success: true, data: brands });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, active } = req.body;
    let logo = '';
    if (req.file) {
      logo = await uploadToCloudinary(req.file.buffer, 'brands');
    }
    const slug = generateSlug(name);
    const brand = await Brand.create({ name, slug, logo, description, active });
    res.status(201).json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, description, active } = req.body;
    const updates = { description, active };
    if (name) {
      updates.name = name;
      updates.slug = generateSlug(name);
    }
    if (req.file) {
      updates.logo = await uploadToCloudinary(req.file.buffer, 'brands');
    }
    const brand = await Brand.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, message: 'Brand deleted' });
  } catch (err) {
    next(err);
  }
};
