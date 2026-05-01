import jwt from 'jsonwebtoken';

export const generateToken = (payload, expiresIn = '24h') => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  
  try {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

export default generateToken;
