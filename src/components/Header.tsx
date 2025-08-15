import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { state } = useCart();
  const location = useLocation();

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-[#F9C56C] shadow-lg shadow-[#F9C56C]/20"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between md:grid md:grid-cols-3">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              className="w-12 h-12 md:w-14 md:h-14 object-contain select-none transition-transform duration-300 group-hover:scale-105" 
              loading="eager" 
              decoding="async" 
            />
            <div>
              <h1 className="font-fredoka text-3xl font-bold bg-gradient-to-r from-[#E08A2E] via-[#A6651C] to-[#F4A73C] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">Diskos</h1>
              <p className="text-sm text-[#7D5630] -mt-1 font-medium">✨ Healthier Biscuits</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center justify-center space-x-6">
            <Link 
              to="/" 
              className={`font-poppins font-medium transition-colors ${
                location.pathname === '/' ? 'text-[#A6651C]' : 'text-[#5B3C1B] hover:text-[#E08A2E]'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/catalog" 
              className={`font-poppins font-medium transition-colors ${
                location.pathname === '/catalog' ? 'text-[#A6651C]' : 'text-[#5B3C1B] hover:text-[#E08A2E]'
              }`}
            >
              Treats
            </Link>
          </nav>

          <div className="flex items-center space-x-4 justify-end">
            <Link
              to="/cart"
              className="relative p-3 bg-[#FFE8B0] hover:bg-[#FFD98A] rounded-full text-[#5B3C1B] hover:text-[#A6651C] transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg group"
              aria-label={`Cart (${itemCount} items)`}
              title={itemCount ? `${itemCount} item${itemCount>1?'s':''} in cart` : 'Cart'}
            >
              <ShoppingCart size={24} className="group-hover:animate-bounce" />
              {state.items.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-[#E08A2E] to-[#F4A73C] text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;