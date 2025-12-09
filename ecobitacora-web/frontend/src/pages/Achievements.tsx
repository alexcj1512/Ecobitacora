import { motion } from 'framer-motion';
import { Award, Lock, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ACHIEVEMENTS } from '@/types';
import CountUp from 'react-countup';

export default function Achievements() {
  const { user } = useStore();

  if (!user) return <div>Cargando...</div>;

  const unlockedCount = user.achievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const progress = (unlockedCount / totalCount) * 100;

  const categories = [
    {
      name: 'Rachas',
      achievements: ACHIEVEMENTS.filter((a) => a.id.includes('streak')),
      color: 'from-streak to-orange-500',
    },
    {
      name: 'CO₂ Ahorrado',
      achievements: ACHIEVEMENTS.filter((a) => a.id.includes('co2')),
      color: 'from-success to-green-600',
    },
    {
      name: 'Niveles',
      achievements: ACHIEVEMENTS.filter((a) => a.id.includes('level')),
      color: 'from-primary to-accent',
    },
    {
      name: 'Acciones',
      achievements: ACHIEVEMENTS.filter((a) => a.id.includes('action')),
      color: 'from-energy to-orange-400',
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-energy to-streak rounded-2xl p-6 text-white"
      >
        <div className="flex items-center space-x-3 mb-2">
          <Award className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-bold">Logros</h1>
        </div>
        <p className="opacity-90 text-sm md:text-base">
          Desbloquea todos los achievements 🏆
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">Tu Progreso</h2>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">
              <CountUp end={unlockedCount} duration={2} />
              <span className="text-xl text-text-secondary">/{totalCount}</span>
            </p>
            <p className="text-xs text-text-secondary">Desbloqueados</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-energy to-streak"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5 }}
            />
          </div>
          <p className="text-sm text-text-secondary text-center">
            {progress.toFixed(0)}% completado
          </p>
        </div>
      </motion.div>

      {/* Achievements by Category */}
      {categories.map((category, catIndex) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.1 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-lg"
        >
          <h3 className="text-lg md:text-xl font-bold text-text-primary mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5 text-energy" />
            <span>{category.name}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {category.achievements.map((achievement, i) => {
              const isUnlocked = user.achievements.includes(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                  className={`relative p-4 rounded-xl text-center cursor-pointer ${
                    isUnlocked
                      ? `bg-gradient-to-br ${category.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {/* Locked Overlay */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                      <Lock className="w-8 h-8" />
                    </div>
                  )}

                  {/* Checkmark for Unlocked */}
                  {isUnlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1"
                    >
                      <CheckCircle className="w-5 h-5 text-success" />
                    </motion.div>
                  )}

                  <motion.div
                    className="text-4xl md:text-5xl mb-2"
                    animate={
                      isUnlocked
                        ? {
                            rotate: [0, 10, -10, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    {achievement.icon}
                  </motion.div>
                  <p className="font-bold text-xs md:text-sm mb-1">{achievement.name}</p>
                  <p className="text-xs opacity-80">{achievement.description}</p>

                  {/* Shine Effect */}
                  {isUnlocked && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                      animate={{
                        x: ['-100%', '200%'],
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Motivation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white text-center"
      >
        <TrendingUp className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl md:text-2xl font-bold mb-2">
          ¡Sigue Desbloqueando Logros!
        </h3>
        <p className="opacity-90 text-sm md:text-base">
          Cada logro te acerca más a ser un verdadero Eco Warrior 🌱
        </p>
      </motion.div>
    </div>
  );
}
