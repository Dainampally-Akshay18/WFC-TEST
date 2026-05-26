import * as yup from 'yup';

export const eventValidationSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),

  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),

  date: yup
    .string()
    .required('Date is required')
    .test('is-future-date', 'Date must be in the future', function (value) {
      if (!value) return false;
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }),

  time: yup
    .string()
    .required('Time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),

  location: yup
    .string()
    .required('Location is required')
    .min(3, 'Location must be at least 3 characters')
    .max(100, 'Location must not exceed 100 characters'),

  visibility: yup
    .string()
    .required('Visibility is required')
    .oneOf(['GLOBAL', 'BRANCH'], 'Visibility must be GLOBAL or BRANCH'),

  branch: yup
    .string()
    .nullable()
    .test('branch-required', 'Branch is required when visibility is BRANCH', function (value) {
      const { visibility } = this.parent;
      if (visibility === 'BRANCH') {
        return !!value && value.trim() !== '';
      }
      return true;
    }),
});
