import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatINR } from '../lib/format';
import { Plus } from 'lucide-react';
import { fetchCategories, fetchProducts } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductCardSkeleton } from './LoadingSkeleton';

const ProductCarousel: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize animations only when visible and after products are rendered
  React.useLayoutEffect(() => {
    let ctx: any;
    let initialized = false;
    const el = sectionRef.current;
    if (!el) return;

    const onIntersect: IntersectionObserverCallback = (entries, observer) => {
      const entry = entries[0];
      if (!initialized && entry.isIntersecting) {
        initialized = true;
        (async () => {
          const { gsap } = await import('gsap');
          const { ScrollTrigger } = await import('gsap/ScrollTrigger');
          gsap.registerPlugin(ScrollTrigger);

          ctx = gsap.context(() => {
            const q = gsap.utils.selector(sectionRef);

            // Animate section title (scoped)
            const title = q('.carousel-title');
            if (title.length) {
              gsap.fromTo(title,
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 1,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: title[0],
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                  }
                }
              );
            }

            // Animate product cards (only if present and scoped)
            const cards = q('.product-card');
            const grid = q('.product-grid')[0];
            if (cards.length && grid) {
              gsap.fromTo(cards,
                { y: 100, opacity: 0, scale: 0.8, rotation: -5 },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotation: 0,
                  duration: 0.8,
                  ease: 'bounce.out',
                  stagger: 0.2,
                  scrollTrigger: {
                    trigger: grid,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                  }
                }
              );
            }
          }, sectionRef);

          // Do not call ScrollTrigger.refresh() here to avoid invalid scopes while hidden
        })();
        observer.disconnect();
      }
    };

    const observer = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    observer.observe(el);

    return () => {
      observer.disconnect();
      ctx?.revert?.();
    };
  }, [products.length]);

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category_id: product.category_id,
      full_image_url: product.full_image_url || product.image_url
    });

    // Show toast notification
    showToast(`🍪 ${product.name} added to cart!`, 'success', 2500);

    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.willChange = 'transform';
    const { gsap } = await import('gsap');
    gsap.to(target, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        target.style.willChange = 'auto';
      }
    });
  };

  // Like feature removed per request

  // Fetch products on mount with caching handled in api.ts
  useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        setProducts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load products');
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch categories to resolve category_id -> name without altering DB/view
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

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-pink-50 to-orange-50"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1200px 900px' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="carousel-title font-fredoka text-4xl md:text-6xl font-bold magic-text mb-4">
            Our Magical Treats ✨
          </h2>
          <p className="font-poppins text-xl text-textBody max-w-2xl mx-auto">
            Each biscuit is crafted with love and sprinkled with happiness
          </p>
        </div>

        <div className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {error ? (
            <div className="col-span-full text-center text-red-500 py-12">{error}</div>
          ) : loading ? (
            // Beautiful loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">No products available</div>
          ) : products.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="product-card group bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 cursor-pointer border border-white/50 hover:border-pink-200/50"
            >
              <div className="relative overflow-hidden rounded-2xl mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-2xl"></div>
                <img
                  src={product.full_image_url || product.image_url}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  width="300"
                  height="192"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-700 will-change-transform"
                />
                
                {/* Enhanced floating emoji with animation */}
                <div className="absolute top-3 left-3 text-3xl animate-bounce group-hover:animate-spin transition-all duration-300">
                  🍪
                </div>
                

                
                {/* Enhanced category tag */}
                {product.category_id && categoryMap[product.category_id] ? (
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold capitalize shadow-lg backdrop-blur-sm">
                    {categoryMap[product.category_id]}
                  </div>
                ) : null}
                
                {/* New badge for visual interest */}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  ✨ Fresh
                </div>
              </div>
              
                              <h3 className="font-fredoka text-xl font-bold text-textPrimary mb-2">
                {product.name}
              </h3>
              
              <p className="font-poppins text-textBody mb-4 text-sm line-clamp-2">
                {product.description}
              </p>
              
              {/* Reviews removed */}
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="font-fredoka font-bold text-3xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {formatINR(product.price)}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">per delicious biscuit</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-5 py-3 rounded-full font-bold hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 hover:rotate-3 flex items-center gap-2 shadow-lg hover:shadow-xl group-hover:animate-pulse"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/catalog"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-fredoka font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            aria-label="View all products"
            title="View all products"
          >
            🍪 View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;