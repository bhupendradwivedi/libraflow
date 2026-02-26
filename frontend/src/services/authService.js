// src/services/authService.js

import axiosInstance from "../api/axiosInstance";

const AUTH_BASE = "/auth";

/**
 * Centralized request handler
 * - Normalizes success response
 * - Normalizes error response
 */
const handleRequest = async (promise) => {
    try {
        const response = await promise;
        return response.data;
    } catch (error) {
        // If interceptor already normalized error
        if (error?.message) {
            throw new Error(error.message);
        }

        // Raw axios fallback
        const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Something went wrong";

        throw new Error(message);
    }
};

const authService = {
    register: (userData) =>
        handleRequest(
            axiosInstance.post(`${AUTH_BASE}/register`, userData)
        ),
verifyOtp: (email, otp) =>
  handleRequest(
    axiosInstance.post(`${AUTH_BASE}/verify-otp`, { email, otp })
  ),
  resendOtp: (email) =>
  handleRequest(
    axiosInstance.post(`${AUTH_BASE}/resend-otp`, { email })
  ),



    login: (email, password) =>
        handleRequest(
            axiosInstance.post(`${AUTH_BASE}/login`, { email, password })
        ),

   

};

export default authService;
