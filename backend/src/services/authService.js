const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'learnhub-secret-key';

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

async function register(name, email, password) {
  const users = readUsers();

  if (users.find((u) => u.email === email)) {
    const err = new Error('E-mail ja cadastrado');
    err.code = 'Conflict';
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, passwordHash };
  users.push(user);
  writeUsers(users);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: '7d',
  });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

async function login(email, password) {
  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    const err = new Error('Credenciais invalidas');
    err.code = 'Unauthorized';
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Credenciais invalidas');
    err.code = 'Unauthorized';
    throw err;
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: '7d',
  });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

module.exports = { register, login, JWT_SECRET };
