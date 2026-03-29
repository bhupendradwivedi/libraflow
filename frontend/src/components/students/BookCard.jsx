import React, { useState } from 'react';
import { BookPlus, X, User, Bookmark, Info, IndianRupee } from 'lucide-react';

const BookCard = ({ book, onIssue }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAvailable = book.quantity > 0;

  return (
    <>
      {/* --- Card Section (Same as before) --- */}
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col w-full max-w-[260px] overflow-hidden transition-all hover:shadow-md group shadow-sm">
        <div className="relative h-48 sm:h-56 w-full bg-slate-100 overflow-hidden">
          <img 
            src={book.image?.url || `https://placehold.co/300x400?text=${book.title}`} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-md shadow-sm border border-slate-100">
            <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Bookmark size={10} className="text-[#14D3BC]" /> {book.category}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight line-clamp-1">{book.title}</h3>
            <div className="flex items-center gap-1 text-slate-500">
              <User size={12} />
              <p className="text-[10px] font-medium truncate uppercase tracking-tight">{book.author}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center border-t border-slate-50 pt-3">
             <span className="text-sm font-bold text-slate-900 flex items-center">
                <IndianRupee size={12} strokeWidth={3} />{book.price}
             </span>
             <div className={`text-[10px] font-bold ${isAvailable ? 'text-[#14D3BC]' : 'text-rose-500'}`}>
                {isAvailable ? `${book.quantity} In Stock` : 'Out of Stock'}
             </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2.5 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="View Details"
            >
              <span className="sr-only">Details</span>
              <Info size={18} />
            </button>
            <button 
              disabled={!isAvailable}
              onClick={() => onIssue(book._id)}
              className={`flex-1 rounded-lg py-2.5 px-3 font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2
                ${isAvailable ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              {isAvailable ? 'Issue' : 'N/A'} {isAvailable && <BookPlus size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Updated Compact Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          {/* max-w-md (448px) makes it smaller than before */}
          <div className="bg-white w-full max-w-md overflow-hidden rounded-xl shadow-xl flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header - Slimmer padding */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Quick View</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <X size={18} />
                </button>
            </div>

            <div className="p-4 flex flex-col sm:flex-row gap-5">
              {/* Smaller Image container */}
              <div className="w-32 sm:w-36 shrink-0 aspect-[3/4] mx-auto sm:mx-0 rounded-lg overflow-hidden shadow-sm border border-slate-100">
                <img 
                  src={book.image?.url || `https://placehold.co/400x600?text=${book.title}`} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content - Tightened vertical spacing */}
              <div className="flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">By {book.author}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                     <p className="text-[7px] text-slate-400 uppercase font-bold mb-0.5">ISBN</p>
                     <p className="text-[10px] font-mono font-bold text-slate-700">{book.isbn || '---'}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                     <p className="text-[7px] text-slate-400 uppercase font-bold mb-0.5">Price</p>
                     <p className="text-[10px] font-bold text-slate-700 italic">₹{book.price}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {book.description || "No description available for this record."}
                </p>

                <button 
                    disabled={!isAvailable}
                    onClick={() => { onIssue(book._id); setIsModalOpen(false); }}
                    className={`mt-auto w-full py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all
                    ${isAvailable 
                        ? 'bg-[#14D3BC] text-white hover:bg-[#11b8a4] shadow-md shadow-teal-50 active:scale-95' 
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                >
                    {isAvailable ? 'Confirm Request' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;