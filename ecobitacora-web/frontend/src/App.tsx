import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { api } from '@/utils/api';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Stats from '@/pages/Stats';
import Profile from '@/pages/Profile';
import Community from '@/pages/Community';
import Challenges from '@/pages/Challenges';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Donate from '@/pages/Donate';

// Componente para proteger rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userId = localStorage.getItem('userId');
  
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Componente para transiciones de página
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Stats />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Community />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenges"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Challenges />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Profile />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Analytics />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Reports />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/donate"
          element={
            <ProtectedRoute>
              <Layout>
                <PageTransition>
                  <Donate />
                </PageTransition>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

// Componente de transición de página
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const { setUser, setActions, setStats, setChatMessages } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const [user, actions, stats, chatHistory] = await Promise.all([
          api.getUser(),
          api.getActions({ limit: 10 }),
          api.getStats(),
          api.getChatHistory(),
        ]);
        setUser(user);
        setActions(actions);
        setStats(stats);
        setChatMessages(chatHistory);
      } catch (error) {
        console.error('Backend no disponible, usando datos de demo:', error);
        
        // SI FALLA, usa datos de demostración
        const demoUser = {
          id: 'demo-user-id',
          name: 'Demo User',
          email: 'demo@ecobitacora.com',
          xp: 2500,
          level: 10,
          totalCO2: 145.5,
          streak: 7,
          maxStreak: 15,
          lastActionDate: new Date().toISOString(),
          achievements: ['eco-warrior', 'green-champion', 'water-saver'],
          avatar: '🌱',
          createdAt: new Date().toISOString(),
        };

        const demoActions = [
          {
            id: '1',
            userId: 'demo-user-id',
            type: 'Usar bicicleta en lugar de auto',
            category: 'transport',
            co2Saved: 5.2,
            xpGained: 50,
            date: new Date().toISOString(),
          },
          {
            id: '2',
            userId: 'demo-user-id',
            type: 'Reciclar plástico',
            category: 'recycle',
            co2Saved: 2.1,
            xpGained: 30,
            date: new Date(Date.now() - 86400000).toISOString(),
          },
        ];

        const demoStats = {
          totalActions: 45,
          totalCO2: 145.5,
          totalXP: 2500,
          categoriesBreakdown: {
            transport: 45.2,
            recycle: 38.5,
            energy: 35.8,
            water: 26.0,
          },
          weeklyProgress: [
            { day: 'Lun', co2: 12 },
            { day: 'Mar', co2: 18 },
            { day: 'Mié', co2: 15 },
            { day: 'Jue', co2: 22 },
            { day: 'Vie', co2: 19 },
            { day: 'Sáb', co2: 25 },
            { day: 'Dom', co2: 20 },
          ],
        };

        setUser(demoUser);
        setActions(demoActions);
        setStats(demoStats);
        setChatMessages([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [setUser, setActions, setStats, setChatMessages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            🌱
          </motion.div>
          <p className="text-text-secondary">Cargando...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
