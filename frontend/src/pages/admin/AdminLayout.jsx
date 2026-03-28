import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../../components/common/TopNavbar';
import Footer from '../../components/common/Footer'; 
import Loader from '../../components/common/Loader'; 
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, isActionLoading } = useContext(AuthContext);

  // 1. Jab tak Admin data sync ho raha ho, tab tak professional loader dikhao
  if (isActionLoading || !user) {
    return <Loader fullScreen={true} message="Initialising Admin Console..." />;
  }

  return (
    /* flex flex-col + min-h-screen ensure karta hai ki footer hamesha bottom par rahe */
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      
      {/* 2. Admin Specific Navbar */}
      <TopNavbar role="admin" />
      
      {/* 3. Main Action Area */}
      <main className="flex-grow w-full max-w-[1600px] mx-auto px-6 py-10 md:px-10">
        <div className="animate-in fade-in duration-700">
          <Outlet />
        </div>
      </main>

      
      
    </div>
  );
};

export default AdminLayout;