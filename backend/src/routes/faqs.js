const router = require('express').Router();
const ctrl = require('../controllers/faqController');
const { protect } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.post('/', protect, ctrl.create);
router.put('/:id', protect, ctrl.update);
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
