import { motion } from 'framer-motion';
import { Target, Calendar, Clock, CheckCircle, Star } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function Challenges() {
  const { t } = useLanguageStore();
  const dailyChallenge = {
    title: t('challenge.daily'),
    description: t('challenge.description'),
    progress: 0,
    goal: 1,
    reward: 50,
    icon: '🚴',
  };

  const weeklyChallenge = {
    title: t('challenges.title'),
    description: t('challenge.description'),
    progress: 2.5,
    goal: 5,
    reward: 200,
    icon: '♻️',
    daysLeft: 4,
  };

  const monthlyChallenge = {
    title: t('challenges.title'),
    description: t('challenge.description'),
    progress: 24.5,
    goal: 50,
    reward: 1000,
    icon: '🌍',
    daysLeft: 12,
  };

  const completedChallenges = [
    { title: 'Semana Verde', date: '15 Nov', reward: 200, icon: '🌱' },
    { title: 'Eco Warrior', date: '10 Nov', reward: 150, icon: '⚡' },
    { title: 'Ahorro de Agua', date: '5 Nov', reward: 100, icon: '💧' },
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
          <Target className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-bold">{t('challenges.title')}</h1>
        </div>
        <p className="opacity-90 text-sm md:text-base">
          {t('challenges.reward')} 🎯
        </p>
      </motion.div>

      {/* Daily Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 md:p-6 shadow-lg relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(90deg, #FFB74D, #FF6B35, #FFB74D)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute inset-[2px] bg-white rounded-2xl" />
        </motion.div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                className="text-4xl md:text-5xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {dailyChallenge.icon}
              </motion.div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-text-primary">
                  {dailyChallenge.title}
                </h3>
                <p className="text-sm text-text-secondary">{dailyChallenge.description}</p>
              </div>
            </div>
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-energy" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{t('challenge.progress')}</span>
              <span className="font-medium text-text-primary">
                {dailyChallenge.progress}/{dailyChallenge.goal}
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-energy to-streak"
                initial={{ width: 0 }}
                animate={{
                  width: `${(dailyChallenge.progress / dailyChallenge.goal) * 100}%`,
                }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-text-secondary">{t('challenges.reward')}:</span>
            <span className="font-bold text-primary text-lg">+{dailyChallenge.reward} XP</span>
          </div>
        </div>
      </motion.div>

      {/* Weekly & Monthly Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-recycle" />
              <h3 className="font-bold text-text-primary text-sm md:text-base">
                {weeklyChallenge.title}
              </h3>
            </div>
            <span className="text-xs bg-recycle/10 text-recycle px-2 py-1 rounded-full">
              {weeklyChallenge.daysLeft}{t('common.days')} {t('challenges.timeLeft')}
            </span>
          </div>

          <div className="text-center my-4">
            <motion.div
              className="text-5xl md:text-6xl mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {weeklyChallenge.icon}
            </motion.div>
            <p className="text-sm text-text-secondary">{weeklyChallenge.description}</p>
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-recycle"
                initial={{ width: 0 }}
                animate={{
                  width: `${(weeklyChallenge.progress / weeklyChallenge.goal) * 100}%`,
                }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">
                {weeklyChallenge.progress}kg / {weeklyChallenge.goal}kg
              </span>
              <span className="font-bold text-recycle">+{weeklyChallenge.reward} XP</span>
            </div>
          </div>
        </motion.div>

        {/* Monthly */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-text-primary text-sm md:text-base">
                {monthlyChallenge.title}
              </h3>
            </div>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {monthlyChallenge.daysLeft}{t('common.days')} {t('challenges.timeLeft')}
            </span>
          </div>

          <div className="text-center my-4">
            <motion.div
              className="text-5xl md:text-6xl mb-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {monthlyChallenge.icon}
            </motion.div>
            <p className="text-sm text-text-secondary">{monthlyChallenge.description}</p>
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{
                  width: `${(monthlyChallenge.progress / monthlyChallenge.goal) * 100}%`,
                }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">
                {monthlyChallenge.progress}kg / {monthlyChallenge.goal}kg
              </span>
              <span className="font-bold text-primary">+{monthlyChallenge.reward} XP</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Completed Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 md:p-6 shadow-lg"
      >
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="w-6 h-6 text-success" />
          <h2 className="text-xl font-bold text-text-primary">{t('challenges.completed')}</h2>
        </div>

        <div className="space-y-3">
          {completedChallenges.map((challenge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 bg-success/5 rounded-xl border border-success/20"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{challenge.icon}</div>
                <div>
                  <h4 className="font-semibold text-text-primary text-sm md:text-base">
                    {challenge.title}
                  </h4>
                  <p className="text-xs text-text-secondary">{challenge.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-success">+{challenge.reward}</p>
                <p className="text-xs text-text-secondary">XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
