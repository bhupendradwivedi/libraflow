import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion'; 

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

// GLOBAL PAGE WRAPPER

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }}
    >
      {children}
    </motion.div>
  );
};

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

// --- 2. ANIMATED ROUTES COMPONENT ---
// Location track karne ke liye ise Router ke andar hona chahiye
const AnimatedRoutes = () => {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader fullScreen={true} message="Initializing Library System..." />;
  }

  return (
    /* mode="wait" ensures old page exits before new one enters */
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={
          <PageWrapper>
            {user ? (
              user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/student/dashboard" replace />
            ) : <Home />}
          </PageWrapper>
        } />

        <Route path="/login" element={
          <PageWrapper>
            {!user ? <Login /> : (
              user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/student/dashboard" replace />
            )}
          </PageWrapper>
        } />

        <Route path="/register" element={<PageWrapper>{!user ? <Register /> : <Navigate to="/student/dashboard" replace />}</PageWrapper>} />
        <Route path="/verify-otp" element={<PageWrapper>{!user ? <VerifyOTP /> : <Navigate to="/" replace />}</PageWrapper>} />

        {/* --- ADMIN ROUTES (Protected) --- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <PageWrapper>
                <AdminLayout />
              </PageWrapper>
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
              <PageWrapper>
                <StudentLayout />
              </PageWrapper>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="my-issued-books" element={<MyIssuedBooks />} />
          <Route path="issued-books" element={<IssuedBooks />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '0px',
            background: '#0F172A', // Saira Stencil theme ke liye dark slate
            color: '#fff',
            fontSize: '11px',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            border: '1px solid #14D3BC'
          },
        }}
      />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;