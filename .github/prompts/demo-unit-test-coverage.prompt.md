---
agent: 'plan'
description: 'Demo: Analyze LearnHub backend test coverage gaps and generate a plan for adding unit tests without changing code.'
tools: [read, search]
---
# 🧪 Demo: Plan LearnHub Backend Test Coverage

## 📊 Current State
- The backend currently exposes a small Express API under `backend/src/`
- There are **no backend test files** in this project today
- `backend/package.json` currently has **no test script** and no test dependencies
- The server bootstrap lives in `backend/src/index.js`, which starts the HTTP listener directly

## 🎯 Objective
Analyze the current LearnHub backend and produce a concrete implementation plan for increasing test coverage of the existing API routes, controllers, and services.

## 🚫 Execution Constraints
- Do not edit any file
- Do not create test files
- Do not change scripts, dependencies, or app bootstrap
- Do not implement code samples as patches
- Do not propose changes outside the current repository scope
- Your output must be a plan only

## 📋 Real Backend Scope

### Existing Routes
- `backend/src/routes/products.js`
- `backend/src/routes/checkout.js`
- `backend/src/routes/orders.js`

### Existing Controllers
- `backend/src/controllers/productController.js`
- `backend/src/controllers/checkoutController.js`
- `backend/src/controllers/orderController.js`

### Existing Services
- `backend/src/services/productService.js`
- `backend/src/services/orderService.js`
- `backend/src/services/paymentService.js`

## 📋 Recommended Test Files To Plan

### 🔗 Route And Controller Coverage (High Priority)
- [ ] `backend/src/routes/products.test.js`
- [ ] `backend/src/routes/checkout.test.js`
- [ ] `backend/src/routes/orders.test.js`

### 🧠 Service Coverage (Medium Priority)
- [ ] `backend/src/services/productService.test.js`
- [ ] `backend/src/services/orderService.test.js`

## ✅ Planning Requirements

### Products Route: `GET /products` and `GET /products/:id`
- ✅ Returns all products
- ✅ Returns a single product by ID
- ✅ Returns `404` when the product does not exist

### Checkout Route: `POST /checkout`
- ✅ Returns `201` when checkout succeeds
- ✅ Returns `400` when `productId` is missing
- ✅ Returns `400` when `userEmail` is missing
- ✅ Returns `400` when the email format is invalid
- ✅ Returns `400` when the service reports a business error
- ✅ Covers success and failure paths with mocked service behavior

### Orders Route: `GET /orders/:userEmail`
- ✅ Returns the orders for a valid email
- ✅ Returns `400` when the email format is invalid
- ✅ Covers the empty list case

### Service Coverage
- ✅ `productService.getAllProducts()` returns the seeded catalog
- ✅ `productService.getProductById()` returns a product or `null`
- ✅ `orderService.createOrder()` returns an error when the product does not exist
- ✅ `orderService.createOrder()` returns an error for duplicate purchases
- ✅ `orderService.createOrder()` returns success when payment succeeds
- ✅ `orderService.getOrdersByEmail()` filters orders by user email

### App-Level Behavior
- ✅ Unknown routes return `404` with the expected error body
- ✅ Global error handling can be exercised if app creation is testable

## 🛠️ Analysis And Planning Guidelines

### First Assess Testability
The current `backend/src/index.js` may start the server immediately. Assess whether the current bootstrap blocks testability and describe the minimal refactor that would likely be needed, but do not implement it.

Preferred approach:
```javascript
// backend/src/app.js
const express = require('express');

function createApp() {
  const app = express();
  // register middleware and routes
  return app;
}

module.exports = { createApp };
```

```javascript
// backend/src/index.js
const { createApp } = require('./app');

const app = createApp();
app.listen(PORT, () => {
  console.log(`Servidor backend em execucao em http://localhost:${PORT}`);
});
```

Treat this code as a reference architecture for the plan, not as an instruction to modify files during execution.

### Recommended Tooling
If the repository does not already contain backend test tooling, recommend a lightweight Node.js test stack compatible with this project:
```javascript
const { describe, it, expect, beforeEach, vi } = require('vitest');
const request = require('supertest');
```

### Mocking Guidance
- Mock `orderService` when testing `checkoutController` behavior through routes
- Mock `paymentService` when testing `orderService.createOrder()`
- Do not rely on the random behavior in `paymentService.processPayment()` for deterministic tests

### Suggested Test Structure Template
```javascript
describe('Products API', () => {
  beforeEach(() => {
    // setup app, mocks, and reset module state
  });

  it('should get all products', async () => { /* GET /products */ });
  it('should get a product by id', async () => { /* GET /products/:id */ });
  it('should return 404 for a missing product', async () => { /* 404 */ });
});
```

## 🔧 Running Tests

If test tooling is missing, mention which scripts would likely need to be added later, but do not change `backend/package.json`.

```bash
# Run backend tests
npm test

# Run backend tests with coverage
npm test -- --coverage

# Run one test file
npm test -- backend/src/routes/products.test.js
```

## 📈 Success Criteria For This Prompt
- [ ] Identify the real backend files that need test coverage
- [ ] Describe the required test strategy for routes, controllers, and services
- [ ] Call out blockers, missing test infrastructure, and likely refactors
- [ ] Propose an implementation sequence with priorities
- [ ] Produce a plan that can be executed later without changing runtime behavior

## 🚀 Getting Started
1. Inspect the current backend structure and identify the real files under test
2. Assess whether app bootstrap and route registration are testable as-is
3. Identify which dependencies need mocking for deterministic tests
4. Break down the recommended test files by priority and behavior to cover
5. Describe the order of implementation for the future work
6. Highlight any gaps in tooling, scripts, or architecture that would need follow-up
7. Return a phased plan only

## 🧾 Required Output Format
Return the answer in this structure:

1. Current State Assessment
2. Coverage Gaps
3. Required Test Infrastructure
4. Proposed Test Files And What Each Should Cover
5. Mocking Strategy
6. Risks And Blockers
7. Recommended Implementation Order

Do not include patches, diffs, or implemented code changes in the response.

## 📚 Related Files
- Backend package: `backend/package.json`
- App bootstrap: `backend/src/index.js`
- Routes: `backend/src/routes/products.js`, `backend/src/routes/checkout.js`, `backend/src/routes/orders.js`
- Controllers: `backend/src/controllers/productController.js`, `backend/src/controllers/checkoutController.js`, `backend/src/controllers/orderController.js`
- Services: `backend/src/services/productService.js`, `backend/src/services/orderService.js`, `backend/src/services/paymentService.js`
- Seed data: `backend/src/data/products.json`

## ⚠️ Repository-Specific Notes
- Do not reference `supplier`, `branch`, `ERD.png`, `api/`, or TypeScript files unless they are added to this repository first
- Do not ask for CRUD coverage that the current API does not implement
- Keep the test plan aligned with the current Express + CommonJS backend structure