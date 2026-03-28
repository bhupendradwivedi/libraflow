import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShieldCheck, ArrowRight, RotateCcw, Library } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const { state } = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useContext(AuthContext);

  // Safety check: Redirect if email is missing
  useEffect(() => {
    if (!state?.email) {
      toast.error("Invalid access. Please register first.");
      navigate('/register');
    }
  }, [state, navigate]);

  // Cooldown timer logic
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return toast.error("Enter a valid 6-digit OTP");
    }
    try {
      const data = await verifyOtp(state.email, otp);
      if (data?.success) {
        navigate('/login');
      }
    } catch (error) {}
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await resendOtp(state.email);
      setCooldown(60); 
      toast.success("New OTP sent to your email");
    } catch (error) {}
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center font-sans p-4">
      
      {/* Sharp Rectangle Container */}
      <div className="w-full h-screen md:h-auto md:max-w-[450px] bg-white px-8 md:px-12 flex flex-col justify-center animate-in fade-in zoom-in duration-500">
        
        {/* Branding Header - Consistent Teal Circle */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-[#14D3BC] rounded-full mb-6 mx-auto">
            <ShieldCheck size={30} className="text-[#14D3BC]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Security Check</h1>
          <p className="text-slate-400 text-[11px] mt-2 tracking-tight">
            Passcode sent to <br/>
            <span className="text-[#14D3BC] font-bold">{state?.email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-8">
          {/* OTP Input - High Contrast & Sharp */}
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
              Enter 6-Digit Code
            </label>
            <div className="relative border border-slate-200 focus-within:border-[#14D3BC] transition-all rounded-none bg-slate-50/30">
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                autoFocus
                className="w-full text-center text-4xl tracking-[12px] font-bold py-5 bg-transparent outline-none text-slate-800 placeholder:text-slate-100 rounded-none"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>

          {/* Action Button - Sharp Teal Rectangle */}
          <button
            type="submit"
            className="w-full py-4.5 bg-[#14D3BC] hover:bg-[#11bba6] text-white font-bold text-sm tracking-wide shadow-lg shadow-teal-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 rounded-none group"
          >
            Verify Identity <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Resend Logic */}
          <div className="text-center">
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={handleResend}
              className={`flex items-center justify-center gap-2 mx-auto text-[11px] font-bold uppercase tracking-wide transition-all ${
                cooldown > 0 ? "text-slate-300" : "text-slate-500 hover:text-[#14D3BC]"
              }`}
            >
              <RotateCcw size={14} className={cooldown > 0 ? "" : "animate-spin-slow"} />
              {cooldown > 0 ? `Retry in ${cooldown}s` : "Resend Passcode"}
            </button>
          </div>
        </form>

        {/* Professional Footer */}
        <div className="mt-12 pt-6 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            SVPC Digital Library • Secure Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;