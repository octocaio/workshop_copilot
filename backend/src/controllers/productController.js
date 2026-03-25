const { getAllProducts, getProductById } = require('../services/productService');

function listProducts(req, res) {
  const products = getAllProducts();
  res.json(products);
}

function getProduct(req, res) {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
}

module.exports = { listProducts, getProduct };
