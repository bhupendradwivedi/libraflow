import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookPlus, X, User, Bookmark, Info, IndianRupee, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

const BookCard = ({ book, onIssue }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAvailable = book.quantity > 0;

  const handleConfirmIssue = () => {
    Swal.fire({
      title: 'Request Asset?',
      text: `Place a request for "${book.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#14D3BC',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Confirm Request',
      background: '#ffffff',
      borderRadius: '1.5rem',
      customClass: {
        popup: 'rounded-[2rem] border-none shadow-2xl',
        title: 'font-black uppercase tracking-tight text-slate-800',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onIssue(book._id);
        setIsModalOpen(false);
      }
    });
  };

  return (
    <>
      {/* --- Compact Card with Framer Motion --- */}
      <motion.div 
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        whileTap={{ scale: 0.98 }}
        className="group relative bg-white rounded-[1.8rem] p-2.5 border border-slate-100 w-full max-w-[240px] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow duration-500"
      >
        {/* Image Section - Reduced Height */}
        <div className="relative aspect-[4/5] w-full rounded-[1.4rem] overflow-hidden bg-slate-100">
          <motion.img 
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.8 }}
            src={book.image?.url || `https://placehold.co/400x500?text=${book.title}`} 
            alt={book.title} 
            className="w-full h-full object-cover" 
          />
          
          {/* Glassmorphism Badge */}
          <div className="absolute top-2 left-2">
            <span className="backdrop-blur-md bg-white/60 px-2.5 py-1 rounded-full text-[8px] font-black text-slate-800 uppercase tracking-wider border border-white/40 shadow-sm">
              {book.category}
            </span>
          </div>

          {/* Out of Stock Overlay */}
          {!isAvailable && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center"
             >
                <span className="bg-white/90 px-3 py-1 rounded-full text-[9px] font-black text-slate-900 uppercase">Out of Stock</span>
             </motion.div>
          )}
        </div>

        {/* Info Section - Compact Spacing */}
        <div className="px-1.5 pt-3 pb-1 flex flex-col gap-1">
          <h3 className="font-black text-slate-900 text-[13px] leading-tight line-clamp-1 uppercase tracking-tight group-hover:text-[#14D3BC] transition-colors">
            {book.title}
          </h3>
          
          <div className="flex items-center gap-1 opacity-60">
            <User size={10} className="text-slate-400" />
            <p className="text-[9px] font-bold text-slate-500 truncate uppercase">{book.author}</p>
          </div>

          {/* Price & Quantity Row */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
             <div className="flex items-center">
                <IndianRupee size={10} className="text-slate-900" strokeWidth={3} />
                <span className="text-sm font-black text-slate-900 tracking-tighter">{book.price}</span>
             </div>
             <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${isAvailable ? 'bg-teal-50 text-[#14D3BC]' : 'bg-rose-50 text-rose-400'}`}>
                QTY: {book.quantity}
             </span>
          </div>

          {/* Actions - Modern & Smaller */}
          <div className="flex gap-1.5 mt-3">
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: '#000', color: '#14D3BC' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 transition-colors"
            >
              <Info size={16} strokeWidth={2.5} />
            </motion.button>
            <motion.button 
              disabled={!isAvailable}
              whileHover={isAvailable ? { scale: 1.03, backgroundColor: '#14D3BC' } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              onClick={handleConfirmIssue}
              className={`flex-1 rounded-xl py-2 px-3 font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2
                ${isAvailable ? 'bg-slate-950 text-white shadow-md' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              {isAvailable ? 'Issue Asset' : 'N/A'}
              {isAvailable && <BookPlus size={12} strokeWidth={3} />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* --- Compact Animated Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl flex flex-col p-6"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <X size={20} />
              </button>

              <div className="flex gap-5 mb-6">
                <div className="w-24 shrink-0 aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-slate-100">
                  <img src={book.image?.url || `https://placehold.co/400x600?text=${book.title}`} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-xs font-black text-[#14D3BC] uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
                    <Sparkles size={10} /> Detail View
                  </h4>
                  <h3 className="text-xl font-black text-slate-900 leading-tight uppercase italic">{book.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Authored by {book.author}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                   <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Asset Price</p>
                      <p className="text-xs font-black text-slate-900 tracking-tighter italic">₹{book.price}</p>
                   </div>
                   <div className="flex-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Quantity</p>
                      <p className="text-xs font-black text-slate-900 tracking-tighter italic">{book.quantity} PCS</p>
                   </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  {book.description || "The metadata for this academic asset is currently being processed for the institutional registry."}
                </p>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!isAvailable}
                  onClick={handleConfirmIssue}
                  className={`w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                  ${isAvailable 
                    ? 'bg-slate-950 text-white shadow-xl shadow-slate-200' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                >
                  Confirm Asset Request
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookCard;