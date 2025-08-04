import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate floating particles
      gsap.to('.floating-particle', {
        y: -20,
        x: 'random(-30, 30)',
        duration: 'random(2, 5)',
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          amount: 2,
          from: "random"
        }
      });

      // Animate footer content
      gsap.fromTo('.footer-content', 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: '.footer-content',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 text-white overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="floating-particle absolute text-2xl opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {['🍪', '⭐', '🎈', '🌟', '💫', '🎉'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      <div className="footer-content relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl">🍪</span>
              </div>
              <div>
                <h3 className="font-fredoka text-2xl font-bold">YumYum</h3>
                <p className="text-sm opacity-90">Biscuits</p>
              </div>
            </div>
            <p className="font-poppins text-sm opacity-90 leading-relaxed">
              Spreading joy and creating magical moments, one biscuit at a time. 
              Join our sweet adventure! ✨
            </p>
          </div>

          {/* Quick Links */}
          <div>
                            <h4 className="font-fredoka text-lg font-bold mb-4">Quick Links 🚀</h4>
            <ul className="space-y-2">
              {['Home', 'Our Treats', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="font-poppins text-sm opacity-90 hover:opacity-100 transition-opacity duration-200 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
                            <h4 className="font-fredoka text-lg font-bold mb-4">Get in Touch 📞</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 opacity-90" />
                <span className="font-poppins text-sm opacity-90">+91-9467689666</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 opacity-90" />
                <span className="font-poppins text-sm opacity-90">dksincorporate@gmail.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 opacity-90" />
                <span className="font-poppins text-sm opacity-90">Biscuit Land, Sweet Street 123</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
                            <h4 className="font-fredoka text-lg font-bold mb-4">Magic Updates 💌</h4>
            <p className="font-poppins text-sm opacity-90 mb-4">
              Get the latest news about new flavors and special offers!
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-full text-gray-800 font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-white"
              />
                              <button className="bg-white text-purple-600 px-4 py-2 rounded-full font-fredoka font-bold text-sm hover:bg-gray-100 transition-colors duration-200">
                Subscribe! 🎉
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {['🎵', '📸', '🐦', '📘'].map((emoji, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                >
                  <span className="text-lg">{emoji}</span>
                </a>
              ))}
            </div>
            
            <div className="text-center">
              <p className="font-poppins text-sm opacity-90 flex items-center justify-center">
                Made with <Heart className="w-4 h-4 mx-1 text-red-300" /> by the YumYum Team
              </p>
              <p className="font-poppins text-xs opacity-75 mt-1">
                © 2024 YumYum Biscuits. All rights reserved. 🍪
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;