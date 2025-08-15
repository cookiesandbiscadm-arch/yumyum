import React, { useRef, useEffect } from 'react';

const OurStory: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const storySteps = [
    {
      year: '2020',
      title: 'The Magic Begins',
      description: 'A grandmother\'s secret recipe becomes the foundation of our magical biscuit world.',
      icon: '👵',
      emoji: '✨',
      side: 'left'
    },
    {
      year: '2021',
      title: 'First Batch of Joy',
      description: 'We baked our first batch of magical biscuits, spreading smiles to 100 happy families.',
      icon: '🍪',
      emoji: '😊',
      side: 'right'
    },
    {
      year: '2022',
      title: 'Growing the Family',
      description: 'Our biscuit family grew to include 50+ magical flavors, each with its own special power.',
      icon: '🌟',
      emoji: '🎉',
      side: 'left'
    },
    {
      year: '2023',
      title: 'Worldwide Wonder',
      description: 'We started delivering happiness to children all around the world, one biscuit at a time.',
      icon: '🌍',
      emoji: '🚀',
      side: 'right'
    },
    {
      year: '2024',
      title: 'The Adventure Continues',
      description: 'Today, we continue creating magical moments and sweet memories for families everywhere.',
      icon: '🎈',
      emoji: '💖',
      side: 'left'
    }
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

            // Animate section header (scoped)
            const header = q('.story-header');
            if (header.length) {
              gsap.fromTo(header,
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 1,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: header[0],
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                  }
                }
              );
            }

            // Animate story steps
            storySteps.forEach((_, index) => {
              const stepEls = q(`.story-step-${index}`);
              const iconEls = q(`.story-icon-${index}`);

              if (stepEls.length) {
                gsap.fromTo(stepEls,
                  { y: 30, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    scrollTrigger: {
                      trigger: stepEls[0],
                      start: 'top 85%',
                      toggleActions: 'play none none reverse'
                    }
                  }
                );
              }

              if (stepEls.length && iconEls.length) {
                gsap.fromTo(iconEls,
                  { y: 20, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    delay: 0.2,
                    scrollTrigger: {
                      trigger: stepEls[0],
                      start: 'top 85%',
                      toggleActions: 'play none none reverse'
                    }
                  }
                );
              }
            });
          }, sectionRef);

          // No explicit ScrollTrigger.refresh() to avoid invalid scopes while hidden
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

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-[#FFF9ED] to-[#FFE8B0] overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1200px 1200px' }}
    >
      <div className="container mx-auto px-4">
        <div className="story-header text-center mb-16">
                      <h2 className="font-fredoka text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#A6651C] via-[#E08A2E] to-[#F4A73C] bg-clip-text text-transparent">
              Our Magical Journey 
              <span className="inline-block animate-bounce">✨</span>
            </span>
          </h2>
          <p className="font-poppins text-xl text-[#5B3C1B]/90 max-w-2xl mx-auto">
            Every great adventure has a beginning. Here's ours...
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#FFD699] via-[#E08A2E] to-[#A6651C] rounded-full shadow-inner"></div>

          {storySteps.map((step, index) => (
            <div
              key={index}
              className={`story-step-${index} relative flex flex-col md:flex-row items-center mb-16 ${
                step.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content Card */}
              <div className={`w-full md:w-5/12 ${step.side === 'left' ? 'md:pr-8' : 'md:pl-8'} mb-8 md:mb-0`}>
                <div className="bg-gradient-to-br from-white to-[#FFF5E5] backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-[#FFE8B0] hover:border-[#E08A2E]">
                  <div className="flex items-center mb-4">
                    <div className={`story-icon-${index} text-3xl md:text-4xl mr-3`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="font-fredoka text-xl md:text-2xl font-bold bg-gradient-to-r from-[#A6651C] to-[#E08A2E] bg-clip-text text-transparent">
                        {step.year}
                      </div>
                      <h3 className="font-fredoka text-lg md:text-xl font-bold text-[#5B3C1B] mt-1">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="font-poppins text-[#5B3C1B]/90 leading-relaxed text-sm md:text-base mt-2">
                    {step.description}
                  </p>
                  <div className="text-right mt-4 text-xl md:text-2xl">
                    {step.emoji}
                  </div>
                </div>
              </div>

              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-[#F9C56C] to-[#E08A2E] rounded-full border-4 border-white shadow-lg z-10 hover:scale-125 transition-transform duration-300"></div>

              {/* Empty space for the other side */}
              <div className="hidden md:block w-5/12"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-white to-[#FFF5E5] rounded-3xl p-8 max-w-2xl mx-auto shadow-xl border-2 border-[#FFE8B0] hover:border-[#E08A2E] transition-colors duration-300">
                            <h3 className="font-fredoka text-3xl font-bold bg-gradient-to-r from-[#A6651C] to-[#E08A2E] bg-clip-text text-transparent mb-4">
              Join Our Adventure! 🎯
            </h3>
            <p className="font-poppins text-[#5B3C1B]/90 mb-6 text-lg">
              Be part of our magical story. Every biscuit you enjoy adds a new chapter to our journey of spreading joy and creating sweet memories.
            </p>
                          <button className="bg-gradient-to-r from-[#A6651C] via-[#E08A2E] to-[#F4A73C] text-white px-8 py-4 rounded-full font-fredoka font-bold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
              <span className="drop-shadow-md">🍪 Start Your Adventure</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;