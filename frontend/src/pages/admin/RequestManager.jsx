import React, { useEffect, useState } from 'react';
import issueService from '../../services/IssueServices.js';
import { 
  Check, X, BookOpen, Search, GraduationCap, 
  Timer, User, ArrowRightLeft, CheckCircle2 
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

  const filteredRequests = requests.filter((req) => {
    const query = searchTerm.toLowerCase();
    return (
      req.student?.name?.toLowerCase().includes(query) || 
      req.book?.title?.toLowerCase().includes(query) ||
      req.student?.rollNumber?.toLowerCase().includes(query)
    );
  });

  const handleAction = async (id, action, name) => {
    if (!window.confirm(`Confirm: ${action} request for ${name}?`)) return;
    try {
      if (action === 'approve') await issueService.approveIssueRequest(id);
      else if (action === 'reject') await issueService.rejectIssueRequest(id);
      
      toast.success(`Request ${action}ed successfully`);
      fetchAllRequests(); 
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  if (loading) return <Loader fullScreen={true} message="Accessing SVPC Command Queue..." />;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans px-4 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b-2 border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Action <span className="text-[#14D3BC]">Queue</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
            <ArrowRightLeft size={12} className="text-[#14D3BC]" /> Circulation & Asset Movement
          </p>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="SEARCH BY STUDENT OR BOOK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-slate-100 focus:border-[#14D3BC] outline-none font-bold text-[10px] uppercase tracking-widest transition-all bg-slate-50 focus:bg-white rounded-none"
          />
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 py-32 text-center">
          <CheckCircle2 className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Queue Cleared • No Actions</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredRequests.map((req) => (
            <div key={req._id} className="bg-white border-2 border-slate-900 flex flex-col lg:flex-row items-stretch shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="w-2 shrink-0 bg-orange-500" />
              <div className="flex-1 p-6 flex flex-col lg:flex-row justify-between items-center gap-8">
                <div className="flex items-start gap-6 flex-1 w-full">
                  <div className="w-14 h-14 bg-slate-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 shrink-0">
                    <User size={24} />
                  </div>
                  <div className="space-y-3 w-full">
                    <h4 className="font-black text-slate-900 uppercase tracking-tighter text-xl leading-none">
                      {req.student?.name || "Unknown"}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-black text-slate-400 font-mono">#{req.student?.rollNumber}</span>
                      <p className="text-slate-900 font-black text-[10px] uppercase tracking-tight flex items-center gap-1">
                        <BookOpen size={12} className="text-[#14D3BC]" /> {req.book?.title}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-wider">
                        <GraduationCap size={12} className="text-[#14D3BC]" /> 
                        {req.student?.branch} | Sem {req.student?.semester}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-wider font-mono">
                        <Timer size={12} className="text-[#14D3BC]" /> {new Date(req.createdAt).toLocaleDateString('en-GB')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <button onClick={() => handleAction(req._id, 'reject', req.student?.name)} className="p-4 border-2 border-slate-200 text-slate-400 hover:border-rose-600 hover:text-rose-600 transition-all bg-white"><X size={18} /></button>
                  <button onClick={() => handleAction(req._id, 'approve', req.student?.name)} className="flex-1 lg:px-8 py-4 bg-slate-900 text-white border-2 border-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-[#14D3BC] shadow-[4px_4px_0px_0px_rgba(20,211,188,1)] transition-all">Approve Issue</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestManager;