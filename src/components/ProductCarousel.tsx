import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../lib/api';
import { ProductCardSkeleton } from './LoadingSkeleton';
import ProductCard from './ProductCard';

const ProductCarousel: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
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
            const q = gsap.utils.selector(el);

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
                { y: 30, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: 'power3.out',
                  stagger: 0.15,
                  scrollTrigger: {
                    trigger: grid,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                  }
                }
              );
            }
          }, el);

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

  // Category mapping removed as it's not being used in the component

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-[#FFE8B0] to-[#F9C56C]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1200px 900px' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="carousel-title font-fredoka text-4xl md:text-6xl font-bold mb-4 text-[#5B3C1B]">
            Our Magical Treats ✨
          </h2>
          <p className="font-poppins text-xl text-[#7D5630] max-w-2xl mx-auto">
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
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                weight: '200',
                unit: 'g'
              }}
              className="product-card"
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#E08A2E] to-[#D07D1F] text-white px-8 py-4 rounded-full font-fredoka font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-[0_0_30px_rgba(224,138,46,0.5)] hover:from-[#D07D1F] hover:to-[#A65A18] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E08A2E]/50"
            aria-label="View all products"
            title="View all products"
          >
            <img src="/images/logo.png" alt="Logo" className="w-6 h-6 md:w-7 md:h-7 object-contain select-none" loading="lazy" decoding="async" />
            <span>View All Products</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;