import { useOutletContext } from 'react-router-dom';
import { Users, Calendar, ShieldCheck, ArrowUpRight } from '@phosphor-icons/react';

export default function AdminHome() {
  const { admin } = useOutletContext();

  const stats = [
    {
      label: 'Active Admin',
      value: '1',
      icon: ShieldCheck,
      color: 'saffron',
      bg: 'bg-saffron/10',
      border: 'border-saffron/20',
      text: 'text-saffron'
    },
    {
      label: 'Members',
      value: 'Coming Soon',
      icon: Users,
      color: 'blue',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400'
    },
    {
      label: 'Inquiries',
      value: 'Coming Soon',
      icon: Calendar,
      color: 'green',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400'
    },
  ];

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-saffron/20 to-saffron/5 border border-saffron/20 rounded-2xl p-6 flex items-center gap-4">
        <img
          src={admin?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'A')}&background=ff9933&color=fff`}
          alt={admin?.name}
          className="w-14 h-14 rounded-full border-2 border-saffron/40 object-cover"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'A')}&background=ff9933&color=fff`; }}
        />
        <div>
          <p className="text-gray-400 text-sm">{greeting} 👋</p>
          <h1 className="text-2xl font-bold text-white">{admin?.name}</h1>
          <p className="text-saffron text-xs font-semibold uppercase tracking-widest mt-0.5">HinduVahini Admin</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-white font-semibold text-sm uppercase tracking-widest mb-4 opacity-60">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, bg, border, text }) => (
            <div key={label} className={`${bg} ${border} border rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm font-medium">{label}</span>
                <div className={`w-9 h-9 ${bg} border ${border} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} className={text} weight="fill" />
                </div>
              </div>
              <p className={`text-2xl font-bold ${text}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white/3 border border-white/5 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-saffron/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <ArrowUpRight size={18} className="text-saffron" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">More features coming soon</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Member management, inquiry inbox, gallery management, and leadership updates will be added to this admin panel in upcoming releases.
            </p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white/3 border border-white/5 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Account Details</h2>
        <div className="space-y-3">
          {[
            { label: 'Name', value: admin?.name },
            { label: 'Email', value: admin?.email },
            { label: 'Phone', value: admin?.phone || '—' },
            { label: 'Account Since', value: admin?.created_at ? new Date(admin.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-gray-500 text-sm">{label}</span>
              <span className="text-white text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
