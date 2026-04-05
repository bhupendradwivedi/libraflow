import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion imports
import BookCard from '../../components/students/BookCard';
import bookService from '../../services/bookServices';
import { toast } from 'react-hot-toast';
import { Search, Library, Hash, Bell, Sparkles } from 'lucide-react';
import issueService from '../../services/IssueServices';
import Loader from '../../components/common/Loader';

const DashboardHome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      if (data.success) setBooks(data.books);
    } catch (err) {
      toast.error("Sync failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllBooks(); }, []);

  const handleIssueRequest = async (bookId) => {
    try {
      setRequestingId(bookId);
      const data = await issueService.requestIssue(bookId);
      if (data.success) toast.success("REQUESTED");
    } catch (err) {
      toast.error("Failed Or You Not Verified By Admin.");
    } finally {
      setRequestingId(null);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 } // Har card ke beech 0.1s ka gap
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (loading) return <Loader fullScreen={true} message="Optimizing Catalog..." />;

  return (
    <div className="h-[100dvh] w-full bg-[#F8FAFC] flex flex-col overflow-hidden fixed inset-0 font-sans selection:bg-teal-100">
      
      {/* 1. HEADER (Framer Motion) */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="shrink-0 bg-white border-b border-slate-100 px-5 py-3 flex justify-between items-center z-50"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-[#14D3BC] shadow-lg"
          >
            <Library size={18} strokeWidth={2.5} />
          </motion.div>
          <div>
            <h1 className="text-[13px] font-black tracking-tighter uppercase text-slate-800 leading-none">
              Catalog.<span className="text-teal-500">Hub</span>
            </h1>
            <p className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-1">Institutional Access</p>
          </div>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="relative p-2 text-slate-400 hover:text-teal-500 transition-colors bg-slate-50 rounded-full"
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        </motion.button>
      </motion.header>

      {/* 2. SEARCH BOX */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="shrink-0 px-5 py-4 bg-white border-b border-slate-100 shadow-sm"
      >
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search assets, titles or authors..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent outline-none text-[11px] font-bold uppercase tracking-wider text-slate-700 rounded-2xl focus:bg-white focus:border-teal-500/20 focus:ring-4 focus:ring-teal-500/5 transition-all shadow-inner"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* 3. SCROLLABLE AREA */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-24 bg-[#F8FAFC]">
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-7xl mx-auto mb-8 px-2 flex items-center gap-2"
        >
           <Sparkles size={12} className="text-teal-500" />
           <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">
             Active Inventory Collection
           </p>
        </motion.div>

        {/* Animated Grid with AnimatePresence */}
        <AnimatePresence mode='popLayout'>
          {filteredBooks.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
            >
              {filteredBooks.map((book) => (
                <motion.div 
                  layout // Smoothly re-arranges cards when filtering
                  key={book._id} 
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full flex justify-center"
                >
                   <BookCard 
                    book={book} 
                    onIssue={handleIssueRequest} 
                    isLoading={requestingId === book._id} 
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-96 flex flex-col items-center justify-center"
            >
              <Hash size={32} className="text-slate-200 mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No assets matching query</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchTerm("")} 
                className="mt-4 px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl"
              >
                Reset Search
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardHome;