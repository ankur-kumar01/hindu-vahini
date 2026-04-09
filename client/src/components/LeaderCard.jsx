import { CrownSimple, Phone } from '@phosphor-icons/react';

export default function LeaderCard({ leader, isVertical = false }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden group hover:shadow-soft transition-all duration-300 transform hover:-translate-y-1 ${isVertical ? 'shadow-soft border border-gray-100' : ''}`}>
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        <img src={leader.image} alt={leader.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {leader.isPresident && (
          <div className="absolute bottom-3 right-3 bg-saffron text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md">
            <CrownSimple weight="fill" size={20} />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1 group-hover:text-saffron transition-colors">{leader.name}</h3>
        <span className="text-sm font-semibold text-saffron block mb-3">{leader.role}</span>
        <p className="text-gray-600 text-sm mb-5 leading-relaxed">{leader.bio}</p>
        <div className="flex flex-col gap-2">
          {leader.phones.map((phone, i) => (
            <a key={i} href={`tel:${phone.replace(/[\s-]/g, '')}`} className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-saffron transition-colors">
              <Phone size={16} className="text-saffron" /> {phone}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
