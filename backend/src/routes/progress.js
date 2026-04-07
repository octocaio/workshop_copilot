const express = require('express');
const { updateOrderProgress } = require('../controllers/progressController');

const router = express.Router();

router.put('/:orderId', updateOrderProgress);

module.exports = router;
