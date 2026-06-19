const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/offerController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', ctrl.getAll);
router.post('/', protect, upload.single('bannerImage'), ctrl.create);
router.put('/:id', protect, upload.single('bannerImage'), ctrl.update);
router.delete('/:id', protect, ctrl.remove);
module.exports = router;
