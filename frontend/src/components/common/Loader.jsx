import React from 'react';
import { Library, Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, message = "Fetching Data..." }) => {
  // Common Sharp Style for both loaders
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      {/* Sharp Box with Animated Spinner */}
      <div className="relative flex items-center justify-center w-16 h-16 bg-white border-2 border-[#14D3BC] shadow-lg shadow-teal-50">
        <Library size={32} className="text-[#14D3BC]" strokeWidth={1.5} />
        {/* Spinning Border Layer */}
        <div className="absolute inset-0 border-t-2 border-[#14D3BC] animate-spin"></div>
      </div>
      
      {/* Branding & Message */}
      <div className="text-center">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">SVPC</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          {message}
        </p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[999] bg-white flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="w-full py-20 flex items-center justify-center">
      {loaderContent}
    </div>
  );
};

export default Loader;