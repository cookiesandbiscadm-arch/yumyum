import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowLeft, Plus, Minus, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import { fetchCategories } from '../lib/api';
import { formatINR } from '../lib/format';
import ProductCard from '../components/ProductCard';

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
      // Guard against undefined route id
      if (!id) {
        setError('Invalid product ID.');
        setProduct(null);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('products_with_images')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError(error.message || 'Failed to load product.');
      // Normalize nutrition in case the view exposes flat columns
      type Nutrition = { calories: number | null; sugar: number | null; protein: number | null };
      let normalized: any = data ? { ...data } : null;
      if (normalized) {
        const nutrition: Nutrition = (normalized as any)?.nutrition ?? {
          calories: (normalized as any)?.calories ?? (normalized as any)?.nutrition_calories ?? null,
          sugar: (normalized as any)?.sugar ?? (normalized as any)?.nutrition_sugar ?? null,
          protein: (normalized as any)?.protein ?? (normalized as any)?.nutrition_protein ?? null,
        };
        // If all fields are null, drop nutrition to avoid showing placeholders unnecessarily
        if (nutrition.calories == null && nutrition.sugar == null && nutrition.protein == null) {
          normalized.nutrition = undefined;
        } else {
          normalized.nutrition = nutrition;
        }
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

  // Animation effects with cleanup
  useEffect(() => {
    if (!loading && product) {
      let mainTl: gsap.core.Timeline | null = gsap.timeline();
      let relatedTl: gsap.core.Timeline | null = null;

      // Safely animate main content if refs exist
      if (imageRef.current && detailsRef.current) {
        mainTl = gsap.timeline();
        mainTl.fromTo(
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
      }

      // Safely animate related products when they load
      if (!relatedLoading && relatedRef.current) {
        const relatedItems = relatedRef.current.querySelectorAll('.related-item');
        if (relatedItems.length > 0) {
          relatedTl = gsap.timeline();
          relatedTl.fromTo(
            relatedItems,
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

      // Cleanup function
      return () => {
        if (mainTl) mainTl.kill();
        if (relatedTl) relatedTl.kill();
      };
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
      <div className="pt-20 min-h-screen bg-gradient-to-br from-[#FFE8B0] to-[#F9C56C] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🍪</div>
          <h2 className="font-fredoka text-2xl text-[#5B3C1B] mb-4">
            Oops! Treat not found
          </h2>
          <Link
            to="/catalog"
            className="bg-gradient-to-r from-[#A6651C] to-[#E08A2E] text-white px-6 py-3 rounded-full font-poppins font-medium hover:opacity-90 transition-all duration-300 shadow-md"
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
    <div className="pt-20 min-h-screen bg-gradient-to-br from-[#FFE8B0] to-[#F9C56C]">
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
            className="inline-flex items-center text-[#5B3C1B] hover:text-[#A6651C] transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Catalog
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <motion.div 
            ref={imageRef}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg overflow-hidden border border-[#FFE8B0]"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl">
              <img
                src={product.full_image_url || product.image_url}
                alt={product.name}
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
                    className="absolute text-[#F9C56C] text-lg"
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
                  <span className="bg-[#F9C56C]/20 text-[#5B3C1B] px-3 py-1 rounded-full text-sm font-poppins font-medium capitalize">
                    {categoryMap[product.category_id]}
                  </span>
                ) : null}
                {/* Reviews removed */}
              </div>
              
              <h1 className="font-fredoka text-4xl md:text-5xl text-[#5B3C1B] mb-4">
                {product.name}
              </h1>
              
              <p className="font-poppins text-lg text-[#7D5630] mb-6">
                {product.description}
              </p>
              
              <div className="text-4xl font-poppins font-extrabold text-[#A6651C] mb-8">
                {formatINR(product.price)}
              </div>
            </div>

            {/* Nutrition Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[#FFE8B0]">
              <h3 className="font-fredoka text-xl text-[#5B3C1B] mb-4">
                Nutrition Magic ✨
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="font-poppins font-bold text-[#5B3C1B]">
                    {product?.nutrition?.calories ?? '—'}
                  </div>
                  <div className="text-sm text-[#7D5630]">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🍯</div>
                  <div className="font-poppins font-bold text-[#5B3C1B]">
                    {product?.nutrition?.sugar ?? '—'}g
                  </div>
                  <div className="text-sm text-[#7D5630]">Sugar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">💪</div>
                  <div className="font-poppins font-bold text-[#5B3C1B]">
                    {product?.nutrition?.protein ?? '—'}g
                  </div>
                  <div className="text-sm text-[#7D5630]">Protein</div>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="font-poppins font-medium text-[#5B3C1B] whitespace-nowrap">
                  Quantity:
                </span>
                <motion.div 
                  className="flex flex-wrap items-center gap-2 sm:gap-4 w-full"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 sm:gap-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F9C56C]/20 flex-shrink-0 flex items-center justify-center text-[#5B3C1B] hover:bg-[#F9C56C]/30 transition-all"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                    <motion.span 
                      className="text-xl sm:text-2xl font-bold w-8 sm:w-12 text-center"
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
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F9C56C]/20 flex-shrink-0 flex items-center justify-center text-[#5B3C1B] hover:bg-[#F9C56C]/30 transition-all"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="h-12 w-full sm:flex-1 bg-gradient-to-r from-[#A6651C] to-[#E08A2E] text-white rounded-full font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg px-4 text-sm sm:text-base whitespace-nowrap min-w-0 overflow-hidden"
                  >
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="truncate">Add to Cart - {formatINR((product.price * quantity))}</span>
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
          <h2 className="font-fredoka text-3xl text-[#5B3C1B] mb-8 text-center">
            You Might Also Love
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
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
                  className="related-item h-full"
                >
                  <ProductCard 
                    product={{
                      ...relatedProduct,
                      weight: '300',
                      unit: 'g'
                    }}
                    linkToProduct={true}
                    className="h-full min-h-[420px] sm:min-h-[440px]"
                  />
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;