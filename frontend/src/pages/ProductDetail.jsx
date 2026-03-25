import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetail() {
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

  if (loading) return <LoadingSpinner text="Loading course details..." />;

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">⚠️ {error || 'Course not found'}</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6"
      >
        ← Back to catalog
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="aspect-video">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          <p className="mt-4 text-gray-600 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-3xl font-bold text-indigo-600">
              ${product.price.toFixed(2)}
            </span>
            <Link
              to={`/checkout/${product.id}`}
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Purchase Now
            </Link>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              What you will learn
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Complete hands-on projects and exercises</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Industry best practices and patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Lifetime access to course content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Certificate of completion</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
