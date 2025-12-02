import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || '/api';

const http = axios.create({
    baseURL,
    withCredentials: true,
});

// ✅ ADD THIS - Send token from localStorage as fallback for in-app browsers
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem("authToken");

    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`;

    }
    return config;
}, (error) => {
    return Promise.reject(error);
})


export default http;