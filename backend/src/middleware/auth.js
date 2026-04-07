const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../services/authService');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticacao ausente' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalido ou expirado' });
  }
}

module.exports = { authenticate };
