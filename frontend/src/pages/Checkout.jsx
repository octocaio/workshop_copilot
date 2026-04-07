import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchProduct, submitCheckout } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Checkout({ addToast }) {
  const { productId } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);
  const [email, setEmail] = useState('');
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
      const result = await submitCheckout(productId, email);
      setSuccess(result);
      addToast(t('checkout.purchaseSuccess'), 'success');
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text={t('checkout.loading')} />;

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">⚠️ {t('checkout.productNotFound')}</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
          {t('common.backToCatalog')}
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t('checkout.successTitle')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          {t('checkout.successMessage', { title: product.title })}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
          {t('checkout.orderId', { id: success.orderId })}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/meus-cursos"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t('checkout.goToMyCourses')}
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {t('checkout.seeMoreCourses')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        to={`/produto/${productId}`}
        className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6"
      >
        {t('checkout.backToCourse')}
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('checkout.title')}</h1>

        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{product.title}</h3>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t('checkout.emailLabel')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('checkout.emailPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
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
                {t('checkout.processing')}
              </>
            ) : (
              t('checkout.completePurchase', { price: product.price.toFixed(2) })
            )}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
          {t('checkout.securePayment')}
        </p>
      </div>
    </div>
  );
}

Checkout.propTypes = {
  addToast: PropTypes.func.isRequired,
};

