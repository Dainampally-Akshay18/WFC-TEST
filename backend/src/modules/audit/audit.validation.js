export const auditValidation = {
  filterSchema: {
    validate: (data) => {
      // TODO: Implement validation logic using Joi/Zod
      return { error: null, value: data };
    },
  },
};

export default auditValidation;
