const FAQ = require('../models/FAQ');

exports.getAll = async (_req, res, next) => {
  try {
    const data = await FAQ.find({ active: true }).sort({ sortOrder: 1 });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const doc = await FAQ.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const doc = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const doc = await FAQ.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err) { next(err); }
};
