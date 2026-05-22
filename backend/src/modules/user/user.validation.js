import Joi from 'joi';

export const userValidation = {
  updateUserSchema: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 100 characters',
      }),

    branch: Joi.string()
      .trim()
      .optional()
      .allow(null, ''),

    role: Joi.string()
      .valid('MASTER_ADMIN', 'LEADER', 'USER')
      .optional()
      .messages({
        'any.only': 'Role must be one of: MASTER_ADMIN, LEADER, USER',
      }),

    status: Joi.string()
      .valid('PENDING', 'APPROVED', 'REJECTED')
      .optional()
      .messages({
        'any.only': 'Status must be one of: PENDING, APPROVED, REJECTED',
      }),
  }).min(1),

  getUsersQuerySchema: Joi.object({
    role: Joi.string()
      .valid('MASTER_ADMIN', 'LEADER', 'USER')
      .optional(),

    status: Joi.string()
      .valid('PENDING', 'APPROVED', 'REJECTED')
      .optional(),

    branch: Joi.string()
      .trim()
      .optional(),

    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .optional(),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .optional(),
  }),

  userIdParamSchema: Joi.object({
    userId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid user ID format',
      }),
  }),
};

export default userValidation;
