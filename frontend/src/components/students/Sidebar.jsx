// src/components/Sidebar.jsx
import { LayoutDashboard,  LogOut,  } from 'lucide-react';

const Sidebar = () => {
  const menu = [
    { name: 'Discover', icon: <LayoutDashboard />, active: true },
    
    
  ];

  return (
    <div className="w-64 bg-white h-screen p-6 flex flex-col border-r border-gray-100">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-brand-blue rounded-lg"></div>
        <h1 className="text-xl font-bold text-brand-navy">BookBase</h1>
      </div>
      
      <nav className="flex-1 space-y-4">
        {menu.map((item) => (
          <div key={item.name} className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer font-semibold ${item.active ? 'text-brand-blue bg-blue-50' : 'text-gray-400'}`}>
            {item.icon} <span>{item.name}</span>
          </div>
        ))}
      </nav>
      
      <button className="flex items-center gap-4 p-3 text-gray-400 font-semibold hover:text-red-500 transition">
        <LogOut /> <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;