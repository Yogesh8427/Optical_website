const Category = require('../models/Category');
const generateSlug = require('../utils/generateSlug');
const { uploadToCloudinary } = require('../middleware/upload');

// Return all categories with parentId populated (name + slug only)
exports.getAll = async (_req, res, next) => {
  try {
    const categories = await Category.find()
      .populate('parentId', 'name slug _id')
      .sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, active, parentId, hi_name, hi_description } = req.body;
    let image = '';
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, 'categories');
    }
    // Make slug unique when sub-category shares a name with another
    const base = generateSlug(name);
    const suffix = parentId ? `-${String(parentId).slice(-4)}` : '';
    const slug = base + suffix;

    const category = await Category.create({
      name, slug, description, image,
      active: active !== undefined ? active : true,
      parentId: parentId || null,
      translations: { hi: { name: hi_name || '', description: hi_description || '' } },
    });
    const populated = await category.populate('parentId', 'name slug _id');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, description, active, parentId, hi_name, hi_description } = req.body;
    const updates = {
      description,
      active,
      parentId: parentId || null,
      'translations.hi.name': hi_name || '',
      'translations.hi.description': hi_description || '',
    };
    if (name) {
      updates.name = name;
      const base = generateSlug(name);
      const suffix = parentId ? `-${String(parentId).slice(-4)}` : '';
      updates.slug = base + suffix;
    }
    if (req.file) {
      updates.image = await uploadToCloudinary(req.file.buffer, 'categories');
    }
    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('parentId', 'name slug _id');
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    // Prevent deleting a parent that has children
    const children = await Category.countDocuments({ parentId: req.params.id });
    if (children > 0) {
      return res.status(400).json({ success: false, message: `Cannot delete: this category has ${children} sub-categories. Delete them first.` });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
