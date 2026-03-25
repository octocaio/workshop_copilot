const { Router } = require('express');
const { listOrders } = require('../controllers/orderController');

const router = Router();

router.get('/:userEmail', listOrders);

module.exports = router;
