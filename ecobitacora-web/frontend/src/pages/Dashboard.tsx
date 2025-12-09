import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, TrendingUp, Globe } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useLanguageStore } from '@/store/languageStore';
// import CountUp from 'react-countup';
import StatsCard from '@/components/dashboard/StatsCard';
import ImpactVisual from '@/components/dashboard/ImpactVisual';
import RecentActions from '@/components/dashboard/RecentActions';
import MotivationalQuote from '@/components/dashboard/MotivationalQuote';
import DailyChallenge from '@/components/dashboard/DailyChallenge';
import AddActionModal from '@/components/AddActionModal';
import StreakWarning from '@/components/StreakWarning';

export default function Dashboard() {
  const { user, actions } = useStore();
  const { t } = useLanguageStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const [currentPhrase] = useState(t('dashboard.phrase'));

  if (!user) return <div>{t('common.loading')}</div>;

  return (
    <div className="space-y-4 md:space-y-8 pb-20 md:pb-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary via-accent to-primary-dark rounded-2xl md:rounded-3xl p-4 md:p-8 overflow-hidden shadow-2xl"
      >
        {/* Animated Background */}
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
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 text-white pr-16 md:pr-24">
          <motion.h1
            className="text-2xl md:text-4xl font-bold mb-1 md:mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t('dashboard.welcome', { name: user.name })}
          </motion.h1>
          <motion.p
            className="text-sm md:text-xl opacity-90"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {currentPhrase}
          </motion.p>

          {/* Floating Earth */}
          <motion.div
            className="absolute right-2 top-1/2 -translate-y-1/2 text-4xl md:text-8xl"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            }}
          >
            🌍
          </motion.div>
        </div>
      </motion.div>

      {/* Streak Warning */}
      <StreakWarning streak={user.streak} lastActionDate={user.lastActionDate} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={Flame}
          title={t('dashboard.streak')}
          value={user.streak}
          suffix={` ${t('common.days')}`}
          color="streak"
          subtitle={`${t('dashboard.record').replace('{days}', user.maxStreak.toString())}`}
          delay={0}
        />
        <StatsCard
          icon={TrendingUp}
          title={t('dashboard.level')}
          value={user.level}
          color="primary"
          subtitle={`${user.xp % 1000} / 1000 XP`}
          progress={(user.xp % 1000) / 1000}
          delay={0.1}
        />
        <StatsCard
          icon={Globe}
          title={t('dashboard.co2')}
          value={user.totalCO2}
          suffix={` ${t('common.kg')}`}
          color="success"
          subtitle={`${Math.floor(user.totalCO2 / 22)} ${t('dashboard.treesPlanted')}`}
          delay={0.2}
        />
      </div>

      {/* Impact Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImpactVisual
          type="forest"
          value={user.totalCO2}
          title={t('dashboard.virtualForest')}
          icon="🌳"
        />
        <ImpactVisual
          type="distance"
          value={user.totalCO2}
          title={t('dashboard.kmSaved')}
          icon="🚴"
        />
        <ImpactVisual
          type="energy"
          value={user.totalCO2}
          title={t('categories.energy')}
          icon="💡"
        />
        <ImpactVisual
          type="water"
          value={user.totalCO2}
          title={t('categories.water')}
          icon="💧"
        />
      </div>

      {/* Recent Actions & Motivational */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActions actions={actions.slice(0, 5)} />
        </div>
        <div className="space-y-6">
          <MotivationalQuote />
          <DailyChallenge />
        </div>
      </div>

      {/* Floating Add Button */}
      <motion.button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 left-6 bg-success text-white p-4 rounded-full shadow-2xl z-40"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(102, 187, 106, 0.7)',
            '0 0 0 20px rgba(102, 187, 106, 0)',
          ],
        }}
        transition={{
          boxShadow: {
            duration: 1.5,
            repeat: Infinity,
          },
        }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Add Action Modal */}
      <AddActionModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
