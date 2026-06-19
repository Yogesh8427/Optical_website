const router = require('express').Router();
const ctrl = require('../controllers/frameController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', ctrl.getAll);
router.post('/import', protect, ctrl.bulkImport);
router.get('/:slug', ctrl.getBySlug);
router.post('/', protect, upload.array('images', 6), ctrl.create);
router.put('/:id', protect, upload.array('images', 6), ctrl.update);
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
