// Armazenamento de usuarios em memoria
const users = [];

function findByEmail(email) {
  return users.find((u) => u.email === email) || null;
}

function createUser(email, passwordHash) {
  const user = { id: require('crypto').randomUUID(), email, passwordHash };
  users.push(user);
  return user;
}

module.exports = { findByEmail, createUser };
