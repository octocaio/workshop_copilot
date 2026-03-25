import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import MyCourses from './pages/MyCourses';
import Login from './pages/Login';
import Register from './pages/Register';
import { getCurrentUser } from './services/api';

export default function App() {
  const { toasts, addToast } = useToast();
  const [user, setUser] = useState(() => getCurrentUser());

  const handleAuthChange = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onAuthChange={handleAuthChange} addToast={addToast} />
        <ToastContainer toasts={toasts} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produto/:id" element={<ProductDetail />} />
            <Route
              path="/finalizar-compra/:productId"
              element={<Checkout addToast={addToast} />}
            />
            <Route
              path="/meus-cursos"
              element={<MyCourses addToast={addToast} />}
            />
            <Route
              path="/login"
              element={<Login addToast={addToast} onAuthChange={handleAuthChange} />}
            />
            <Route
              path="/cadastro"
              element={<Register addToast={addToast} onAuthChange={handleAuthChange} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
