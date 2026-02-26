// src/components/Common/Navbar.jsx
{/* Profile Dropdown Logic */}
<div className="flex items-center gap-3">
  <div className="text-right hidden sm:block">
    <p className="text-sm font-bold text-[#1B2559]">{user.name}</p>
    <button className="text-[10px] text-brand-primary font-semibold hover:underline">
      Forget Password?
    </button>
  </div>
  <div className="w-10 h-10 rounded-full bg-brand-primary border-4 border-white shadow-sm overflow-hidden">
    <img src={user.avatar} alt="profile" />
  </div>
</div>