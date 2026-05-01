import AuthModel from './auth.model.js';
import { generateToken } from '../../utils/generateToken.js';
import { hashPassword, comparePassword } from '../../utils/hashPassword.js';

export const authService = {
  async register(email, password) {
    // TODO: Implement business logic
    // - Validate email
    // - Hash password
    // - Save to DB
    // - Return user
  },

  async login(email, password) {
    // TODO: Implement business logic
    // - Find user
    // - Compare password
    // - Generate token
    // - Return token
  },

  async logout(userId) {
    // TODO: Implement business logic
    // - Clear refresh token
  },

  async refreshToken(refreshToken) {
    // TODO: Implement business logic
    // - Verify refresh token
    // - Generate new access token
  },
};

export default authService;
