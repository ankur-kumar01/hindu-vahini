import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Phone, FloppyDisk, Check, Warning } from '@phosphor-icons/react';

export default function AdminProfile() {
  const { admin, setAdmin } = useOutletContext();
  const [form, setForm] = useState({ name: admin?.name || '', phone: admin?.phone || '' });
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', msg: data.error });
      } else {
        setStatus({ type: 'success', msg: 'Profile updated successfully!' });
        setAdmin(prev => ({ ...prev, ...form }));
        const stored = JSON.parse(localStorage.getItem('admin_info') || '{}');
        localStorage.setItem('admin_info', JSON.stringify({ ...stored, ...form }));
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Update your admin profile details.</p>
      </div>

      {/* Avatar */}
      <div className="bg-white/3 border border-white/5 rounded-2xl p-6 flex items-center gap-4">
        <img
          src={admin?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'A')}&background=ff9933&color=fff&size=128`}
          alt={admin?.name}
          className="w-16 h-16 rounded-full border-2 border-saffron/30 object-cover"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'A')}&background=ff9933&color=fff`; }}
        />
        <div>
          <p className="text-white font-semibold">{admin?.name}</p>
          <p className="text-gray-500 text-sm">{admin?.email}</p>
          <p className="text-gray-600 text-xs mt-1">Avatar auto-generated from name</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/3 border border-white/5 rounded-2xl p-6">
        {status && (
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-5 text-sm ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {status.type === 'success' ? <Check size={16} weight="bold" /> : <Warning size={16} weight="fill" />}
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-saffron/60 focus:ring-2 focus:ring-saffron/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-saffron/60 focus:ring-2 focus:ring-saffron/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={admin?.email}
              disabled
              className="w-full bg-white/3 border border-white/5 text-gray-500 rounded-xl px-4 py-3 text-sm cursor-not-allowed"
            />
            <p className="text-gray-600 text-xs mt-1">Email cannot be changed.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-saffron text-white py-3 rounded-xl font-bold text-sm hover:bg-saffronLight transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,153,51,0.25)]"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <FloppyDisk size={16} weight="bold" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
