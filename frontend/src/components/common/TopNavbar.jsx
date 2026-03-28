import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  Library, LogOut, Menu, X, 
  LayoutDashboard, BookOpen, Clock,
  ChevronDown, Mail, Hash, Bell
} from 'lucide-react';

const TopNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const userRole = user?.role || 'user';

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Professional Navigation Links
  const links = userRole === 'admin' ? [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={14} /> },
    { name: 'Book Inventory', path: '/admin/manageBooks', icon: <BookOpen size={14} /> },
    { name: 'Issue Requests', path: '/admin/request-manager', icon: <Bell size={14} /> },
    { name: 'Users List', path: '/admin/students-list', icon: <Hash size={14} /> },
    { name: 'Return-Requests', path: '/admin/return-request', icon: <Bell size={14} /> },
  ] : [
    { name: 'Catalog', path: '/student/dashboard', icon: <BookOpen size={14} /> },
    { name: 'My Requests', path: '/student/my-issued-books', icon: <Bell size={14} /> }, // ✅ Wapas add kar diya
    { name: 'Active Shelf', path: '/student/issued-books', icon: <Clock size={14} /> },
  ];

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-[100] px-4 md:px-10 h-16 flex items-center justify-between">
      
      {/* --- LEFT: SVPC BRANDING --- */}
      <div className="flex items-center gap-8 h-full">
        <div 
          className="flex items-center gap-3 cursor-pointer border-r border-slate-100 pr-8 h-10" 
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 bg-[#14D3BC] flex items-center justify-center text-white">
            <Library size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">SVPC</span>
            <span className="text-[8px] font-black text-[#14D3BC] uppercase tracking-[0.4em]">Library</span>
          </div>
        </div>

        {/* --- CENTER: NAVIGATION --- */}
        <div className="hidden md:flex items-center h-full">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                h-16 px-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2
                ${isActive 
                  ? 'border-[#14D3BC] text-slate-900 bg-teal-50/20' 
                  : 'border-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-50'}
              `}
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* --- RIGHT: PROFILE & LOGOUT --- */}
      <div className="flex items-center gap-4 h-full" ref={dropdownRef}>
        
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`h-16 px-4 flex items-center gap-3 border-l border-slate-100 transition-all
            ${isProfileOpen ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
        >
          <div className="hidden md:flex flex-col items-end leading-none">
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
              {user?.name?.split(' ')[0] || "Student"}
            </span>
            <span className="text-[8px] font-bold text-[#14D3BC] uppercase tracking-widest mt-1">
               {userRole === 'admin' ? 'SVPC Admin' : 'ID Verified'}
            </span>
          </div>
          <div className="w-9 h-9 bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
             {user?.name?.charAt(0) || "U"}
          </div>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* --- PROFILE DROPDOWN --- */}
        {isProfileOpen && (
          <div className="absolute top-[64px] right-0 w-80 bg-white border-2 border-slate-100 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-6 bg-[#0F172A] text-white flex items-center gap-4">
                <div className="w-12 h-12 bg-[#14D3BC] flex items-center justify-center text-white text-xl font-black">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight">{user?.name}</h4>
                  <span className="text-[9px] font-bold text-teal-400 uppercase tracking-[0.2em]">{userRole} Portal</span>
                </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <div className="flex items-center gap-3 text-slate-700">
                  <Mail size={14} className="text-[#14D3BC]" />
                  <span className="text-[11px] font-bold lowercase">{user?.email}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">University Roll No</label>
                <div className="flex items-center gap-3 text-slate-700">
                  <Hash size={14} className="text-[#14D3BC]" />
                  <span className="text-[11px] font-bold uppercase">{user?.rollNumber || "NOT_ASSIGNED"}</span>
                </div>
              </div>
            </div>

            <div className="p-2 border-t border-slate-50">
              <button 
                onClick={logout}
                className="w-full py-4 flex items-center justify-center gap-3 text-red-500 hover:bg-red-50 transition-colors font-black text-[10px] uppercase tracking-[0.3em]"
              >
                <LogOut size={14} /> Secure Logout
              </button>
            </div>
          </div>
        )}

        {/* MOBILE MENU TOGGLE */}
        <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b-4 border-[#14D3BC] flex flex-col p-4 md:hidden shadow-2xl animate-in slide-in-from-top-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-4 border-b border-slate-50 text-[11px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-3"
            >
              {link.icon} {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;