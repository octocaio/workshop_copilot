const { Router } = require('express');
const { listOrders } = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, listOrders);

module.exports = router;
