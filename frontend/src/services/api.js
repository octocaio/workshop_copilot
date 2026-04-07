const API_BASE = '/api';

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Falha ao cadastrar');
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Falha ao entrar');
  return data;
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Falha ao buscar produtos');
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Produto nao encontrado');
  return res.json();
}

export async function submitCheckout(productId) {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ productId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Falha ao finalizar a compra');
  return data;
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Falha ao buscar pedidos');
  return res.json();
}
