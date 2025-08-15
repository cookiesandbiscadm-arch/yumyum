import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Home } from 'lucide-react';

const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const customerInfo = location.state?.customerInfo;

  useEffect(() => {
    // Confetti effect
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.top = '0';
    confetti.style.left = '0';
    confetti.style.width = '100%';
    confetti.style.height = '100%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1000';
    document.body.appendChild(confetti);

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 3 + 2 + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.innerHTML = ['🍪', '⭐', '🎉', '✨'][Math.floor(Math.random() * 4)];
        particle.style.fontSize = '20px';
        particle.style.animation = 'fall 4s linear forwards';
        confetti.appendChild(particle);

        setTimeout(() => particle.remove(), 4000);
      }, i * 100);
    }

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall {
        0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      confetti.remove();
      style.remove();
    };
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-[#FFE8B0] to-[#F9C56C] flex items-center justify-center">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['🍪', '⭐', '🎉', '✨', '💖'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="mb-8"
        >
          <div className="text-8xl md:text-9xl mb-4">🍪</div>
          
          {/* Dancing mascot */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="font-fredoka text-4xl md:text-6xl text-[#5B3C1B] mb-6">
            Your Biscuit Adventure is on the Way!
          </h1>
          
          {customerInfo && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-xl"
            >
              <h2 className="font-fredoka text-2xl text-[#5B3C1B] mb-4">
                Order Confirmation
              </h2>
              <div className="text-left space-y-2 font-poppins text-[#7D5630]">
                <p><strong>Name:</strong> {customerInfo.name}</p>
                <p><strong>Phone:</strong> {customerInfo.phone}</p>
                <p><strong>Address:</strong> {customerInfo.address}</p>
              </div>
            </motion.div>
          )}

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="font-poppins text-xl text-[#7D5630] mb-8"
          >
            Thank you for choosing Diskos Biscuits! Your delicious treats will be delivered 
            with extra love and magic sprinkles. 
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/catalog"
              className="group bg-gradient-to-r from-[#A6651C] to-[#E08A2E] text-white px-8 py-4 rounded-full font-poppins font-semibold text-lg hover:opacity-90 transition-all duration-300 flex items-center gap-2 shadow-md"
            >
              Order More Treats
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/"
              className="bg-white/80 backdrop-blur-sm text-[#5B3C1B] px-8 py-4 rounded-full font-poppins font-semibold text-lg hover:bg-white transition-colors duration-300 flex items-center gap-2 shadow-sm"
            >
              <Home className="w-5 h-5 text-[#E08A2E]" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>

        {/* Fun stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { emoji: '🚚', text: 'Free Delivery', subtitle: 'Straight to your door!' },
            { emoji: '⏰', text: '4–7 Days', subtitle: 'Estimated delivery time' },
            { emoji: '😊', text: '100% Happy', subtitle: 'Happy Children' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2 + index * 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg"
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <div className="font-fredoka text-xl text-textPrimary mb-1">
                {item.text}
              </div>
              <div className="font-poppins text-textBody text-sm">
                {item.subtitle}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYouPage;