const { getOrdersByUserId } = require('../services/orderService');

function listOrders(req, res) {
  const userId = req.user.id;
  const orders = getOrdersByUserId(userId);
  res.json(orders);
}

module.exports = { listOrders };
