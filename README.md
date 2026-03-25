# LearnHub — Infoproduct Platform

A minimal but production-like infoproduct platform (Hotmart-like) where users can browse a catalog of courses, purchase them, and access the content.

## 🧱 Architecture

- **Backend:** Node.js + Express (REST API)
- **Frontend:** React (Vite) + TailwindCSS
- **Storage:** In-memory (no database required)
- **Payment:** Mock payment gateway (easily replaceable with Stripe, etc.)

## 📁 Project Structure

```
backend/
  src/
    routes/          # Express route definitions
    controllers/     # Request handlers
    services/        # Business logic (products, orders, payments)
    data/            # JSON data (products catalog)

frontend/
  src/
    pages/           # React page components
    components/      # Reusable UI components
    services/        # API client layer
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The API server will start on **http://localhost:3001**.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will open on **http://localhost:5173**.

> The frontend proxies API requests to the backend via Vite's dev server proxy configuration.

## 🔌 API Endpoints

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| GET    | `/products`           | List all courses               |
| GET    | `/products/:id`       | Get a single course            |
| POST   | `/checkout`           | Purchase a course              |
| GET    | `/orders/:userEmail`  | Get purchased courses by email |
| GET    | `/health`             | Health check                   |

### POST /checkout body

```json
{
  "productId": "course-1",
  "userEmail": "user@example.com"
}
```

## 🎨 Features

- **Catalog Page** — Browse all available courses with pricing
- **Product Detail** — View full course description with purchase button
- **Checkout** — Enter email and complete purchase (mock payment)
- **My Courses** — Enter email to view purchased courses and watch embedded videos
- **Toast Notifications** — Success/error feedback
- **Loading States** — Spinners during data fetching
- **Responsive Design** — Works on mobile and desktop
- **Payment Abstraction** — Mock gateway ready to be replaced with Stripe/PayPal
