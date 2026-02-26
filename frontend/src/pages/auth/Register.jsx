import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, GraduationCap } from 'lucide-react';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    branch: ''
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const data = await register(userData);

      if (data?.success) {
        toast.success("OTP sent to your email!");
        navigate('/verify-otp', {
          state: { email: userData.email }
        });
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-10 rounded-[30px] shadow-sm">
        <h2 className="text-3xl font-bold text-[#1B2559] mb-8 text-center">
          Sign up
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0]" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F4F7FE] outline-none border-2 border-transparent focus:border-[#5D5FEF]"
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0]" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F4F7FE] outline-none border-2 border-transparent focus:border-[#5D5FEF]"
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0]" size={18} />
            <select
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F4F7FE] outline-none border-2 border-transparent focus:border-[#5D5FEF]"
              onChange={(e) =>
                setUserData({ ...userData, branch: e.target.value })
              }
            >
              <option value="">Select Branch</option>
              <option value="CS">Computer Science</option>
              <option value="IT">Information Technology</option>
            </select>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0]" size={18} />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F4F7FE] outline-none border-2 border-transparent focus:border-[#5D5FEF]"
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-4 bg-black text-white font-bold rounded shadow-lg active:scale-95 transition"
          >
            Get OTP
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#A3AED0]">
          Already have an account?
          <Link to="/login" className="text-[#5D5FEF] font-bold ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
