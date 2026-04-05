import React, { useEffect, useState, useMemo } from 'react';
import issueService from '../../services/IssueServices.js';
import { 
  Check, X, Search, GraduationCap, 
  CheckCircle2, UserCircle, AlertCircle
} from 'lucide-react'; 
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; 
import Loader from '../../components/common/Loader';

const RequestManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const data = await issueService.getAdminPendingRequests();
      if (data.success) setRequests(data.requests || []);
    } catch (error) {
      toast.error("Failed to sync action queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllRequests(); }, []);

  const filteredRequests = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return requests.filter((req) =>
      req.student?.name?.toLowerCase().includes(query) || 
      req.book?.title?.toLowerCase().includes(query) ||
      req.student?.rollNumber?.toLowerCase().includes(query)
    );
  }, [requests, searchTerm]);

  // Handle Action with SweetAlert2
  const handleAction = async (id, action, studentName, bookTitle) => {
    const isApprove = action === 'approve';
    
    // --- SWEETALERT CONFIRMATION DIALOG ---
    Swal.fire({
      title: isApprove ? 'Approve Issue?' : 'Reject Request?',
      html: `Aap <b>${studentName}</b> ki <b>${bookTitle}</b> ke liye request ${isApprove ? 'approve' : 'reject'} kar rahe hain.`,
      icon: isApprove ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isApprove ? '#0F172A' : '#e11d48', // Tailwind slate-900 or rose-600
      cancelButtonColor: '#94a3b8', // slate-400
      confirmButtonText: isApprove ? 'Yes, Approve!' : 'Yes, Reject!',
      cancelButtonText: 'Cancel',
      borderRadius: '1.5rem',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Show loading state in button
        const loadingToast = toast.loading('Processing...');
        
        try {
          if (isApprove) await issueService.approveIssueRequest(id);
          else await issueService.rejectIssueRequest(id);
          
          toast.success(`Request ${action}ed successfully`, { id: loadingToast });
          
          // Animation before removing from list
          setRequests(prev => prev.filter(r => r._id !== id));

          // Success SweetAlert (Optional)
          Swal.fire({
            title: 'Success!',
            text: `Request has been ${action}ed.`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            borderRadius: '1.5rem',
          });

        } catch (error) {
          toast.error(error?.response?.data?.message || "Operation failed", { id: loadingToast });
        }
      }
    });
  };

  if (loading) return <Loader fullScreen={true} message="Syncing Requests..." />;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 pb-24 font-sans text-slate-900 page-reveal">
      
      {/* HEADER & SEARCH */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 font-heading italic uppercase">
            Request <span className="text-teal-600">Manager</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Manage book issue approvals</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={16} />
          <input 
            type="text"
            placeholder="SEARCH STUDENT OR BOOK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-[11px] font-bold uppercase tracking-wider shadow-sm"
          />
        </div>
      </div>

      {/* REQUEST CARDS */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 py-20 text-center">
          <CheckCircle2 size={40} className="mx-auto text-emerald-400 mb-3" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Queue is Clear</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((req) => (
            <div key={req._id} className="bg-white rounded-[2.2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
              
              {/* 1. STUDENT INFO */}
              <div className="p-5 flex items-center gap-4 border-b border-slate-50 bg-white">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                  <UserCircle size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 leading-none truncate uppercase italic text-sm">{req.student?.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-lg">
                      RN: {req.student?.rollNumber}
                    </span>
                    <span className="text-[9px] font-black text-teal-600 flex items-center gap-1 uppercase">
                      <GraduationCap size={12} /> {req.student?.branch}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Queue Date</p>
                  <p className="text-[10px] font-bold text-slate-500">{new Date(req.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              {/* 2. BOOK INFO */}
              <div className="bg-slate-50/30 p-5 flex gap-5">
                <div className="shrink-0">
                  <img 
                    src={req.book?.image?.url || "https://placehold.co/100x150?text=No+Cover"} 
                    className="w-16 h-24 object-cover rounded-xl shadow-lg border-2 border-white rotate-[-2deg]"
                    alt={req.book?.title}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-[8px] font-black text-teal-500 uppercase tracking-[0.2em] mb-1">Asset Request</p>
                  <h4 className="text-sm font-black text-slate-800 line-clamp-2 leading-tight mb-1 uppercase italic">
                    {req.book?.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">By {req.book?.author}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[8px] font-mono font-black text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-md uppercase">ISBN: {req.book?.isbn || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* 3. ACTIONS */}
              <div className="p-3 flex gap-3 bg-white border-t border-slate-50">
                <button 
                  onClick={() => handleAction(req._id, 'reject', req.student?.name, req.book?.title)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-rose-100 active:scale-95"
                >
                  <X size={14} strokeWidth={3} /> Reject
                </button>
                <button 
                  onClick={() => handleAction(req._id, 'approve', req.student?.name, req.book?.title)}
                  className="flex-[2] flex items-center justify-center gap-2 py-4 bg-[#0F172A] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all hover:bg-primary hover:text-[#0F172A]"
                >
                  <Check size={14} strokeWidth={3} /> Approve Issue
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8 bg-slate-100"></div>
            <AlertCircle size={14} className="text-slate-200" />
            <div className="h-px w-8 bg-slate-100"></div>
        </div>
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
          SVPC Registry Action Queue
        </p>
      </div>

    </div>
  );
};

export default RequestManager;