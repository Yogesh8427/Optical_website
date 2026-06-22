const Offer = require('../models/Offer');
const { uploadToCloudinary } = require('../middleware/upload');

function parseIds(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : val.split(',').filter(Boolean);
}

exports.getAll = async (req, res, next) => {
  try {
    const now = new Date();
    const filter = {};
    if (req.query.active === 'true') {
      filter.active = true;
      filter.$or = [{ endDate: null }, { endDate: { $gte: now } }];
      filter.$and = [{ $or: [{ startDate: null }, { startDate: { $lte: now } }] }];
    }
    const offers = await Offer.find(filter)
      .populate('productIds', 'name slug images framePrice')
      .populate('brandIds', 'name logo')
      .populate('categoryIds', 'name slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: offers });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, occasionName, discountType, discountValue, productIds, brandIds, categoryIds, bgColor, startDate, endDate, active } = req.body;
    let bannerImage = '';
    if (req.file) bannerImage = await uploadToCloudinary(req.file.buffer, 'offers');
    const offer = await Offer.create({
      title, description, occasionName, discountType, discountValue,
      productIds: parseIds(productIds),
      brandIds: parseIds(brandIds),
      categoryIds: parseIds(categoryIds),
      bannerImage, bgColor, startDate, endDate, active,
    });
    res.status(201).json({ success: true, data: offer });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { title, description, occasionName, discountType, discountValue, productIds, brandIds, categoryIds, bgColor, startDate, endDate, active } = req.body;
    const updates = { title, description, occasionName, discountType, discountValue, bgColor, startDate, endDate, active };
    if (productIds  !== undefined) updates.productIds  = parseIds(productIds);
    if (brandIds    !== undefined) updates.brandIds    = parseIds(brandIds);
    if (categoryIds !== undefined) updates.categoryIds = parseIds(categoryIds);
    if (req.file) updates.bannerImage = await uploadToCloudinary(req.file.buffer, 'offers');
    const offer = await Offer.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    res.json({ success: true, data: offer });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
