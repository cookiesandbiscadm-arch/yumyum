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
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-gradient-to-r from-pink-200 to-purple-200 shadow-lg shadow-pink-500/10"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-magic-pink via-magic-purple to-magic-orange rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-pulse">
              <span className="text-3xl group-hover:animate-spin transition-all duration-300">🍪</span>
            </div>
            <div>
              <h1 className="font-fredoka text-3xl font-bold bg-gradient-to-r from-magic-pink via-magic-purple to-magic-orange bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">Diskos</h1>
              <p className="text-sm text-textBody -mt-1 font-medium">✨ Magical Biscuits</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`font-poppins font-medium transition-colors ${
                location.pathname === '/' ? 'text-magic-pink' : 'text-textBody hover:text-magic-pink'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/catalog" 
              className={`font-poppins font-medium transition-colors ${
                location.pathname === '/catalog' ? 'text-magic-pink' : 'text-textBody hover:text-magic-pink'
              }`}
            >
              Treats
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-3 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 rounded-full text-textBody hover:text-magic-pink transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg group"
              aria-label={`Cart (${itemCount} items)`}
              title={itemCount ? `${itemCount} item${itemCount>1?'s':''} in cart` : 'Cart'}
            >
              <ShoppingCart size={24} className="group-hover:animate-bounce" />
              {state.items.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gradient-to-r from-magic-pink to-magic-orange text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse"
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