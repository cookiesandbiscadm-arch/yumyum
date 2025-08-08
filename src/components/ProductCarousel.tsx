import React, { useRef } from 'react';
import { Heart, Plus } from 'lucide-react';
import { fetchProducts } from '../lib/api';
import { useCart } from '../context/CartContext';


const ProductCarousel: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
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

  const handleAddToCart = async (product: any, event: React.MouseEvent) => {
    event.stopPropagation();
    addItem(product);
    
    // Bounce animation
    const { gsap } = await import('gsap');
    gsap.to(event.currentTarget, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1
    });
  };

  const handleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const heart = event.currentTarget.querySelector('.heart-icon');
    if (heart) {
      const { gsap } = await import('gsap');
      gsap.to(heart, {
        scale: 1.3,
        duration: 0.3,
        ease: "bounce.out",
        yoyo: true,
        repeat: 1
      });
    }
  };

  
  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then(prods => setProducts(prods))
      .catch(e => setError(e.message || 'Failed to load products.'))
      .finally(() => setLoading(false));
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
          ) : loading ? null : products.length === 0 ? (
            <div className="col-span-full text-center py-12">No products found.</div>
          ) : products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="product-card group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl mb-4">
                <img
                  src={product.full_image_url || product.image_url}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating emoji */}
                <div className="absolute top-3 left-3 text-3xl animate-bounce">
                  🍪
                </div>
                
                {/* Like button */}
                <button
                  onClick={handleLike}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200"
                >
                  <Heart className="heart-icon w-5 h-5 text-gray-400 hover:text-red-500 transition-colors duration-200" />
                </button>
                
                {/* Flavor tag */}
                <div className="absolute bottom-3 left-3 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {product.category}
                </div>
              </div>
              
                              <h3 className="font-fredoka text-xl font-bold text-textPrimary mb-2">
                {product.name}
              </h3>
              
              <p className="font-poppins text-textBody mb-4 text-sm line-clamp-2">
                {product.description}
              </p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">⭐</span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600 bg-yellow-100 px-2 py-1 rounded-full">
                  4.9 (127)
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-fredoka font-bold text-2xl text-green-600">
                    ${product.price}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">/ biscuit</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium hover:from-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
                          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-fredoka font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
            🍪 View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;