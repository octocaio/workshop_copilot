/**
 * Abstracao de gateway de pagamento simulado.
 * Substitua esta implementacao por Stripe, PayPal etc. em producao.
 */

function processPayment({ productId, userEmail, amount }) {
  // Simula um atraso de ~200ms no processamento do pagamento
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula uma taxa de sucesso de 95%
      const success = Math.random() < 0.95;
      resolve({
        success,
        transactionId: success ? `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}` : null,
        message: success ? 'Pagamento processado com sucesso' : 'Pagamento recusado. Tente novamente.',
      });
    }, 200);
  });
}

module.exports = { processPayment };
