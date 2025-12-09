import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { ACTION_TYPES } from '@/types';
import { useStore } from '@/store/useStore';
import { useLanguageStore } from '@/store/languageStore';
import { api } from '@/utils/api';
import Confetti from 'react-confetti';

interface AddActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Category = 'transport' | 'recycle' | 'energy' | 'water';

export default function AddActionModal({ isOpen, onClose }: AddActionModalProps) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [actionType, setActionType] = useState<any>(null);
  const [amount, setAmount] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { addAction, user, setUser } = useStore();

  const { t } = useLanguageStore();
  
  const categories = [
    { id: 'transport', label: t('categories.transport'), icon: '🚴', color: 'bg-transport' },
    { id: 'recycle', label: t('categories.recycle'), icon: '♻️', color: 'bg-recycle' },
    { id: 'energy', label: t('categories.energy'), icon: '💡', color: 'bg-energy' },
    { id: 'water', label: t('categories.water'), icon: '💧', color: 'bg-water' },
  ];

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setTimeout(() => setStep(2), 300);
  };

  const handleActionSelect = (action: any) => {
    setActionType(action);
    setTimeout(() => setStep(3), 300);
  };

  const handleSubmit = async () => {
    if (!category || !actionType || !user) return;

    const co2Saved = actionType.co2PerUnit * amount;
    const xpGained = Math.floor(co2Saved * 10);

    try {
      const newAction = await api.createAction({
        category,
        type: actionType.label,
        amount,
        co2Saved,
        xpGained,
        ...(photo && { photo }), // Include photo only if uploaded
      });

      addAction(newAction);

      // Update user stats
      const updatedUser = await api.getUser();
      setUser(updatedUser);

      // Check for achievements
      await api.checkAchievements();

      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Error creating action:', error);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setStep(1);
    setCategory(null);
    setActionType(null);
    setAmount(1);
    setPhoto(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-accent p-6 text-white relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{
                    x: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{t('actions.register')}</h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center space-x-4 mt-4">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-1">
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          step >= s ? 'bg-white text-primary' : 'bg-white/30'
                        }`}
                        animate={step === s ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {step > s ? <Check className="w-5 h-5" /> : s}
                      </motion.div>
                      {s < 3 && (
                        <div className="flex-1 h-1 mx-2 bg-white/30 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: step > s ? '100%' : '0%' }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <AnimatePresence mode="wait">
                  {/* Step 1: Category Selection */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-xl font-bold text-text-primary mb-6">
                        {t('actions.selectCategory')}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {categories.map((cat, i) => (
                          <motion.button
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCategorySelect(cat.id as Category)}
                            className={`${cat.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all`}
                          >
                            <motion.div
                              className="text-5xl mb-3"
                              animate={{
                                rotate: [0, 10, -10, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                            >
                              {cat.icon}
                            </motion.div>
                            <p className="font-bold text-lg">{cat.label}</p>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Action Type Selection */}
                  {step === 2 && category && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        onClick={() => setStep(1)}
                        className="flex items-center text-text-secondary hover:text-primary mb-4"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span>{t('actions.back')}</span>
                      </button>
                      <h3 className="text-xl font-bold text-text-primary mb-6">
                        {t('actions.selectAction')}
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {ACTION_TYPES[category].map((action, i) => (
                          <motion.button
                            key={action.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02, x: 10 }}
                            onClick={() => handleActionSelect(action)}
                            className="flex items-center space-x-4 p-4 bg-bg-card hover:bg-primary/10 rounded-xl transition-all"
                          >
                            <motion.span
                              className="text-3xl"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {action.icon}
                            </motion.span>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-text-primary">{action.label}</p>
                              <p className="text-sm text-text-secondary">
                                {action.co2PerUnit} kg CO₂ por {action.unit}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-text-secondary" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Amount */}
                  {step === 3 && actionType && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        onClick={() => setStep(2)}
                        className="flex items-center text-text-secondary hover:text-primary mb-4"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span>{t('actions.back')}</span>
                      </button>
                      <h3 className="text-xl font-bold text-text-primary mb-6">
                        {t('actions.howMuch')}
                      </h3>

                      <div className="space-y-6">
                        {/* Slider */}
                        <div>
                          <label className="block text-text-secondary mb-2">
                            {t('actions.amount')} ({actionType.unit})
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                          <motion.div
                            key={amount}
                            initial={{ scale: 1.5 }}
                            animate={{ scale: 1 }}
                            className="text-center mt-4"
                          >
                            <span className="text-5xl font-bold text-primary">{amount}</span>
                            <span className="text-xl text-text-secondary ml-2">
                              {actionType.unit}
                            </span>
                          </motion.div>
                        </div>

                        {/* Photo Upload */}
                        <div>
                          <label className="block text-text-primary mb-2 font-bold text-lg">
                            📸 {t('actions.photo')} <span className="text-red-500">{t('actions.photoRequired')}</span>
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                              id="photo-upload"
                            />
                            <label
                              htmlFor="photo-upload"
                              className="flex items-center justify-center w-full p-4 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                            >
                              {photo ? (
                                <div className="relative w-full">
                                  <img
                                    src={photo}
                                    alt="Preview"
                                    className="w-full h-40 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPhoto(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <p className="text-4xl mb-2">📷</p>
                                  <p className="text-sm text-text-secondary">
                                    {t('actions.clickUpload')}
                                  </p>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Preview */}
                        <motion.div
                          className="bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl p-6"
                          animate={{
                            scale: [1, 1.02, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          <h4 className="font-bold text-text-primary mb-4">{t('actions.impact')}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-3xl font-bold text-success">
                                {(actionType.co2PerUnit * amount).toFixed(2)}
                              </p>
                              <p className="text-sm text-text-secondary">{t('actions.co2Saved')}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-3xl font-bold text-primary">
                                +{Math.floor(actionType.co2PerUnit * amount * 10)}
                              </p>
                              <p className="text-sm text-text-secondary">{t('actions.xpGained')}</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Warning if no photo */}
                        {!photo && (
                          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-center space-x-3">
                            <span className="text-3xl">⚠️</span>
                            <p className="text-red-700 font-medium">
                              {t('actions.warning')}
                            </p>
                          </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                          onClick={handleSubmit}
                          disabled={!photo}
                          whileHover={photo ? { scale: 1.02 } : {}}
                          whileTap={photo ? { scale: 0.98 } : {}}
                          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                            photo
                              ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl cursor-pointer'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {photo ? t('actions.save') : t('actions.uploadPhoto')}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
