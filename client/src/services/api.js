import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend API URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/signup', formData);

export const getUserProfile = () => API.get('/user/profile');
export const updateUserProfile = (profileData) => API.put('/user/profile', profileData);

export const getTasks = () => API.get('/tasks');
export const createTask = (taskData) => API.post('/tasks', taskData);
export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);