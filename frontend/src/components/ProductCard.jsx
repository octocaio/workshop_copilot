import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProductCard({ product }) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {product.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
            {t('productCard.viewDetails')}
          </span>
        </div>
      </div>
    </Link>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

