import React from 'react';
import ProductCard from '../components/ProductCard';

const ProductCardDemo: React.FC = () => {
  // Sample product data for demonstration
  const sampleProducts = [
    {
      id: '1',
      name: 'Chocolate Chip Delight',
      description: 'Crispy golden biscuits loaded with premium chocolate chips, baked to perfection with a hint of vanilla.',
      price: 120.00,
      image_url: '/api/placeholder/400/300',
      weight: '200',
      unit: 'g'
    },
    {
      id: '2',
      name: 'Butter Cookies Classic',
      description: 'Traditional butter cookies with a rich, melt-in-your-mouth texture.',
      price: 100.00,
      image_url: '/api/placeholder/400/300',
      weight: '250',
      unit: 'g'
    },
    {
      id: '3',
      name: 'Oat & Honey Crunch',
      description: 'Wholesome oat biscuits sweetened with natural honey and topped with crunchy nuts.',
      price: 150.00,
      image_url: '/api/placeholder/400/300',
      weight: '180',
      unit: 'g'
    },
    {
      id: '4',
      name: 'Double Chocolate Fudge',
      description: 'Rich chocolate biscuits with fudge chunks for the ultimate indulgence.',
      price: 180.00,
      image_url: '/api/placeholder/400/300',
      weight: '200',
      unit: 'g'
    },
    {
      id: '5',
      name: 'Coconut Macaroons',
      description: 'Tropical coconut biscuits with a chewy texture and sweet coconut flakes.',
      price: 140.00,
      image_url: '/api/placeholder/400/300',
      weight: '150',
      unit: 'g'
    },
    {
      id: '6',
      name: 'Almond Shortbread',
      description: 'Delicate shortbread cookies with roasted almonds and a buttery finish.',
      price: 160.00,
      image_url: '/api/placeholder/400/300',
      weight: '220',
      unit: 'g'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-primary to-accent2 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-fredoka text-4xl md:text-5xl font-bold text-textPrimary mb-4">
            🍪 Product Card Showcase
          </h1>
          <p className="font-poppins text-textBody text-lg max-w-2xl mx-auto">
            Experience our beautifully designed product cards with smooth responsiveness, 
            clean aesthetics, and magical interactions.
          </p>
        </div>

        {/* Grid Layout - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sampleProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              linkToProduct={false} // Disable links for demo
            />
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100">
          <h2 className="font-fredoka text-2xl font-bold text-textPrimary mb-6 text-center">
            ✨ Card Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-fredoka font-bold text-textPrimary mb-2">Mobile Optimized</h3>
              <p className="font-poppins text-textBody text-sm">
                Touch-friendly buttons and responsive design for all screen sizes
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-fredoka font-bold text-textPrimary mb-2">Clean Aesthetics</h3>
              <p className="font-poppins text-textBody text-sm">
                Light pink backgrounds with ample white space and modern styling
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-fredoka font-bold text-textPrimary mb-2">Smooth Interactions</h3>
              <p className="font-poppins text-textBody text-sm">
                Subtle hover effects, animations, and visual feedback
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🛒</div>
              <h3 className="font-fredoka font-bold text-textPrimary mb-2">Vibrant Purple CTA</h3>
              <p className="font-poppins text-textBody text-sm">
                Distinct purple "Add to Cart" buttons with hover animations
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-fredoka font-bold text-textPrimary mb-2">Clear Pricing</h3>
              <p className="font-poppins text-textBody text-sm">
                Price with unit/quantity information for transparency
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🖼️</div>
              <h3 className="font-fredoka font-bold text-textPrimary mb-2">High-Quality Images</h3>
              <p className="font-poppins text-textBody text-sm">
                Professional product photos without embedded text
              </p>
            </div>
          </div>
        </div>

        {/* Responsive Demo Section */}
        <div className="mt-16">
          <h2 className="font-fredoka text-3xl font-bold text-textPrimary mb-8 text-center">
            📐 Responsive Layouts
          </h2>
          
          <div className="space-y-12">
            {/* Mobile Layout Demo */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-pink-100">
              <h3 className="font-fredoka text-xl font-bold text-textPrimary mb-4 text-center">
                📱 Mobile Layout (Single Column)
              </h3>
              <div className="max-w-sm mx-auto">
                <ProductCard 
                  product={sampleProducts[0]}
                  linkToProduct={false}
                />
              </div>
            </div>

            {/* Tablet Layout Demo */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-pink-100">
              <h3 className="font-fredoka text-xl font-bold text-textPrimary mb-4 text-center">
                📟 Tablet Layout (Two Columns)
              </h3>
              <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
                <ProductCard 
                  product={sampleProducts[1]}
                  linkToProduct={false}
                />
                <ProductCard 
                  product={sampleProducts[2]}
                  linkToProduct={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardDemo;
