import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchOrders } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProgress } from '../hooks/useProgress';

const STORAGE_KEY = 'learnhub_progress';

function loadAllProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export default function MyCourses({ addToast }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchingId, setWatchingId] = useState(null);
  const [progress, setProgress] = useState(() => loadAllProgress());

  const { markComplete, updateLastWatched, getLastWatchedCourseId } = useProgress();

  const handleFetch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrders(null);

    try {
      const data = await fetchOrders(email);
      setOrders(data);
      setProgress(loadAllProgress());
      if (data.length === 0) {
        addToast(t('myCourses.noCoursesFound'), 'info');
      }
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = useCallback((orderId, courseId) => {
    const isOpening = watchingId !== orderId;
    setWatchingId(isOpening ? orderId : null);
    if (isOpening) {
      updateLastWatched(courseId);
      setProgress(loadAllProgress());
    }
  }, [watchingId, updateLastWatched]);

  const handleMarkComplete = useCallback((courseId) => {
    markComplete(courseId);
    setProgress(loadAllProgress());
  }, [markComplete]);

  const courseIds = orders ? orders.map((o) => o.product.id) : [];
  const lastWatchedId = getLastWatchedCourseId(courseIds);

  const continueOrder = orders?.find(
    (o) => o.product.id === lastWatchedId && !progress[o.product.id]?.completed
  );

  const completedCount = orders
    ? orders.filter((o) => progress[o.product.id]?.completed).length
    : 0;

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('myCourses.title')}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{t('myCourses.subtitle')}</p>
      </div>

      <form onSubmit={handleFetch} className="max-w-md mx-auto flex gap-3 mb-10">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={t('myCourses.emailPlaceholder')}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? t('common.loading') : t('myCourses.search')}
        </button>
      </form>

      {loading && <LoadingSpinner text={t('myCourses.searching')} />}

      {error && <p className="text-center text-red-500">⚠️ {error}</p>}

      {orders?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">{t('myCourses.noCoursesTitle')}</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{t('myCourses.noCoursesSubtitle')}</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-8">
          {/* Stats bar */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <span className="text-2xl">📚</span>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('myCourses.myLibrary')}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{orders.length}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('myCourses.completedCourses')}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{completedCount}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <span className="text-2xl">▶️</span>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('myCourses.inProgress')}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{orders.length - completedCount}</p>
              </div>
            </div>
          </div>

          {/* Continue watching */}
          {continueOrder && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {t('myCourses.continueWatchingSection')}
              </h2>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-700 rounded-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={continueOrder.product.thumbnail}
                    alt={continueOrder.product.title}
                    className="w-full sm:w-48 h-32 object-cover"
                  />
                  <div className="flex-1 p-5 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {continueOrder.product.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t('myCourses.purchasedOn', {
                          date: new Date(continueOrder.purchasedAt).toLocaleDateString(),
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleWatch(continueOrder.orderId, continueOrder.product.id)}
                      className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {watchingId === continueOrder.orderId
                        ? t('myCourses.close')
                        : t('myCourses.continueWatching')}
                    </button>
                  </div>
                </div>
                {watchingId === continueOrder.orderId && (
                  <div className="border-t border-indigo-100 dark:border-indigo-700">
                    <div className="aspect-video">
                      <iframe
                        src={continueOrder.product.videoUrl}
                        title={continueOrder.product.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All courses */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {t('myCourses.coursesCount', { count: orders.length })}
            </h2>

            <div className="space-y-4">
              {orders.map((order) => {
                const courseProgress = progress[order.product.id] || {};
                const isWatching = watchingId === order.orderId;

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
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {order.product.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {t('myCourses.purchasedOn', {
                                date: new Date(order.purchasedAt).toLocaleDateString(),
                              })}
                            </p>
                          </div>
                          {courseProgress.completed && (
                            <span className="shrink-0 text-sm text-green-600 dark:text-green-400 font-medium">
                              {t('myCourses.completed')}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleWatch(order.orderId, order.product.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            {isWatching ? t('myCourses.close') : t('myCourses.watch')}
                          </button>

                          {!courseProgress.completed && (
                            <button
                              onClick={() => handleMarkComplete(order.product.id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                            >
                              {t('myCourses.markComplete')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {isWatching && (
                      <div className="border-t border-gray-100 dark:border-gray-700">
                        <div className="aspect-video">
                          <iframe
                            src={order.product.videoUrl}
                            title={order.product.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

MyCourses.propTypes = {
  addToast: PropTypes.func.isRequired,
};

