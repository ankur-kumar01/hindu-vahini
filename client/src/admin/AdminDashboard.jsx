import { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import {
  House, User, LockKey, SignOut, List, X, ShieldCheck, Bell, Envelope, Users, Images, Megaphone, HandHeart, IdentificationCard, Code
} from '@phosphor-icons/react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const info = localStorage.getItem('admin_info');

    if (!token || !info) {
      navigate('/dashboard-login');
      return;
    }

    // Verify token is still valid
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
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: '/admin/dashboard', icon: House, label: 'Dashboard' },
    { to: '/admin/members', icon: IdentificationCard, label: 'Membership Requests' },
    { to: '/admin/development-requests', icon: Code, label: 'Development Requests' },
    { to: '/admin/leaders', icon: Users, label: 'Manage Leaders' },
    { to: '/admin/gallery', icon: Images, label: 'Manage Gallery' },
    { to: '/admin/campaigns', icon: Megaphone, label: 'Manage Campaigns' },
    { to: '/admin/donations', icon: HandHeart, label: 'Manage Donations' },
    { to: '/admin/queries', icon: Envelope, label: 'Contact Queries' },
    { to: '/admin/profile', icon: User, label: 'My Profile' },
    { to: '/admin/change-password', icon: LockKey, label: 'Change Password' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <img src="/logo.png" alt="Logo" className="w-9 h-9 rounded-full border border-saffron/30" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">HinduVahini</p>
            <p className="text-saffron text-[10px] font-semibold uppercase tracking-widest">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-500 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-saffron text-white shadow-[0_4px_15px_rgba(255,153,51,0.25)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} weight={({ isActive }) => isActive ? 'fill' : 'regular'} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Admin Profile Footer */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={admin?.avatar || '/upload/admin/default-avatar.png'}
              alt={admin?.name}
              className="w-9 h-9 rounded-full border border-saffron/30 object-cover"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'A')}&background=ff9933&color=fff`; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{admin?.name}</p>
              <p className="text-gray-500 text-xs truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2 px-3 rounded-xl text-sm font-medium transition-all"
          >
            <SignOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay on Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-dark/80 backdrop-blur-sm border-b border-white/5 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <List size={22} />
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={14} className="text-saffron" />
              <span>Authenticated Session</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors">
              <Bell size={16} />
            </div>
            <img
              src={admin?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'A')}&background=ff9933&color=fff`}
              alt={admin?.name}
              className="w-8 h-8 rounded-full border border-saffron/30 object-cover"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'A')}&background=ff9933&color=fff`; }}
            />
          </div>
        </header>

        {/* Page Content via Outlet */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet context={{ admin, setAdmin }} />
        </main>
      </div>
    </div>
  );
}
