import { motion } from 'framer-motion';
import { History as HistoryIcon, Filter, Calendar, TrendingUp, Search } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useLanguageStore } from '@/store/languageStore';
import { formatDistanceToNow } from 'date-fns';
import { getBgColor } from '@/utils/colors';

export default function History() {
  const { actions } = useStore();
  const { t } = useLanguageStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: t('common.all'), icon: '📋', color: 'bg-primary' },
    { id: 'transport', name: t('categories.transport'), icon: '🚴', color: 'bg-transport' },
    { id: 'recycle', name: t('categories.recycle'), icon: '♻️', color: 'bg-recycle' },
    { id: 'energy', name: t('categories.energy'), icon: '💡', color: 'bg-energy' },
    { id: 'water', name: t('categories.water'), icon: '💧', color: 'bg-water' },
  ];

  const categoryIcons: Record<string, string> = {
    transport: '🚴',
    recycle: '♻️',
    energy: '💡',
    water: '💧',
  };

  const filteredActions = actions.filter((action) => {
    const matchesCategory = filterCategory === 'all' || action.category === filterCategory;
    const matchesSearch = action.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalCO2 = filteredActions.reduce((sum, action) => sum + action.co2Saved, 0);
  const totalXP = filteredActions.reduce((sum, action) => sum + action.xpGained, 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white"
      >
        <div className="flex items-center space-x-3 mb-2">
          <HistoryIcon className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-bold">{t('history.title')}</h1>
        </div>
        <p className="opacity-90 text-sm md:text-base">
          {t('history.all')}
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-lg"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${t('common.search')}...`}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              filterCategory === cat.id
                ? `${cat.color} text-white shadow-lg`
                : 'bg-white text-text-secondary border border-gray-200'
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="font-medium">{cat.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-4 shadow-lg text-center"
        >
          <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="text-2xl font-bold text-success">{totalCO2.toFixed(1)}</p>
          <p className="text-xs text-text-secondary">{t('actions.co2Saved')}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-lg text-center"
        >
          <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-primary">{filteredActions.length}</p>
          <p className="text-xs text-text-secondary">{t('stats.totalActions')}</p>
        </motion.div>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {filteredActions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-8 text-center shadow-lg"
          >
            <p className="text-text-secondary">{t('history.noActions')}</p>
          </motion.div>
        ) : (
          filteredActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="bg-white rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className={`${getBgColor(action.category)} p-3 rounded-xl text-white text-2xl`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {categoryIcons[action.category]}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary truncate text-sm md:text-base">
                    {action.type}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary mt-1">
                    <span>{action.amount} {t('common.units')}</span>
                    <span className="text-success font-medium">
                      +{action.co2Saved.toFixed(2)} {t('common.kg')} CO₂
                    </span>
                    <span className="text-primary font-medium">+{action.xpGained} XP</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatDistanceToNow(new Date(action.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
