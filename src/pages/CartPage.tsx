import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/format';
import { submitOrder } from '../lib/api';

const CartPage: React.FC = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });


const handleCheckout = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsCheckingOut(true);
  try {
    const orderResult = await submitOrder({
      customer: customerInfo,
      items: state.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
    clearCart();
    navigate('/thank-you', { state: { customerInfo, orderNumber: orderResult.order_number } });
  } catch (error: any) {
    alert('Order failed: ' + (error && (typeof error === 'object' && 'message' in error) ? error.message : String(error)));
  } finally {
    setIsCheckingOut(false);
  }
};

  if (state.items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-secondary flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-8xl mb-6">🍪</div>
          <h2 className="font-fredoka text-3xl text-textPrimary mb-4">
            Your cart is empty
          </h2>
          <p className="font-poppins text-textBody mb-8">
            Time to fill it with some delicious treats!
          </p>
          <Link
            to="/catalog"
            aria-label="Start Shopping"
            className="bg-accent1 text-white px-10 py-4 rounded-full font-poppins font-extrabold text-2xl shadow-lg hover:bg-accent1/90 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-accent1/70"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-secondary">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            🍪
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            to="/catalog"
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-textBody" />
          </Link>
          <h1 className="font-fredoka text-3xl md:text-4xl text-textPrimary">
            Your Magical Cart
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, x: -100 }}
                  className="bg-white rounded-3xl p-6 mb-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item.full_image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-2xl"
                      />
                      <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-fredoka text-xl text-textPrimary mb-1">
                        {item.name}
                      </h3>
                      <p className="text-textBody text-sm mb-2">
                        {formatINR(item.price)} each
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1 hover:bg-primary/10 rounded-full transition-colors"
                        >
                          <Minus className="w-4 h-4 text-textPrimary" />
                        </button>
                        <span className="px-3 py-1 bg-secondary rounded-full font-poppins font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-primary/10 rounded-full transition-colors"
                        >
                          <Plus className="w-4 h-4 text-textPrimary" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-poppins font-extrabold text-xl text-accent1 mb-2">
                        {formatINR(item.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-xl h-fit"
          >
            <h2 className="font-fredoka text-2xl text-textPrimary mb-6">
              Order Summary
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="font-poppins text-textBody">
                  Items ({state.items.reduce((sum, item) => sum + item.quantity, 0)})
                </span>
                <span className="font-poppins font-medium">
                  {formatINR(state.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-poppins text-textBody">Delivery</span>
                <span className="font-poppins font-medium text-accent1">Free!</span>
              </div>
              <hr className="border-secondary" />
              <div className="flex justify-between">
                <span className="font-poppins font-bold text-textPrimary text-lg">
                  Total
                </span>
                <span className="font-poppins font-extrabold text-accent1 text-2xl">
                  {formatINR(state.total)}
                </span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block font-poppins font-medium text-textPrimary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block font-poppins font-medium text-textPrimary mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors"
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label className="block font-poppins font-medium text-textPrimary mb-2">
                  Delivery Address
                </label>
                <textarea
                  required
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="Where should we deliver your treats?"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isCheckingOut}
                whileHover={{ scale: isCheckingOut ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-full font-poppins font-bold text-lg transition-all duration-300 ${
                  isCheckingOut
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90 animate-wiggle'
                }`}
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Magic...
                  </div>
                ) : (
                  '✨ Complete Order ✨'
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;