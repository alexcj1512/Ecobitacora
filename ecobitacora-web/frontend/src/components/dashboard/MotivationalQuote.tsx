import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

const quotes = [
  {
    text: 'El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.',
    author: 'Proverbio chino',
  },
  {
    text: 'No heredamos la Tierra de nuestros ancestros, la tomamos prestada de nuestros hijos.',
    author: 'Proverbio nativo americano',
  },
  {
    text: 'Sé el cambio que quieres ver en el mundo.',
    author: 'Mahatma Gandhi',
  },
  {
    text: 'La naturaleza no necesita a las personas. Las personas necesitan a la naturaleza.',
    author: 'Conservation International',
  },
];

export default function MotivationalQuote() {
  const { t } = useLanguageStore();
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white overflow-hidden shadow-lg"
      data-aos="fade-left"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: -100,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
          }}
          style={{
            left: `${20 + i * 15}%`,
          }}
        >
          {['🌿', '🍃', '🌱', '✨', '💚'][i]}
        </motion.div>
      ))}

      <div className="relative z-10">
        <motion.p
          className="text-lg font-medium mb-4 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          "{quote.text}"
        </motion.p>
        <p className="text-sm opacity-80">— {quote.author}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm">{t('reports.share')}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
