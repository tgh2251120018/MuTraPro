import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080/api/v1', // [INSTRUCTION_B] Fallback to localhost for dev [INSTRUCTION_E]
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor for Token (same as previous step)
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

export default axiosInstance;