import React from 'react';
import { Library, Mail, Phone, Globe, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t-2 border-slate-100 mt-auto">
      {/* Upper Footer: Branding & Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* 1. Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#14D3BC] flex items-center justify-center text-white">
              <Library size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">SVPC</span>
              <span className="text-[9px] font-black text-[#14D3BC] uppercase tracking-[0.4em]">Library</span>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400 font-medium uppercase tracking-wider">
            Providing seamless access to global knowledge and academic resources for SVPC students and faculty.
          </p>
        </div>

        {/* 2. Quick Navigation */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 inline-block">Navigation</h4>
          <ul className="space-y-3 flex flex-col">
            <Link to="/student/dashboard" className="text-[10px] font-bold text-slate-400 hover:text-[#14D3BC] uppercase tracking-widest transition-colors">Digital Catalog</Link>
            <Link to="/student/my-issued-books" className="text-[10px] font-bold text-slate-400 hover:text-[#14D3BC] uppercase tracking-widest transition-colors">Request Status</Link>
            <Link to="/student/issued-books" className="text-[10px] font-bold text-slate-400 hover:text-[#14D3BC] uppercase tracking-widest transition-colors">Active Shelf</Link>
          </ul>
        </div>

        {/* 3. Support & Help */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 inline-block">Support</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-[#14D3BC]">
              <ShieldCheck size={14} className="text-[#14D3BC]" /> Library Guidelines
            </li>
            <li className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-[#14D3BC]">
              <Globe size={14} className="text-[#14D3BC]" /> Institutional Access
            </li>
          </ul>
        </div>

        {/* 4. Contact Details */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 inline-block">Contact</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-400">
              <Mail size={14} className="text-[#14D3BC]" />
              <span className="text-[10px] font-bold lowercase tracking-tight">support@svpc.edu.in</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Phone size={14} className="text-[#14D3BC]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">+91 755 267XXXX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Version */}
      <div className="bg-slate-50 py-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            © 2026 SVPC DIGITAL LIBRARY PORTAL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4">
             <span className="text-[8px] font-black bg-white border border-slate-200 px-3 py-1 text-slate-400 uppercase tracking-widest">
               v3.4.0 Stable
             </span>
             <span className="text-[8px] font-black bg-[#14D3BC]/10 border border-[#14D3BC]/20 px-3 py-1 text-[#14D3BC] uppercase tracking-widest">
               Secure Environment
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;