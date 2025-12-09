import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useLanguageStore } from '@/store/languageStore';

interface ImpactVisualProps {
  type: 'forest' | 'distance' | 'energy' | 'water';
  value: number;
  title: string;
  icon: string;
}

export default function ImpactVisual({ type, value, title, icon }: ImpactVisualProps) {
  const { t } = useLanguageStore();
  const calculations = {
    forest: Math.floor(value / 22), // árboles
    distance: Math.floor(value / 0.192), // km
    energy: Math.floor(value / 0.04), // horas
    water: Math.floor(value / 0.12), // duchas
  };

  const result = calculations[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden group"
      data-aos="fade-up"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      
      {/* Waves for water */}
      {type === 'water' && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 left-0 right-0 h-32 bg-water/10 rounded-full"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
              }}
              style={{
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <motion.span
            className="text-4xl"
            animate={{
              rotate: type === 'forest' ? [0, 5, -5, 0] : 0,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            {icon}
          </motion.span>
        </div>

        <div className="space-y-4">
          {/* Main Number */}
          <div className="text-center">
            <motion.div
              className="text-5xl font-bold text-gradient"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CountUp end={result} duration={2.5} />
            </motion.div>
            <p className="text-text-secondary mt-2">
              {type === 'forest' && t('dashboard.treesPlanted')}
              {type === 'distance' && t('dashboard.kmBike')}
              {type === 'energy' && `${t('common.hours')} ${t('categories.energy')}`}
              {type === 'water' && t('categories.water')}
            </p>
          </div>

          {/* Visual Representation */}
          <div className="flex justify-center items-end space-x-2 h-24">
            {type === 'forest' &&
              [...Array(Math.min(result, 10))].map((_, i) => (
                <motion.div
                  key={i}
                  className="text-3xl"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: i * 0.1,
                    type: 'spring',
                  }}
                >
                  🌳
                </motion.div>
              ))}

            {type === 'distance' && (
              <div className="relative w-full">
                <motion.div
                  className="text-4xl absolute"
                  animate={{
                    x: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  🚴
                </motion.div>
                <div className="h-1 bg-gray-200 rounded-full mt-8">
                  <motion.div
                    className="h-full bg-transport rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </div>
            )}

            {type === 'energy' && (
              <motion.div
                className="text-6xl"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                💡
              </motion.div>
            )}

            {type === 'water' && (
              <motion.div
                className="text-6xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                💧
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
