// src/api/axiosInstance.js

import axios from "axios";

const axiosInstance = axios.create({
    baseURL: " https://libraflow-g3k0.onrender.com/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 sec timeout safety
});

// 🔐 Response Interceptor (Global Error Handling)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            // Auto logout if token expired
            if (status === 401) {
                console.warn("Unauthorized. Redirecting to login...");
                window.location.href = "/login";
            }

            return Promise.reject(error.response.data);
        }

        return Promise.reject({
            message: "Network error. Please try again.",
        });
    }
);

export default axiosInstance;
