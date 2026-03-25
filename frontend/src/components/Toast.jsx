import PropTypes from 'prop-types';

export function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null;

  const bgMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${bgMap[toast.type] || bgMap.info} text-white px-5 py-3 rounded-lg shadow-lg animate-fade-in text-sm max-w-sm`}
          style={{
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          {toast.message}
        </div>
      ))}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};
