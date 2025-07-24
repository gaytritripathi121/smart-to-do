import axios from 'axios';

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/tasks"
    : "/api/tasks";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const getTasks = (params = {}) => axiosInstance.get('/', { params });
export const addTask = (taskData) => axiosInstance.post('/', taskData);
export const updateTask = (id, updatedData) => axiosInstance.put(`/${id}`, updatedData);
export const deleteTask = (id) => axiosInstance.delete(`/${id}`);
