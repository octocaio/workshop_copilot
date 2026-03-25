import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { removeToken } from '../services/api';

export default function Navbar({ user, onAuthChange, addToast }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    onAuthChange();
    addToast('Voce saiu da sua conta', 'info');
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
            {user ? (
              <>
                <Link
                  to="/meus-cursos"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Meus Cursos
                </Link>
                <span className="text-sm text-gray-500">Ola, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
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
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.object,
  onAuthChange: PropTypes.func.isRequired,
  addToast: PropTypes.func.isRequired,
};
