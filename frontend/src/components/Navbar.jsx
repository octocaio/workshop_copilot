import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/useTheme';

const LANGUAGES = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleDark } = useTheme();

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('learnhub_lang', code);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">LearnHub</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              {t('navbar.catalog')}
            </Link>
            <Link
              to="/meus-cursos"
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              {t('navbar.myCourses')}
            </Link>

            <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-lg p-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-label={`Switch to ${lang.label}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <button
              onClick={toggleDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
