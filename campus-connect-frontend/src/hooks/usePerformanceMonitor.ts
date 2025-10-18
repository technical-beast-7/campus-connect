import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  componentName: string;
}

/**
 * Hook to monitor component performance
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startTimeRef = useRef<number>(performance.now());
  const mountTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Record mount time
    mountTimeRef.current = performance.now();
    
    // Calculate and log performance metrics
    const loadTime = mountTimeRef.current - startTimeRef.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        loadTime: `${loadTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });
    }

    // Report to analytics in production (if needed)
    if (process.env.NODE_ENV === 'production' && loadTime > 100) {
      // Only report slow components
      reportPerformanceMetric({
        loadTime,
        renderTime: loadTime,
        componentName,
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, [componentName]);

  return {
    markRenderStart: () => {
      startTimeRef.current = performance.now();
    },
    markRenderEnd: () => {
      const renderTime = performance.now() - startTimeRef.current;
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} render:`, `${renderTime.toFixed(2)}ms`);
      }
      return renderTime;
    },
  };
};

/**
 * Report performance metrics (placeholder for analytics integration)
 */
const reportPerformanceMetric = (metrics: PerformanceMetrics) => {
  // In a real application, this would send data to an analytics service
  // For now, we'll just log it
  console.log('[Performance Analytics]', metrics);
};

/**
 * Hook to monitor page load performance
 */
export const usePagePerformance = (pageName: string) => {
  useEffect(() => {
    // Use the Navigation Timing API to get page load metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          const metrics = {
            pageName,
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            firstPaint: 0,
            firstContentfulPaint: 0,
          };

          // Get paint metrics
          const paintEntries = performance.getEntriesByType('paint');
          paintEntries.forEach((paintEntry) => {
            if (paintEntry.name === 'first-paint') {
              metrics.firstPaint = paintEntry.startTime;
            } else if (paintEntry.name === 'first-contentful-paint') {
              metrics.firstContentfulPaint = paintEntry.startTime;
            }
          });

          if (process.env.NODE_ENV === 'development') {
            console.log(`[Page Performance] ${pageName}:`, metrics);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'paint'] });

    return () => {
      observer.disconnect();
    };
  }, [pageName]);
};

/**
 * Hook to monitor bundle size and loading performance
 */
export const useBundlePerformance = () => {
  useEffect(() => {
    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          // Only monitor JavaScript bundles
          if (resourceEntry.name.includes('.js') && resourceEntry.transferSize > 100000) {
            const metrics = {
              name: resourceEntry.name.split('/').pop(),
              size: resourceEntry.transferSize,
              loadTime: resourceEntry.responseEnd - resourceEntry.requestStart,
              cached: resourceEntry.transferSize === 0,
            };

            if (process.env.NODE_ENV === 'development') {
              console.log('[Bundle Performance]', metrics);
            }
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => {
      observer.disconnect();
    };
  }, []);
};