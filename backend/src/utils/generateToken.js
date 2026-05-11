import jwt from 'jsonwebtoken';

/**
 * ============================================
 * JWT TOKEN GENERATION
 * ============================================
 */

/**
 * Generate JWT token
 * @param {Object} payload - Token payload (userId, role, branch)
 * @param {String} expiresIn - Token expiry time (default: 7d)
 * @returns {String} JWT token
 */
export const generateToken = (payload, expiresIn = '7d') => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  try {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

export default generateToken;
