import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Sparkles, Camera, Calendar } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useLanguageStore } from '@/store/languageStore';
import Confetti from 'react-confetti';
import { addToGoogleCalendar } from '@/utils/calendar';

export default function DailyChallenge() {
  const [accepted, setAccepted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { actions } = useStore();
  const { t } = useLanguageStore();
  
  const challenge = {
    title: t('challenge.daily'),
    description: t('challenge.description'),
    progress: 0,
    goal: 1,
    reward: 50,
  };

  // Initialize and check if challenge needs reset (every 24 hours)
  useEffect(() => {
    const lastChallengeDate = localStorage.getItem('challenge-date');
    const today = new Date().toDateString();
    
    // Reset challenge if it's a new day
    if (lastChallengeDate !== today) {
      localStorage.setItem('challenge-date', today);
      localStorage.removeItem('challenge-accepted');
      localStorage.removeItem('challenge-completed');
      setAccepted(false);
      setCompleted(false);
    } else {
      // Load saved state for today
      setAccepted(localStorage.getItem('challenge-accepted') === 'true');
      setCompleted(localStorage.getItem('challenge-completed') === 'true');
    }
  }, []);

  // Check if user completed the challenge (with photo required)
  useEffect(() => {
    if (accepted && !completed) {
      const today = new Date().toDateString();
      const todayTransportActions = actions.filter(action => {
        const actionDate = new Date(action.date).toDateString();
        // Check if it's transport category, today, and has a photo
        return action.category === 'transport' && 
               actionDate === today &&
               action.photo; // Photo is required!
      });

      if (todayTransportActions.length > 0) {
        setCompleted(true);
        setShowConfetti(true);
        localStorage.setItem('challenge-completed', 'true');
        
        setTimeout(() => {
          setShowConfetti(false);
        }, 4000);
      }
    }
  }, [actions, accepted, completed]);

  const handleAccept = () => {
    setAccepted(true);
    const today = new Date().toDateString();
    localStorage.setItem('challenge-accepted', 'true');
    localStorage.setItem('challenge-date', today);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-white rounded-2xl p-6 shadow-lg overflow-hidden"
      data-aos="fade-left"
      data-aos-delay="100"
    >
      {/* Animated Border */}
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
          <h3 className="text-lg font-bold text-text-primary flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-energy" />
            <span>{challenge.title}</span>
          </h3>
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            🏅
          </motion.div>
        </div>

        <p className="text-text-secondary mb-4">
          {challenge.description}
        </p>
        {accepted && !completed && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2">
            <Camera className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>{t('challenge.remember')}</strong> {t('challenge.photoReminder')}
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">{t('challenge.progress')}</span>
            <span className="font-medium text-text-primary">
              {completed ? 1 : 0}/{challenge.goal}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-energy to-streak"
              initial={{ width: 0 }}
              animate={{ width: completed ? '100%' : '0%' }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Reward */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-text-secondary">{t('challenge.reward')}:</span>
          <span className="font-bold text-primary">+{challenge.reward} XP</span>
        </div>

        {/* Calendar Button */}
        {!completed && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addToGoogleCalendar(
              t('challenge.daily'),
              challenge.description,
              new Date()
            )}
            className="w-full mt-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all flex items-center justify-center space-x-2 text-sm font-medium"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('challenge.addCalendar')}</span>
          </motion.button>
        )}

        {/* CTA Button */}
        {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
        
        <motion.button
          onClick={handleAccept}
          disabled={accepted || completed}
          whileHover={!accepted && !completed ? { scale: 1.02 } : {}}
          whileTap={!accepted && !completed ? { scale: 0.98 } : {}}
          animate={!accepted && !completed ? {
            boxShadow: [
              '0 0 0 0 rgba(255, 183, 77, 0.7)',
              '0 0 0 10px rgba(255, 183, 77, 0)',
            ],
          } : {}}
          transition={{
            boxShadow: {
              duration: 1.5,
              repeat: Infinity,
            },
          }}
          className={`w-full mt-4 py-3 rounded-xl font-medium transition-all ${
            completed
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed'
              : accepted
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-energy to-streak text-white hover:shadow-lg'
          }`}
        >
          {completed ? (
            <span className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>{t('challenge.completed', { xp: challenge.reward })}</span>
            </span>
          ) : accepted ? (
            <span className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{t('challenge.accepted')}</span>
            </span>
          ) : (
            t('challenge.accept')
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
