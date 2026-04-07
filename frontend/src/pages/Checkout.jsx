import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct, submitCheckout } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Checkout({ addToast }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct(productId)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await submitCheckout(productId);
      setSuccess(result);
      addToast('Compra concluida com sucesso! 🎉', 'success');
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Carregando checkout..." />;

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">⚠️ Produto nao encontrado</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Voltar ao catalogo
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Compra Realizada!
        </h1>
        <p className="text-gray-600 mb-2">
          Obrigado por comprar <strong>{product.title}</strong>.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          ID do pedido: {success.orderId}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/meus-cursos"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Ir para Meus Cursos
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Ver Mais Cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        to={`/produto/${productId}`}
        className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6"
      >
        ← Voltar ao curso
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Finalizar Compra</h1>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{product.title}</h3>
            <p className="text-indigo-600 font-bold">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processando...
              </>
            ) : (
              `Concluir compra — $${product.price.toFixed(2)}`
            )}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-400 text-center">
          🔒 Seu pagamento esta seguro. Este checkout e simulado.
        </p>
      </div>
    </div>
  );
}

Checkout.propTypes = {
  addToast: PropTypes.func.isRequired,
};
