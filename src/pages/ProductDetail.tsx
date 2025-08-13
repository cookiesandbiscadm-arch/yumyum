import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowLeft, Plus, Minus, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import { fetchCategories } from '../lib/api';
import { formatINR } from '../lib/format';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Related products state
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  
  // Refs for animations
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

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
      // Normalize nutrition in case the view exposes flat columns
      const normalized = data
        ? {
            ...data,
            nutrition:
              data?.nutrition ?? {
                calories: (data as any)?.calories ?? (data as any)?.nutrition_calories ?? null,
                sugar: (data as any)?.sugar ?? (data as any)?.nutrition_sugar ?? null,
                protein: (data as any)?.protein ?? (data as any)?.nutrition_protein ?? null,
              },
          }
        : null;
      // If all fields are null, drop nutrition to avoid showing placeholders unnecessarily
      if (
        normalized &&
        normalized.nutrition &&
        normalized.nutrition.calories == null &&
        normalized.nutrition.sugar == null &&
        normalized.nutrition.protein == null
      ) {
        (normalized as any).nutrition = undefined;
      }
      setProduct(normalized);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // Resolve category name without DB/view changes
  useEffect(() => {
    let mounted = true;
    fetchCategories()
      .then((cats) => {
        if (!mounted || !cats) return;
        const map: Record<string, string> = {};
        for (const c of cats) if (c && c.id) map[c.id] = c.name;
        setCategoryMap(map);
      })
      .catch(() => {/* ignore */});
    return () => { mounted = false; };
  }, []);

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

  // Animation effects
  useEffect(() => {
    if (!loading && product) {
      // Animate main content
      gsap.fromTo(
        [imageRef.current, detailsRef.current],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power3.out',
        }
      );

      // Animate related products when they load
      if (!relatedLoading && relatedRef.current) {
        gsap.fromTo(
          relatedRef.current.querySelectorAll('.related-item'),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.3,
          }
        );
      }
    }
  }, [loading, relatedLoading, product]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-64 h-64 bg-gray-200 rounded-full mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-12 bg-primary/20 rounded-lg w-48"></div>
        </div>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="pt-20 min-h-screen bg-secondary flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
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
        </motion.div>
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
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Link
            to="/catalog"
            className="inline-flex items-center text-textBody hover:text-primary transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Catalog
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <motion.div 
            ref={imageRef}
            className="bg-white rounded-2xl p-6 shadow-lg overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl">
              <img
                src={product.full_image_url || product.image_url}
                alt={product.name}
                fetchPriority="high"
                width="600"
                height="384"
                sizes="(max-width: 1024px) 100vw, 50vw"
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
                {product?.category_id && categoryMap[product.category_id] ? (
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-poppins font-medium capitalize">
                    {categoryMap[product.category_id]}
                  </span>
                ) : null}
                {/* Reviews removed */}
              </div>
              
              <h1 className="font-fredoka text-4xl md:text-5xl text-textPrimary mb-4">
                {product.name}
              </h1>
              
              <p className="font-poppins text-lg text-textBody mb-6">
                {product.description}
              </p>
              
              <div className="text-4xl font-poppins font-extrabold text-accent1 mb-8">
                {formatINR(product.price)}
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
                    {product?.nutrition?.calories ?? '—'}
                  </div>
                  <div className="text-sm text-textBody">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🍯</div>
                  <div className="font-poppins font-bold text-textPrimary">
                    {product?.nutrition?.sugar ?? '—'}g
                  </div>
                  <div className="text-sm text-textBody">Sugar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">💪</div>
                  <div className="font-poppins font-bold text-textPrimary">
                    {product?.nutrition?.protein ?? '—'}g
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
                <motion.div 
                  className="flex items-center gap-4 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>
                  <motion.span 
                    className="text-2xl font-bold w-12 text-center"
                    key={quantity}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {quantity}
                  </motion.span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 h-12 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart - {formatINR((product.price * quantity) / 100)}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <motion.div 
          ref={relatedRef}
          className="md:col-span-2 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
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
                        src={relatedProduct.full_image_url || relatedProduct.image_url}
                        alt={relatedProduct.name}
                        loading="lazy"
                        decoding="async"
                        width="200"
                        height="128"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
                      />
                    </div>
                    <h3 className="font-fredoka text-lg text-textPrimary mb-1">
                      {relatedProduct.name}
                    </h3>
                    <div className="font-poppins font-bold text-accent1">
                      {formatINR(relatedProduct.price)}
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