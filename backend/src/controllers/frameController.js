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

/**
 * Build per-color image arrays.
 * existingImages: string | string[] — one entry per color, comma-sep URLs already on Cloudinary
 * imageCount:     string | string[] — one number per color, how many new files belong to it
 * files:          multer file[] — new uploads in order (color0-files..., color1-files..., ...)
 * numColors:      fallback if existingImages/imageCount not provided
 * Returns: string[] where each slot is a comma-separated list of all URLs for that color
 */
async function buildColorImages(files, existingImages, imageCount, numColors) {
  const existing = toArray(existingImages);   // ['url1,url2', '', 'url3']
  const counts   = toArray(imageCount).map(Number); // [2, 0, 1]
  const total    = counts.reduce((s, n) => s + n, 0);
  const len      = Math.max(existing.length, counts.length, numColors);

  // Upload all new files upfront
  const uploaded = [];
  for (const file of files) {
    uploaded.push(await uploadToCloudinary(file.buffer, 'frames'));
  }

  const result = [];
  let fileOffset = 0;
  for (let i = 0; i < len; i++) {
    const existUrls = existing[i] ? existing[i].split(',').map((u) => u.trim()).filter(Boolean) : [];
    const newCount  = counts[i] || 0;
    const newUrls   = uploaded.slice(fileOffset, fileOffset + newCount);
    fileOffset += newCount;
    result.push([...existUrls, ...newUrls].join(','));
  }

  return result;
}

function toArray(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

// Expand comma-separated image slots into a flat array of individual URLs
function flattenImageUrls(images) {
  if (!images || !images.length) return [];
  return images.flatMap((slot) =>
    slot ? slot.split(',').map((u) => u.trim()).filter(Boolean) : []
  );
}

exports.create = async (req, res, next) => {
  try {
    const { name, description, categoryId, brandId, framePrice, material, gender, colors, sizes, featured, active, requiresLens, inStock, hi_name, hi_description } = req.body;

    const colorList = parseArray(colors);
    const images = await buildColorImages(req.files || [], req.body.existingImages, req.body.imageCount, colorList.length);

    const slug = generateSlug(name);
    const frame = await Frame.create({
      name, slug, description, categoryId, brandId, framePrice,
      material, gender,
      colors: colorList,
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

    const colorList = updates.colors ?? parseArray(colors);
    updates.images = await buildColorImages(req.files || [], req.body.existingImages, req.body.imageCount, colorList.length);

    // Find and delete from Cloudinary any URLs that were removed
    const existing = await Frame.findById(req.params.id).select('images');
    if (existing) {
      const oldUrls = flattenImageUrls(existing.images);
      const newUrls = new Set(flattenImageUrls(updates.images));
      const removed = oldUrls.filter((u) => !newUrls.has(u));
      if (removed.length > 0) {
        const ids = removed.map(extractPublicId).filter(Boolean);
        if (ids.length > 0) cloudinary.api.delete_resources(ids).catch(() => {});
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
    // Delete all images from Cloudinary (images[] slots are comma-separated URLs)
    const allUrls = flattenImageUrls(frame.images);
    if (allUrls.length > 0) {
      const ids = allUrls.map(extractPublicId).filter(Boolean);
      if (ids.length > 0) cloudinary.api.delete_resources(ids).catch(() => {});
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
