const { register, login } = require('../services/authService');

const emailRegex = /^[^@\s]{1,64}@[^@\s]{1,255}$/;

async function registerUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha sao obrigatorios' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de e-mail invalido' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
  }

  const result = await register(email, password);

  if (!result.success) {
    return res.status(409).json({ error: result.error });
  }

  res.status(201).json({ token: result.token, email: result.email });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha sao obrigatorios' });
  }

  const result = await login(email, password);

  if (!result.success) {
    return res.status(401).json({ error: result.error });
  }

  res.json({ token: result.token, email: result.email });
}

module.exports = { registerUser, loginUser };
