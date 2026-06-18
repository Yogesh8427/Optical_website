const router = require('express').Router();
const ctrl = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.post('/', upload.single('prescriptionFile'), ctrl.create);
router.get('/', protect, ctrl.getAll);
router.get('/:id', protect, ctrl.getById);
router.put('/:id/status', protect, ctrl.updateStatus);

module.exports = router;
