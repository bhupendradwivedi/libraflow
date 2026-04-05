import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import { setMemoryToken } from "../api/axiosInstance";
import { toast } from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // --- Pehle Cleanup Function Define Karein (ReferenceError Fix) ---
  const handleLocalCleanup = useCallback(() => {
    setMemoryToken(null);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
  }, []);

  const verifyUser = useCallback(async () => {
    
    if (localStorage.getItem("isLoggedIn") !== "true") {
        setLoading(false);
        return;
    }

    try {
        const data = await authService.refresh();
        
        if (data?.success) {
          
            setMemoryToken(data.accessToken);
            setUser(data.user);
        } else {
            handleLocalCleanup();
        }
    } catch (error) {
      
        handleLocalCleanup();
    } finally {
      
        setLoading(false);
    }
}, [handleLocalCleanup]);
  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

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

  // --- 3. VERIFY OTP (Updated Logic) ---
  const verifyOtp = async (email, otp) => {
    setIsActionLoading(true);
    try {
      const data = await authService.verifyOtp(email, otp);
      if (data?.success) {
        // IMPORTANT: Verify hote hi login wala logic hona chahiye
        if (data.accessToken) {
          setMemoryToken(data.accessToken);
          setUser(data.user);
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

  // --- 5. LOGIN LOGIC ---
const login = async (email, password) => {
  setIsActionLoading(true);
  try {
    const data = await authService.login(email, password);
    if (data?.success) {
      setMemoryToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem("isLoggedIn", "true"); 

      toast.success(`Welcome back, ${data.user.name}!`);
      return data;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
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
      console.error("Logout error:", error);
    } finally {
      setMemoryToken(null);
      setUser(null);
      toast.success("Logged out successfully");
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
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};