import { X, Copy, WhatsappLogo, Check, ShareNetwork, IdentificationCard, Phone } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

export default function LeaderIDModal({ leader, onClose }) {
  const [copied, setCopied] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (leader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [leader]);

  if (!leader) return null;

  // Generate a mock ID number based on the name length and some random bits
  const memberId = `HV-${leader.name.length}${leader.phones[0].slice(-2)}-${leader.isPresident ? '01' : '02'}`;
  
  const shareUrl = `${window.location.origin}/leadership?leader=${encodeURIComponent(leader.name)}`;
  const shareText = `Check out the profile of ${leader.name} (${leader.role}) from HinduVahini: `;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Overlay/Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/95 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center animation-scale-up pointer-events-none">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute -top-12 right-0 md:-top-2 md:-right-12 p-3 text-white hover:text-saffron transition-colors pointer-events-auto"
          aria-label="Close Preview"
        >
          <X size={32} weight="bold" />
        </button>

        {/* ID Card Front */}
        <div className="relative w-full bg-[#f9fafb] rounded-[24px] overflow-hidden shadow-2xl border-t-8 border-saffron pointer-events-auto shadow-black/40">
            {/* Top Pattern Header */}
            <div className="h-16 bg-white flex items-center justify-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full border border-saffron/20" />
                    <span className="font-bold text-dark text-sm tracking-tight uppercase">HinduVahini Trust</span>
                </div>
            </div>

            <div className="px-6 pt-8 pb-10 flex flex-col items-center text-center">
                {/* Profile Photo */}
                <div className="relative mb-6">
                    <div className="w-40 h-40 rounded-full border-[6px] border-white shadow-lg overflow-hidden ring-1 ring-saffron/10">
                        <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Info Container */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-dark mb-1 font-heading">{leader.name}</h2>
                    <p className="text-saffron font-bold text-xs uppercase tracking-widest mb-4">{leader.role}</p>
                    
                    <div className="w-8 h-1 bg-saffron/20 mx-auto rounded-full mb-6"></div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                             <IdentificationCard size={18} weight="duotone" className="text-saffron" />
                             <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Membership ID</span>
                             <span className="text-xs font-mono font-bold text-dark">{memberId}</span>
                        </div>
                        {leader.phones.length > 0 && (
                            <div className="flex items-center justify-center gap-2 text-gray-500">
                                <Phone size={18} weight="duotone" className="text-saffron" />
                                <span className="text-xs font-bold text-dark">{leader.phones[0]}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Logo/Watermark */}
                <div className="opacity-10 pointer-events-none select-none absolute bottom-12 right-0 rotate-[-15deg]">
                    <img src="/logo.png" alt="Watermark" className="w-32 h-32" />
                </div>
            </div>

            {/* Bottom Saffron Strip */}
            <div className="bg-saffron/10 border-t border-saffron/10 py-3 flex items-center justify-center">
                <span className="text-[9px] font-bold text-saffron uppercase tracking-[4px]">Unity • Dharma • Service</span>
            </div>
        </div>

        {/* Share Action Bar Below Card */}
        <div className="mt-8 pointer-events-auto bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-full flex items-center gap-4 shadow-2xl animation-slide-up">
          <div className="hidden sm:flex items-center gap-2 text-white/70 mr-2 border-r border-white/10 pr-6">
            <ShareNetwork size={20} weight="bold" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Share ID</span>
          </div>

          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all ${copied ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-white text-dark hover:bg-saffron hover:text-white shadow-lg'}`}
          >
            {copied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          <button 
            onClick={shareOnWhatsApp}
            className="flex items-center justify-center bg-[#25D366] text-white p-2.5 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg"
            title="Share on WhatsApp"
          >
            <WhatsappLogo size={22} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}
