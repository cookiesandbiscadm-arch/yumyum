import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { state } = useCart();
  const location = useLocation();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b-2 border-magic-pink/20"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-magic-pink to-magic-purple rounded-full flex items-center justify-center">
              <span className="text-2xl">🍪</span>
            </div>
            <div>
              <h1 className="font-fredoka text-2xl font-bold magic-text">YumYum</h1>
              <p className="text-xs text-textBody -mt-1">Biscuits</p>
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
            <button className="p-2 text-textBody hover:text-magic-pink transition-colors">
              <Heart size={24} />
            </button>
            <Link to="/cart" className="relative p-2 text-textBody hover:text-magic-pink transition-colors">
              <ShoppingCart size={24} />
              {state.items.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-magic-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
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