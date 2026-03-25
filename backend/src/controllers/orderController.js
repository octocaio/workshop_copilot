const { getOrdersByEmail } = require('../services/orderService');

function listOrders(req, res) {
  const { userEmail } = req.params;

  if (!userEmail) {
    return res.status(400).json({ error: 'userEmail parameter is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const orders = getOrdersByEmail(userEmail);
  res.json(orders);
}

module.exports = { listOrders };
