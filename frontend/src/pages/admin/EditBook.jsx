import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, BookOpen, User, Hash, DollarSign, Layers, Upload, Info } from 'lucide-react';
import bookService from '../../services/bookServices';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader'; 
const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '', quantity: 1, price: '', description: '',
  });
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await bookService.getAllBooks();
        const foundBook = res.books?.find(b => String(b._id) === String(id));
        
        if (foundBook) {
          setFormData({
            title: foundBook.title || '',
            author: foundBook.author || '',
            isbn: foundBook.isbn || '',
            category: foundBook.category || '',
            quantity: foundBook.quantity || 1,
            price: foundBook.price || '',
            description: foundBook.description || '',
          });
          setPreview(foundBook.image?.url || null);
        } else {
          toast.error("Asset not found in registry");
          navigate('/admin/manageBooks');
        }
      } catch (err) {
        toast.error("Database sync failed");
      } finally {
        setLoading(false); 
      }
    };

    if (id) fetchBook();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'price' || name === 'quantity') && value < 0) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append("image", imageFile);

      const response = await bookService.editBook(id, data);
      if (response.success) {
        toast.success("Asset records updated");
        navigate('/admin/manageBooks');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Modification failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader fullScreen={true} message="Accessing SVPC Asset Registry..." />;

  if (updating) return <Loader fullScreen={true} message="Committing Changes to Database..." />;

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center py-6 md:py-12 px-4 md:px-0 animate-in fade-in duration-500">
      <div className="w-full max-w-5xl">
        
        {/* Navigation & Header */}
        <div className="mb-10 px-2">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-[#14D3BC] font-bold text-[10px] uppercase tracking-widest mb-6 transition-all"
          >
            <ArrowLeft size={14} /> Discard Changes
          </button>
          <div className="flex items-baseline gap-4">
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Modify Asset</h2>
             <span className="h-[2px] flex-grow bg-slate-100 hidden md:block"></span>
          </div>
          <p className="text-[#14D3BC] font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
            Registry ID: {id?.slice(-12).toUpperCase()}
          </p>
        </div>

        {/* Sharp Form Container */}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-100 p-6 md:p-12 shadow-2xl shadow-slate-100/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Column 1: Core Records */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Asset Title</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 focus-within:border-[#14D3BC] transition-all">
                    <BookOpen size={18} className="text-slate-300" />
                    <input type="text" name="title" value={formData.title} required className="bg-transparent outline-none w-full font-bold text-slate-800 text-sm" onChange={handleChange} />
                  </div>
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Registered Author</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 focus-within:border-[#14D3BC] transition-all">
                    <User size={18} className="text-slate-300" />
                    <input type="text" name="author" value={formData.author} required className="bg-transparent outline-none w-full font-bold text-slate-800 text-sm" onChange={handleChange} />
                  </div>
                </div>

                {/* ISBN */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">ISBN Reference</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 focus-within:border-[#14D3BC] transition-all">
                    <Hash size={18} className="text-slate-300" />
                    <input type="text" name="isbn" value={formData.isbn} className="bg-transparent outline-none w-full font-bold text-slate-800 text-sm" onChange={handleChange} />
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Value (₹)</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 focus-within:border-[#14D3BC] transition-all">
                    <DollarSign size={18} className="text-slate-300" />
                    <input type="number" name="price" value={formData.price} required className="bg-transparent outline-none w-full font-bold text-slate-800 text-sm" onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  <Info size={12} /> Technical Overview
                </label>
                <textarea name="description" rows="5" value={formData.description} className="w-full bg-slate-50 border border-slate-100 p-6 focus:border-[#14D3BC] outline-none font-medium text-slate-700 text-sm transition-all" onChange={handleChange}></textarea>
              </div>
            </div>

            {/* Column 2: Inventory & Visuals */}
            <div className="space-y-8 border-l-0 lg:border-l border-slate-100 lg:pl-12">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Department</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 focus-within:border-[#14D3BC] transition-all">
                  <Layers size={18} className="text-slate-300" />
                  <select name="category" value={formData.category} className="bg-transparent outline-none w-full font-bold text-slate-800 text-sm appearance-none cursor-pointer" onChange={handleChange}>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Current Stock Level</label>
                <input type="number" name="quantity" min="1" value={formData.quantity} className="w-full bg-slate-900 p-4 font-black text-center text-[#14D3BC] text-xl border-none outline-none" onChange={handleChange} />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Update Artwork</label>
                <input type="file" id="file-upload" accept="image/*" className="hidden" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center gap-4 bg-slate-50 border-2 border-dashed border-slate-200 h-[240px] hover:border-[#14D3BC] hover:bg-white cursor-pointer transition-all group overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-[#14D3BC] transition-all">
                        <Upload size={20} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Cover</span>
                    </>
                  )}
                </label>
              </div>

              <button 
                type="submit" 
                className="w-full py-5 bg-slate-900 hover:bg-[#14D3BC] text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group"
              >
                <Save size={18} /> Commit Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;