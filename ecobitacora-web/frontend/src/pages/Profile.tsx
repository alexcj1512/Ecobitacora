// import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useLanguageStore } from '@/store/languageStore';
import { ACHIEVEMENTS } from '@/types';
import { Award, TrendingUp, Calendar, Zap, Download, FileJson, Copy } from 'lucide-react';
import CountUp from 'react-countup';
import { getIconColor } from '@/utils/colors';
import { exportToCSV, exportToJSON, copyToClipboard } from '@/utils/export';

export default function Profile() {
  const { user } = useStore();
  const { t } = useLanguageStore();

  if (!user) return <div>{t('common.loading')}</div>;

  const userStats = [
    { icon: TrendingUp, label: t('dashboard.level'), value: user.level, color: 'primary' },
    { icon: Zap, label: t('profile.totalXP'), value: user.xp, color: 'energy' },
    { icon: Calendar, label: t('dashboard.streak'), value: user.streak, suffix: ` ${t('common.days')}`, color: 'streak' },
    { icon: Award, label: t('profile.achievements'), value: user.achievements.length, color: 'success' },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary via-accent to-primary-dark rounded-3xl p-8 overflow-hidden shadow-2xl"
      >
        {/* Parallax Background */}
        <motion.div
          className="absolute inset-0 opacity-20"
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
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex items-center space-x-6">
          {/* Avatar */}
          <motion.div
            className="w-32 h-32 rounded-full bg-white text-primary flex items-center justify-center text-5xl font-bold shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {user.name.charAt(0).toUpperCase()}
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-white">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full mt-3"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(255,255,255,0.4)',
                  '0 0 0 10px rgba(255,255,255,0)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Award className="w-5 h-5" />
              <span className="font-bold">{t('dashboard.level')} {user.level}</span>
            </motion.div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="relative z-10 mt-6">
          <div className="flex justify-between text-white text-sm mb-2">
            <span>{t('challenge.progress')}</span>
            <span>{user.xp % 1000} / 1000 XP</span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((user.xp % 1000) / 1000) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {userStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg text-center"
              data-aos="zoom-in"
              data-aos-delay={i * 100}
            >
              <Icon className={`w-8 h-8 ${getIconColor(stat.color)} mx-auto mb-3`} />
              <p className="text-3xl font-bold text-text-primary">
                <CountUp end={stat.value} duration={2} />
                {stat.suffix}
              </p>
              <p className="text-text-secondary text-sm mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
        data-aos="fade-up"
      >
        <h2 className="text-2xl font-bold text-text-primary mb-6">{t('profile.achievements')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ACHIEVEMENTS.map((achievement, i) => {
            const isUnlocked = user.achievements.includes(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, rotateY: 180 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1, rotateY: 360 }}
                className={`relative p-4 rounded-xl text-center cursor-pointer ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg'
                    : 'bg-gray-100 text-gray-400'
                }`}
                style={{ perspective: '1000px' }}
              >
                {/* Locked Overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                    <span className="text-4xl">🔒</span>
                  </div>
                )}

                <motion.div
                  className="text-4xl mb-2"
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
                <p className="font-bold text-sm">{achievement.name}</p>
                <p className="text-xs opacity-80 mt-1">{achievement.description}</p>

                {/* Shine Effect for Unlocked */}
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

      {/* Export Data Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center space-x-2">
          <Download className="w-6 h-6 text-primary" />
          <span>{t('profile.exportData')}</span>
        </h2>
        <p className="text-text-secondary mb-6">
          {t('profile.exportDesc')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportToCSV(useStore.getState().actions, user)}
            className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>{t('profile.exportCSV')}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => exportToJSON(useStore.getState().actions, user)}
            className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg"
          >
            <FileJson className="w-5 h-5" />
            <span>{t('profile.exportJSON')}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              await copyToClipboard(useStore.getState().actions, user);
              alert(t('common.success'));
            }}
            className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg"
          >
            <Copy className="w-5 h-5" />
            <span>{t('profile.copy')}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Member Since */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-text-secondary"
      >
        <p>
          {t('profile.memberSince')}{' '}
          {new Date(user.createdAt).toLocaleDateString('es', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </motion.div>
    </div>
  );
}
