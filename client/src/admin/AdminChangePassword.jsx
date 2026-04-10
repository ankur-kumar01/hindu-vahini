import { useState } from 'react';
import { LockKey, Eye, EyeSlash, Check, Warning } from '@phosphor-icons/react';

export default function AdminChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', msg: 'New passwords do not match.' });
      return;
    }
    if (form.newPassword.length < 8) {
      setStatus({ type: 'error', msg: 'New password must be at least 8 characters.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', msg: data.error });
      } else {
        setStatus({ type: 'success', msg: 'Password changed successfully!' });
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'currentPassword', label: 'Current Password', key: 'current' },
    { name: 'newPassword', label: 'New Password', key: 'new' },
    { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' },
  ];

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Change Password</h1>
        <p className="text-gray-500 text-sm mt-1">Keep your account secure with a strong password.</p>
      </div>

      <div className="bg-white/3 border border-white/5 rounded-2xl p-6">
        {status && (
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-5 text-sm ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {status.type === 'success' ? <Check size={16} weight="bold" /> : <Warning size={16} weight="fill" />}
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, key }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
              <div className="relative">
                <LockKey size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={show[key] ? 'text' : 'password'}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-saffron/60 focus:ring-2 focus:ring-saffron/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {show[key] ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}

          {/* Strength Tips */}
          <div className="bg-white/3 rounded-xl p-3 text-xs text-gray-500 space-y-1">
            <p className="font-semibold text-gray-400 mb-1">Password tips:</p>
            <p>• At least 8 characters long</p>
            <p>• Mix uppercase, lowercase, numbers & symbols</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-saffron text-white py-3 rounded-xl font-bold text-sm hover:bg-saffronLight transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,153,51,0.25)]"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <LockKey size={16} weight="bold" />}
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
