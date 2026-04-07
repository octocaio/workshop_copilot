import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-gray-900">LearnHub</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Catalogo
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/meus-cursos"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Meus Cursos
                </Link>
                <span className="text-sm text-gray-500 hidden sm:block">{email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="px-4 py-2 bg-lime-400 text-gray-900 font-semibold rounded-lg hover:bg-lime-500 transition-colors text-sm"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
