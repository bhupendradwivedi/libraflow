import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { toast } from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial Page Load Loader
  const [isActionLoading, setIsActionLoading] = useState(false); // Button Spinner Loader

  // --- 1. SESSION VERIFICATION ---
  useEffect(() => {
    const verifyUser = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        setUser(null);
        setLoading(false);
        return; 
      }

      try {
        const data = await authService.getUser();
        if (data?.success) {
          setUser(data.user);
        } else {
          handleLocalCleanup();
        }
      } catch (error) {
        handleLocalCleanup();
        console.error("Session verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const handleLocalCleanup = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    setUser(null);
  };

  // --- 2. REGISTER LOGIC ---
  const register = async (userData) => {
    setIsActionLoading(true);
    try {
      const data = await authService.register(userData);
      if (data?.success) {
        toast.success("Registration successful! Please verify OTP.");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- 3. VERIFY OTP ---
  const verifyOtp = async (email, otp) => {
    setIsActionLoading(true);
    try {
      const data = await authService.verifyOtp(email, otp);
      if (data?.success) {
        toast.success("Account verified successfully!");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- 4. RESEND OTP ---
  const resendOtp = async (email) => {
    setIsActionLoading(true);
    try {
      const data = await authService.resendOtp(email);
      if (data?.success) {
        toast.success("New OTP sent successfully!");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- 5. LOGIN LOGIC (Cleaned Up) ---
  const login = async (email, password) => {
    setIsActionLoading(true);
    try {
      const data = await authService.login(email, password);
      
      if (data?.success) {
        localStorage.setItem("token", data.token); 
        localStorage.setItem("isLoggedIn", "true");
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return data; // Success return
      } else {
        // Agar backend error message bhej raha hai par success true nahi hai
        toast.error(data?.message || "Invalid Email or Password");
        return data;
      }
    } catch (error) {
      // Axios errors usually come here
      const errorMsg = error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- 6. LOGOUT LOGIC ---
  const logout = async () => {
    setIsActionLoading(true); 
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API failed, cleaning up locally");
    } finally {
      handleLocalCleanup();
      toast.success("Logged out successfully");
      setIsActionLoading(false);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isActionLoading, 
        login,
        logout,
        register,
        verifyOtp,
        resendOtp,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};