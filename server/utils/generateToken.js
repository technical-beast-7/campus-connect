import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for user authentication
 * @param {string} id - User ID to encode in token
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export default generateToken;
