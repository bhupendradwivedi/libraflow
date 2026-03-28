import React, { useEffect, useState } from 'react';
import { 
  Book, Clock, CheckCircle, XCircle, RefreshCw, 
  User, Calendar, Search, Hash, 
} from 'lucide-react';
import toast from 'react-hot-toast';
import issueService from '../../services/IssueServices';
import Loader from '../../components/common/Loader';

const MyIssuedBooks = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const data = await issueService.getMyBookRequests();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      toast.error("Records sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyRequests(); }, []);

  const filteredRequests = requests.filter((req) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      req.book?.title?.toLowerCase().includes(searchTerm) ||
      req.book?.author?.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) return <Loader fullScreen={true} message="Accessing Personal Ledger..." />;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans sm:px-4 pb-20">
      
      {/* --- HEADER & SEARCH: Mobile Optimized --- */}
      <div className="px-4 sm:px-0 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b-2 border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none font-heading">
            My Requests
          </h1>
          <p className="text-[#14D3BC] text-[10px] font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
            Borrowing History & Status
          </p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14D3BC]" size={16} />
          <input 
            type="text" 
            placeholder="SEARCH BY TITLE OR AUTHOR..." 
            className="w-full pl-11 pr-4 py-4 sm:py-3 border-2 border-slate-100 focus:border-[#14D3BC] outline-none font-bold text-[10px] uppercase tracking-widest transition-all bg-slate-50 focus:bg-white sm:rounded-none"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- REQUESTS LIST: Full Screen on Mobile --- */}
      {filteredRequests.length === 0 ? (
        <div className="mx-4 sm:mx-0 bg-white border-2 border-dashed border-slate-200 py-20 text-center">
          <Book className="mx-auto text-slate-200 mb-4" size={40} />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No matching records</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {filteredRequests.map((req) => (
            <div 
              key={req._id} 
              className="bg-white sm:border-2 border-slate-900 flex flex-col md:flex-row items-stretch sm:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
            >
              {/* Image Section: Full Color, No Hover Scale */}
              <div className="w-full md:w-32 h-48 md:h-auto bg-slate-100 border-b-2 md:border-b-0 md:border-r-2 border-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                {req.book?.image?.url ? (
                  <img src={req.book.image.url} alt="cover" className="h-full w-full object-cover" />
                ) : (
                  <Book size={32} className="text-slate-300" />
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-slate-900 text-[#14D3BC] text-[9px] font-black px-2 py-1 uppercase font-mono">
                      REF: {req._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase font-mono bg-slate-50 px-2 py-1 border border-slate-100">
                      <Hash size={10} className="inline mr-1" /> ISBN: {req.book?.isbn || "N/A"}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight font-heading mb-2">
                    {req.book?.title}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                    <User size={12} className="text-[#14D3BC]" /> {req.book?.author}
                  </p>
                </div>

                {/* Tracking Dates */}
                <div className="flex flex-wrap gap-6 mt-6 border-t border-slate-100 pt-5">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Requested</span>
                    <div className="flex items-center gap-2 text-slate-800">
                      <Calendar size={12} className="text-[#14D3BC]" />
                      <span className="text-[10px] font-black font-mono">
                        {new Date(req.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>
                  
                  {req.status === 'approved' && (
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-rose-300 uppercase tracking-widest mb-1">Due Date</span>
                      <div className="flex items-center gap-2 text-rose-600 font-mono">
                        <Clock size={12} />
                        <span className="text-[10px] font-black">
                          {new Date(req.dueDate).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Section: Mobile Friendly */}
              <div className={`w-full md:w-48 border-t-2 md:border-t-0 md:border-l-2 border-slate-900 flex flex-col items-center justify-center py-6 px-4 gap-2 ${
                req.status === 'pending' ? 'bg-amber-50' : 
                req.status === 'approved' ? 'bg-emerald-50' : 'bg-rose-50'
              }`}>
                {req.status === 'pending' && <RefreshCw size={24} className="animate-spin text-amber-500 mb-1" />}
                {req.status === 'approved' && <CheckCircle size={24} className="text-emerald-500 mb-1" />}
                {req.status === 'rejected' && <XCircle size={24} className="text-rose-500 mb-1" />}
                
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                  req.status === 'pending' ? 'text-amber-600' : 
                  req.status === 'approved' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {req.status}
                </span>
                
                {req.status === 'pending' && (
                  <p className="text-[8px] font-bold text-amber-400 text-center uppercase tracking-widest">
                    In Queue
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIssuedBooks;