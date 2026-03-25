const API_BASE = '/api';

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

export async function submitCheckout(productId, userEmail) {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, userEmail }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Falha ao finalizar a compra');
  return data;
}

export async function fetchOrders(userEmail) {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(userEmail)}`);
  if (!res.ok) throw new Error('Falha ao buscar pedidos');
  return res.json();
}
