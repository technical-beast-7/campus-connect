import React from 'react';
import type { ComponentType, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';

interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  isolate?: boolean; // If true, errors won't bubble up to parent error boundaries
}

function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  const WrappedComponent = (props: P) => {
    const { fallback, onError, isolate } = options;

    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
      if (onError) {
        onError(error, errorInfo);
      }
      
      if (!isolate) {
        // Re-throw the error to let it bubble up to parent error boundaries
        // This is useful for global error handling
        throw error;
      }
    };

    return (
      <ErrorBoundary
        fallback={fallback}
        onError={handleError}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Preserve component name for debugging
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Convenience function for creating error boundaries with custom fallbacks
export const createErrorBoundary = (options: WithErrorBoundaryOptions = {}) => {
  return function <P extends object>(Component: ComponentType<P>) {
    return withErrorBoundary(Component, options);
  };
};

// Pre-configured error boundary for pages
export const withPageErrorBoundary = <P extends object>(Component: ComponentType<P>) => {
  return withErrorBoundary(Component, {
    fallback: <ErrorFallback 
      error={new Error('Page failed to load')} 
      resetError={() => window.location.reload()} 
    />,
    isolate: true
  });
};

// Pre-configured error boundary for components
export const withComponentErrorBoundary = <P extends object>(Component: ComponentType<P>) => {
  return withErrorBoundary(Component, {
    fallback: (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Component Error
            </h3>
            <p className="mt-1 text-sm text-red-700">
              This component failed to load. Please try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    ),
    isolate: false
  });
};

export default withErrorBoundary;