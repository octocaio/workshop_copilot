import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let createOrder;
let getOrdersByEmail;
let mockProcessPayment;

beforeEach(() => {
  const paymentPath = path.resolve(__dirname, './paymentService.js');
  const orderPath = path.resolve(__dirname, './orderService.js');
  delete require.cache[paymentPath];
  delete require.cache[orderPath];

  const paymentMod = require('./paymentService');
  mockProcessPayment = vi.fn();
  paymentMod.processPayment = mockProcessPayment;

  const orderMod = require('./orderService');
  createOrder = orderMod.createOrder;
  getOrdersByEmail = orderMod.getOrdersByEmail;
});

describe('orderService', () => {
  describe('createOrder()', () => {
    it('returns error when product does not exist', async () => {
      const result = await createOrder('nonexistent', 'test@example.com');
      expect(result).toEqual({ success: false, error: 'Produto nao encontrado' });
    });

    it('returns success when payment is approved', async () => {
      mockProcessPayment.mockResolvedValue({
        success: true,
        transactionId: 'txn_test_123',
        message: 'Pagamento processado com sucesso',
      });

      const result = await createOrder('course-1', 'buyer@example.com');
      expect(result.success).toBe(true);
      expect(result.order).toHaveProperty('orderId');
      expect(result.order.productId).toBe('course-1');
      expect(result.order.userEmail).toBe('buyer@example.com');
      expect(result.order.transactionId).toBe('txn_test_123');
    });

    it('returns error for duplicate purchase', async () => {
      mockProcessPayment.mockResolvedValue({
        success: true,
        transactionId: 'txn_test_456',
        message: 'Pagamento processado com sucesso',
      });

      await createOrder('course-1', 'dup@example.com');

      const result = await createOrder('course-1', 'dup@example.com');
      expect(result).toEqual({ success: false, error: 'Voce ja comprou este curso' });
    });

    it('returns error when payment is declined', async () => {
      mockProcessPayment.mockResolvedValue({
        success: false,
        transactionId: null,
        message: 'Pagamento recusado. Tente novamente.',
      });

      const result = await createOrder('course-1', 'declined@example.com');
      expect(result).toEqual({ success: false, error: 'Pagamento recusado. Tente novamente.' });
    });
  });

  describe('getOrdersByEmail()', () => {
    it('filters orders by user email', async () => {
      mockProcessPayment.mockResolvedValue({
        success: true,
        transactionId: 'txn_test_789',
        message: 'Pagamento processado com sucesso',
      });

      await createOrder('course-1', 'filter@example.com');
      await createOrder('course-2', 'other@example.com');

      const orders = getOrdersByEmail('filter@example.com');
      expect(orders.length).toBe(1);
      expect(orders[0].userEmail).toBe('filter@example.com');
    });

    it('returns empty array when no orders match', () => {
      const orders = getOrdersByEmail('nobody@example.com');
      expect(orders).toEqual([]);
    });
  });
});
