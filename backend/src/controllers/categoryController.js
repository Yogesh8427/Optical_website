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
      'translations.hi.name': hi_name || '',
      'translations.hi.description': hi_description || '',
    };
    // Only update these fields if explicitly sent in the request
    if (description !== undefined) updates.description = description;
    if (active !== undefined) updates.active = active;
    // Only update parentId if it was explicitly sent (avoids wiping it when only updating translations/image)
    if (parentId !== undefined) updates.parentId = parentId || null;
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

/**
 * POST /api/categories/import
 * Body: { rows: [{ name, parent_category, description, active }] }
 * - First pass: create all top-level (no parent) categories
 * - Second pass: create sub-categories (look up parent by name)
 */
exports.bulkImport = async (req, res, next) => {
  try {
    const { rows } = req.body; // already-parsed JSON from frontend
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No rows provided' });
    }

    const created = [];
    const errors  = [];

    // ── Pass 1: top-level categories (parent_category blank) ──────────
    const topRows = rows.filter((r) => !r.parent_category?.trim());
    for (const row of topRows) {
      if (!row.name?.trim()) { errors.push({ row: row.name || '(empty)', reason: 'Name is required' }); continue; }
      try {
        const slug = generateSlug(row.name.trim());
        const existing = await Category.findOne({ slug });
        if (existing) { errors.push({ row: row.name, reason: 'Already exists (skipped)' }); continue; }
        const cat = await Category.create({
          name: row.name.trim(),
          slug,
          description: row.description?.trim() || '',
          active: row.active?.toString().toLowerCase() !== 'false',
          parentId: null,
        });
        created.push(cat.name);
      } catch (e) {
        errors.push({ row: row.name, reason: e.message });
      }
    }

    // ── Pass 2: sub-categories (parent_category filled) ───────────────
    // Fetch all categories fresh (includes newly created parents)
    const allCats = await Category.find();
    const byName  = (n) => allCats.find((c) => c.name.toLowerCase() === n.toLowerCase());

    const subRows = rows.filter((r) => r.parent_category?.trim());
    for (const row of subRows) {
      if (!row.name?.trim()) { errors.push({ row: row.name || '(empty)', reason: 'Name is required' }); continue; }
      const parent = byName(row.parent_category.trim());
      if (!parent) { errors.push({ row: row.name, reason: `Parent "${row.parent_category}" not found` }); continue; }
      try {
        const base   = generateSlug(row.name.trim());
        const suffix = `-${String(parent._id).slice(-4)}`;
        const slug   = base + suffix;
        const existing = await Category.findOne({ slug });
        if (existing) { errors.push({ row: row.name, reason: 'Already exists (skipped)' }); continue; }
        const cat = await Category.create({
          name: row.name.trim(),
          slug,
          description: row.description?.trim() || '',
          active: row.active?.toString().toLowerCase() !== 'false',
          parentId: parent._id,
        });
        created.push(cat.name);
      } catch (e) {
        errors.push({ row: row.name, reason: e.message });
      }
    }

    res.json({ success: true, created: created.length, errors });
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
