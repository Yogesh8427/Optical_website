const Banner = require('../models/Banner');
const { uploadToCloudinary } = require('../middleware/upload');

exports.getAll = async (_req, res, next) => {
  try {
    const data = await Banner.find({ active: true }).sort({ sortOrder: 1 });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, subtitle, buttonText, buttonUrl, sortOrder, active } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Banner image is required' });
    const image = await uploadToCloudinary(req.file.buffer, 'banners');
    const doc = await Banner.create({ title, subtitle, image, buttonText, buttonUrl, sortOrder, active });
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = await uploadToCloudinary(req.file.buffer, 'banners');
    const doc = await Banner.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const doc = await Banner.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) { next(err); }
};
