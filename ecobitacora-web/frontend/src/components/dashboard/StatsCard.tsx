import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import CountUp from 'react-countup';
import { getGradientClasses } from '@/utils/colors';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  suffix?: string;
  color: string;
  subtitle?: string;
  progress?: number;
  delay?: number;
}

export default function StatsCard({
  icon: Icon,
  title,
  value,
  suffix = '',
  color,
  subtitle,
  progress,
  delay = 0,
}: StatsCardProps) {
  const gradientClass = getGradientClasses(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className="relative bg-white rounded-2xl p-6 shadow-xl overflow-hidden group cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-10`}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-br ${gradientClass} text-white`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>

          {color === 'streak' && (
            <motion.div
              className="text-4xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            >
              🔥
            </motion.div>
          )}
        </div>

        <h3 className="text-text-secondary text-sm font-medium mb-2">{title}</h3>
        
        <div className="flex items-baseline space-x-2">
          <motion.span
            className="text-4xl font-bold text-text-primary"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: delay + 0.2 }}
          >
            <CountUp end={value} duration={2} />
          </motion.span>
          {suffix && <span className="text-xl text-text-secondary">{suffix}</span>}
        </div>

        {subtitle && (
          <p className="text-sm text-text-secondary mt-2">{subtitle}</p>
        )}

        {progress !== undefined && (
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${gradientClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1, delay: delay + 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Floating Particles */}
        {color === 'streak' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: -50,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Infinity,
                }}
                style={{
                  left: `${30 + i * 20}%`,
                  bottom: 20,
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}
