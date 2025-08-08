import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'button';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  variant = 'card' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'h-64 rounded-3xl';
      case 'text':
        return 'h-4 rounded-full';
      case 'circle':
        return 'rounded-full aspect-square';
      case 'button':
        return 'h-12 rounded-full';
      default:
        return 'h-64 rounded-3xl';
    }
  };

  return (
    <motion.div
      className={`bg-gradient-to-r from-pink-100 via-purple-100 to-orange-100 bg-[length:200%_100%] animate-pulse ${getVariantClasses()} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: 'linear-gradient(90deg, #fce7f3 25%, #f3e8ff 50%, #fed7aa 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite linear, pulse 2s infinite'
      }}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
      <div className="space-y-4">
        {/* Image skeleton */}
        <LoadingSkeleton variant="card" className="h-48" />
        
        {/* Title skeleton */}
        <LoadingSkeleton variant="text" className="w-3/4" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <LoadingSkeleton variant="text" className="w-full" />
          <LoadingSkeleton variant="text" className="w-2/3" />
        </div>
        
        {/* Price and button skeleton */}
        <div className="flex items-center justify-between pt-4">
          <LoadingSkeleton variant="text" className="w-24 h-8" />
          <LoadingSkeleton variant="button" className="w-24" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;

// Add shimmer keyframe to global CSS
const shimmerStyle = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;
