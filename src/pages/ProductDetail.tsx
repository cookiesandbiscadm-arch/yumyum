import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Heart, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Related products state
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [relatedError, setRelatedError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products_with_images')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError(error.message || 'Failed to load product.');
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (!product || !product.category_id) return;
    setRelatedLoading(true);
    setRelatedError(null);
    supabase
      .from('products_with_images')
      .select('*')
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(4)
      .then(({ data, error }) => {
        if (error) setRelatedError(error.message || 'Failed to load related products.');
        setRelatedProducts(data || []);
        setRelatedLoading(false);
      });
  }, [product]);

  if (loading) {
    return <div className="pt-20 min-h-screen flex items-center justify-center">Loading product...</div>;
  }
  if (error || !product) {
    return (
      <div className="pt-20 min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍪</div>
          <h2 className="font-fredoka text-2xl text-textPrimary mb-4">
            Oops! Treat not found
          </h2>
          <Link
            to="/catalog"
            className="bg-primary text-white px-6 py-3 rounded-full font-poppins font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-textBody hover:text-primary transition-colors font-poppins"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Treats
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl">
              <img
                src={product.full_image_url || product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover rounded-2xl"
              />
              
              {/* Floating sparkles */}
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-primary text-lg"
                    style={{
                      left: `${10 + i * 20}%`,
                      top: `${15 + i * 15}%`,
                    }}
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      rotate: [0, 180, 360],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-poppins font-medium capitalize">
                  {product.category}
                </span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-current" />
                  ))}
                </div>
              </div>
              
              <h1 className="font-fredoka text-4xl md:text-5xl text-textPrimary mb-4">
                {product.name}
              </h1>
              
              <p className="font-poppins text-lg text-textBody mb-6">
                {product.description}
              </p>
              
              <div className="text-4xl font-poppins font-bold text-primary mb-8">
                ${product.price}
              </div>
            </div>

            {/* Nutrition Info */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-fredoka text-xl text-textPrimary mb-4">
                Nutrition Magic ✨
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="font-poppins font-bold text-textPrimary">
                    {product.nutrition.calories}
                  </div>
                  <div className="text-sm text-textBody">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🍯</div>
                  <div className="font-poppins font-bold text-textPrimary">
                    {product.nutrition.sugar}g
                  </div>
                  <div className="text-sm text-textBody">Sugar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">💪</div>
                  <div className="font-poppins font-bold text-textPrimary">
                    {product.nutrition.protein}g
                  </div>
                  <div className="text-sm text-textBody">Protein</div>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-poppins font-medium text-textPrimary">
                  Quantity:
                </span>
                <div className="flex items-center bg-white rounded-full shadow-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-primary/10 rounded-full transition-colors"
                  >
                    <Minus className="w-4 h-4 text-textPrimary" />
                  </button>
                  <span className="px-4 font-poppins font-bold text-textPrimary">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-primary/10 rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4 text-textPrimary" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white py-4 rounded-full font-poppins font-semibold text-lg hover:bg-primary/90 transition-colors animate-bounce-gentle"
                >
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-4 rounded-full transition-colors ${
                    isLiked ? 'bg-accent2 text-white' : 'bg-white text-textBody hover:bg-accent2/10'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="font-fredoka text-3xl text-textPrimary mb-8 text-center">
            You Might Also Love
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedLoading ? (
              <div className="col-span-full text-center py-8">Loading related products...</div>
            ) : relatedError ? (
              <div className="col-span-full text-center text-red-500 py-8">{relatedError}</div>
            ) : relatedProducts.length === 0 ? (
              <div className="col-span-full text-center py-8">No related products found.</div>
            ) : relatedProducts.map((relatedProduct: any, index: number) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group bg-white rounded-3xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/product/${relatedProduct.id}`}>
                    <div className="relative overflow-hidden rounded-2xl mb-3">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-fredoka text-lg text-textPrimary mb-1">
                      {relatedProduct.name}
                    </h3>
                    <div className="font-poppins font-bold text-primary">
                      ${relatedProduct.price}
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;