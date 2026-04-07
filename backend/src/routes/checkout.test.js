import { describe, it, expect, vi, beforeAll } from 'vitest';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let app;
let mockCreateOrder;

beforeAll(() => {
  // Clear all related modules from cache to ensure proper mock wiring
  const servicesDir = path.resolve(__dirname, '../services');
  const controllersDir = path.resolve(__dirname, '../controllers');
  const routesDir = path.resolve(__dirname, '../routes');
  const appPath = path.resolve(__dirname, '../app.js');

  Object.keys(require.cache).forEach((key) => {
    if (
      key.startsWith(servicesDir) ||
      key.startsWith(controllersDir) ||
      key.startsWith(routesDir) ||
      key === appPath
    ) {
      delete require.cache[key];
    }
  });

  // Mock orderService BEFORE any dependent module loads
  const orderMod = require('../services/orderService');
  mockCreateOrder = vi.fn();
  orderMod.createOrder = mockCreateOrder;

  // Now load app — controller will get the mocked orderService from cache
  const { createApp } = require('../app');
  app = createApp();
});

describe('POST /checkout', () => {
  it('returns 400 when productId is missing', async () => {
    const res = await request(app)
      .post('/checkout')
      .send({ userEmail: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'productId e userEmail sao obrigatorios' });
  });

  it('returns 400 when userEmail is missing', async () => {
    const res = await request(app)
      .post('/checkout')
      .send({ productId: 'course-1' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'productId e userEmail sao obrigatorios' });
  });

  it('returns 400 when email format is invalid', async () => {
    const res = await request(app)
      .post('/checkout')
      .send({ productId: 'course-1', userEmail: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Formato de e-mail invalido' });
  });

  it('returns 400 when service reports a business error', async () => {
    mockCreateOrder.mockResolvedValue({ success: false, error: 'Produto nao encontrado' });
    const res = await request(app)
      .post('/checkout')
      .send({ productId: 'nonexistent', userEmail: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Produto nao encontrado' });
  });

  it('returns 201 when checkout succeeds', async () => {
    mockCreateOrder.mockResolvedValue({
      success: true,
      order: { orderId: 'order-123' },
    });
    const res = await request(app)
      .post('/checkout')
      .send({ productId: 'course-1', userEmail: 'test@example.com' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      success: true,
      orderId: 'order-123',
      message: 'Compra concluida com sucesso!',
    });
  });
});
