const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/products', productRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/orders', orderRoutes);

// Tratamento de 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada' });
});

// Tratamento global de erros
app.use((err, req, res, _next) => {
  console.error('Erro nao tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend em execucao em http://localhost:${PORT}`);
});
