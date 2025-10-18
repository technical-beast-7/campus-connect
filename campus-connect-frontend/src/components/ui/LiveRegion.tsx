import React, { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number; // Clear message after X milliseconds
}

const LiveRegion: React.FC<LiveRegionProps> = ({ 
  message, 
  priority = 'polite', 
  clearAfter = 5000 
}) => {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && regionRef.current) {
      regionRef.current.textContent = message;
      
      if (clearAfter > 0) {
        const timer = setTimeout(() => {
          if (regionRef.current) {
            regionRef.current.textContent = '';
          }
        }, clearAfter);
        
        return () => clearTimeout(timer);
      }
    }
  }, [message, clearAfter]);

  return (
    <div
      ref={regionRef}
      aria-live={priority}
      aria-atomic="true"
      className="live-region"
    />
  );
};

export default LiveRegion;