export const notificationValidation = {
  markAsReadSchema: {
    validate: (data) => {
      // TODO: Implement validation logic using Joi/Zod
      return { error: null, value: data };
    },
  },
};

export default notificationValidation;
