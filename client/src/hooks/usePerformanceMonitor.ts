import { useEffect } from 'react';

/**
 * Hook to monitor component performance
 * This is a stub implementation for development
 */
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    // Stub implementation - can be enhanced with actual performance monitoring
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} mounted`);
    }
  }, [componentName]);
};

/**
 * Hook to monitor page performance
 * This is a stub implementation for development
 */
export const usePagePerformance = (pageName: string) => {
  useEffect(() => {
    // Stub implementation - can be enhanced with actual page performance tracking
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Page Performance] ${pageName} loaded`);
    }
  }, [pageName]);
};
