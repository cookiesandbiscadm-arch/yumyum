import React, { useRef, useEffect } from 'react';

const BuySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  // No local state needed in this lightweight section
 

  const features = [
    { icon: '🚚', title: 'Free Delivery', description: 'Straight to your door!' },
    { icon: '⏰', title: '30 Min Max', description: 'Super fast delivery' },
    { icon: '😊', title: '100% Happy', description: 'Guaranteed smiles' },
    { icon: '🌟', title: 'Premium Quality', description: 'Only the best ingredients' }
  ];

  useEffect(() => {
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

            // Animate main container (scoped)
            const container = q('.buy-container');
            if (container.length) {
              gsap.fromTo(container,
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: container[0],
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                  }
                }
              );
            }

            // Animate features (scoped)
            const features = q('.feature-item');
            const featuresGrid = q('.features-grid')[0];
            if (features.length && featuresGrid) {
              gsap.fromTo(features,
                { y: 30, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  stagger: 0.15,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: featuresGrid,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                  }
                }
              );
            }
          }, sectionRef);

          // Avoid ScrollTrigger.refresh() while hidden by content-visibility
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
  }, []);

  // Derived pricing removed (unused)

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-[#FFF5E0] to-[#FFE8B0]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1100px 900px' }}
    >
      <div className="container mx-auto px-4">
        <div className="buy-container max-w-6xl mx-auto">


          

          {/* Features Grid */}
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-item text-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl hover:shadow-xl transition-all duration-300 border border-[#FFE8B0] hover:border-[#E08A2E] hover:scale-[1.02]"
              >
                <div className="text-5xl mb-4 drop-shadow-md">{feature.icon}</div>
                <h4 className="font-fredoka text-xl font-bold text-[#5B3C1B] mb-2">
                  {feature.title}
                </h4>
                <p className="font-poppins text-[#7D5630] text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuySection;