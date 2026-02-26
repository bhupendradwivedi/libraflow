import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext'; // Context import karein

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';

// Student Dashboard Page
import StudentDashboard from './pages/studends/StudentDashboard';

// Protected Route Wrapper: Login check karne ke liye
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  // Jab tak backend se user data aa raha ho, loading spinner dikhayein
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F4F7FE]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D5FEF]"></div>
      </div>
    );
  }
  
  // Agar user logged in nahi hai, toh login page par bhej do
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />

        {/*  Protected Dashboard Route: Login ke baad hi dikhega */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard /> 
            </ProtectedRoute>
          } 
        />

        {/* Home/Default Redirect Logic */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 Handling */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;