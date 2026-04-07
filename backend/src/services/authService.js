const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByEmail, createUser } = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET || 'learnhub-secret-dev';
const SALT_ROUNDS = 10;

async function register(email, password) {
  if (findByEmail(email)) {
    return { success: false, error: 'E-mail ja cadastrado' };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = createUser(email, passwordHash);

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return { success: true, token, email: user.email };
}

async function login(email, password) {
  const user = findByEmail(email);
  if (!user) {
    return { success: false, error: 'E-mail ou senha invalidos' };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: 'E-mail ou senha invalidos' };
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return { success: true, token, email: user.email };
}

module.exports = { register, login, JWT_SECRET };
