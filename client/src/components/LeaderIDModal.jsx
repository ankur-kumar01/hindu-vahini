import { X, Copy, WhatsappLogo, Check, ShareNetwork, IdentificationCard, Phone, MapPin } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

export default function LeaderIDModal({ leader, onClose }) {
  const [copied, setCopied] = useState(false);

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

  const phoneSuffix = leader.phone ? leader.phone.slice(-2) : '00';
  const memberId = `HV-${leader.name.length}${phoneSuffix}-${leader.designation === 'President' ? '01' : '02'}`;
  
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

  const isNational = !leader.state || leader.state === 'National';

  return (
    // Full-screen overlay, scrollable so nothing clips on small screens
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark/95 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Centering wrapper — min-h ensures it fills screen, py gives breathing room */}
      <div className="relative flex flex-col items-center justify-start min-h-full py-6 px-4 md:justify-center md:py-10">

        {/* Close button — top right corner on all devices */}
        <button 
          onClick={onClose} 
          className="fixed top-4 right-4 z-[110] p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          aria-label="Close Preview"
        >
          <X size={24} weight="bold" />
        </button>

        {/* Card — fluid width, capped for larger screens */}
        <div className="relative w-full max-w-xs sm:max-w-sm animation-scale-up mt-8 md:mt-0">

          {/* ID Card */}
          <div className="relative w-full bg-[#f9fafb] rounded-[20px] overflow-hidden shadow-2xl border-t-8 border-saffron shadow-black/40">

            {/* Header */}
            <div className="h-14 bg-white flex items-center justify-center px-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="w-7 h-7 rounded-full border border-saffron/20" />
                <span className="font-bold text-dark text-sm tracking-tight uppercase">HinduVahini Trust</span>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 pt-5 pb-3 flex flex-col items-center text-center">

              {/* Photo */}
              <div className="mb-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[5px] border-white shadow-lg overflow-hidden ring-1 ring-saffron/10">
                  <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Info */}
              <div className="mb-4 w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-dark mb-0.5 font-heading leading-tight">{leader.name}</h2>
                <p className="text-saffron font-bold text-[10px] uppercase tracking-widest mb-0.5">{leader.role}</p>
                {leader.designation && (
                  <p className="text-gray-500 text-[11px] font-semibold mb-2">{leader.designation}</p>
                )}
                
                <div className="w-6 h-0.5 bg-saffron/20 mx-auto rounded-full mb-3" />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-gray-500">
                    <IdentificationCard size={15} weight="duotone" className="text-saffron shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter opacity-60">Membership ID</span>
                    <span className="text-[10px] font-mono font-bold text-dark">{memberId}</span>
                  </div>
                  {leader.phone && (
                    <div className="flex items-center justify-center gap-1.5 text-gray-500">
                      <Phone size={15} weight="duotone" className="text-saffron shrink-0" />
                      <span className="text-[11px] font-bold text-dark">{leader.phone}</span>
                    </div>
                  )}
                  {/* Location */}
                  {isNational ? (
                    <div className="flex items-center justify-center">
                      <span className="text-[9px] bg-orange-50 text-orange-600 font-bold px-3 py-0.5 rounded-full uppercase tracking-wide border border-orange-200">
                        🇮🇳 National Leadership
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <MapPin size={11} className="text-saffron shrink-0" weight="fill" />
                      <span className="text-[11px] font-bold text-gray-600">
                        {leader.district ? `${leader.district}, ` : ''}{leader.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-1 border-t border-gray-100 w-full pt-3 pb-2">
                <QRCodeSection url={shareUrl} />
                <p className="text-[8px] text-gray-400 font-semibold uppercase tracking-widest mt-1">
                  Scan to view official profile
                </p>
              </div>

              {/* Watermark */}
              <div className="opacity-10 pointer-events-none select-none absolute bottom-14 right-0 rotate-[-15deg]">
                <img src="/logo.png" alt="Watermark" className="w-24 h-24" />
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="bg-saffron/10 border-t border-saffron/10 py-2.5 flex items-center justify-center">
              <span className="text-[8px] font-bold text-saffron uppercase tracking-[3px]">Unity • Dharma • Service</span>
            </div>
          </div>

          {/* Share Bar */}
          <div className="mt-5 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-3 rounded-full flex items-center justify-center gap-3 shadow-2xl">
            <div className="hidden sm:flex items-center gap-1.5 text-white/70 border-r border-white/10 pr-4 mr-1">
              <ShareNetwork size={17} weight="bold" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Share ID</span>
            </div>

            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full font-bold text-xs transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-dark hover:bg-saffron hover:text-white shadow-md'}`}
            >
              {copied ? <Check size={15} weight="bold" /> : <Copy size={15} weight="bold" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>

            <button 
              onClick={shareOnWhatsApp}
              className="flex items-center justify-center bg-[#25D366] text-white p-2.5 rounded-full hover:scale-110 active:scale-95 transition-all shadow-md"
              title="Share on WhatsApp"
            >
              <WhatsappLogo size={20} weight="fill" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lazy-loaded QR Code
function QRCodeSection({ url }) {
  const [QRCodeSVG, setQRCodeSVG] = useState(null);

  useEffect(() => {
    import('qrcode.react').then(mod => setQRCodeSVG(() => mod.QRCodeSVG));
  }, []);

  if (!QRCodeSVG) return <div className="w-16 h-16 bg-gray-100 rounded-lg animate-pulse" />;

  return (
    <QRCodeSVG
      value={url}
      size={64}
      bgColor="#ffffff"
      fgColor="#1a1a1a"
      level="H"
      imageSettings={{
        src: '/logo.png',
        height: 14,
        width: 14,
        excavate: true,
      }}
    />
  );
}
