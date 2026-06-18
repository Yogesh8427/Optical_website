const Frame = require('../models/Frame');
const generateSlug = require('../utils/generateSlug');
const { uploadToCloudinary } = require('../middleware/upload');

exports.getAll = async (req, res, next) => {
  try {
    const {
      search, category, brand, gender, material,
      minPrice, maxPrice, page = 1, limit = 12, featured,
    } = req.query;

    const filter = { active: true };
    if (category) filter.categoryId = category;
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
    const { name, description, categoryId, brandId, framePrice, material, gender, colors, sizes, featured, active } = req.body;

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
      images, featured, active,
    });
    res.status(201).json({ success: true, data: frame });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, description, categoryId, brandId, framePrice, material, gender, colors, sizes, featured, active } = req.body;
    const updates = { description, categoryId, brandId, framePrice, material, gender, featured, active };
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
