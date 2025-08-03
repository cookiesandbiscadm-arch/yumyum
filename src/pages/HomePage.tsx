import React, { useRef } from 'react';
import Hero3D from '../components/Hero3D';
import ProductCarousel from '../components/ProductCarousel';
import BuySection from '../components/BuySection';
import OurStory from '../components/OurStory';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="relative">
      <Hero3D />
      <ProductCarousel />
      <BuySection />
      <OurStory />
      <Footer />
    </div>
  );
};

export default HomePage;