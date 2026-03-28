import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://libraflow-qzzb.onrender.com/api",
    withCredentials: true,
});

// Request Interceptor: Yeh har request mein token chipka dega
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;