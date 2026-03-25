const { Router } = require('express');
const { checkout } = require('../controllers/checkoutController');

const router = Router();

router.post('/', checkout);

module.exports = router;
