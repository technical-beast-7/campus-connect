/**
 * Image optimization utilities for better performance
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Compress and resize an image file
 */
export const compressImage = (
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1200,
      maxHeight = 800,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create a lazy loading image component with optimization
 */
export const createOptimizedImageSrc = (
  src: string,
  width?: number,
  height?: number
): string => {
  // In a real application, this would integrate with a CDN or image service
  // For now, we'll return the original src with potential query parameters
  const url = new URL(src, window.location.origin);
  
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  
  return url.toString();
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)',
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB',
    };
  }

  return { isValid: true };
};

/**
 * Generate responsive image srcSet for different screen sizes
 */
export const generateResponsiveSrcSet = (baseSrc: string): string => {
  const sizes = [320, 640, 768, 1024, 1280];
  
  return sizes
    .map(size => `${createOptimizedImageSrc(baseSrc, size)} ${size}w`)
    .join(', ');
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Lazy load images with Intersection Observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options: IntersectionObserverInit = {}) {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          this.observer.unobserve(img);
          this.images.delete(img);
        }
      }
    });
  }

  observe(img: HTMLImageElement) {
    this.images.add(img);
    this.observer.observe(img);
  }

  unobserve(img: HTMLImageElement) {
    this.images.delete(img);
    this.observer.unobserve(img);
  }

  disconnect() {
    this.observer.disconnect();
    this.images.clear();
  }
}