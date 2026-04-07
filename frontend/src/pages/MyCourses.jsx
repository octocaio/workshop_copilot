import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { fetchOrders } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useI18n } from '../hooks/useI18n';

const LS_LAST_WATCHED = 'learnhub_last_watched';
const LS_COMPLETED = 'learnhub_completed';

function getLastWatched() {
  try {
    const raw = localStorage.getItem(LS_LAST_WATCHED);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getCompleted() {
  try {
    const raw = localStorage.getItem(LS_COMPLETED);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLastWatched(orderId) {
  localStorage.setItem(LS_LAST_WATCHED, JSON.stringify({ orderId, at: Date.now() }));
}

function saveCompleted(set) {
  localStorage.setItem(LS_COMPLETED, JSON.stringify([...set]));
}

export default function MyCourses({ addToast }) {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchingId, setWatchingId] = useState(null);
  const [lastWatched, setLastWatched] = useState(() => getLastWatched());
  const [completed, setCompleted] = useState(() => getCompleted());

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrders(null);

    try {
      const data = await fetchOrders(email);
      setOrders(data);
      if (data.length === 0) {
        addToast(t('account.noCoursesFound'), 'info');
      }
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = useCallback((orderId) => {
    setWatchingId((prev) => {
      const next = prev === orderId ? null : orderId;
      if (next) {
        saveLastWatched(orderId);
        setLastWatched({ orderId, at: Date.now() });
      }
      return next;
    });
  }, []);

  const toggleComplete = useCallback((orderId) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      saveCompleted(next);
      return next;
    });
  }, []);

  const lastWatchedOrder =
    orders && lastWatched
      ? orders.find((o) => o.orderId === lastWatched.orderId)
      : null;

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('account.title')}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t('account.subtitle')}
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
          placeholder={t('account.emailPlaceholder')}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? t('account.loading') : t('account.see')}
        </button>
      </form>

      {loading && <LoadingSpinner text={t('account.searching')} />}

      {error && (
        <p className="text-center text-red-500">⚠️ {error}</p>
      )}

      {orders?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t('account.noCourses')}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            {t('account.buyCourse')}
          </p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-6">
          {lastWatchedOrder && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                ▶️ {t('account.continueWatching')}
              </h2>
              <div
                className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleWatch(lastWatchedOrder.orderId)}
              >
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={lastWatchedOrder.product.thumbnail}
                    alt={lastWatchedOrder.product.title}
                    className="w-full sm:w-48 h-32 object-cover"
                  />
                  <div className="flex-1 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {lastWatchedOrder.product.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t('account.purchasedAt')}{' '}
                      {new Date(lastWatchedOrder.purchasedAt).toLocaleDateString()}
                    </p>
                    {completed.has(lastWatchedOrder.orderId) && (
                      <span className="inline-block mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                        {t('account.completed')}
                      </span>
                    )}
                  </div>
                </div>
                {watchingId === lastWatchedOrder.orderId && (
                  <div className="border-t border-indigo-200 dark:border-indigo-700">
                    <div className="aspect-video">
                      <iframe
                        src={lastWatchedOrder.product.videoUrl}
                        title={lastWatchedOrder.product.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {orders.length}{' '}
            {orders.length > 1
              ? t('account.coursesBoughtMany')
              : t('account.coursesBoughtOne')}
          </h2>

          {orders.map((order) => {
            const isDone = completed.has(order.orderId);
            return (
              <div
                key={order.orderId}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={order.product.thumbnail}
                    alt={order.product.title}
                    className="w-full sm:w-48 h-32 object-cover"
                  />
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {order.product.title}
                      </h3>
                      {isDone && (
                        <span className="shrink-0 text-sm font-medium text-green-600 dark:text-green-400">
                          {t('account.completed')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t('account.purchasedAt')}{' '}
                      {new Date(order.purchasedAt).toLocaleDateString()}
                    </p>

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {t('account.progress')}
                        </span>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {isDone ? '100%' : '0%'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-500"
                          style={{ width: isDone ? '100%' : '0%' }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleWatch(order.orderId)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {watchingId === order.orderId
                          ? t('account.close')
                          : t('account.watch')}
                      </button>
                      <button
                        onClick={() => toggleComplete(order.orderId)}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          isDone
                            ? 'border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {isDone
                          ? t('account.markIncomplete')
                          : t('account.markComplete')}
                      </button>
                    </div>
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
            );
          })}
        </div>
      )}
    </div>
  );
}

MyCourses.propTypes = {
  addToast: PropTypes.func.isRequired,
};

