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
      border border-[#FFE8B0] overflow-hidden backdrop-blur-sm
      ${className}
    `}>
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-3xl aspect-[4/3] bg-gradient-to-br from-[#FFE8B0] to-[#F9C56C]">
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#A6651C]/10 via-transparent to-[#F4A73C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        
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
        <div className="absolute top-4 left-4 bg-gradient-to-r from-[#F4A73C] to-[#E08A2E] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-white/20">
          Fresh Baked
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 space-y-4">
        {/* Product Name */}
        <h3 className="font-fredoka text-xl font-bold text-[#5B3C1B] leading-tight group-hover:text-[#A6651C] transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Description (Optional) */}
        {product.description && (
          <p className="font-poppins text-[#7D5630] text-sm leading-relaxed line-clamp-2 opacity-80">
            {product.description}
          </p>
        )}
        
        {/* Price Section */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="font-fredoka font-bold text-xl sm:text-2xl bg-gradient-to-r from-[#E08A2E] via-[#A6651C] to-[#F4A73C] bg-clip-text text-transparent">
              {formatINR(product.price)}
            </div>
            <div className="text-xs text-[#7D5630]/70 font-medium">
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
                group/btn relative bg-gradient-to-r from-[#A6651C] to-[#E08A2E]
                text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm
                hover:from-[#8A5618] hover:to-[#C47526] 
                transition-all duration-300 transform hover:scale-105 
                shadow-lg hover:shadow-xl active:scale-95
                focus:outline-none focus:ring-4 focus:ring-[#FFE8B0]
                min-w-[100px] sm:min-w-[120px] touch-manipulation
                whitespace-nowrap overflow-hidden
              "
              aria-label={`Add ${product.name} to cart`}
            >
              {/* Button Content */}
              <span className="flex items-center justify-center gap-1.5 sm:gap-2 w-full">
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:animate-bounce flex-shrink-0" />
                <span className="truncate">
                  <span className="hidden xs:inline">Add to Cart</span>
                  <span className="xs:hidden">Add</span>
                </span>
              </span>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#A6651C]/20 to-[#E08A2E]/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </button>
          )}
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-[#F9C56C] group-hover:via-[#FFD98A] group-hover:to-[#F6B63C] opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>
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
