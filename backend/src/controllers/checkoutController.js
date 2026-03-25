const { createOrder } = require('../services/orderService');

async function checkout(req, res) {
  const { productId, userEmail } = req.body;

  if (!productId || !userEmail) {
    return res.status(400).json({ error: 'productId e userEmail sao obrigatorios' });
  }

  // Validacao basica de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    return res.status(400).json({ error: 'Formato de e-mail invalido' });
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
