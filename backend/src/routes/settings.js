const router = require('express').Router();
const ctrl = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', ctrl.get);
router.put('/', protect, upload.single('logo'), ctrl.update);

module.exports = router;
