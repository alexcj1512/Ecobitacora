import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, DollarSign, Copy, Check, QrCode, Leaf } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function Donate() {
  const { t } = useLanguageStore();
  const [copiedYape, setCopiedYape] = useState(false);
  const [copiedPaypal, setCopiedPaypal] = useState(false);

  // Datos de donación
  const yapeNumber = '+51 938 226 649'; // Tu número de Yape
  const paypalEmail = 'aslext@paypal.com'; // Tu email de PayPal
  const paypalLink = 'https://www.paypal.me/aslext'; // Tu link de PayPal

  const copyToClipboard = (text: string, type: 'yape' | 'paypal') => {
    navigator.clipboard.writeText(text);
    if (type === 'yape') {
      setCopiedYape(true);
      setTimeout(() => setCopiedYape(false), 2000);
    } else {
      setCopiedPaypal(true);
      setTimeout(() => setCopiedPaypal(false), 2000);
    }
  };

  const donationAmounts = [
    { amount: 10, icon: '💚', label: t('donate.basicSupport') },
    { amount: 35, icon: '🌱', label: t('donate.plant') },
    { amount: 100, icon: '🌳', label: t('donate.tree') },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="inline-block text-6xl mb-4"
        >
          💚
        </motion.div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          {t('donate.title')}
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          {t('donate.subtitle')}
        </p>
      </motion.div>

      {/* Why Donate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8"
      >
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center space-x-2">
          <Heart className="w-6 h-6 text-red-500" />
          <span>{t('donate.whyDonate')}</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🚀',
              title: t('donate.newFeatures'),
              desc: t('donate.newFeaturesDesc'),
            },
            {
              icon: '🔧',
              title: t('donate.maintenance'),
              desc: t('donate.maintenanceDesc'),
            },
            {
              icon: '🌱',
              title: t('donate.realImpact'),
              desc: t('donate.realImpactDesc'),
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Donation Amounts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
          {t('donate.chooseAmount')}
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          {donationAmounts.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 text-center cursor-pointer border-2 border-transparent hover:border-primary transition-all"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="text-2xl font-bold text-primary mb-1">
                S/ {item.amount}
              </div>
              <div className="text-xs text-text-secondary">{item.label}</div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-text-secondary text-sm">
          {t('donate.orChoose')}
        </p>
      </motion.div>

      {/* Payment Methods */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Yape */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-purple-100 p-4 rounded-2xl">
              <QrCode className="w-12 h-12 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center text-text-primary mb-2">
            {t('donate.yape')}
          </h3>
          <p className="text-center text-text-secondary mb-6">
            {t('donate.yapeDesc')}
          </p>

          {/* QR Code de Yape */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 mb-6 flex items-center justify-center">
            <img 
              src="/yape-qr.jpeg" 
              alt="QR Yape" 
              className="w-64 h-64 rounded-xl border-4 border-purple-200 object-contain bg-white shadow-lg"
              onError={(e) => {
                // Si no encuentra la imagen, mostrar placeholder
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="text-center hidden">
              <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center mb-4 mx-auto border-4 border-purple-200">
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-purple-600">Coloca tu QR como:<br/>yape-qr.jpeg</p>
                </div>
              </div>
            </div>
          </div>

          {/* Yape Number */}
          <div className="bg-purple-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-text-secondary mb-2 text-center">
              {t('donate.yapeNumber')}
            </p>
            <div className="flex items-center justify-between bg-white rounded-lg p-3">
              <span className="font-mono font-bold text-purple-600">
                {yapeNumber}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => copyToClipboard(yapeNumber, 'yape')}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                {copiedYape ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-purple-600" />
                )}
              </motion.button>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
            <Leaf className="w-4 h-4 text-purple-600" />
            <span>{t('donate.yapeAvailable')}</span>
          </div>
        </motion.div>

        {/* PayPal */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-2xl">
              <DollarSign className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-center text-text-primary mb-2">
            {t('donate.paypal')}
          </h3>
          <p className="text-center text-text-secondary mb-6">
            {t('donate.paypalDesc')}
          </p>

          {/* QR Code de PayPal */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 mb-6 flex items-center justify-center">
            <img 
              src="/paypal-qr.jpeg" 
              alt="QR PayPal" 
              className="w-64 h-64 rounded-xl border-4 border-blue-200 object-contain bg-white shadow-lg"
              onError={(e) => {
                // Si no encuentra la imagen, mostrar placeholder
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="text-center hidden">
              <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center mb-4 mx-auto border-4 border-blue-200">
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs text-blue-600">Coloca tu QR como:<br/>paypal-qr.jpeg</p>
                </div>
              </div>
            </div>
          </div>

          {/* PayPal Email */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-text-secondary mb-2 text-center">
              {t('donate.paypalEmail')}
            </p>
            <div className="flex items-center justify-between bg-white rounded-lg p-3 mb-3">
              <span className="font-mono text-sm text-blue-600 truncate">
                {paypalEmail}
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => copyToClipboard(paypalEmail, 'paypal')}
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
              >
                {copiedPaypal ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-blue-600" />
                )}
              </motion.button>
            </div>

            {/* PayPal Button */}
            <motion.a
              href={paypalLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-center transition-colors"
            >
              {t('donate.paypalButton')}
            </motion.a>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
            <Leaf className="w-4 h-4 text-blue-600" />
            <span>{t('donate.paypalAvailable')}</span>
          </div>
        </motion.div>
      </div>

      {/* Thank You Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary via-accent to-primary-dark rounded-3xl p-8 text-center text-white"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="text-6xl mb-4"
        >
          🙏
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">{t('donate.thankYou')}</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          {t('donate.thankYouMessage')}
        </p>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
          {t('donate.faq')}
        </h2>
        <div className="space-y-4">
          {[
            {
              q: t('donate.faqSafe'),
              a: t('donate.faqSafeAnswer'),
            },
            {
              q: t('donate.faqReceipt'),
              a: t('donate.faqReceiptAnswer'),
            },
            {
              q: t('donate.faqCountry'),
              a: t('donate.faqCountryAnswer'),
            },
            {
              q: t('donate.faqUse'),
              a: t('donate.faqUseAnswer'),
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-card rounded-xl p-4"
            >
              <h3 className="font-bold text-text-primary mb-2">{item.q}</h3>
              <p className="text-text-secondary text-sm">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
