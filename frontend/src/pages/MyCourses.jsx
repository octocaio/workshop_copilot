import { useState } from 'react';
import { fetchOrders } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MyCourses({ addToast }) {
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
        addToast('No courses found for this email', 'info');
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
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="mt-2 text-gray-500">
          Enter your email to access your purchased courses
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
          placeholder="you@example.com"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'View'}
        </button>
      </form>

      {loading && <LoadingSpinner text="Fetching your courses..." />}

      {error && (
        <p className="text-center text-red-500">⚠️ {error}</p>
      )}

      {orders && orders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-500 text-lg">
            No courses found for this email.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Purchase a course to get started!
          </p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {orders.length} course{orders.length > 1 ? 's' : ''} purchased
          </h2>

          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <img
                  src={order.product.thumbnail}
                  alt={order.product.title}
                  className="w-full sm:w-48 h-32 object-cover"
                />
                <div className="flex-1 p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {order.product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Purchased on{' '}
                    {new Date(order.purchasedAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() =>
                      setWatchingId(
                        watchingId === order.orderId ? null : order.orderId
                      )
                    }
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {watchingId === order.orderId ? '⏸️ Close' : '▶️ Watch'}
                  </button>
                </div>
              </div>

              {watchingId === order.orderId && (
                <div className="border-t border-gray-100">
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
