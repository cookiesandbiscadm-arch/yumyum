import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts, fetchCategories } from '../lib/api';
import ProductCard from '../components/ProductCard';

const ProductCatalog: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        setCategories([{ id: 'all', name: 'All Treats', emoji: '🍪' }, ...cats]);
        setProducts(prods);
      } catch (err: any) {
        setError(err.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category_id === activeCategory);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Smooth scroll to top when changing categories
    window.scrollTo({
      top: 300, // Scroll to just below the category buttons
      behavior: 'smooth'
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-[#FFE8B0] to-[#F9C56C]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="font-fredoka text-4xl md:text-6xl text-[#5B3C1B] mb-4">
            Our Magical Collection
          </h1>
          <p className="font-poppins text-xl text-[#7D5630] max-w-2xl mx-auto">
            Choose your favorite treats and start your delicious adventure!
          </p>
        </motion.div>

        {/* Category Filter (horizontal scroll on mobile) */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="-mx-4 px-4 overflow-x-auto whitespace-nowrap no-scrollbar md:overflow-visible md:whitespace-normal">
            <div className="inline-flex gap-3 md:flex md:flex-wrap md:justify-center md:gap-4 w-max">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full font-poppins font-medium transition-all duration-300 inline-flex items-center gap-2 flex-shrink-0 ${
                    activeCategory === category.id
                      ? 'bg-[#A6651C] text-white shadow-lg md:scale-105'
                      : 'bg-white text-[#5B3C1B] hover:bg-[#FFE8B0] md:hover:scale-105'
                  }`}
                >
                  <span className="text-lg md:text-xl">{category.emoji}</span>
                  <span className="truncate max-w-[10rem] md:max-w-none">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {error ? (
            <div className="col-span-full text-center text-red-500 py-12">{error}</div>
          ) : loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white/80 rounded-2xl p-4 h-full backdrop-blur-sm">
                <div className="animate-pulse">
                  <div className="bg-[#FFE8B0] h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-[#F9C56C] rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-[#F9C56C] rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-[#A6651C]/20 rounded-lg"></div>
                </div>
              </div>
            ))
          ) : filteredProducts.length === 0 ? (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[#5B3C1B]">No products found in this category.</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    duration: 0.3
                  }}
                  className="product-item"
                >
                  <ProductCard 
                    product={{
                      ...product,
                      weight: '300',
                      unit: 'g'
                    }}
                    linkToProduct={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;