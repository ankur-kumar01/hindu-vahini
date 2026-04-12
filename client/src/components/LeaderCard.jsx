import { CrownSimple, Phone, MapPin } from '@phosphor-icons/react';

export default function LeaderCard({ leader, isVertical = false, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl overflow-hidden group hover:shadow-img transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${isVertical ? 'shadow-soft border border-gray-100' : ''}`}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
             <span className="text-white font-medium tracking-wide bg-dark/40 px-4 py-2 rounded-full text-xs">View Identity ID</span>
        </div>
        {leader.designation === 'President' && (
          <div className="absolute bottom-3 right-3 bg-saffron text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10 transition-transform group-hover:scale-110">
            <CrownSimple weight="fill" size={20} />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1 group-hover:text-saffron transition-colors">{leader.name}</h3>
        <span className="text-sm font-semibold text-saffron block mb-1">{leader.role}</span>
        {leader.state && leader.state !== 'National' && (
          <div className="flex items-center gap-1 mb-3">
            <MapPin size={12} className="text-gray-400" weight="fill" />
            <span className="text-xs text-gray-400 font-medium">
              {leader.district ? `${leader.district}, ` : ''}{leader.state}
            </span>
          </div>
        )}
        {(!leader.state || leader.state === 'National') && (
          <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 mb-3">🇮🇳 National</span>
        )}
        <p className="text-gray-600 text-sm mb-5 leading-relaxed">{leader.bio}</p>
        <div className="flex flex-col gap-2">
          {leader.phone && (
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <Phone size={16} className="text-saffron" /> {leader.phone}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
