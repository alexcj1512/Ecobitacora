import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, Leaf, Droplet, Zap, Recycle, Car, Home } from 'lucide-react';
import { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';

export default function Education() {
  const { t } = useLanguageStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'transport', name: t('categories.transport'), icon: Car, color: 'bg-transport', emoji: '🚴' },
    { id: 'recycle', name: t('categories.recycle'), icon: Recycle, color: 'bg-recycle', emoji: '♻️' },
    { id: 'energy', name: t('categories.energy'), icon: Zap, color: 'bg-energy', emoji: '💡' },
    { id: 'water', name: t('categories.water'), icon: Droplet, color: 'bg-water', emoji: '💧' },
    { id: 'home', name: t('education.title'), icon: Home, color: 'bg-primary', emoji: '🏠' },
  ];

  const articles = [
    {
      id: 1,
      category: 'transport',
      title: '10 Formas de Reducir tu Huella de Carbono en el Transporte',
      description: 'Descubre cómo moverte de forma más sostenible',
      image: '🚲',
      readTime: '5 min',
      tips: [
        'Usa bicicleta para distancias cortas (menos de 5km)',
        'Comparte auto con compañeros de trabajo',
        'Usa transporte público siempre que sea posible',
        'Planifica tus rutas para evitar viajes innecesarios',
        'Considera vehículos eléctricos o híbridos',
      ],
    },
    {
      id: 2,
      category: 'recycle',
      title: 'Guía Completa de Reciclaje en Casa',
      description: 'Aprende a separar correctamente tus residuos',
      image: '♻️',
      readTime: '7 min',
      tips: [
        'Separa plástico, papel, vidrio y metal',
        'Limpia los envases antes de reciclar',
        'Aplasta las botellas para ahorrar espacio',
        'Reutiliza antes de reciclar',
        'Conoce los símbolos de reciclaje',
      ],
    },
    {
      id: 3,
      category: 'energy',
      title: 'Ahorro de Energía: Tips Prácticos',
      description: 'Reduce tu consumo eléctrico fácilmente',
      image: '⚡',
      readTime: '4 min',
      tips: [
        'Cambia a bombillas LED (75% menos energía)',
        'Desconecta aparatos en standby',
        'Usa electrodomésticos eficientes (A+++)',
        'Aprovecha la luz natural',
        'Ajusta el termostato (1°C = 7% ahorro)',
      ],
    },
    {
      id: 4,
      category: 'water',
      title: 'Conservación del Agua en el Hogar',
      description: 'Cada gota cuenta para el planeta',
      image: '💧',
      readTime: '6 min',
      tips: [
        'Duchas de 5 minutos (ahorra 40L)',
        'Cierra el grifo al cepillarte',
        'Repara fugas inmediatamente',
        'Usa lavavajillas y lavadora llenos',
        'Recolecta agua de lluvia para plantas',
      ],
    },
    {
      id: 5,
      category: 'home',
      title: 'Hogar Sostenible: Primeros Pasos',
      description: 'Transforma tu casa en un espacio eco-friendly',
      image: '🏡',
      readTime: '8 min',
      tips: [
        'Usa productos de limpieza ecológicos',
        'Compra local y de temporada',
        'Reduce el uso de plásticos',
        'Compostaje de residuos orgánicos',
        'Plantas que purifican el aire',
      ],
    },
  ];

  const funFacts = [
    {
      icon: '🌳',
      fact: 'Un árbol absorbe 22kg de CO₂ al año',
      detail: 'Plantar árboles es una de las formas más efectivas de combatir el cambio climático',
    },
    {
      icon: '♻️',
      fact: 'Reciclar 1 tonelada de papel salva 17 árboles',
      detail: 'También ahorra 26,000 litros de agua y 4,000 kWh de energía',
    },
    {
      icon: '💡',
      fact: 'Los LED usan 75% menos energía que incandescentes',
      detail: 'Y duran 25 veces más, ahorrando dinero a largo plazo',
    },
    {
      icon: '🚗',
      fact: 'Un auto promedio emite 4.6 toneladas de CO₂/año',
      detail: 'Usar bicicleta o transporte público reduce significativamente esta cifra',
    },
  ];

  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-recycle to-primary rounded-2xl p-6 text-white"
      >
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-bold">{t('education.title')}</h1>
        </div>
        <p className="opacity-90 text-sm md:text-base">{t('education.tips')} 🌱</p>
      </motion.div>

      {/* Categories Filter */}
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory(null)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
            !selectedCategory
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white text-text-secondary border border-gray-200'
          }`}
        >
          <Leaf className="w-5 h-5" />
          <span className="font-medium">{t('common.all')}</span>
        </motion.button>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? `${cat.color} text-white shadow-lg`
                  : 'bg-white text-text-secondary border border-gray-200'
              }`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="font-medium">{cat.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Fun Facts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {funFacts.map((fact, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl p-4 border border-primary/30"
          >
            <div className="flex items-start space-x-3">
              <motion.div
                className="text-4xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {fact.icon}
              </motion.div>
              <div className="flex-1">
                <h4 className="font-bold text-text-primary text-sm md:text-base mb-1">
                  {fact.fact}
                </h4>
                <p className="text-xs md:text-sm text-text-secondary">{fact.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-6 h-6 text-energy" />
          <h2 className="text-xl md:text-2xl font-bold text-text-primary">
            {t('education.articles')}
          </h2>
        </div>

        {filteredArticles.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-4 md:p-6 shadow-lg"
          >
            <div className="flex items-start space-x-4">
              <motion.div
                className="text-5xl md:text-6xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {article.image}
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {article.readTime}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-text-primary mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-text-secondary mb-4">{article.description}</p>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-text-primary">{t('education.tips')}:</p>
                  <ul className="space-y-1">
                    {article.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-text-secondary">
                        <span className="text-success mt-0.5">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full md:w-auto bg-primary text-white px-6 py-2 rounded-xl font-medium"
                >
                  {t('education.readMore')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
