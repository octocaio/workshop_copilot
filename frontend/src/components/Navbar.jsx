import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-gray-900">LearnHub</span>
          </Link>
          <div className="flex gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Catalog
            </Link>
            <Link
              to="/my-courses"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              My Courses
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
