import { useCallback } from 'react';

interface ErrorInfo {
  componentStack?: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

interface UseErrorHandlerReturn {
  handleError: (error: Error, errorInfo?: ErrorInfo) => void;
  logError: (error: Error, context?: Record<string, any>) => void;
  reportError: (error: Error, context?: Record<string, any>) => Promise<void>;
}

const useErrorHandler = (): UseErrorHandlerReturn => {
  const logError = useCallback((error: Error, context?: Record<string, any>) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context: context || {}
    };

    console.error('Error logged:', errorData);
    
    // Store error in localStorage for debugging (in development)
    if (import.meta.env.DEV) {
      const existingErrors = JSON.parse(localStorage.getItem('campus-connect-errors') || '[]');
      existingErrors.push(errorData);
      
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.shift();
      }
      
      localStorage.setItem('campus-connect-errors', JSON.stringify(existingErrors));
    }
  }, []);

  const reportError = useCallback(async (error: Error, context?: Record<string, any>) => {
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        context: context || {}
      };

      // In a real application, you would send this to an error reporting service
      // Example implementations:
      
      // Sentry
      // Sentry.captureException(error, { extra: context });
      
      // LogRocket
      // LogRocket.captureException(error);
      
      // Custom API endpoint
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });

      console.log('Error reported:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }, []);

  const handleError = useCallback((error: Error, errorInfo?: ErrorInfo) => {
    // Log the error locally
    logError(error, errorInfo);
    
    // Report the error to external service
    reportError(error, errorInfo);
  }, [logError, reportError]);

  return {
    handleError,
    logError,
    reportError
  };
};

export default useErrorHandler;
