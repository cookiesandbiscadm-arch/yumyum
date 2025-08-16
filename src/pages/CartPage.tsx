import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/format';
import { submitOrder } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabaseClient';
// Stripe integration can be added later when needed

interface PromoCodeDetails {
  code: string;
  discount: number;
  discountAmount: number;
}

const CartPage: React.FC = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const { showToast } = useToast();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoCodeDetails, setPromoCodeDetails] = useState<PromoCodeDetails | null>(null);
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
  }, [state.items.length]);

  const FREE_SHIPPING_THRESHOLD = 300; // ₹300 for free shipping
  const SHIPPING_COST = 50; // ₹50 shipping cost

  // Compute current discount from subtotal and applied promo percentage
  const computeDiscount = (subtotal: number) => {
    if (!promoCodeDetails) return 0;
    const amount = (subtotal * promoCodeDetails.discount) / 100;
    return Number(amount.toFixed(2));
  };

  const calculateTotal = () => {
    const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const discount = computeDiscount(subtotal);
    return Math.max(0, subtotal + shipping - discount);
  };

  const calculateSubtotal = () => {
    return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    type PromoValidationResponse = {
      valid: boolean;
      message?: string;
      code: string;
      discount_percentage: number;
      discount_amount: number;
      min_order_value?: number;
      amount_remaining?: number;
    };

    try {
      const { data, error } = await supabase.rpc('validate_promo_code', {
        p_code: promoCode.trim().toUpperCase(),
        p_amount: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }) as unknown as { data: PromoValidationResponse | null; error: any };

      if (error || !data || !data.valid) {
        const msg = data && 'message' in data && data.message ? data.message : 'Invalid or expired promo code';
        throw new Error(msg);
      }

      setPromoCodeDetails({
        code: data.code,
        discount: data.discount_percentage,
        discountAmount: data.discount_amount
      });
      
      setPromoError('');
      showToast('Promo code applied successfully!', 'success');

    } catch (error) {
      setPromoError(error instanceof Error ? error.message : 'Failed to apply promo code');
      setPromoCodeDetails(null);
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoCodeDetails(null);
    setPromoError('');
  };

  const handleCheckout = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (state.items.length === 0) return;
    
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

      // Increment promo code usage only after successful order creation
      if (promoCodeDetails) {
        const { error } = await supabase
          .rpc('increment_use_count', {
            p_code: promoCodeDetails.code
          });
        if (error) {
          console.error('Failed to update promo code usage:', error);
          // Continue with checkout even if promo code update fails
        }
      }
      clearCart();
      navigate('/thank-you', { state: { customerInfo, orderNumber: orderResult.order_number } });
    } catch (error: any) {
      alert('Order failed: ' + (error && (typeof error === 'object' && 'message' in error) ? error.message : String(error)));
    } finally {
      setIsCheckingOut(false);
    }
  };

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

  if (state.items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-[#FFE8B0] to-[#F9C56C] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.05, 1],
            opacity: 1,
            transition: { duration: 0.6, ease: 'backOut' }
          }}
          className="text-center"
        >
          <div className="mb-6">
            <img 
              src="/images/logo.png" 
              alt="Logo"
              className="w-24 h-24 md:w-28 md:h-28 object-contain select-none block mx-auto"
              loading="eager"
              decoding="async"
            />
          </div>
          <h2 className="font-fredoka text-3xl text-[#5B3C1B] mb-4">
            Your cart is empty
          </h2>
          <p className="font-poppins text-[#7D5630] mb-8">
            Time to fill it with some delicious treats!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/catalog"
              aria-label="Start Shopping"
              className="bg-gradient-to-r from-[#A6651C] to-[#E08A2E] text-white px-10 py-4 rounded-full font-poppins font-extrabold text-2xl shadow-lg hover:opacity-90 transition-all duration-300 inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#F4A73C]"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="pt-20 min-h-screen bg-gradient-to-br from-[#FFE8B0] to-[#F9C56C]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background animation removed for a clean, static view */}

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
              className="flex items-center text-[#5B3C1B] hover:text-[#A6651C] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </motion.div>
          <motion.h1 
            className="font-fredoka text-3xl md:text-4xl text-[#5B3C1B] ml-8"
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
                  className="cart-item bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6 overflow-hidden border border-[#FFE8B0]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: isRemoving === item.id ? 0 : 1, 
                    x: isRemoving === item.id ? 100 : 0,
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
                    <div 
                      className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex-shrink-0"
                    >
                      {item.full_image_url && (
                        <img
                          src={item.full_image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-fredoka text-xl text-[#5B3C1B]">
                            {item.name}
                          </h3>
                          <p className="text-[#7D5630] font-poppins">
                            {formatINR(item.price)} each
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
                        <div 
                          className="flex items-center bg-gray-50 rounded-full px-3 py-1"
                        >
                          <motion.button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="text-[#5B3C1B] hover:text-[#A6651C] transition-colors p-1"
                            whileTap={{ scale: 0.8 }}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className={`w-4 h-4 ${item.quantity <= 1 ? 'opacity-30' : ''}`} />
                          </motion.button>
                          <span 
                            className="mx-4 font-medium w-6 text-center"
                            key={`quantity-${item.quantity}`}
                          >
                            {item.quantity}
                          </span>
                          <motion.button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-[#5B3C1B] hover:text-[#A6651C] transition-colors p-1"
                            whileTap={{ scale: 0.8 }}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <span 
                          className="font-fredoka text-lg text-[#5B3C1B]"
                        >
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Form */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg h-fit border border-[#FFE8B0] lg:sticky lg:top-24 lg:self-start lg:ml-auto lg:max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-fredoka text-2xl text-[#5B3C1B] mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-[#7D5630]">Subtotal</span>
                <span 
                  className="font-medium"
                >
                  {formatINR(calculateSubtotal())}
                </span>
              </div>

              {/* Discount Display */}
              {promoCodeDetails && (
                <div className="flex justify-between">
                  <span className="text-[#7D5630]">Discount ({promoCodeDetails.code})</span>
                  <span className="font-medium text-green-600">
                    -{formatINR(computeDiscount(calculateSubtotal()))}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[#7D5630]">Shipping</span>
                  {calculateSubtotal() < FREE_SHIPPING_THRESHOLD && (
                    <span className="text-xs bg-[#FFE8B0] text-[#7D5630] px-2 py-0.5 rounded-full">
                      Add {formatINR(FREE_SHIPPING_THRESHOLD - calculateSubtotal())} for free delivery
                    </span>
                  )}
                </div>
                <span className="font-medium">
                  {calculateSubtotal() >= FREE_SHIPPING_THRESHOLD ? 'Free' : formatINR(SHIPPING_COST)}
                </span>
              </div>

              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  {formatINR(calculateTotal())}
                  {promoCodeDetails && promoCodeDetails.discount > 0 && (
                    <span className="block text-xs font-normal text-green-600">
                      You saved {formatINR(computeDiscount(calculateSubtotal()))}!
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-3 text-[#7D5630]">Promo Code</h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E08A2E]"
                  disabled={!!promoCodeDetails}
                />
                {promoCodeDetails ? (
                  <button
                    onClick={removePromoCode}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors w-full sm:w-auto shrink-0"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-[#E08A2E] text-white rounded-full hover:bg-[#D07D1F] transition-colors w-full sm:w-auto shrink-0"
                  >
                    Apply
                  </button>
                )}
              </div>
              {promoError && (
                <p className="mt-1 text-sm text-red-600">{promoError}</p>
              )}
              {promoCodeDetails && (
                <div className="mt-2 text-sm text-green-600">
                  Promo code applied! {promoCodeDetails.discount}% discount (-{formatINR(computeDiscount(calculateSubtotal()))})
                </div>
              )}
            </div>

            <form onSubmit={handleCheckout} className="mt-6 space-y-4">
              <div>
                <label className="block font-poppins font-medium text-[#5B3C1B] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#A6651C] focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block font-poppins font-medium text-[#5B3C1B] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#A6651C] focus:outline-none transition-colors"
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label className="block font-poppins font-medium text-[#5B3C1B] mb-2">
                  Delivery Address
                </label>
                <textarea
                  required
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#A6651C] focus:outline-none transition-colors resize-none"
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
                    : 'bg-gradient-to-r from-[#A6651C] to-[#E08A2E] text-white hover:opacity-90 animate-wiggle'
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
