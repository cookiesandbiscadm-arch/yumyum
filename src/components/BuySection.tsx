import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Plus, Minus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const BuySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedPackage, setSelectedPackage] = useState('family');
  const [quantity, setQuantity] = useState(1);

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      price: 12.99,
      biscuits: 6,
      description: 'Perfect for trying our flavors',
      popular: false
    },
    {
      id: 'family',
      name: 'Family Pack',
      price: 24.99,
      biscuits: 15,
      description: 'Great for sharing with family',
      popular: true
    },
    {
      id: 'party',
      name: 'Party Pack',
      price: 39.99,
      biscuits: 30,
      description: 'Perfect for celebrations',
      popular: false
    }
  ];

  const features = [
    { icon: '🚚', title: 'Free Delivery', description: 'Straight to your door!' },
    { icon: '⏰', title: '30 Min Max', description: 'Super fast delivery' },
    { icon: '😊', title: '100% Happy', description: 'Guaranteed smiles' },
    { icon: '🌟', title: 'Premium Quality', description: 'Only the best ingredients' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate main container
      gsap.fromTo('.buy-container', 
        { y: 100, opacity: 0, scale: 0.9 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.buy-container',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animate features
      gsap.fromTo('.feature-item', 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1,
          duration: 0.8, 
          stagger: 0.2,
          ease: "bounce.out",
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
  const totalPrice = selectedPkg ? selectedPkg.price * quantity : 0;

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-blue-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="buy-container max-w-6xl mx-auto">


          

          {/* Features Grid */}
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-item text-center p-6 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="font-fredoka text-lg font-bold text-textPrimary mb-2">
                  {feature.title}
                </h4>
                <p className="font-poppins text-textBody text-sm">
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