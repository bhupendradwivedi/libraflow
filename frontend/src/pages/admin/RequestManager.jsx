import React, { useEffect, useState, useMemo } from 'react';
import issueService from '../../services/IssueServices.js';
import { 
  Check, X, BookOpen, Search, GraduationCap, 
  Clock, User, ArrowRightLeft, CheckCircle2,
  Hash, Book as BookIcon, UserCircle, Calendar
} from 'lucide-react'; 
import toast from 'react-hot-toast';
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

  const handleAction = async (id, action, name) => {
    const loadingToast = toast.loading(`${action === 'approve' ? 'Approving' : 'Rejecting'}...`);
    try {
      if (action === 'approve') await issueService.approveIssueRequest(id);
      else if (action === 'reject') await issueService.rejectIssueRequest(id);
      
      toast.success(`Request ${action}ed`, { id: loadingToast });
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      toast.error("Operation failed", { id: loadingToast });
    }
  };

  if (loading) return <Loader fullScreen={true} message="Syncing Requests..." />;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 pb-24 font-sans text-slate-900">
      
      {/* HEADER & SEARCH */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Request <span className="text-teal-600">Manager</span>
          </h1>
          <p className="text-slate-500 text-xs font-medium">Manage book issue approvals</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search student or book..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      {/* REQUEST CARDS */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 py-20 text-center">
          <CheckCircle2 size={40} className="mx-auto text-emerald-400 mb-3" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Queue is Clear</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((req) => (
            <div key={req._id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all active:scale-[0.98]">
              
              {/* 1. STUDENT INFO (Header of Card) */}
              <div className="p-5 flex items-center gap-4 border-b border-slate-50">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center shrink-0">
                  <UserCircle size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 leading-none truncate">{req.student?.name}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded tracking-tighter">
                      ID: {req.student?.rollNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <GraduationCap size={12} className="text-teal-500" /> {req.student?.branch}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Requested</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{new Date(req.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              {/* 2. BOOK INFO (Body of Card) */}
              <div className="bg-slate-50/50 p-5 flex gap-4">
                <div className="shrink-0">
                  <img 
                    src={req.book?.image?.url || "https://placehold.co/100x150?text=No+Cover"} 
                    className="w-14 h-20 object-cover rounded-lg shadow-sm border-2 border-white"
                    alt={req.book?.title}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-[9px] font-bold text-teal-600 uppercase tracking-widest mb-1">Requested Book</p>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-1">
                    {req.book?.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium italic">by {req.book?.author}</p>
                  <p className="text-[9px] font-mono font-bold text-slate-400 mt-2 uppercase tracking-tighter">ISBN: {req.book?.isbn || "N/A"}</p>
                </div>
              </div>

              {/* 3. ACTIONS (Footer of Card) */}
              <div className="p-3 flex gap-2 bg-white border-t border-slate-100">
                <button 
                  onClick={() => handleAction(req._id, 'reject', req.student?.name)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors active:bg-rose-100"
                >
                  <X size={16} /> Reject
                </button>
                <button 
                  onClick={() => handleAction(req._id, 'approve', req.student?.name)}
                  className="flex-[2] flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-all"
                >
                  <Check size={16} /> Approve Issue
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MOBILE END INFO */}
      <div className="mt-12 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          Powered by AdminCore
        </p>
      </div>

    </div>
  );
};

export default RequestManager;