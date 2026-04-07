import PropTypes from 'prop-types';
import { useState } from 'react';
import { fetchOrders } from '../services/api';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MyCourses({ addToast }) {
  const { t } = useApp();
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchingId, setWatchingId] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrders(null);

    try {
      const data = await fetchOrders(email);
      setOrders(data);
      if (data.length === 0) {
        addToast(t('myCourses.noCourses'), 'info');
      }
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('myCourses.title')}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t('myCourses.subtitle')}
        </p>
      </div>

      <form
        onSubmit={handleFetch}
        className="max-w-md mx-auto flex gap-3 mb-10"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={t('myCourses.emailPlaceholder')}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50"
        >
          {loading ? t('myCourses.loading') : t('myCourses.view')}
        </button>
      </form>

      {loading && <LoadingSpinner text={t('myCourses.searching')} />}

      {error && (
        <p className="text-center text-red-500 dark:text-red-400">⚠️ {error}</p>
      )}

      {orders?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t('myCourses.noCourses')}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            {t('myCourses.buyFirst')}
          </p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('myCourses.coursesCount')(orders.length)}
          </h2>

          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors"
            >
              <div className="flex flex-col sm:flex-row">
                <img
                  src={order.product.thumbnail}
                  alt={order.product.title}
                  className="w-full sm:w-48 h-32 object-cover"
                />
                <div className="flex-1 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {order.product.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('myCourses.purchasedOn')}{' '}
                    {new Date(order.purchasedAt).toLocaleDateString()}
                  </p>
                  {order.progress && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {t('myCourses.progress')}:
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {order.progress.progress}%
                        </span>
                        {order.progress.completed && (
                          <span className="text-green-600 dark:text-green-400 text-xs font-semibold">
                            ✓ {t('myCourses.completed')}
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${order.progress.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setWatchingId(
                        watchingId === order.orderId ? null : order.orderId
                      )
                    }
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                  >
                    {watchingId === order.orderId
                      ? '⏸️ ' + t('myCourses.close')
                      : '▶️ ' + t('myCourses.watch')}
                  </button>
                </div>
              </div>

              {watchingId === order.orderId && (
                <div className="border-t border-gray-100 dark:border-gray-700">
                  <div className="aspect-video">
                    <iframe
                      src={order.product.videoUrl}
                      title={order.product.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

MyCourses.propTypes = {
  addToast: PropTypes.func.isRequired,
};
