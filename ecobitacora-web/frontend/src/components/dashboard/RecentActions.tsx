import { motion } from 'framer-motion';
import { Action } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useLanguageStore } from '@/store/languageStore';
import { api } from '@/utils/api';
import { getBgColor } from '@/utils/colors';

interface RecentActionsProps {
  actions: Action[];
}

const categoryIcons = {
  transport: '🚴',
  recycle: '♻️',
  energy: '💡',
  water: '💧',
};

export default function RecentActions({ actions }: RecentActionsProps) {
  const { deleteAction: removeAction } = useStore();
  const { t } = useLanguageStore();

  const handleDelete = async (id: string) => {
    try {
      await api.deleteAction(id);
      removeAction(id);
    } catch (error) {
      console.error('Error deleting action:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
      data-aos="fade-right"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6">{t('dashboard.recentActions')}</h2>

      <div className="space-y-4">
        {actions.length === 0 ? (
          <p className="text-text-secondary text-center py-8">
            {t('history.noActions')} 🌱
          </p>
        ) : (
          actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="glassmorphism rounded-xl p-4 relative group"
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 rounded-xl"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />

              <div className="relative flex items-center space-x-4">
                {/* Icon */}
                <motion.div
                  className={`${getBgColor(action.category)} p-3 rounded-xl text-white text-2xl`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {categoryIcons[action.category]}
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{action.type}</h3>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary mt-1">
                    <span>{action.amount} {t('common.units')}</span>
                    <span className="text-success font-medium">
                      +{action.co2Saved.toFixed(2)} {t('common.kg')} CO₂
                    </span>
                    <span className="text-primary font-medium">
                      +{action.xpGained} XP
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatDistanceToNow(new Date(action.date), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {/* Delete Button */}
                <motion.button
                  onClick={() => handleDelete(action.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </motion.button>

                {/* New Badge */}
                {new Date().getTime() - new Date(action.date).getTime() < 3600000 && (
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                    className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-1 rounded-full"
                  >
                    {t('actions.new')}
                  </motion.div>
                )}
              </div>

              {/* Timeline Line */}
              {index < actions.length - 1 && (
                <div className="absolute left-8 top-full w-0.5 h-4 bg-gradient-to-b from-primary to-transparent" />
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
