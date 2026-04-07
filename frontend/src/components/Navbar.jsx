import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';

const LANG_LABELS = { pt: 'PT', en: 'EN', es: 'ES', de: 'DE' };

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();
  const { lang, t, setLanguage } = useI18n();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-200">
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
              {t('navbar.myAccount')}
            </Link>

            <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              {Object.entries(LANG_LABELS).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  aria-label={`${t('navbar.changeLangTo')} ${label}`}
                  className={`px-2 py-1 text-xs font-semibold transition-colors ${
                    lang === code
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              aria-label={dark ? t('navbar.lightMode') : t('navbar.darkMode')}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
