/**
 * Centralized error handling middleware
 * Handles all errors passed to next(error) in the application
 * Formats error responses consistently across all endpoints
 */
export const errorHandler = (err, req, res, next) => {
  // Default to 500 if status code is not set or is 200
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  // Set status code
  res.status(statusCode);
  
  // Build error response
  const errorResponse = {
    message: err.message || 'Internal Server Error',
    // Include stack trace only in development environment
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }
  
  // Send error response
  res.json(errorResponse);
};

/**
 * Not Found middleware - Handles 404 errors for undefined routes
 * Should be placed before errorHandler in middleware chain
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
