const { register, login } = require('../services/authService');

async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email e password sao obrigatorios' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
  }

  try {
    const result = await register(name, email, password);
    res.status(201).json(result);
  } catch (err) {
    if (err.code === 'Conflict') return res.status(409).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email e password sao obrigatorios' });
  }

  try {
    const result = await login(email, password);
    res.json(result);
  } catch (err) {
    if (err.code === 'Unauthorized') return res.status(401).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { registerUser, loginUser };
