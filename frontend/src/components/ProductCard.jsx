import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-indigo-600 font-medium group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
