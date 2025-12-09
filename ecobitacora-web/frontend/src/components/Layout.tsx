import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BarChart3, User, Users, Target, TrendingUp, FileText, Globe, LogOut, Heart } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import Chatbot from './Chatbot';
import FloatingParticles from './FloatingParticles';
import EcobitacoraLogo from './EcobitacoraLogo';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguageStore();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/stats', icon: BarChart3, label: t('nav.stats') },
    { path: '/analytics', icon: TrendingUp, label: t('nav.analytics') },
    { path: '/reports', icon: FileText, label: t('nav.reports') },
    { path: '/community', icon: Users, label: t('nav.community') },
    { path: '/challenges', icon: Target, label: t('nav.challenges') },
    { path: '/profile', icon: User, label: t('nav.profile') },
    { path: '/donate', icon: Heart, label: 'Donar', color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-bg-main relative overflow-hidden">
      <FloatingParticles />
      
      {/* Header - Desktop */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="hidden md:block bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-8">
            <Link to="/" className="group flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <EcobitacoraLogo className="w-8 h-8 text-primary" showText={true} />
              </motion.div>
            </Link>

            <nav className="flex items-center space-x-1 flex-1 justify-end">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isDonate = item.path === '/donate';
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? isDonate
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-primary text-white shadow-lg'
                          : isDonate
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-text-secondary hover:bg-bg-card'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
              
              {/* Language Selector */}
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-text-secondary hover:bg-bg-card transition-all"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase">{language}</span>
                </motion.button>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={() => setLanguage('es')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-t-lg flex items-center space-x-2"
                  >
                    <span>🇪🇸</span>
                    <span>Español</span>
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => setLanguage('pt')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-b-lg flex items-center space-x-2"
                  >
                    <span>🇧🇷</span>
                    <span>Português</span>
                  </button>
                </div>
              </div>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
                <span>Salir</span>
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Header Mobile - Logo Only */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="md:hidden bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40"
      >
        <div className="px-4">
          <div className="flex justify-center items-center h-14">
            <Link to="/">
              <EcobitacoraLogo className="w-6 h-6 text-primary" showText={true} />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8 relative z-10">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Chatbot */}
      <Chatbot />

      {/* Bottom Navigation - Mobile Only */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom"
      >
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center justify-center py-2 ${
                    isActive ? 'text-primary' : 'text-text-secondary'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
                  <span className="text-xs mt-1">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
