import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Carregando cursos..." />;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">⚠️ {error}</p>
        <button
          onClick={() => globalThis.location.reload()}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">
          Evolua Suas Habilidades
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
          Descubra cursos de alta qualidade com especialistas do mercado.
          Comece hoje e acelere sua carreira.
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
