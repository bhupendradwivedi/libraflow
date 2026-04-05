import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import { setMemoryToken } from "../api/axiosInstance";
import { toast } from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Always start as true
  const [isActionLoading, setIsActionLoading] = useState(false);

  // --- 1. CLEANUP UTILITY ---
  // Clears everything on logout or failed verification
  const handleLocalCleanup = useCallback(() => {
    setMemoryToken(null);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
  }, []);

  // 2. THE PERSISTENCE ENGINE 
  const verifyUser = useCallback(async () => {
    
    const wasLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (!wasLoggedIn) {
      setLoading(false);
      return;
    }

    try {
      // Step B: Ask backend for a fresh Access Token using the Refresh Cookie
      const data = await authService.refresh();
      
      if (data?.success) {
        setMemoryToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem("isLoggedIn", "true");
      } else {
        handleLocalCleanup();
      }
    } catch (error) {
      console.error("Session restoration failed:", error);
      handleLocalCleanup();
    } finally {
      // Step C: ONLY set loading to false after the network request finishes
      setLoading(false);
    }
  }, [handleLocalCleanup]);

  // Run verification once when the app starts
  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  // --- 3. LOGIN LOGIC ---
  const login = async (email, password) => {
    setIsActionLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data?.success) {
        setMemoryToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem("isLoggedIn", "true"); // PERSISTENCE FLAG
        toast.success(`Welcome back, ${data.user.name}!`);
        return data;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      toast.error(errorMsg);
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- 4. REGISTER LOGIC ---
  const register = async (userData) => {
    setIsActionLoading(true);
    try {
      const data = await authService.register(userData);
      if (data?.success) {
        toast.success("Registration successful! Verify your OTP.");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- 5. OTP VERIFICATION (With Persistence) ---
  const verifyOtp = async (email, otp) => {
    setIsActionLoading(true);
    try {
      const data = await authService.verifyOtp(email, otp);
      if (data?.success) {
        if (data.accessToken) {
          setMemoryToken(data.accessToken);
          setUser(data.user);
          localStorage.setItem("isLoggedIn", "true"); // SET FLAG HERE TOO
        }
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

  // --- 6. LOGOUT LOGIC ---
  const logout = async () => {
    setIsActionLoading(true);
    try {
      await authService.logout(); // Notify backend to clear cookies
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      handleLocalCleanup(); // Clear frontend state
      toast.success("Logged out successfully");
      setIsActionLoading(false);
    }
  };

  // --- 7. RESEND OTP ---
  const resendOtp = async (email) => {
    setIsActionLoading(true);
    try {
      const data = await authService.resendOtp(email);
      if (data?.success) toast.success("New OTP sent!");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      throw error;
    } finally {
      setIsActionLoading(false);
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
        verifyUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};