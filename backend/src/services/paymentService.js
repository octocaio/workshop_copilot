/**
 * Mock payment gateway abstraction.
 * Replace this implementation with Stripe, PayPal, etc. in production.
 */

function processPayment({ productId, userEmail, amount }) {
  // Simulate a ~200ms payment processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a 95% success rate
      const success = Math.random() < 0.95;
      resolve({
        success,
        transactionId: success ? `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}` : null,
        message: success ? 'Payment processed successfully' : 'Payment declined. Please try again.',
      });
    }, 200);
  });
}

module.exports = { processPayment };
