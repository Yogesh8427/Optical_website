const Inquiry = require('../models/Inquiry');
const Frame = require('../models/Frame');
const LensBrand = require('../models/LensBrand');
const LensProduct = require('../models/LensProduct');
const Settings = require('../models/Settings');
const buildWhatsAppUrl = require('../utils/whatsappMessage');
const { uploadToCloudinary } = require('../middleware/upload');

exports.create = async (req, res, next) => {
  try {
    const {
      frameId, customerName, phone, email, city,
      powerRequired, rightEye, leftEye, add,
      lensBrandId, lensTypes, notes,
      selectedColor, selectedSize, needsCheckup,
    } = req.body;

    let prescriptionFile = '';
    if (req.file) {
      prescriptionFile = await uploadToCloudinary(req.file.buffer, 'prescriptions', {
        resource_type: req.file.mimetype === 'application/pdf' ? 'raw' : 'image',
      });
    }

    const inquiry = await Inquiry.create({
      frameId, customerName, phone, email, city,
      powerRequired: powerRequired === 'true' || powerRequired === true,
      prescriptionFile,
      rightEye: rightEye ? (typeof rightEye === 'string' ? JSON.parse(rightEye) : rightEye) : {},
      leftEye: leftEye ? (typeof leftEye === 'string' ? JSON.parse(leftEye) : leftEye) : {},
      add, lensBrandId, lensTypes, notes,
      selectedColor: selectedColor || '',
      selectedSize: selectedSize || '',
    });

    // Build WhatsApp URL — fetch frame, brand, lens product, settings
    const lensProductId = Array.isArray(lensTypes) ? lensTypes[0] : null;
    const [frame, lensBrand, lensProductDoc, settings] = await Promise.all([
      Frame.findById(frameId),
      lensBrandId ? LensBrand.findById(lensBrandId) : null,
      lensProductId ? LensProduct.findById(lensProductId) : null,
      Settings.findOne(),
    ]);

    // First image of selected colour (comma-separated slot)
    const colorIndex = frame?.colors?.indexOf(selectedColor) ?? 0;
    const imageSlot = frame?.images?.[colorIndex >= 0 ? colorIndex : 0] || frame?.images?.[0] || '';
    const frameImage = imageSlot ? imageSlot.split(',')[0].trim() : '';

    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '';

    const powerBool = powerRequired === 'true' || powerRequired === true;

    const whatsappUrl = settings?.whatsappNumber
      ? buildWhatsAppUrl(settings.whatsappNumber, {
          frameName:    frame?.name  || 'Unknown',
          frameSlug:    frame?.slug  || '',
          frameImage,
          framePrice:   frame?.framePrice || 0,
          selectedColor: selectedColor || '',
          selectedSize:  selectedSize  || '',
          powerRequired: powerBool,
          lensBrand:     lensBrand?.name     || '',
          lensProduct:   lensProductDoc?.name || '',
          rightEye:      powerBool ? (typeof rightEye === 'string' ? JSON.parse(rightEye || '{}') : rightEye) : null,
          leftEye:       powerBool ? (typeof leftEye  === 'string' ? JSON.parse(leftEye  || '{}') : leftEye)  : null,
          add:           powerBool ? add : null,
          customerName, phone, email, city, notes,
          needsCheckup:  needsCheckup === 'true' || needsCheckup === true,
          siteUrl,
        })
      : null;

    res.status(201).json({ success: true, data: inquiry, whatsappUrl });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate('frameId', 'name slug images')
        .populate('lensBrandId', 'name')
        .populate('lensTypes', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Inquiry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: inquiries,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('frameId', 'name slug images framePrice')
      .populate('lensBrandId', 'name logo')
      .populate('lensTypes', 'name extraPrice');
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};
