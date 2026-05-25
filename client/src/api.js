import axios from 'axios';

const apiRoot = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
const baseURL = apiRoot ? `${apiRoot}/api` : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
