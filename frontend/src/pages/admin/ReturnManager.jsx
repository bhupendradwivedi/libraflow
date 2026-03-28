import React, { useEffect, useState } from 'react';
import { Check, User, BookOpen, AlertCircle, IndianRupee, Hash, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import issueService from '../../services/IssueServices';
import userService from '../../services/userService';

const ReturnRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await userService.getAdminReturnRequests();
      if (res.success) setRequests(res.requests);
    } catch (err) {
      toast.error("Queue sync failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchReturns(); }, []);

  const handleApproveReturn = async (id, name, fine) => {
    const confirmMsg = `Receive book from ${name}? \nTotal Fine Collected: ₹${fine}`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await issueService.approveReturnRequest(id);
      if (res.success) {
        toast.success("Book received & inventory updated!");
        fetchReturns(); // Refresh list
      }
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 px-4">
      {/* HEADER */}
      <div className="border-b-4 border-slate-900 pb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase font-heading">
          Return <span className="text-[#14D3BC]">Manager</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
          Verify Assets & Collect Fines
        </p>
      </div>

      {/* REQUESTS LIST */}
      <div className="grid gap-6">
        {requests.length > 0 ? requests.map((req) => (
          <div key={req._id} className="bg-white border-2 border-slate-900 flex flex-col lg:flex-row shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
            
            {/* 1. Student Info Section */}
            <div className="p-6 flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 bg-[#14D3BC] flex items-center justify-center text-white font-black text-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {req.user?.name[0]}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg leading-none">{req.user?.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase font-mono tracking-widest flex items-center gap-2">
                    <Hash size={10} className="text-[#14D3BC]"/> {req.user?.rollNumber}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-[8px] font-black bg-white border border-slate-200 px-2 py-1 uppercase tracking-widest text-slate-500 flex items-center gap-1">
                  <GraduationCap size={10}/> {req.user?.branch}
                </span>
                <span className="text-[8px] font-black bg-white border border-slate-200 px-2 py-1 uppercase tracking-widest text-slate-500">
                  Yr {req.user?.year} / Sem {req.user?.semester}
                </span>
              </div>
            </div>

            {/* 2. Book Info Section */}
            <div className="p-6 flex-1 flex flex-col justify-center">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                <BookOpen size={10} /> Asset Requested for Return
              </p>
              <h4 className="text-base font-black text-slate-900 uppercase leading-tight truncate">{req.book?.title}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Due: {new Date(req.dueDate).toLocaleDateString('en-GB')}</p>
            </div>

            {/* 3. Fine & Action Section */}
            <div className="p-6 lg:w-72 bg-white flex flex-col items-center justify-center gap-4 border-t-2 lg:border-t-0 lg:border-l-2 border-slate-900">
              <div className="text-center">
                <p className="text-[8px] font-black text-rose-300 uppercase tracking-widest mb-1">Live Fine Status</p>
                <div className={`text-2xl font-black font-mono flex items-center justify-center gap-1 ${req.currentFine > 0 ? 'text-rose-600 animate-pulse' : 'text-emerald-500'}`}>
                  <IndianRupee size={20} /> {req.currentFine}
                </div>
              </div>

              <button 
                onClick={() => handleApproveReturn(req._id, req.user?.name, req.currentFine)}
                className="w-full bg-slate-900 text-[#14D3BC] py-3 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#14D3BC] hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(20,211,188,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                <Check size={14} strokeWidth={4} /> Confirm Receipt
              </button>
            </div>
          </div>
        )) : (
          <div className="py-20 bg-slate-50 border-2 border-dashed border-slate-200 text-center">
            <AlertCircle size={40} className="mx-auto text-slate-200 mb-2" />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No pending return approvals</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnRequests;