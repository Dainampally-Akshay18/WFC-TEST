// Placeholder for toast notifications
// Will be implemented with a toast library like react-hot-toast or sonner

export const toast = {
  success: (message) => {
    console.log('✅ Success:', message);
  },
  
  error: (message) => {
    console.error('❌ Error:', message);
  },
  
  warning: (message) => {
    console.warn('⚠️ Warning:', message);
  },
  
  info: (message) => {
    console.info('ℹ️ Info:', message);
  },
  
  loading: (message) => {
    console.log('⏳ Loading:', message);
  },
};
