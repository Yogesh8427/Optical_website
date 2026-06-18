const Settings = require('../models/Settings');
const { uploadToCloudinary } = require('../middleware/upload');

exports.get = async (_req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (typeof updates.socialLinks  === 'string') updates.socialLinks  = JSON.parse(updates.socialLinks);
    if (typeof updates.seoDefaults  === 'string') updates.seoDefaults  = JSON.parse(updates.seoDefaults);
    if (typeof updates.aboutContent === 'string') updates.aboutContent = JSON.parse(updates.aboutContent);
    if (req.file) updates.logo = await uploadToCloudinary(req.file.buffer, 'settings');

    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create(updates);
    else settings = await Settings.findByIdAndUpdate(settings._id, updates, { new: true, runValidators: true });

    res.json({ success: true, data: settings });
  } catch (err) { next(err); }
};
