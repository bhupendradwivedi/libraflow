import React, { useContext } from 'react';
import { Outlet } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import Footer from "./Footer"; 
import { AuthContext } from "../../context/AuthContext";
import Loader from "../common/Loader";

const StudentLayout = () => {
  const { user, isActionLoading } = useContext(AuthContext);

  if (isActionLoading || !user) {
    return <Loader fullScreen={true} message="Syncing SVPC Library Profile..." />;
  }

  return (
    // 'flex flex-col' aur 'min-h-screen' zaroori hai 
    // taaki content kam hone par bhi footer niche hi rahe.
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {/* 2. Top Navigation Bar */}
      <TopNavbar />
      
      {/* 3. Main Content Area ('flex-grow' footer ko niche dhakelta hai) */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="animate-in fade-in duration-700">
          <Outlet /> 
        </div>
      </main>

      {/* 4. Footer yahan attach karein */}
      <Footer />
      
    </div>
  );
};

export default StudentLayout;