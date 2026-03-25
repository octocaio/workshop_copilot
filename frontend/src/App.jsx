import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastContainer, useToast } from './components/Toast';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import MyCourses from './pages/MyCourses';

export default function App() {
  const { toasts, addToast } = useToast();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ToastContainer toasts={toasts} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/checkout/:productId"
              element={<Checkout addToast={addToast} />}
            />
            <Route
              path="/my-courses"
              element={<MyCourses addToast={addToast} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
