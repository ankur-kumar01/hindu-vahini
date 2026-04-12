import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { SignOut, ShieldCheck, List, X, Images } from '@phosphor-icons/react';

export default function DashboardPanel() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const info = JSON.parse(localStorage.getItem('admin_info') || '{}');

    if (!token || !info) {
      navigate('/dashboard-login');
      return;
    }

    // Verify session
    fetch('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setAdmin(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_info');
        navigate('/dashboard-login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col text-white">
      {/* Mobile-focused Header */}
      <header className="bg-dark/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-saffron rounded-xl flex items-center justify-center shadow-lg shadow-saffron/20">
             <Images size={20} weight="fill" className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider leading-none">Management</h1>
            <p className="text-[10px] text-saffron font-bold uppercase tracking-widest mt-1">Photo Dashboard</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 active:scale-90"
          title="Sign Out"
        >
          <SignOut size={20} weight="bold" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
           <div className="flex items-center gap-3 text-xs">
              <img 
                src={admin?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'A')}&background=ff9933&color=fff`} 
                className="w-8 h-8 rounded-full border border-saffron/30"
                alt="Avatar"
              />
              <div>
                <p className="font-bold text-gray-300">{admin?.name}</p>
                <div className="flex items-center gap-1.5 text-saffron font-black uppercase tracking-[0.1em] text-[10px]">
                   <ShieldCheck size={12} weight="fill" /> {admin?.role === 'admin' ? 'Super Admin' : 'Admin'}
                </div>
              </div>
           </div>
           
           {admin?.role === 'admin' && (
             <button 
              onClick={() => navigate('/admin/dashboard')}
              className="text-[10px] bg-white/5 hover:bg-saffron hover:text-white px-3 py-1.5 rounded-lg border border-white/10 font-black uppercase transition-all"
             >
                Full Admin
             </button>
           )}
        </div>

        <Outlet context={{ admin }} />
      </main>

      {/* Persistent Mobile Help Bar */}
      <footer className="md:hidden bg-dark/40 border-t border-white/5 py-4 text-center">
         <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black">Hindu Vahini © 2024 • Secured Panel</p>
      </footer>
    </div>
  );
}
