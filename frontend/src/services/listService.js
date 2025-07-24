import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api/lists'
  : '/api/lists';
const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getLists = () => axiosInstance.get('/');
export const createList = (listData) => axiosInstance.post('/', listData);
export const deleteList = (id) => axiosInstance.delete(`/${id}`);
