import * as yup from 'yup';

export const emailSchema = yup.string().email('Invalid email').required('Email is required');

export const phoneSchema = yup.string().matches(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number');

export const urlSchema = yup.string().url('Invalid URL');

export const requiredString = (fieldName) => 
  yup.string().required(`${fieldName} is required`);

export const optionalString = yup.string().nullable();

export const requiredNumber = (fieldName) => 
  yup.number().required(`${fieldName} is required`);

export const optionalNumber = yup.number().nullable();

export const requiredDate = (fieldName) => 
  yup.date().required(`${fieldName} is required`);

export const optionalDate = yup.date().nullable();
