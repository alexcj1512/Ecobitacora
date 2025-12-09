import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import EcobitacoraLogo from '@/components/EcobitacoraLogo';

// Mock data - Para presentación
const mockCredentials = {
  email: "demo@ecobitacora.com",
  password: "demo123"
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Cuando intente login con estos datos, entra sin backend
      if (email === mockCredentials.email && password === mockCredentials.password) {
        // Entra directo al dashboard con datos ficticios
        localStorage.setItem("user", JSON.stringify({
          name: "Demo User",
          email: email,
          xp: 2500,
          level: 10
        }));
        localStorage.setItem('userId', 'demo-user-id');
        
        // Redirigir al dashboard
        navigate('/');
        window.location.reload();
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userId', data.user.id);

      // Redirigir al dashboard
      navigate('/');
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating Leaves */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -50,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 50,
            rotate: 360,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          🍃
        </motion.div>
      ))}

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <EcobitacoraLogo className="w-12 h-12" showText={true} />
        </div>

        <h1 className="text-3xl font-bold text-center text-text-primary mb-2">
          ¡Bienvenido de vuelta!
        </h1>
        <p className="text-center text-text-secondary mb-8">
          Inicia sesión para continuar tu viaje ecológico 🌱
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Iniciar Sesión</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-text-secondary">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Decorative Element */}
        <motion.div
          className="mt-8 flex items-center justify-center space-x-2 text-text-secondary text-sm"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <Leaf className="w-4 h-4 text-primary" />
          <span>Juntos por un planeta más verde</span>
          <Leaf className="w-4 h-4 text-accent" />
        </motion.div>
      </motion.div>
    </div>
  );
}
