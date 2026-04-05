import React, { useEffect, useState } from 'react';
import { 
  Search, ShieldCheck, CheckCircle2, 
  UserCheck, Trash2, Mail, BookOpen,
  ArrowRight, BookMarked, Users, Clock, AlertCircle,
  Eraser, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; 
import userService from '../../services/userService';
import Loader from '../../components/common/Loader'; 

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCleaning, setIsCleaning] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);

  // Fetch all students from the database
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllStudents(); 
      if (res && res.success) setStudents(res.students); 
    } catch (error) {
      toast.error("Failed to load students list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  // Toggle expanded view for book details
  const toggleExpand = (id) => setExpandedStudent(expandedStudent === id ? null : id);

  // Handle Admin Approval with SweetAlert
  const handleApprove = async (id, name) => {
    Swal.fire({
      title: 'Confirm Approval',
      text: `Are you sure you want to approve ${name}'s profile?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#14D3BC',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Approve!',
      borderRadius: '1.5rem'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await userService.approveStudent(id); 
          if (res.success) { 
            Swal.fire('Approved!', 'Student profile is now active.', 'success');
            fetchStudents(); 
          }
        } catch (error) { toast.error("Approval failed"); }
      }
    });
  };

  // Handle Single Student Deletion
  const handleDelete = async (id, name) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `${name}'s data will be permanently deleted!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await userService.deleteStudent(id); 
          if (res.success) { 
            toast.success("Deleted successfully"); 
            fetchStudents(); 
          }
        } catch (error) { toast.error("Deletion failed"); }
      }
    });
  };
  
  // Handle Bulk Cleanup of Unverified Accounts
  const handleBulkCleanup = async () => {
    Swal.fire({
      title: 'Database Cleanup',
      text: "All unverified accounts will be deleted. Do you want to proceed?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Clean All!',
      footer: '<span style="color: #ef4444; font-weight: bold;">Note: This action cannot be undone</span>'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsCleaning(true);
          const res = await userService.deleteUnverifiedStudents(); 
          if (res.success) {
            Swal.fire({
              title: 'Cleanup Complete!',
              text: `${res.deletedCount || 0} accounts were removed.`,
              icon: 'success',
              confirmButtonColor: '#14D3BC'
            });
            fetchStudents();
          }
        } catch (error) {
          toast.error(error.message || "Cleanup failed");
        } finally {
          setIsCleaning(false);
        }
      }
    });
  };

  // Filter students based on search term
  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: students.length,
    pending: students.filter(s => s.adminApproved === 'pending').length,
    activeLoans: students.reduce((acc, s) => acc + (s.activeBorrowCount || 0), 0)
  };

  if (loading) return <Loader fullScreen={true} message="Accessing SVPC Vault..." />;

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="mb-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center justify-between lg:justify-start lg:gap-4">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight italic uppercase">Registry<span className="text-[#14D3BC]">.</span></h1>
                
                {/* Mobile Cleanup Button */}
                <button 
                  onClick={handleBulkCleanup}
                  disabled={isCleaning}
                  className="lg:hidden p-3 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 shadow-sm active:scale-95 transition-all"
                  title="Cleanup Unverified"
                >
                  {isCleaning ? <RefreshCw size={20} className="animate-spin" /> : <Eraser size={20} />}
                </button>
            </div>
            <p className="text-slate-500 font-medium text-sm mt-1">Manage institutional identities and academic access.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative group w-full sm:min-w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14D3BC] transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by name or roll number..." 
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-[#14D3BC] outline-none transition-all shadow-sm focus:shadow-md font-semibold text-slate-700"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Desktop Cleanup Button */}
            <button 
              onClick={handleBulkCleanup}
              disabled={isCleaning}
              className="hidden lg:flex items-center gap-2 px-6 py-3 bg-white border-2 border-rose-100 text-rose-500 font-black rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isCleaning ? <RefreshCw size={18} className="animate-spin" /> : <Eraser size={18} />}
              <span className="text-xs tracking-widest uppercase">{isCleaning ? "Processing..." : "Cleanup Unverified"}</span>
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 border-2 border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Users size={24}/></div>
            <div><p className="text-xs font-bold text-slate-400 uppercase">Total Students</p><p className="text-xl font-black text-slate-800">{stats.total}</p></div>
          </div>
          <div className="bg-white p-4 border-2 border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><Clock size={24}/></div>
            <div><p className="text-xs font-bold text-slate-400 uppercase">Pending Review</p><p className="text-xl font-black text-slate-800">{stats.pending}</p></div>
          </div>
          <div className="bg-white p-4 border-2 border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><BookMarked size={24}/></div>
            <div><p className="text-xs font-bold text-slate-400 uppercase">Active Borrows</p><p className="text-xl font-black text-slate-800">{stats.activeLoans}</p></div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-900/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#14D3BC]/20">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider">Student Profile</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider">Academic details</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider">Verification</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-right text-[#14D3BC]">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <React.Fragment key={student._id}>
                  <tr className={`hover:bg-slate-50/80 transition-all ${expandedStudent === student._id ? 'bg-[#14D3BC]/5' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner ${student.adminApproved === 'approved' ? 'bg-[#14D3BC]' : 'bg-slate-300'}`}>
                          {student.name ? student.name[0].toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm uppercase leading-none mb-1">{student.name}</p>
                          <p className="text-xs font-bold text-slate-400 lowercase">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{student.branch}</span>
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-bold text-slate-400">RN: {student.rollNumber}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                          <span className="text-[10px] font-black text-[#14D3BC]">SEM {student.semester}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className={`w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm ${student.accountVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
                          {student.accountVerified ? 'Email Verified' : 'Email Pending'}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 ml-1">Books: {student.activeBorrowCount || 0}/6</p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => toggleExpand(student._id)} className={`p-2.5 rounded-xl transition-all ${expandedStudent === student._id ? 'bg-slate-900 text-[#14D3BC]' : 'hover:bg-slate-100 text-slate-400'}`}>
                          <BookMarked size={18} />
                        </button>

                        {student.adminApproved === 'pending' ? (
                          <button onClick={() => handleApprove(student._id, student.name)} className="p-2.5 rounded-xl bg-slate-900 text-[#14D3BC] hover:scale-110 shadow-lg shadow-slate-200">
                            <UserCheck size={18} />
                          </button>
                        ) : (
                          <div className="p-2.5 text-[#14D3BC] bg-emerald-50 rounded-xl" title="Approved"><CheckCircle2 size={18} /></div>
                        )}

                        <button onClick={() => handleDelete(student._id, student.name)} className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* EXPANDED VIEW - BOOK LEDGER */}
                  {expandedStudent === student._id && (
                    <tr>
                      <td colSpan="4" className="px-6 py-0 border-none bg-slate-50/50">
                        <div className="py-6 px-10 animate-in slide-in-from-top-2 duration-300">
                           <div className="flex items-center gap-3 mb-4">
                              <div className="h-0.5 w-10 bg-[#14D3BC]"></div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Book Ledger</h4>
                           </div>

                          {student.issueBooks && student.issueBooks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {student.issueBooks.map((book, index) => (
                                <div key={index} className="bg-white border border-slate-200 p-4 rounded-2xl flex justify-between items-center group hover:border-[#14D3BC] transition-all shadow-sm">
                                  <div>
                                    <p className="text-[11px] font-black text-slate-800 uppercase line-clamp-1">{book.bookTitle || "Untitled Asset"}</p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-1 font-mono">{book.issueId || "ID-UNAVAILABLE"}</p>
                                  </div>
                                  <div className={`h-2 w-2 rounded-full ${book.returned ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`}></div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-6 opacity-40">
                              <AlertCircle size={32} className="text-slate-300 mb-2"/>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Zero active borrow records found</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No identities found matching query</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;