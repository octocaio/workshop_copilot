const { createApp } = require('./app');

const app = createApp();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend em execucao em http://localhost:${PORT}`);
});
