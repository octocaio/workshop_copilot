const products = require('../data/products.json');

function getAllProducts() {
  return products;
}

function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

module.exports = { getAllProducts, getProductById };
