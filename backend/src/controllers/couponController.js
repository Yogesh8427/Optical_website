const Coupon = require('../models/Coupon');

// Admin — full list with claims
exports.getAll = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) { next(err); }
};

// Public — active coupons without claims detail
exports.getPublic = async (req, res, next) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      active: true,
      $or: [{ validUntil: null }, { validUntil: { $gte: now } }],
    }).sort({ createdAt: -1 });
    const safe = coupons.map(({ _id, code, title, description, type, discountType, discountValue, validUntil, maxUses, usedCount }) => ({
      _id, code, title, description, type, discountType, discountValue, validUntil, maxUses, usedCount,
      remaining: maxUses - usedCount,
    }));
    res.json({ success: true, data: safe });
  } catch (err) { next(err); }
};

exports.getByCode = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase(), active: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    const now = new Date();
    if (coupon.validUntil && coupon.validUntil < now) return res.status(400).json({ success: false, message: 'This coupon has expired' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
    const { claims, ...safe } = coupon.toObject();
    res.json({ success: true, data: { ...safe, claimsCount: claims.length } });
  } catch (err) { next(err); }
};

exports.claim = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and phone are required' });

    // Get real IP (works behind proxies/Vercel/Nginx)
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();

    const query = req.params.id.match(/^[a-f\d]{24}$/i)
      ? { _id: req.params.id, active: true }
      : { code: req.params.id.toUpperCase(), active: true };
    const coupon = await Coupon.findOne(query);
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });

    const now = new Date();
    if (coupon.validUntil && coupon.validUntil < now) return res.status(400).json({ success: false, message: 'This coupon has expired' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });

    // Block same phone
    if (coupon.claims.find(c => c.phone === phone)) {
      return res.status(400).json({ success: false, message: 'This phone number has already claimed this coupon' });
    }
    // Block same IP (Option 3) — skip for localhost/private IPs
    const isPrivateIp = !ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.');
    if (!isPrivateIp && coupon.claims.find(c => c.ip === ip)) {
      return res.status(400).json({ success: false, message: 'A coupon has already been claimed from your device/network. Visit our store for assistance.' });
    }

    const claimId = 'CLM-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    coupon.claims.push({ claimId, name, phone, ip });
    coupon.usedCount += 1;
    await coupon.save();
    res.json({ success: true, data: { claimId, code: coupon.code, title: coupon.title, description: coupon.description }, message: 'Coupon claimed successfully!' });
  } catch (err) { next(err); }
};

exports.verify = async (req, res, next) => {
  try {
    const { claimId } = req.body;
    if (!claimId) return res.status(400).json({ success: false, message: 'Claim ID is required' });
    const coupon = await Coupon.findOne({ 'claims.claimId': claimId.toUpperCase() });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid claim ID — not found' });
    const claim = coupon.claims.find(c => c.claimId === claimId.toUpperCase());
    if (claim.redeemed) {
      return res.json({ success: true, alreadyRedeemed: true, data: { claimId: claim.claimId, name: claim.name, phone: claim.phone, redeemedAt: claim.redeemedAt, couponTitle: coupon.title, couponCode: coupon.code } });
    }
    // Mark as redeemed
    claim.redeemed = true;
    claim.redeemedAt = new Date();
    await coupon.save();
    res.json({ success: true, alreadyRedeemed: false, data: { claimId: claim.claimId, name: claim.name, phone: claim.phone, redeemedAt: claim.redeemedAt, couponTitle: coupon.title, couponCode: coupon.code } });
  } catch (err) { next(err); }
};

// Admin — force-give a coupon to a phone number (bypasses one-per-phone limit)
exports.forceClaim = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ success: false, message: 'Name and phone are required' });
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    const claimId = 'CLM-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    coupon.claims.push({ claimId, name, phone });
    coupon.usedCount += 1;
    await coupon.save();
    res.json({ success: true, message: `Coupon given to ${name} (${phone})` });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { code, title, description, type, discountType, discountValue, validUntil, maxUses, active } = req.body;
    const coupon = await Coupon.create({ code: code.toUpperCase(), title, description, type, discountType, discountValue, validUntil, maxUses, active });
    res.status(201).json({ success: true, data: coupon });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { title, description, type, discountType, discountValue, validUntil, maxUses, active } = req.body;
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { title, description, type, discountType, discountValue, validUntil, maxUses, active }, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, data: coupon });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
