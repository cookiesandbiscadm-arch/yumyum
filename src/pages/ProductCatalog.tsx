import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../lib/api';
import { formatINR } from '../lib/format';
import { useCart } from '../context/CartContext';

const ProductCatalog: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {error ? (
            <div className="col-span-full text-center text-red-500 py-12">{error}</div>
          ) : loading ? null : filteredProducts.length === 0 ? null : filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-2xl mb-4">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.full_image_url || product.image_url}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width="300"
                    height="192"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
                  />
                </Link>
                {/* Reviews removed */}

              {/* Category badge (resolved via category_id) */}
              {product.category_id && categoryMap[product.category_id] ? (
                <div className="mt-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-poppins font-medium capitalize">
                    {categoryMap[product.category_id]}
                  </span>
                </div>
              ) : null}
                
                {/* Sparkles on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-primary text-xs"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${20 + i * 20}%`,
                      }}
                      animate={{
                        scale: [0, 1.2, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <Link to={`/product/${product.id}`}>
                <h3 className="font-fredoka text-xl text-textPrimary mb-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <p className="font-poppins text-textBody mb-4 text-sm line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-poppins font-extrabold text-2xl text-accent1">
                  {formatINR(product.price)}
                </span>
                
                <div className="flex gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="bg-accent1 text-white px-4 py-2 rounded-full font-poppins font-medium hover:bg-accent1/90 transition-colors text-sm"
                  >
                    View
                  </Link>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addItem(product)}
                    className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
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