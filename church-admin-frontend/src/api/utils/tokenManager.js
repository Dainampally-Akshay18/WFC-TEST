const TOKEN_KEY = 'church_admin_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
};
