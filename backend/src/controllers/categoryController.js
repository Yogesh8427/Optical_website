const Category = require('../models/Category');
const generateSlug = require('../utils/generateSlug');
const { uploadToCloudinary } = require('../middleware/upload');

exports.getAll = async (_req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, active } = req.body;
    let image = '';
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, 'categories');
    }
    const slug = generateSlug(name);
    const category = await Category.create({ name, slug, description, image, active });
    res.status(201).json({ success: true, data: category });
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
      updates.image = await uploadToCloudinary(req.file.buffer, 'categories');
    }
    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
