import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import MyCourses from './pages/MyCourses';
import MyAccount from './pages/MyAccount';

export default function App() {
  const { toasts, addToast } = useToast();

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Navbar />
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
                path="/minha-conta"
                element={<MyAccount addToast={addToast} />}
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
