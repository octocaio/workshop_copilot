const { createOrder } = require('../services/orderService');

async function checkout(req, res) {
  const { productId } = req.body;
  const userEmail = req.user.email;

  if (!productId) {
    return res.status(400).json({ error: 'productId e obrigatorio' });
  }

  const result = await createOrder(productId, userEmail);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json({
    success: true,
    orderId: result.order.orderId,
    message: 'Compra concluida com sucesso!',
  });
}

module.exports = { checkout };
