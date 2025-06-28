import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if needed
  withCredentials: true, // ⬅️ important for cookie support
});

export default API;
