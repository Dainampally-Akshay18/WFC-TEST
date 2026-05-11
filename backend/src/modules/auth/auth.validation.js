import Joi from 'joi';

/**
 * ============================================
 * AUTH VALIDATION SCHEMAS
 * ============================================
 * 
 * All input validation using Joi
 */

export const authValidation = {
  /**
   * Validation for SIGNUP
   */
  signupSchema: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email',
      }),

    password: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
      }),

    branch: Joi.string()
      .required()
      .messages({
        'string.empty': 'Branch is required',
      }),
  }),

  /**
   * Validation for LOGIN
   */
  loginSchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email',
      }),

    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'Password is required',
      }),
  }),

  /**
   * Validation for FORGOT PASSWORD
   */
  forgotPasswordSchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email',
      }),
  }),

  /**
   * Validation for RESET PASSWORD
   */
  resetPasswordSchema: Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'string.empty': 'Reset token is required',
      }),

    newPassword: Joi.string()
      .min(6)
      .max(100)
      .required()
      .messages({
        'string.empty': 'New password is required',
        'string.min': 'Password must be at least 6 characters',
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
      }),
  }),

  /**
   * Validation for REJECT USER
   */
  rejectUserSchema: Joi.object({
    reason: Joi.string()
      .max(500)
      .messages({
        'string.max': 'Rejection reason must be less than 500 characters',
      }),
  }),

  /**
   * Validation for UPDATE PROFILE
   */
  updateProfileSchema: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'Name must be at least 2 characters',
      }),
  }),
};

export default authValidation;
