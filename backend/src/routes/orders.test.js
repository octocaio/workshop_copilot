import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('GET /orders/:userEmail', () => {
  it('returns orders for a valid email', async () => {
    const res = await request(app).get('/orders/test@example.com');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await request(app).get('/orders/not-an-email');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Formato de e-mail invalido' });
  });

  it('returns empty array when no orders exist', async () => {
    const res = await request(app).get('/orders/noorders@example.com');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
