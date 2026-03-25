const { Router } = require('express');
const { checkout } = require('../controllers/checkoutController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post('/', requireAuth, checkout);

module.exports = router;
