import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct, submitCheckout } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Checkout({ addToast }) {
  const { productId } = useParams();
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
      addToast('Purchase completed successfully! 🎉', 'success');
    } catch (err) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading checkout..." />;

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">⚠️ Product not found</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Back to catalog
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Purchase Successful!
        </h1>
        <p className="text-gray-600 mb-2">
          Thank you for purchasing <strong>{product.title}</strong>.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Order ID: {success.orderId}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/my-courses"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to My Courses
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Browse More Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link
        to={`/product/${productId}`}
        className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6"
      >
        ← Back to course
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

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
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

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
                Processing...
              </>
            ) : (
              `Complete Purchase — $${product.price.toFixed(2)}`
            )}
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-400 text-center">
          🔒 Your payment is secure. This is a simulated checkout.
        </p>
      </div>
    </div>
  );
}
