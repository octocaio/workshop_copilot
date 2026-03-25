import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text={t('home.loadingCourses')} />;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">⚠️ {error}</p>
        <button
          onClick={() => globalThis.location.reload()}
          className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {t('home.title')}
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
