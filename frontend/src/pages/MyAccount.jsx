import PropTypes from 'prop-types';
import { useState } from 'react';
import { fetchOrders, updateProgress } from '../services/api';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MyAccount({ addToast }) {
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

  const handleToggleComplete = async (order) => {
    try {
      const newCompleted = !order.progress.completed;
      await updateProgress(order.orderId, email, {
        completed: newCompleted,
      });

      // Atualiza localmente
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === order.orderId
            ? {
                ...o,
                progress: {
                  ...o.progress,
                  completed: newCompleted,
                  progress: newCompleted ? 100 : o.progress.progress,
                },
              }
            : o
        )
      );

      addToast(
        newCompleted
          ? t('account.markComplete')
          : t('account.markIncomplete'),
        'success'
      );
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleUpdateProgress = async (order, newProgress) => {
    try {
      await updateProgress(order.orderId, email, {
        progress: newProgress,
      });

      // Atualiza localmente
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === order.orderId
            ? {
                ...o,
                progress: {
                  ...o.progress,
                  progress: newProgress,
                },
              }
            : o
        )
      );
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const continueWatchingCourses = orders?.filter(
    (o) => o.progress.progress > 0 && o.progress.progress < 100
  );
  const completedCourses = orders?.filter((o) => o.progress.completed);
  const notStartedCourses = orders?.filter((o) => o.progress.progress === 0);

  return (
    <div className="dark:text-gray-100">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('account.title')}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t('account.subtitle')}
        </p>
      </div>

      {!orders && (
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
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {loading ? t('account.loading') : t('account.access')}
          </button>
        </form>
      )}

      {loading && <LoadingSpinner text={t('myCourses.searching')} />}

      {error && (
        <p className="text-center text-red-500 dark:text-red-400">⚠️ {error}</p>
      )}

      {orders?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t('account.noCourses')}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            {t('account.buyFirst')}
          </p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-8">
          {/* Continue Watching Section */}
          {continueWatchingCourses && continueWatchingCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('myCourses.continueWatching')}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {continueWatchingCourses.map((order) => (
                  <CourseCard
                    key={order.orderId}
                    order={order}
                    onToggleComplete={() => handleToggleComplete(order)}
                    onUpdateProgress={(progress) =>
                      handleUpdateProgress(order, progress)
                    }
                    watchingId={watchingId}
                    setWatchingId={setWatchingId}
                    t={t}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Not Started Section */}
          {notStartedCourses && notStartedCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('account.library')}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {notStartedCourses.map((order) => (
                  <CourseCard
                    key={order.orderId}
                    order={order}
                    onToggleComplete={() => handleToggleComplete(order)}
                    onUpdateProgress={(progress) =>
                      handleUpdateProgress(order, progress)
                    }
                    watchingId={watchingId}
                    setWatchingId={setWatchingId}
                    t={t}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Section */}
          {completedCourses && completedCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('myCourses.completed')}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedCourses.map((order) => (
                  <CourseCard
                    key={order.orderId}
                    order={order}
                    onToggleComplete={() => handleToggleComplete(order)}
                    onUpdateProgress={(progress) =>
                      handleUpdateProgress(order, progress)
                    }
                    watchingId={watchingId}
                    setWatchingId={setWatchingId}
                    t={t}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CourseCard({
  order,
  onToggleComplete,
  onUpdateProgress,
  watchingId,
  setWatchingId,
  t,
}) {
  const isWatching = watchingId === order.orderId;
  const progressPercent = order.progress.progress || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="relative">
        <img
          src={order.product.thumbnail}
          alt={order.product.title}
          className="w-full h-40 object-cover"
        />
        {order.progress.completed && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ✓ {t('myCourses.completed')}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {order.product.title}
        </h3>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">
              {t('account.progress')}
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setWatchingId(isWatching ? null : order.orderId)}
            className="flex-1 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            {isWatching ? '⏸️ ' + t('myCourses.close') : '▶️ ' + t('myCourses.watch')}
          </button>
          <button
            onClick={onToggleComplete}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              order.progress.completed
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={
              order.progress.completed
                ? t('account.markIncomplete')
                : t('account.markComplete')
            }
          >
            {order.progress.completed ? '✓' : '○'}
          </button>
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
            ></iframe>
          </div>
          {/* Progress slider */}
          <div className="p-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercent}
              onChange={(e) => onUpdateProgress(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}

MyAccount.propTypes = {
  addToast: PropTypes.func.isRequired,
};

CourseCard.propTypes = {
  order: PropTypes.object.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onUpdateProgress: PropTypes.func.isRequired,
  watchingId: PropTypes.string,
  setWatchingId: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};
