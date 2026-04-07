import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

const app = createApp();

describe('App-level behavior', () => {
  it('returns 404 with error message for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Rota nao encontrada' });
  });

  it('returns 404 for unknown POST routes', async () => {
    const res = await request(app).post('/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Rota nao encontrada' });
  });
});
