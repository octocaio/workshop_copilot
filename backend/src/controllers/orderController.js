const { getOrdersByEmail } = require('../services/orderService');

function listOrders(req, res) {
  const { userEmail } = req.params;

  if (!userEmail) {
    return res.status(400).json({ error: 'O parametro userEmail e obrigatorio' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    return res.status(400).json({ error: 'Formato de e-mail invalido' });
  }

  const orders = getOrdersByEmail(userEmail);
  res.json(orders);
}

module.exports = { listOrders };
