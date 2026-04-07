import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct } from '../services/api';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetail() {
  const { t } = useApp();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner text={t('product.loading')} />;

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 dark:text-red-400 text-lg">
          ⚠️ {error || t('product.notFound')}
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← {t('nav.catalog')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6"
      >
        ← {t('nav.catalog')}
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="aspect-video">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {product.title}
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              R$ {product.price.toFixed(2)}
            </span>
            <Link
              to={`/finalizar-compra/${product.id}`}
              className="inline-flex items-center px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-sm"
            >
              {t('product.buyNow')}
            </Link>
          </div>

          <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              O que voce vai aprender
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400 mt-1">✓</span>
                <span>Projetos praticos e exercicios aplicados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400 mt-1">✓</span>
                <span>Boas praticas e padroes usados no mercado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400 mt-1">✓</span>
                <span>Acesso vitalicio ao conteudo do curso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400 mt-1">✓</span>
                <span>Certificado de conclusao</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
