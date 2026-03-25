import PropTypes from 'prop-types';

export default function LoadingSpinner({ text = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">{text}</p>
    </div>
  );
}

LoadingSpinner.propTypes = {
  text: PropTypes.string,
};

