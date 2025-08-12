import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../lib/api';
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