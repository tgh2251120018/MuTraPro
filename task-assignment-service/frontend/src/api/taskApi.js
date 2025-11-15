import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;