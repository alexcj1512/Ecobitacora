import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp, Award, Crown } from 'lucide-react';
import CountUp from 'react-countup';
import { useLanguageStore } from '@/store/languageStore';

export default function Community() {
  const { t } = useLanguageStore();
  // Datos de ejemplo de la comunidad
  const topUsers = [
    { id: 1, name: 'Ana Verde', level: 15, co2: 250.5, streak: 45, avatar: '🌟' },
    { id: 2, name: 'Carlos Eco', level: 12, co2: 198.3, streak: 30, avatar: '🌿' },
    { id: 3, name: 'María Tierra', level: 11, co2: 175.8, streak: 28, avatar: '🌱' },
    { id: 4, name: 'Juan Bosque', level: 10, co2: 156.2, streak: 25, avatar: '🌳' },
    { id: 5, name: 'Laura Océano', level: 9, co2: 142.7, streak: 22, avatar: '💧' },
    { id: 6, name: 'Pedro Cielo', level: 8, co2: 128.4, streak: 20, avatar: '☁️' },
    { id: 7, name: 'Sofia Flor', level: 7, co2: 115.9, streak: 18, avatar: '🌸' },
    { id: 8, name: 'Diego Sol', level: 6, co2: 98.5, streak: 15, avatar: '☀️' },
  ];

  const communityStats = [
    { label: t('community.activeUsers'), value: 1247, icon: Users, color: 'text-primary' },
    { label: t('community.totalCO2'), value: 15680, suffix: 'kg', icon: TrendingUp, color: 'text-success' },
    { label: t('community.totalActions'), value: 8934, icon: Award, color: 'text-energy' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('community.title')}</h1>
        <p className="opacity-90">{t('community.subtitle')}</p>
      </motion.div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {communityStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-lg text-center"
            >
              <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl md:text-3xl font-bold text-text-primary">
                <CountUp end={stat.value} duration={2} />
                {stat.suffix}
              </p>
              <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 md:p-6 shadow-lg"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="w-6 h-6 text-energy" />
          <h2 className="text-xl md:text-2xl font-bold text-text-primary">{t('community.topWarriors')}</h2>
        </div>

        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl transition-all ${
                index < 3
                  ? 'bg-gradient-to-r from-energy/10 to-streak/10 border-2 border-energy/30'
                  : 'bg-bg-card hover:bg-bg-card/80'
              }`}
            >
              {/* Ranking Number */}
              <div className="relative">
                {index < 3 ? (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl md:text-4xl"
                  >
                    {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                  </motion.div>
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="text-3xl md:text-4xl">{user.avatar}</div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-primary truncate text-sm md:text-base">
                  {user.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-text-secondary mt-1">
                  <span className="flex items-center">
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    Nivel {user.level}
                  </span>
                  <span className="flex items-center">
                    🔥 {user.streak}d
                  </span>
                </div>
              </div>

              {/* CO2 */}
              <div className="text-right">
                <p className="text-lg md:text-xl font-bold text-success">
                  {user.co2}
                </p>
                <p className="text-xs text-text-secondary">kg CO₂</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 md:p-8 text-white text-center"
      >
        <Crown className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
        <h3 className="text-xl md:text-2xl font-bold mb-2">{t('community.joinTop')}</h3>
        <p className="opacity-90 mb-4 text-sm md:text-base">
          {t('community.registerMore')}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const myPosition = Math.floor(Math.random() * 50) + 10;
            const positionElement = document.createElement('div');
            positionElement.innerHTML = `
              <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; background: linear-gradient(135deg, #6B9080 0%, #8FAA96 100%); color: white; padding: 2rem; border-radius: 1.5rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; animation: slideIn 0.3s ease-out;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">Tu Posición</div>
                <div style="font-size: 4rem; font-weight: bold; margin: 1rem 0;">#${myPosition}</div>
                <div style="font-size: 1rem; opacity: 0.9;">¡Sigue así! 💪</div>
              </div>
              <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998; backdrop-filter: blur(4px);"></div>
              <style>
                @keyframes slideIn {
                  from { transform: translate(-50%, -60%); opacity: 0; }
                  to { transform: translate(-50%, -50%); opacity: 1; }
                }
              </style>
            `;
            document.body.appendChild(positionElement);
            setTimeout(() => positionElement.remove(), 2500);
          }}
          className="bg-white text-primary px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          {t('community.myPosition')}
        </motion.button>
      </motion.div>
    </div>
  );
}
