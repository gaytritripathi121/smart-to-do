import api from './api';

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

export const logout = () => {
  localStorage.removeItem('token');
};
