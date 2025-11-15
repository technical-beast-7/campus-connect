import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  text, 
  fullScreen = false, 
  className = '' 
}) => {
  const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  const getTextSize = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const spinnerSize = getSizeStyles(size);
  const textSize = getTextSize(size);

  const LoaderContent = () => (
    <div className={`flex flex-col items-center justify-center animate-fade-in ${className}`}>
      {/* Campus Connect branded spinner */}
      <div className="relative">
        <div
          className={`${spinnerSize} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}
          role="status"
          aria-label="Loading"
        />
        {/* Outer ring for enhanced visual */}
        <div
          className={`absolute inset-0 ${spinnerSize} border-4 border-transparent border-b-primary-300 rounded-full animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '2s' }}
        />
        {/* Inner dot for branding */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
          } bg-primary-600 rounded-full animate-pulse-gentle`}
        />
      </div>
      
      {text && (
        <p className={`mt-4 text-gray-600 font-medium ${textSize} animate-pulse-gentle`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <LoaderContent />
      </div>
    );
  }

  return <LoaderContent />;
};

export default Loader;
