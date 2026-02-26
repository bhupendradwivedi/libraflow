import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const { state } = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useContext(AuthContext);

  // Safety check
  useEffect(() => {
    if (!state?.email) {
      toast.error("Invalid access. Please register first.");
      navigate('/register');
    }
  }, [state, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP");
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
      setCooldown(60); // 60 sec cooldown
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm p-10 rounded-[30px] shadow-sm text-center">

        <div className="w-16 h-16 bg-[#F4F7FE] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="text-[#5D5FEF]" size={32} />
        </div>

        <h2 className="text-2xl font-bold text-[#1B2559] mb-2">
          Verify OTP
        </h2>

        <p className="text-[#A3AED0] text-sm mb-8 px-2">
          Enter the 6-digit code sent to <br/>
          <span className="text-[#1B2559] font-bold">
            {state?.email}
          </span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">

          <input
            type="text"
            maxLength="6"
            placeholder="000000"
            autoFocus
            className="w-full text-center text-3xl tracking-[15px] font-bold py-5 rounded-2xl bg-[#F4F7FE] outline-none border-2 border-transparent focus:border-[#5D5FEF]"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-4 bg-black text-white rounded font-bold shadow-xl active:scale-95 transition"
          >
            Verify Account
          </button>

          <button
            type="button"
            disabled={cooldown > 0}
            onClick={handleResend}
            className={`text-sm font-bold ${
              cooldown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#5D5FEF] hover:underline"
            }`}
          >
            {cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : "Resend OTP"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
