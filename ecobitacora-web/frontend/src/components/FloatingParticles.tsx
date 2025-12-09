import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: ['🌿', '🍃', '💧', '♻️', '🌱'][i % 5],
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    x: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl opacity-20"
          initial={{ y: '100vh', x: `${particle.x}vw` }}
          animate={{
            y: '-10vh',
            x: `${particle.x + (Math.random() - 0.5) * 20}vw`,
            rotate: 360,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
}
