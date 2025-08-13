import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate srcSet for WebP and original format
  const generateSrcSet = (url: string, format: 'webp' | 'original') => {
    if (!url) return '';
    
    // If using a CDN with image transformation (e.g., Cloudinary, Imgix, etc.)
    if (url.includes('res.cloudinary.com') || url.includes('imgix.net')) {
      const sizes = [300, 600, 900, 1200];
      return sizes
        .map(size => {
          const separator = url.includes('?') ? '&' : '?';
          const formatParam = format === 'webp' ? 'f_webp' : 'f_auto';
          return `${url}${separator}${formatParam},w_${size} ${size}w`;
        })
        .join(', ');
    }
    
    // For local images, we'll assume they're in the public folder
    // and named with size suffixes (e.g., image-300.jpg, image-600.jpg)
    const baseUrl = url.replace(/\.[^/.]+$/, ''); // Remove extension
    const sizes = [300, 600, 900, 1200];
    return sizes
      .map(size => {
        const ext = format === 'webp' ? '.webp' : url.substring(url.lastIndexOf('.'));
        return `${baseUrl}-${size}${ext} ${size}w`;
      })
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  // Fallback to original image if there's an error with WebP
  if (hasError) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={onError}
      />
    );
  }

  return (
    <picture>
      {/* WebP format with srcSet */}
      <source
        type="image/webp"
        srcSet={generateSrcSet(src, 'webp')}
        sizes={sizes}
      />
      
      {/* Original format with srcSet as fallback */}
      <source
        srcSet={generateSrcSet(src, 'original')}
        sizes={sizes}
      />
      
      {/* Fallback img element */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
    </picture>
  );
};

export default OptimizedImage;
