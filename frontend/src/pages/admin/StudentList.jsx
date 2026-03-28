import React, { useEffect, useState } from 'react';
import { 
  Search, ShieldCheck, CheckCircle2, 
  UserCheck, GraduationCap, Mail, Trash2, Hash, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '../../services/userService';
import Loader from '../../components/common/Loader'; 

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllStudents(); 
      if (res && res.success) setStudents(res.students); 
    } catch (error) {
      toast.error("Students list load nahi ho saki");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const toggleExpand = (id) => setExpandedStudent(expandedStudent === id ? null : id);

  const handleApprove = async (id, name) => {
    if (window.confirm(`Approve ${name}?`)) {
      try {
        const res = await userService.approveStudent(id); 
        if (res.success) { toast.success("Approved"); fetchStudents(); }
      } catch (error) { toast.error("Failed"); }
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      try {
        const res = await userService.deleteStudent(id); 
        if (res.success) { toast.success("Deleted"); fetchStudents(); }
      } catch (error) { toast.error("Failed"); }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen={true} message="Syncing SVPC Directory..." />;

  return (
    <div className="animate-in fade-in duration-700 font-sans sm:px-4 pb-20">
      
      {/* --- HEADER: Mobile par full width --- */}
      <div className="px-4 sm:px-0 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b-2 border-slate-200 pb-8 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase font-heading">Registry</h1>
          <p className="text-[#14D3BC] text-[10px] font-black uppercase tracking-[0.3em] mt-2">Identity Control Console</p>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14D3BC]" size={18} />
          <input 
            type="text" 
            placeholder="Search name or roll no..." 
            className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 focus:border-[#14D3BC] outline-none font-bold text-[11px] uppercase tracking-widest bg-slate-50 focus:bg-white transition-all sm:rounded-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE / MOBILE CARDS --- */}
      <div className="bg-white sm:border-2 border-slate-900 overflow-hidden sm:shadow-[10px_10px_0px_0px_rgba(15,23,42,0.05)]">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-heading">
                <th className="px-4 sm:px-6 py-5 text-[10px] uppercase tracking-widest whitespace-nowrap">Student Identity</th>
                <th className="px-4 sm:px-6 py-5 text-[10px] uppercase tracking-widest whitespace-nowrap">Academic Matrix</th>
                <th className="px-4 sm:px-6 py-5 text-[10px] uppercase tracking-widest text-center">Status</th>
                <th className="px-4 sm:px-6 py-5 text-[10px] uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {filteredStudents.map((student) => (
                <React.Fragment key={student._id}>
                  <tr className="hover:bg-slate-50 transition-colors align-top sm:align-middle">
                    
                    {/* Identity Column */}
                    <td className="px-4 sm:px-6 py-6 min-w-[200px] sm:min-w-[250px]">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`h-10 w-10 sm:h-12 sm:w-12 shrink-0 flex items-center justify-center text-white font-black text-sm border-2 border-slate-900 ${student.adminApproved === 'approved' ? 'bg-[#14D3BC]' : 'bg-slate-300'}`}>
                          {student.name[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-black text-slate-900 uppercase text-xs sm:text-base leading-tight truncate">{student.name}</p>
                          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 flex items-center gap-1 truncate"><Mail size={10}/>{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Academic Details - BOLD & VISIBLE */}
                    <td className="px-4 sm:px-6 py-6 min-w-[280px]">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={14} className="text-[#14D3BC]" />
                          <span className="text-[11px] sm:text-sm font-black text-slate-800 uppercase font-heading truncate">{student.branch}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <span className="bg-slate-900 text-white px-2 py-1 text-[10px] sm:text-[11px] font-black font-mono border border-slate-900">ROLL: {student.rollNumber}</span>
                          <span className="bg-white text-slate-900 px-2 py-1 text-[9px] sm:text-[10px] font-black border-2 border-slate-900 uppercase">YR {student.year}</span>
                          <span className="bg-[#14D3BC]/10 text-[#14D3BC] px-2 py-1 text-[9px] sm:text-[10px] font-black border-2 border-[#14D3BC] font-mono">SEM {student.semester}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 sm:px-6 py-6 text-center">
                      <div className="flex flex-col items-center gap-2 min-w-[100px]">
                        <div className={`flex items-center gap-1 px-2 py-1 border-2 text-[8px] sm:text-[9px] font-black uppercase ${student.accountVerified ? 'border-[#14D3BC] text-[#14D3BC]' : 'border-slate-200 text-slate-400'}`}>
                          {student.accountVerified ? 'Verified' : 'Pending'}
                        </div>
                        <p className="text-[8px] font-bold text-slate-400">LOANS: {student.activeBorrowCount || 0}/6</p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 sm:px-6 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => toggleExpand(student._id)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-slate-200 text-slate-400 hover:border-slate-900 transition-all">
                          <BookOpen size={16} />
                        </button>

                        {student.adminApproved === 'pending' ? (
                          <button onClick={() => handleApprove(student._id, student.name)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-slate-900 text-[#14D3BC] border-2 border-slate-900 hover:bg-[#14D3BC] hover:text-white transition-all">
                            <UserCheck size={16} />
                          </button>
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-[#14D3BC] border-2 border-[#14D3BC]">
                            <CheckCircle2 size={16} />
                          </div>
                        )}

                        <button onClick={() => handleDelete(student._id, student.name)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Mobile View Log */}
                  {expandedStudent === student._id && (
                    <tr className="bg-slate-50">
                      <td colSpan="4" className="px-4 py-8 text-center font-black text-slate-300 text-[9px] uppercase tracking-widest italic border-x-2 border-slate-900">
                        Historical Archive Point • Access Encrypted
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;