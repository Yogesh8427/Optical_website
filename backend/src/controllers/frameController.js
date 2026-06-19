const Category = require('../models/Category');
const Frame = require('../models/Frame');
const generateSlug = require('../utils/generateSlug');
const { uploadToCloudinary } = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

// Extract Cloudinary public_id from a secure_url
function extractPublicId(url) {
  try {
    const parts = url.split('/');
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx === -1) return null;
    // skip version segment if present (v1234567890)
    let start = uploadIdx + 1;
    if (/^v\d+$/.test(parts[start])) start++;
    const withExt = parts.slice(start).join('/');
    return withExt.replace(/\.[^/.]+$/, ''); // remove extension
  } catch { return null; }
}

exports.getAll = async (req, res, next) => {
  try {
    const {
      search, category, brand, gender, material,
      minPrice, maxPrice, page = 1, limit = 12, featured,
    } = req.query;

    const filter = { active: true };
    if (category) {
      // If this is a parent category, include all its sub-categories too
      const subCats = await Category.find({ parentId: category }).select('_id');
      if (subCats.length > 0) {
        filter.categoryId = { $in: [category, ...subCats.map((c) => c._id)] };
      } else {
        filter.categoryId = category;
      }
    }
    if (brand) filter.brandId = brand;
    if (gender) filter.gender = gender;
    if (material) filter.material = new RegExp(material, 'i');
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.framePrice = {};
      if (minPrice) filter.framePrice.$gte = Number(minPrice);
      if (maxPrice) filter.framePrice.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [frames, total] = await Promise.all([
      Frame.find(filter)
        .populate('categoryId', 'name slug')
        .populate('brandId', 'name slug logo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Frame.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: frames,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const frame = await Frame.findOne({ slug: req.params.slug, active: true })
      .populate('categoryId', 'name slug')
      .populate('brandId', 'name slug logo');
    if (!frame) return res.status(404).json({ success: false, message: 'Frame not found' });

    const related = await Frame.find({
      categoryId: frame.categoryId,
      _id: { $ne: frame._id },
      active: true,
    })
      .populate('brandId', 'name slug logo')
      .limit(4);

    res.json({ success: true, data: frame, related });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, categoryId, brandId, framePrice, material, gender, colors, sizes, featured, active, requiresLens, inStock, hi_name, hi_description } = req.body;

    const images = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'frames');
        images.push(url);
      }
    }

    const slug = generateSlug(name);
    const frame = await Frame.create({
      name, slug, description, categoryId, brandId, framePrice,
      material, gender,
      colors: parseArray(colors),
      sizes: parseArray(sizes),
      images, featured, active, requiresLens: requiresLens !== undefined ? requiresLens : true,
      inStock: inStock !== undefined ? (inStock === 'true' || inStock === true) : true,
      translations: { hi: { name: hi_name || '', description: hi_description || '' } },
    });
    res.status(201).json({ success: true, data: frame });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, description, categoryId, brandId, framePrice, material, gender, colors, sizes, featured, active, requiresLens, inStock, hi_name, hi_description } = req.body;
    const updates = {
      description, categoryId, brandId, framePrice, material, gender, featured, active, requiresLens,
      inStock: inStock !== undefined ? (inStock === 'true' || inStock === true) : undefined,
      'translations.hi.name': hi_name || '',
      'translations.hi.description': hi_description || '',
    };
    if (name) {
      updates.name = name;
      updates.slug = generateSlug(name);
    }
    if (colors !== undefined) updates.colors = parseArray(colors);
    if (sizes !== undefined) updates.sizes = parseArray(sizes);
    if (req.files?.length) {
      updates.images = [];
      for (const file of req.files) {
        updates.images.push(await uploadToCloudinary(file.buffer, 'frames'));
      }
    }

    const frame = await Frame.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!frame) return res.status(404).json({ success: false, message: 'Frame not found' });
    res.json({ success: true, data: frame });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const frame = await Frame.findByIdAndDelete(req.params.id);
    if (!frame) return res.status(404).json({ success: false, message: 'Frame not found' });
    // Delete images from Cloudinary
    if (frame.images && frame.images.length > 0) {
      const ids = frame.images.map(extractPublicId).filter(Boolean);
      if (ids.length > 0) {
        await cloudinary.api.delete_resources(ids).catch(() => {}); // don't fail if Cloudinary errors
      }
    }
    res.json({ success: true, message: 'Frame deleted' });
  } catch (err) {
    next(err);
  }
};

function parseArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { return value.split(',').map((s) => s.trim()); }
}

/**
 * POST /api/frames/import
 * Body: { rows: [{ name, category, brand, price, material, gender, colors, sizes, description, featured, requires_lens }] }
 * colors & sizes separated by | e.g. "Black|Gold|Silver"
 * No image upload — images can be added later via the edit screen
 */
exports.bulkImport = async (req, res, next) => {
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No rows provided' });
    }

    const Brand    = require('../models/Brand');
    const created  = [];
    const errors   = [];

    // Cache DB lookups
    const allCategories = await Category.find();
    const allBrands     = await Brand.find();

    const findCat   = (n) => allCategories.find((c) => c.name.toLowerCase() === n?.trim().toLowerCase());
    const findBrand = (n) => allBrands.find((b) => b.name.toLowerCase() === n?.trim().toLowerCase());

    for (const row of rows) {
      if (!row.name?.trim()) { errors.push({ row: '(empty name)', reason: 'Name is required' }); continue; }

      // Resolve category
      const cat = findCat(row.category);
      if (!cat) { errors.push({ row: row.name, reason: `Category "${row.category}" not found` }); continue; }

      // Resolve brand (optional — if blank, we skip brand)
      let brandId = null;
      if (row.brand?.trim()) {
        const brand = findBrand(row.brand);
        if (!brand) { errors.push({ row: row.name, reason: `Brand "${row.brand}" not found` }); continue; }
        brandId = brand._id;
      }

      const gender = row.gender?.trim().toLowerCase();
      const validGenders = ['men', 'women', 'unisex', 'kids'];
      if (!validGenders.includes(gender)) {
        errors.push({ row: row.name, reason: `Gender must be one of: ${validGenders.join(', ')}` }); continue;
      }

      const price = Number(row.price);
      if (isNaN(price) || price < 0) {
        errors.push({ row: row.name, reason: 'Price must be a valid number' }); continue;
      }

      try {
        // Unique slug
        const baseSlug = generateSlug(row.name.trim());
        let slug = baseSlug;
        let counter = 1;
        while (await Frame.findOne({ slug })) { slug = `${baseSlug}-${counter++}`; }

        // Split arrays by pipe character
        const colors = row.colors ? row.colors.split('|').map((s) => s.trim()).filter(Boolean) : [];
        const sizes  = row.sizes  ? row.sizes.split('|').map((s) => s.trim()).filter(Boolean)  : [];

        const frame = await Frame.create({
          name: row.name.trim(),
          slug,
          description: row.description?.trim() || '',
          categoryId: cat._id,
          brandId,
          framePrice: price,
          material: row.material?.trim() || '',
          gender,
          colors,
          sizes,
          images: [],
          featured: row.featured?.toString().toLowerCase() === 'true',
          active: row.active?.toString().toLowerCase() !== 'false',
          requiresLens: row.requires_lens?.toString().toLowerCase() !== 'false',
        });
        created.push(frame.name);
      } catch (e) {
        errors.push({ row: row.name, reason: e.message });
      }
    }

    res.json({ success: true, created: created.length, errors });
  } catch (err) {
    next(err);
  }
};
