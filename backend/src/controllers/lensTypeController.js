const LensType = require('../models/LensType');

exports.getAll = async (_req, res, next) => {
  try {
    const data = await LensType.find({ active: true }).sort({ name: 1 });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const doc = await LensType.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const doc = await LensType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, message: 'Lens type not found' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const doc = await LensType.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Lens type not found' });
    res.json({ success: true, message: 'Lens type deleted' });
  } catch (err) { next(err); }
};
