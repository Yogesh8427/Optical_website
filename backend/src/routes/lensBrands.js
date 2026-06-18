const router = require('express').Router();
const ctrl = require('../controllers/lensBrandController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', ctrl.getAll);
router.post('/', protect, upload.single('logo'), ctrl.create);
router.put('/:id', protect, upload.single('logo'), ctrl.update);
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
