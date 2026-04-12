import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeSlash, LockKey, EnvelopeSimple, ShieldCheck, Warning } from '@phosphor-icons/react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      // Store token and admin info
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_info', JSON.stringify(data.admin));

      // Role-based Redirection
      if (data.admin.role === 'sub-admin') {
        navigate('/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-[#1a0a00] to-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-24 w-80 h-80 bg-saffron/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-saffron/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-saffron/10 border border-saffron/30 mb-5 shadow-[0_0_30px_rgba(255,153,51,0.15)]">
            <img src="/logo.png" alt="HinduVahini" className="w-12 h-12 rounded-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 font-heading">Dashboard login</h1>
          <p className="text-gray-400 text-sm">HinduVahini Trust — Secured Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
              <Warning size={18} weight="fill" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeSimple size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="ashwani@hinduvahini.online"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-saffron/60 focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <LockKey size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl pl-11 pr-12 py-3 focus:outline-none focus:border-saffron/60 focus:ring-2 focus:ring-saffron/20 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-saffron text-white py-3.5 rounded-xl font-bold text-sm hover:bg-saffronLight transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(255,153,51,0.3)] hover:shadow-[0_4px_30px_rgba(255,153,51,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} weight="fill" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Secured access only. Unauthorized attempts are logged.
        </p>
      </div>
    </div>
  );
}
