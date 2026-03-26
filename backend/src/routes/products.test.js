import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('GET /products', () => {
  it('returns all products as an array', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('each product has required fields', async () => {
    const res = await request(app).get('/products');
    const product = res.body[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('price');
  });
});

describe('GET /products/:id', () => {
  it('returns a product when it exists', async () => {
    const res = await request(app).get('/products/course-1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('course-1');
    expect(res.body).toHaveProperty('title');
  });

  it('returns 404 when product does not exist', async () => {
    const res = await request(app).get('/products/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Produto nao encontrado' });
  });
});
