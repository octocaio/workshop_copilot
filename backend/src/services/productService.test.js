import { describe, it, expect } from 'vitest';
import { getAllProducts, getProductById } from './productService.js';

describe('productService', () => {
  describe('getAllProducts()', () => {
    it('returns the seeded catalog', () => {
      const products = getAllProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    it('each product has id, title, and price', () => {
      const products = getAllProducts();
      for (const product of products) {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
      }
    });
  });

  describe('getProductById()', () => {
    it('returns a product when it exists', () => {
      const product = getProductById('course-1');
      expect(product).not.toBeNull();
      expect(product.id).toBe('course-1');
    });

    it('returns null when product does not exist', () => {
      const product = getProductById('nonexistent');
      expect(product).toBeNull();
    });
  });
});
