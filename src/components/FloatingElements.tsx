import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements: React.FC = () => {
  const stars = Array.from({ length: 8 }, (_, i) => i);
  const clouds = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={`star-${star}`}
          className="absolute text-primary opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ⭐
        </motion.div>
      ))}
      
      {clouds.map((cloud) => (
        <motion.div
          key={`cloud-${cloud}`}
          className="absolute text-4xl opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 40}%`,
          }}
          animate={{
            x: [-20, 20, -20],
            y: [-5, 5, -5],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          ☁️
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;