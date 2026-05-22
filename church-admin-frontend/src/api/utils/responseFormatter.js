export const formatResponse = (response) => {
  // Backend returns { success: true, data: {...} }
  if (response.data && typeof response.data === 'object') {
    return response.data;
  }
  
  return {
    data: response.data,
    success: true,
  };
};
