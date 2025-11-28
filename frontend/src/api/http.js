import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || '/api';

const http = axios.create({
    baseURL,
    withCredentials: true,
});

export default http;