import * as yup from 'yup';
import { FILE_UPLOAD } from '../constants/appConstants';

export const imageUploadSchema = yup.object({
  file: yup
    .mixed()
    .required('Image is required')
    .test('fileSize', 'File size is too large', (value) => {
      return value && value.size <= FILE_UPLOAD.MAX_SIZE;
    })
    .test('fileType', 'Invalid file type', (value) => {
      return value && FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(value.type);
    }),
});

export const videoUploadSchema = yup.object({
  file: yup
    .mixed()
    .required('Video is required')
    .test('fileSize', 'File size is too large', (value) => {
      return value && value.size <= FILE_UPLOAD.MAX_SIZE;
    })
    .test('fileType', 'Invalid file type', (value) => {
      return value && FILE_UPLOAD.ALLOWED_VIDEO_TYPES.includes(value.type);
    }),
});

export const documentUploadSchema = yup.object({
  file: yup
    .mixed()
    .required('Document is required')
    .test('fileSize', 'File size is too large', (value) => {
      return value && value.size <= FILE_UPLOAD.MAX_SIZE;
    })
    .test('fileType', 'Invalid file type', (value) => {
      return value && FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES.includes(value.type);
    }),
});
