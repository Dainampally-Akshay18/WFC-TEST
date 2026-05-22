export const formatResponse = (response) => {
  return {
    data: response.data?.data || response.data,
    message: response.data?.message,
    status: response.status,
    success: response.data?.success !== false,
  };
};
