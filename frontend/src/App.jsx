import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext'

// --- COMPONENTS ---
import Loader from './components/common/Loader'; 

// --- PAGES ---
import Home from './components/common/Home';
import StudentLayout from './components/common/StudendLayout'; 
import DashboardHome from './pages/studends/DashboardHome';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import MyIssuedBooks from './pages/studends/MyIssuedBooks';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard'; 
import ManageRequests from './pages/admin/ManageBooks'; 
import AddBook from './pages/admin/AddBook'; 
import RequestManager from './pages/admin/RequestManager';
import StudentList from './pages/admin/StudentList';
import IssuedBooks from './pages/studends/IssuedBook';
import EditBook from './pages/admin/EditBook';
import ReturnRequests from './pages/admin/ReturnManager';


// --- PROTECTED ROUTE WRAPPER ---
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

 
  if (loading) {
    return <Loader fullScreen={true} message="Authenticating Secure Session..." />;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '0px',
            background: '#1E293B',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            border: '1px solid #14D3BC'
          },
        }} 
      />

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={
          user ? (
            user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/student/dashboard" replace />
          ) : <Home/>
        } />

        {/* Auth Routes */}
        <Route path="/login" element={
          !user ? <Login /> : (
            user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/student/dashboard" replace />
          )
        } />

        <Route path="/register" element={!user ? <Register /> : <Navigate to="/student/dashboard" replace />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* --- ADMIN ROUTES (Protected) --- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manageBooks" element={<ManageRequests />} />
          <Route path="request-manager" element={<RequestManager />} />
          <Route path="add-book" element={<AddBook />} />
          <Route path="students-list" element={<StudentList />} />
          <Route path="edit-book/:id" element={<EditBook />} />
            <Route path="return-request" element={<ReturnRequests />} />

          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* --- STUDENT ROUTES (Protected) --- */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="my-issued-books" element={<MyIssuedBooks />} />
          <Route path="issued-books" element={<IssuedBooks />} />

          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* --- GLOBAL REDIRECT --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;