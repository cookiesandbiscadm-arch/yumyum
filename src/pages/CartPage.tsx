import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/format';
import { submitOrder } from '../lib/api';

const CartPage: React.FC = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const cartItemsRef = useRef<HTMLDivElement>(null);

  // Animation effects
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Animate cart items on mount and when items change
    if (cartItemsRef.current) {
      const items = cartItemsRef.current.querySelectorAll('.cart-item');
      
      gsap.fromTo(
        items,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [state.items]);
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
          animate={{ 
            scale: [0.8, 1.05, 1],
            opacity: 1,
            transition: { duration: 0.6, ease: 'backOut' }
          }}
          className="text-center"
        >
          <motion.div 
            className="text-8xl mb-6"
            animate={{ 
              rotate: [0, 10, -10, 0],
              transition: { 
                repeat: Infinity, 
                repeatType: 'reverse',
                duration: 2
              }
            }}
          >
            🍪
          </motion.div>
          <h2 className="font-fredoka text-3xl text-textPrimary mb-4">
            Your cart is empty
          </h2>
          <p className="font-poppins text-textBody mb-8">
            Time to fill it with some delicious treats!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/catalog"
              aria-label="Start Shopping"
              className="bg-accent1 text-white px-10 py-4 rounded-full font-poppins font-extrabold text-2xl shadow-lg hover:bg-accent1/90 transition-all duration-300 inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-accent1/70"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const handleRemoveItem = async (id: string) => {
    setIsRemoving(id);
    // Add a small delay for the animation
    await new Promise(resolve => setTimeout(resolve, 500));
    removeItem(id);
    setIsRemoving(null);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  return (
    <motion.div 
      className="pt-20 min-h-screen bg-secondary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/catalog"
              className="flex items-center text-textBody hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </motion.div>
          <motion.h1 
            className="font-fredoka text-3xl md:text-4xl text-textPrimary ml-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your Cart
          </motion.h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2" ref={cartItemsRef}>
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div
                  key={item.id}
                  className="cart-item bg-white rounded-2xl p-6 shadow-md mb-6 overflow-hidden"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isRemoving === item.id ? 0 : 1, 
                    x: isRemoving === item.id ? 100 : 0,
                    height: isRemoving === item.id ? 0 : 'auto',
                    marginBottom: isRemoving === item.id ? 0 : 24,
                    transition: { duration: 0.3 }
                  }}
                  exit={{ opacity: 0, x: 100, height: 0, marginBottom: 0 }}
                  transition={{ 
                    type: 'spring', 
                    damping: 25, 
                    stiffness: 300,
                    opacity: { duration: 0.2 }
                  }}
                >
                  <div className="flex flex-col sm:flex-row items-center">
                    <motion.div 
                      className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.full_image_url && (
                        <img
                          src={item.full_image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </motion.div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-fredoka text-xl text-textPrimary">
                            {item.name}
                          </h3>
                          <p className="text-textBody font-poppins">
                            {formatINR(item.price / 100)} each
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-2 -mt-2 -mr-2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={isRemoving === item.id}
                          aria-label="Remove item"
                        >
                          {isRemoving === item.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <motion.div 
                          className="flex items-center bg-gray-50 rounded-full px-3 py-1"
                          whileHover={{ scale: 1.02 }}
                        >
                          <motion.button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="text-textBody hover:text-primary transition-colors p-1"
                            whileTap={{ scale: 0.8 }}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className={`w-4 h-4 ${item.quantity <= 1 ? 'opacity-30' : ''}`} />
                          </motion.button>
                          <motion.span 
                            className="mx-4 font-medium w-6 text-center"
                            key={`quantity-${item.quantity}`}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-textBody hover:text-primary transition-colors p-1"
                            whileTap={{ scale: 0.8 }}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                        <motion.span 
                          className="font-fredoka text-lg text-textPrimary"
                          key={`price-${item.quantity}`}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          {formatINR((item.price * item.quantity) / 100)}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Form */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-md h-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-fredoka text-2xl text-textPrimary mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-textBody">Subtotal</span>
                <motion.span 
                  className="font-medium"
                  key={`subtotal-${state.items.reduce((sum, item) => sum + item.quantity, 0)}`}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {formatINR(
                    state.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    ) / 100
                  )}
                </motion.span>
              </div>
              <div className="flex justify-between">
                <span className="text-textBody">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <motion.span
                  key={`total-${state.items.reduce((sum, item) => sum + item.quantity, 0)}`}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {formatINR(
                    state.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    ) / 100
                  )}
                </motion.span>
              </div>
            </div>

            <motion.button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary text-white py-4 rounded-full font-poppins font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={!isCheckingOut ? { scale: 1.02 } : {}}
              whileTap={!isCheckingOut ? { scale: 0.98 } : {}}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Proceed to Checkout
                </>
              )}
            </motion.button>
            
            <form onSubmit={handleCheckout} className="mt-6 space-y-4">
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
                  <div>✨ Complete Order ✨</div>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;