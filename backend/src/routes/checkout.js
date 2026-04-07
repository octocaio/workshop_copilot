const { Router } = require('express');
const { checkout } = require('../controllers/checkoutController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/', authenticate, checkout);

module.exports = router;
