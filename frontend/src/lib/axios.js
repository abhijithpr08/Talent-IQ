import axios from "axios"

console.log("axios: Creating axios instance with baseURL:", import.meta.env.VITE_API_URL);
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("axios: Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.log("axios: Request error:", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("axios: Response:", response.status, response.config.method?.toUpperCase(), response.config.url);
    return response;
  },
  (error) => {
    console.log("axios: Response error:", error.response?.status, error.config?.method?.toUpperCase(), error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;