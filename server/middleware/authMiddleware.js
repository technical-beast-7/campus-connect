import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect middleware - Verifies JWT token and attaches user to request
 * Extracts token from Authorization header (Bearer token)
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Extract token from Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request object (excluding password)
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token expired' });
    }
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * Authorize middleware - Role-based access control
 * Restricts access to specific user roles
 * @param {...string} roles - Allowed roles (e.g., 'student', 'faculty', 'authority')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this resource` 
      });
    }
    
    next();
  };
};
