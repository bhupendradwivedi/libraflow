// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { toast } from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify session on app load
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const data = await authService.getProfile();
        if (data?.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // 🔹 Register
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data?.success) {
        toast.success("Registration successful! Verify OTP.");
      }
      return data;
    } catch (error) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };
  // 🔹 Verify OTP
const verifyOtp = async (email, otp) => {
  try {
    const data = await authService.verifyOtp(email, otp);

    if (data?.success) {
      toast.success("Account verified successfully!");
    }

    return data;
  } catch (error) {
    toast.error(error.message || "OTP verification failed");
    throw error;
  }
};
// 🔹 Resend OTP
const resendOtp = async (email) => {
  try {
    const data = await authService.resendOtp(email);

    if (data?.success) {
      toast.success("New OTP sent successfully!");
    }

    return data;
  } catch (error) {
    toast.error(error.message || "Failed to resend OTP");
    throw error;
  }
};


  // 🔹 Login
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (data?.success) {
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
      }
      return data;
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        verifyOtp,
        resendOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
