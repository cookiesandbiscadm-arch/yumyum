import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    const ctx = gsap.context(() => {
      // Animate section header
      gsap.fromTo('.story-header', 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.story-header',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate story steps
      storySteps.forEach((step, index) => {
        const direction = step.side === 'left' ? -100 : 100;
        
        gsap.fromTo(`.story-step-${index}`, 
          { x: direction, opacity: 0, scale: 0.8 },
          { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            duration: 0.8, 
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: `.story-step-${index}`,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Animate icons within each step
        gsap.fromTo(`.story-icon-${index}`, 
          { scale: 0, rotation: -180, y: 20, opacity: 0 },
          { 
            scale: 1, 
            rotation: 0, 
            y: 0, 
            opacity: 1,
            duration: 0.6, 
            ease: "bounce.out",
            delay: 0.3,
            scrollTrigger: {
              trigger: `.story-step-${index}`,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-blue-50 to-yellow-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="story-header text-center mb-16">
                      <h2 className="font-fredoka text-4xl md:text-6xl font-bold magic-text mb-4">
            Our Magical Journey 🌟
          </h2>
          <p className="font-poppins text-xl text-textBody max-w-2xl mx-auto">
            Every great adventure has a beginning. Here's ours...
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-200 via-purple-200 to-orange-200 rounded-full"></div>

          {storySteps.map((step, index) => (
            <div
              key={index}
              className={`story-step-${index} relative flex flex-col md:flex-row items-center mb-16 ${
                step.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content Card */}
              <div className={`w-full md:w-5/12 ${step.side === 'left' ? 'md:pr-8' : 'md:pl-8'} mb-8 md:mb-0`}>
                <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className={`story-icon-${index} text-3xl md:text-4xl mr-3`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="font-fredoka text-xl md:text-2xl font-bold magic-text">
                        {step.year}
                      </div>
                      <h3 className="font-fredoka text-lg md:text-xl font-bold text-textPrimary">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="font-poppins text-textBody leading-relaxed text-sm md:text-base">
                    {step.description}
                  </p>
                  <div className="text-right mt-4 text-xl md:text-2xl">
                    {step.emoji}
                  </div>
                </div>
              </div>

              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full border-4 border-white shadow-lg z-10"></div>

              {/* Empty space for the other side */}
              <div className="hidden md:block w-5/12"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto shadow-xl">
                            <h3 className="font-fredoka text-3xl font-bold magic-text mb-4">
              Join Our Adventure! 🎯
            </h3>
            <p className="font-poppins text-textBody mb-6">
              Be part of our magical story. Every biscuit you enjoy adds a new chapter to our journey of spreading joy and creating sweet memories.
            </p>
                          <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-8 py-4 rounded-full font-fredoka font-bold text-lg hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 magic-button">
              🍪 Start Your Adventure
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;