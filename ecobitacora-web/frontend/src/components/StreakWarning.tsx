import { motion } from 'framer-motion';
import { AlertTriangle, Flame } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

interface StreakWarningProps {
  streak: number;
  lastActionDate: string | null;
}

export default function StreakWarning({ streak, lastActionDate }: StreakWarningProps) {
  const { t } = useLanguageStore();

  if (!lastActionDate || streak === 0) return null;

  const now = new Date();
  const lastAction = new Date(lastActionDate);
  const hoursSinceLastAction = Math.floor((now.getTime() - lastAction.getTime()) / (1000 * 60 * 60));
  
  // Si han pasado más de 20 horas, mostrar advertencia
  const isAtRisk = hoursSinceLastAction >= 20 && hoursSinceLastAction < 24;
  
  // Si han pasado más de 24 horas, la racha se perdió
  const isLost = hoursSinceLastAction >= 24;

  if (!isAtRisk && !isLost) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 shadow-lg ${
        isLost
          ? 'bg-gradient-to-r from-red-500 to-red-600'
          : 'bg-gradient-to-r from-orange-500 to-orange-600'
      } text-white`}
    >
      <div className="flex items-center space-x-3">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        >
          {isLost ? (
            <AlertTriangle className="w-8 h-8" />
          ) : (
            <Flame className="w-8 h-8" />
          )}
        </motion.div>
        
        <div className="flex-1">
          {isLost ? (
            <>
              <h3 className="font-bold text-lg">¡Racha Perdida!</h3>
              <p className="text-sm opacity-90">
                Han pasado más de 24 horas sin registrar una acción. Tu racha se ha reseteado a 0.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-bold text-lg">🔥 ¡Tu racha está en riesgo!</h3>
              <p className="text-sm opacity-90">
                Llevas {streak} {t('common.days')} de racha. Registra una acción en las próximas {24 - hoursSinceLastAction} horas para mantenerla.
              </p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
