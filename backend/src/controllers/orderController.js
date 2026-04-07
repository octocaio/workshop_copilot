const { getOrdersByEmail } = require('../services/orderService');

function listOrders(req, res) {
  const userEmail = req.user.email;
  const orders = getOrdersByEmail(userEmail);
  res.json(orders);
}

module.exports = { listOrders };
