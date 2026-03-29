import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService.js';
import { 
  Users, Clock, AlertCircle, Plus, 
  UserPlus, TrendingUp, LayoutDashboard, 
  ChevronRight, Bell, Receipt
} from 'lucide-react';
import Loader from '../../components/common/Loader.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeUsers: 0,
    pendingVerifications: 0,
    totalFine: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await userService.getDashboardStats();
        if (res.success) setStats(res.stats);
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader fullScreen={true} message="Syncing Dashboard..." />;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      
      {/* 1. TOP HEADER - Fixed for scrolling */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <LayoutDashboard size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Admin<span className="text-teal-600">Core</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
          </button>
          {/* User Profile Avatar - Desktop/Mobile Consistency */}
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
             <img src="https://ui-avatars.com/api/?name=Admin&background=0D9488&color=fff" alt="admin" />
          </div>
        </div>
      </header>

      {/* 2. SCROLLABLE CONTENT */}
      <main className="flex-1 p-5 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* WELCOME SECTION */}
        <section className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h2>
            <p className="text-slate-500 text-sm">Real-time library analytics and management.</p>
          </div>
        </section>

        {/* STATS GRID */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "Students", val: stats.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active", val: stats.activeUsers, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending", val: stats.pendingVerifications, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Revenue", val: `₹${stats.totalFine}`, icon: Receipt, color: "text-violet-600", bg: "bg-violet-50" },
          ].map((stat, i) => (
            <div key={i} className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-start transition-all hover:shadow-md hover:border-teal-100`}>
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-2xl mb-4`}>
                <stat.icon size={20} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-2xl font-black text-slate-900 mt-1`}>{stat.val}</p>
            </div>
          ))}
        </section>

        {/* PRIMARY ACTION: REQUEST MANAGER */}
        <section>
          <button 
            onClick={() => navigate('/admin/request-manager')}
            className="w-full bg-slate-900 rounded-[2rem] p-6 text-white flex justify-between items-center active:scale-[0.99] transition-all shadow-xl shadow-slate-200 hover:bg-slate-800 group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:rotate-6 transition-transform">
                <Clock size={28} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold">Request Manager</h3>
                <p className="text-slate-400 text-sm">Review pending book issues & returns</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center group-hover:bg-teal-500 group-hover:border-teal-500 transition-all">
              <ChevronRight size={20} />
            </div>
          </button>
        </section>

        {/* SECONDARY ACTIONS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button 
            onClick={() => navigate('/admin/add-book')}
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 active:bg-slate-50 transition-all hover:shadow-md"
          >
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={32} />
            </div>
            <div className="text-left">
              <span className="block font-black text-lg uppercase tracking-tight text-slate-800">Add Book</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Inventory Management</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/admin/students-list')}
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-6 active:bg-slate-50 transition-all hover:shadow-md"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus size={32} />
            </div>
            <div className="text-left">
              <span className="block font-black text-lg uppercase tracking-tight text-slate-800">Users List</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Student Database</span>
            </div>
          </button>
        </section>

        {/* LOGS SECTION */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-700">Recent Activity</h4>
               </div>
               <TrendingUp size={18} className="text-teal-500" />
            </div>
            <div className="space-y-4">
              {[
                { m: "New student registration: Rahul Kumar", t: "2m ago" },
                { m: "Book 'Atomic Habits' issued to ID: #204", t: "15m ago" },
                { m: "Inventory updated: 5 new arrivals", t: "1h ago" }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50 px-2 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                    <p className="text-sm text-slate-600 font-medium">{log.m}</p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tabular-nums">{log.t}</span>
                </div>
              ))}
            </div>
        </section>

      </main>

      {/* 3. SIMPLE FOOTER */}
      <footer className="py-8 text-center border-t border-slate-100">
        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          Powered by AdminCore v2.0
        </p>
      </footer>

    </div>
  );
};

export default AdminDashboard;