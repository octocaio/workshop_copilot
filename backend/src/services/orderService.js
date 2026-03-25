const { v4: uuidv4 } = require('uuid');
const { processPayment } = require('./paymentService');
const { getProductById } = require('./productService');

// In-memory orders store
const orders = [];

async function createOrder(productId, userEmail) {
  const product = getProductById(productId);
  if (!product) {
    return { success: false, error: 'Product not found' };
  }

  // Check if user already purchased this product
  const existingOrder = orders.find(
    (o) => o.productId === productId && o.userEmail === userEmail
  );
  if (existingOrder) {
    return { success: false, error: 'You have already purchased this course' };
  }

  const paymentResult = await processPayment({
    productId,
    userEmail,
    amount: product.price,
  });

  if (!paymentResult.success) {
    return { success: false, error: paymentResult.message };
  }

  const order = {
    orderId: uuidv4(),
    productId,
    userEmail,
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

function getOrdersByEmail(userEmail) {
  return orders.filter((o) => o.userEmail === userEmail);
}

module.exports = { createOrder, getOrdersByEmail };
