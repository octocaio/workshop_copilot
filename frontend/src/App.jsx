import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import MyCourses from './pages/MyCourses';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };

function AppRoutes() {
  const { toasts, addToast } = useToast();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer toasts={toasts} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login addToast={addToast} />} />
          <Route path="/cadastro" element={<Register addToast={addToast} />} />
          <Route
            path="/finalizar-compra/:productId"
            element={
              <ProtectedRoute>
                <Checkout addToast={addToast} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meus-cursos"
            element={
              <ProtectedRoute>
                <MyCourses addToast={addToast} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
