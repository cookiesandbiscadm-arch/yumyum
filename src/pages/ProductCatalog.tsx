import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchProducts, fetchCategories } from '../lib/api';
import ProductCard from '../components/ProductCard';

const ProductCatalog: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

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
        const map: Record<string, string> = {};
        for (const c of cats) if (c && c.id) map[c.id] = c.name;
        setCategoryMap(map);
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


  return (
    <div className="pt-20 min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="font-fredoka text-4xl md:text-6xl text-textPrimary mb-4">
            Our Magical Collection
          </h1>
          <p className="font-poppins text-xl text-textBody max-w-2xl mx-auto">
            Choose your favorite treats and start your delicious adventure!
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-poppins font-medium transition-all duration-300 flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-white text-textBody hover:bg-primary/10 hover:scale-105'
              }`}
            >
              <span className="text-xl">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {error ? (
            <div className="col-span-full text-center text-red-500 py-12">{error}</div>
          ) : loading ? null : filteredProducts.length === 0 ? null : filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard 
                product={{
                  ...product,
                  weight: '200',
                  unit: 'g'
                }}
                linkToProduct={true}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🍪</div>
            <h3 className="font-fredoka text-2xl text-textPrimary mb-2">
              No treats found
            </h3>
            <p className="font-poppins text-textBody">
              Try selecting a different category
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;