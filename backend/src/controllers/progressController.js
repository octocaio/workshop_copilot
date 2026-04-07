const { updateProgress } = require('../services/orderService');

async function updateOrderProgress(req, res) {
  const { orderId } = req.params;
  const { userEmail, progress, completed } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: 'E-mail e obrigatorio' });
  }

  if (progress !== undefined && (typeof progress !== 'number' || progress < 0 || progress > 100)) {
    return res.status(400).json({ error: 'Progresso invalido' });
  }

  const result = updateProgress(orderId, userEmail, { progress, completed });

  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }

  return res.json(result.progress);
}

module.exports = { updateOrderProgress };
