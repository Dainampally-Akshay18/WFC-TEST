/**
 * ============================================
 * VALIDATION MIDDLEWARE
 * ============================================
 * 
 * Validates request body against Joi schema
 */

export const validateRequest = (schema) => {
  return (req, res, next) => {
    // Validate request body
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errorDetails,
        },
      });
    }

    // Attach validated data to request
    req.validatedData = value;
    req.body = value; // Replace body with validated data

    next();
  };
};

export default validateRequest;
