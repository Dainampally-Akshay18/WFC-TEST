export const authValidation = {
  registerSchema: {
    validate: (data) => {
      // TODO: Implement validation logic using Joi/Zod
      return { error: null, value: data };
    },
  },

  loginSchema: {
    validate: (data) => {
      // TODO: Implement validation logic
      return { error: null, value: data };
    },
  },
};

export default authValidation;
