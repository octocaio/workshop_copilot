const { v4: uuidv4 } = require('uuid');
const { processPayment } = require('./paymentService');
const { getProductById } = require('./productService');

// Armazenamento de pedidos em memoria
const orders = [];

async function createOrder(productId, userId) {
  const product = getProductById(productId);
  if (!product) {
    return { success: false, error: 'Produto nao encontrado' };
  }

  // Verifica se o usuario ja comprou este produto
  const existingOrder = orders.find(
    (o) => o.productId === productId && o.userId === userId
  );
  if (existingOrder) {
    return { success: false, error: 'Voce ja comprou este curso' };
  }

  const paymentResult = await processPayment({
    productId,
    userId,
    amount: product.price,
  });

  if (!paymentResult.success) {
    return { success: false, error: paymentResult.message };
  }

  const order = {
    orderId: uuidv4(),
    productId,
    userId,
    product: {
      id: product.id,
      title: product.title,
      description: product.description,
      thumbnail: product.thumbnail,
      videoUrl: product.videoUrl,
      price: product.price,
    },
    transactionId: paymentResult.transactionId,
    purchasedAt: new Date().toISOString(),
  };

  orders.push(order);

  return { success: true, order };
}

function getOrdersByUserId(userId) {
  return orders.filter((o) => o.userId === userId);
}

module.exports = { createOrder, getOrdersByUserId };
