const Testimonial = require('../models/Testimonial');
const { uploadToCloudinary } = require('../middleware/upload');

exports.getAll = async (_req, res, next) => {
  try {
    const data = await Testimonial.find({ active: true }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = await uploadToCloudinary(req.file.buffer, 'testimonials');
    const doc = await Testimonial.create(updates);
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = await uploadToCloudinary(req.file.buffer, 'testimonials');
    const doc = await Testimonial.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const doc = await Testimonial.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) { next(err); }
};
