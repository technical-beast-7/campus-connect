import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  componentStack?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  componentStack 
}) => {
  const handleReportError = () => {
    // In a real app, this would send the error to a reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Error report:', errorReport);
    
    // Example: Send to error reporting service
    // errorReportingService.report(errorReport);
    
    alert('Error report has been logged. Thank you for helping us improve!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 text-red-500">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We encountered an unexpected error. Our team has been notified.
          </p>
          
          {import.meta.env.DEV && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Error Details (Development Only)
              </summary>
              <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-medium text-red-800 mb-2">
                  {error.message}
                </p>
                {error.stack && (
                  <pre className="text-xs text-red-700 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                )}
                {componentStack && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-red-800">Component Stack:</p>
                    <pre className="text-xs text-red-700 overflow-auto max-h-32">
                      {componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={resetError}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Reload Page
          </button>
          
          <button
            onClick={handleReportError}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Report This Error
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;