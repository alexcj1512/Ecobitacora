import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useLanguageStore } from '@/store/languageStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import CountUp from 'react-countup';
import { TrendingUp, Award, Calendar, Zap } from 'lucide-react';
import { getIconColor } from '@/utils/colors';

export default function Stats() {
  const { stats, user } = useStore();
  const { t } = useLanguageStore();

  if (!stats || !user) return <div>{t('common.loading')}</div>;

  const categoryData = [
    { name: t('categories.transport'), value: stats.byCategory.transport, color: '#4A90E2' },
    { name: t('categories.recycle'), value: stats.byCategory.recycle, color: '#7CB342' },
    { name: t('categories.energy'), value: stats.byCategory.energy, color: '#FFB74D' },
    { name: t('categories.water'), value: stats.byCategory.water, color: '#29B6F6' },
  ];

  const summaryCards = [
    { icon: Zap, label: t('stats.totalActions'), value: stats.totalActions, color: 'primary' },
    { icon: TrendingUp, label: t('stats.co2Saved'), value: stats.totalCO2, suffix: ' kg', color: 'success' },
    { icon: Calendar, label: t('stats.overview'), value: parseFloat(stats.averageDaily.toFixed(1)), suffix: ' kg', color: 'energy' },
    { icon: Award, label: t('stats.longestStreak'), value: stats.maxStreak, suffix: ` ${t('common.days')}`, color: 'streak' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-text-primary mb-2">{t('stats.title')}</h1>
        <p className="text-text-secondary">{t('stats.impact')}</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <Icon className={`w-8 h-8 ${getIconColor(card.color)} mb-3`} />
              <p className="text-text-secondary text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-text-primary">
                <CountUp end={card.value} duration={2} decimals={card.suffix?.includes('.') ? 1 : 0} />
                {card.suffix}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - CO2 by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
          data-aos="fade-right"
        >
          <h2 className="text-xl font-bold text-text-primary mb-6">{t('stats.byCategory')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7B6B" />
              <YAxis stroke="#6B7B6B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart - Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
          data-aos="fade-left"
        >
          <h2 className="text-xl font-bold text-text-primary mb-6">{t('stats.evolution')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Timeline Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
        data-aos="fade-up"
      >
        <h2 className="text-xl font-bold text-text-primary mb-6">{t('stats.evolution')}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={stats.last30Days}>
            <defs>
              <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B9080" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6B9080" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" stroke="#6B7B6B" />
            <YAxis stroke="#6B7B6B" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="co2"
              stroke="#6B9080"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCO2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Equivalences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 text-white"
        data-aos="fade-up"
      >
        <h2 className="text-2xl font-bold mb-6">{t('stats.equivalent')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <motion.div
              className="text-6xl mb-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌳
            </motion.div>
            <p className="text-4xl font-bold">
              <CountUp end={Math.floor(stats.totalCO2 / 22)} duration={2} />
            </p>
            <p className="opacity-90">{t('stats.trees')}</p>
          </div>
          <div className="text-center">
            <motion.div
              className="text-6xl mb-3"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚗
            </motion.div>
            <p className="text-4xl font-bold">
              <CountUp end={Math.floor(stats.totalCO2 / 0.192)} duration={2} />
            </p>
            <p className="opacity-90">{t('stats.km')}</p>
          </div>
          <div className="text-center">
            <motion.div
              className="text-6xl mb-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚿
            </motion.div>
            <p className="text-4xl font-bold">
              <CountUp end={Math.floor(stats.totalCO2 / 0.12)} duration={2} />
            </p>
            <p className="opacity-90">{t('stats.equivalent')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
