import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Plus, PencilSimple, Trash, X, UploadSimple, Phone, IdentificationCard } from '@phosphor-icons/react';

const AdminLeaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    designation: '',
    bio: '',
    phone: '',
    display_order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await fetch('/api/leaders');
      if (!response.ok) throw new Error('Failed to fetch leaders');
      const data = await response.json();
      setLeaders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leader) => {
    setEditingLeader(leader);
    setFormData({
      name: leader.name,
      role: leader.role,
      designation: leader.designation || '',
      bio: leader.bio || '',
      phone: leader.phone || '',
      display_order: leader.display_order || 0
    });
    setImagePreview(leader.image_url);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingLeader(null);
    setFormData({
      name: '',
      role: '',
      designation: '',
      bio: '',
      phone: '',
      display_order: leaders.length
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leader?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/leaders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      setLeaders(leaders.filter(l => l.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      const url = editingLeader ? `/api/admin/leaders/${editingLeader.id}` : '/api/admin/leaders';
      const method = editingLeader ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (!response.ok) throw new Error('Operation failed');
      
      setShowModal(false);
      fetchLeaders(); // Refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Leaders | Admin Dashboard</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users size={28} className="text-saffron" weight="duotone" />
            Manage Leaders
          </h1>
          <p className="text-gray-500 mt-1">Add, update or remove organization leadership profiles.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-saffron hover:bg-saffron/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-saffron/20 active:scale-95"
        >
          <Plus size={20} weight="bold" />
          Add New Leader
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-500">
            <div className="w-10 h-10 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin mx-auto mb-4"></div>
            Loading leadership data...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Leader</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Designation & Role</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Contact</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Order</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaders.map((leader) => (
                  <tr key={leader.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={leader.image_url} 
                          alt={leader.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 ring-2 ring-transparent group-hover:ring-saffron/30 transition-all"
                        />
                        <div>
                          <p className="text-white font-bold">{leader.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1 max-w-[200px]">{leader.bio}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-saffron font-bold text-sm tracking-tight">{leader.designation}</p>
                      <p className="text-gray-400 text-xs">{leader.role}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                        <Phone size={14} className="text-gray-500" />
                        {leader.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-white/5 text-gray-400 px-2 py-1 rounded text-xs font-mono">#{leader.display_order}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(leader)}
                          className="p-2 text-gray-400 hover:text-saffron hover:bg-saffron/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <PencilSimple size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(leader.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animation-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingLeader ? <PencilSimple size={24} className="text-saffron" /> : <Plus size={24} className="text-saffron" />}
                {editingLeader ? 'Edit Leader Profile' : 'Add New Leader'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Image Upload Area */}
              <div className="flex flex-col items-center justify-center gap-4 py-2">
                <div className="relative w-32 h-32 md:w-40 md:h-40 group">
                  <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-white/20 group-hover:border-saffron/50 transition-colors flex flex-col items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <UploadSimple size={32} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Photo</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    onChange={handleImageChange}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-saffron text-white p-2 rounded-xl shadow-lg pointer-events-none group-hover:scale-110 transition-transform">
                    <Plus size={16} weight="bold" />
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Recommended: Square Photo (JPG/PNG)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Ashwani Mishra"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-saffron/50 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Designation</label>
                  <input 
                    type="text" 
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    placeholder="e.g., Rashtriya Adhyaksh"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-saffron/50 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Role/Subtitle</label>
                  <input 
                    type="text" 
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    placeholder="e.g., Central Committee Member"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-saffron/50 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g., +91 99999 00000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-saffron/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Biography / Description</label>
                <textarea 
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about the leader's contributions and vision..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-saffron/50 transition-all font-medium resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Display Priority Order</label>
                <input 
                  type="number" 
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron/50 transition-all font-medium"
                />
                <p className="text-[10px] text-gray-600 ml-1">Lower numbers appear first on the website grid.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] bg-saffron hover:bg-saffron/90 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-saffron/20 active:scale-[0.98]"
                >
                  {editingLeader ? 'Update Profile' : 'Save Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaders;
