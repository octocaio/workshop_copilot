const { createOrder } = require('../services/orderService');

async function checkout(req, res) {
  const { productId, userEmail } = req.body;

  if (!productId || !userEmail) {
    return res.status(400).json({ error: 'productId and userEmail are required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const result = await createOrder(productId, userEmail);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json({
    success: true,
    orderId: result.order.orderId,
    message: 'Purchase completed successfully!',
  });
}

module.exports = { checkout };
