import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { formatINR } from '../lib/format';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  full_image_url?: string;
  category_id?: string;
  weight?: string;
  unit?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  showAddToCart?: boolean;
  linkToProduct?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = '', 
  showAddToCart = true,
  linkToProduct = true 
}) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || '',
      category_id: product.category_id || '',
      full_image_url: product.full_image_url || product.image_url || ''
    });

    showToast(`🍪 ${product.name} added to cart!`, 'success', 2500);

    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.willChange = 'transform';
    const { gsap } = await import('gsap');
    gsap.to(target, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        target.style.willChange = 'auto';
      }
    });
  };

  const cardContent = (
    <div className={`
      group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl 
      transition-all duration-500 ease-out transform hover:-translate-y-2
      border border-pink-100 overflow-hidden backdrop-blur-sm
      ${className}
    `}>
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-3xl aspect-[4/3] bg-gradient-to-br from-pink-50 to-purple-50">
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        
        {/* Product Image */}
        <img
          src={product.full_image_url || product.image_url || '/api/placeholder/400/300'}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 will-change-transform"
        />
        
        {/* Floating Magic Sparkle */}
        <div className="absolute top-4 right-4 text-2xl opacity-70 group-hover:opacity-100 group-hover:animate-sparkle transition-all duration-300">
          ✨
        </div>
        
        {/* Fresh Badge */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-magic-orange to-magic-pink text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
          Fresh Baked
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 space-y-4">
        {/* Product Name */}
        <h3 className="font-fredoka text-xl font-bold text-textPrimary leading-tight group-hover:text-magic-purple transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Description (Optional) */}
        {product.description && (
          <p className="font-poppins text-textBody text-sm leading-relaxed line-clamp-2 opacity-80">
            {product.description}
          </p>
        )}
        
        {/* Price Section */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="font-fredoka font-bold text-2xl bg-gradient-to-r from-magic-pink via-magic-purple to-magic-orange bg-clip-text text-transparent">
              {formatINR(product.price)}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {product.weight && product.unit ? (
                `for a ${product.weight}${product.unit} box`
              ) : (
                'per delicious pack'
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              className="
                group/btn relative bg-gradient-to-r from-magic-purple to-purple-600 
                text-white px-6 py-3 rounded-2xl font-bold text-sm
                hover:from-purple-600 hover:to-purple-700 
                transition-all duration-300 transform hover:scale-105 
                shadow-lg hover:shadow-xl active:scale-95
                focus:outline-none focus:ring-4 focus:ring-purple-200
                min-w-[120px] touch-manipulation
              "
              aria-label={`Add ${product.name} to cart`}
            >
              {/* Button Content */}
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4 group-hover/btn:animate-bounce" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </span>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-magic-purple/20 to-purple-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </button>
          )}
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-pink-200 group-hover:via-purple-200 group-hover:to-orange-200 opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );

  // Wrap with Link if linkToProduct is true
  if (linkToProduct) {
    return (
      <Link 
        to={`/product/${product.id}`}
        className="block focus:outline-none focus:ring-4 focus:ring-pink-200 rounded-3xl transition-all duration-300"
        aria-label={`View details for ${product.name}`}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default ProductCard;
