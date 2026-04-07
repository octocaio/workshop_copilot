const { Router } = require('express');
const { listOrders } = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, listOrders);

module.exports = router;
