import React, { useState, useRef, useEffect } from 'react';
import { generateResponsiveSrcSet, createOptimizedImageSrc } from '../../utils/imageOptimization';
import SkeletonLoader from './SkeletonLoader';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  showSkeleton?: boolean;
  fallbackSrc?: string;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  lazy = true,
  showSkeleton = true,
  fallbackSrc,
  className = '',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, isInView]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const optimizedSrc = createOptimizedImageSrc(src, width, height);
  const srcSet = generateResponsiveSrcSet(src);

  // Show skeleton while loading
  if (isLoading && showSkeleton && isInView) {
    return (
      <div className={className} style={{ width, height }}>
        <SkeletonLoader
          variant="rectangular"
          width={width || '100%'}
          height={height || '200px'}
        />
      </div>
    );
  }

  // Show fallback or error state
  if (hasError) {
    if (fallbackSrc) {
      return (
        <img
          ref={imgRef}
          src={fallbackSrc}
          alt={alt}
          className={className}
          onLoad={handleLoad}
          onError={() => setHasError(true)}
          {...props}
        />
      );
    }

    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={{ width: width || '100%', height: height || '200px' }}
      >
        <div className="text-center">
          <svg
            className="w-8 h-8 mx-auto mb-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>Image not available</p>
        </div>
      </div>
    );
  }

  // Don't render image until it's in view (for lazy loading)
  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={className}
        style={{ width: width || '100%', height: height || '200px' }}
      >
        {showSkeleton && (
          <SkeletonLoader
            variant="rectangular"
            width={width || '100%'}
            height={height || '200px'}
          />
        )}
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={optimizedSrc}
      srcSet={srcSet}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading={lazy ? 'lazy' : 'eager'}
      {...props}
    />
  );
};

export default OptimizedImage;