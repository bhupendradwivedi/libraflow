import React, { useState } from 'react';
import { Eye, BookPlus, X, Hash, User, Bookmark, Info } from 'lucide-react';

const BookCard = ({ book, onIssue }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAvailable = book.quantity > 0;

  return (
    <>
      {/* --- Main Elegant Card --- */}
      <div className="bg-white rounded-[2rem] border border-slate-100 flex flex-col w-full max-w-[280px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 group">
        
        {/* 1. Image Section with Soft Gradient Overlay */}
        <div className="relative h-72 w-full bg-slate-50 overflow-hidden">
          <img 
            src={book.image?.url || `https://placehold.co/300x400?text=${book.title}`} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
          
          {/* Floating Category Badge */}
          <div className="absolute top-4 left-4 backdrop-blur-md bg-white/70 border border-white/50 px-3 py-1 rounded-full shadow-sm">
            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1">
              <Bookmark size={10} className="text-[#14D3BC]" /> {book.category}
            </span>
          </div>

          {/* Availability Pulse */}
          <div className={`absolute bottom-4 right-4 h-2 w-2 rounded-full animate-pulse ${isAvailable ? 'bg-[#14D3BC]' : 'bg-rose-500'}`} />
        </div>

        {/* 2. Info Section (Cleaner Spacing) */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="space-y-1">
            <h3 className="font-black text-slate-900 text-lg tracking-tighter uppercase font-heading leading-tight truncate" title={book.title}>
              {book.title}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-400">
              <User size={12} className="text-[#14D3BC]" />
              <p className="text-[10px] font-bold uppercase tracking-widest truncate">
                {book.author}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center border-t border-slate-50 pt-4">
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Valuation</span>
                <span className="text-sm font-black text-slate-900 font-mono">₹{book.price}</span>
             </div>
             <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isAvailable ? 'bg-teal-50 text-[#14D3BC]' : 'bg-rose-50 text-rose-500'}`}>
                {isAvailable ? `${book.quantity} Units` : 'Sold Out'}
             </div>
          </div>

          {/* 3. Minimalist Action Buttons */}
          <div className="mt-6 grid grid-cols-5 gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="col-span-1 aspect-square flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-[#14D3BC] transition-all border border-slate-100"
              title="Details"
            >
              <Info size={18} />
            </button>
            
            <button 
              disabled={!isAvailable}
              onClick={() => onIssue(book._id)}
              className={`col-span-4 rounded-xl py-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
                ${isAvailable 
                  ? 'bg-slate-900 text-white hover:bg-[#14D3BC] hover:text-slate-900 shadow-lg shadow-slate-200 active:scale-95' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              {isAvailable ? 'Issue Request' : 'Unavailable'}
              {isAvailable && <BookPlus size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Simple Professional Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl h-fit overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-500 rounded-[2.5rem] shadow-2xl">
            
            {/* Close */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-md text-slate-900 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100"
            >
              <X size={20} />
            </button>

            {/* Modal Image */}
            <div className="w-full md:w-5/12 h-64 md:h-auto bg-slate-100">
              <img 
                src={book.image?.url || `https://placehold.co/400x600?text=${book.title}`} 
                alt={book.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col bg-white">
              <div className="mb-8">
                <span className="text-[#14D3BC] text-[9px] font-black uppercase tracking-[0.4em] block mb-2">Internal Registry Record</span>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight font-heading mb-1">
                  {book.title}
                </h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">By {book.author}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-slate-300 uppercase">Serial Code</p>
                   <p className="text-[11px] font-black text-slate-900 font-mono tracking-tighter">{book.isbn || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-slate-300 uppercase">Availability</p>
                   <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{book.quantity} In Stack</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                <p className="text-[12px] leading-relaxed text-slate-600 font-medium italic">
                  "{book.description || "The central library metadata unit is currently indexing the abstract for this specific edition."}"
                </p>
              </div>

              <button 
                disabled={!isAvailable}
                onClick={() => { onIssue(book._id); setIsModalOpen(false); }}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all
                  ${isAvailable 
                    ? 'bg-slate-900 text-white hover:bg-[#14D3BC] hover:text-slate-900 shadow-xl shadow-slate-200' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                {isAvailable ? 'Confirm Borrow Request' : 'Asset Depleted'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;