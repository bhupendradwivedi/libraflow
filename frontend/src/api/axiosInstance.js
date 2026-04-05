import axios from "axios";


export let memoryToken = null;

export const setMemoryToken = (token) => {
    memoryToken = token;
};

const axiosInstance = axios.create({
    baseURL: "http://localhost:4000/api", 
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    if (memoryToken) {
        config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;