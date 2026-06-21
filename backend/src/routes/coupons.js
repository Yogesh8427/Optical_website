const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/public', ctrl.getPublic);                      // public — list active coupons
router.get('/', protect, ctrl.getAll);                      // admin — full list with claims
router.post('/', protect, upload.single('bannerImage'), ctrl.create);
router.post('/verify', protect, ctrl.verify);               // admin — verify claim ID at store
router.get('/:code', ctrl.getByCode);                       // public — check single coupon
router.post('/:id/claim', ctrl.claim);                      // public — claim by id or code
router.post('/:id/force-claim', protect, ctrl.forceClaim);  // admin — give to any phone
router.put('/:id', protect, upload.single('bannerImage'), ctrl.update);
router.delete('/:id', protect, ctrl.remove);
module.exports = router;
