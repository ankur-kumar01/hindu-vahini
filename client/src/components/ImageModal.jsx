import { X, Copy, WhatsappLogo, Check, ShareNetwork } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

export default function ImageModal({ image, onClose }) {
  const [copied, setCopied] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (image) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [image]);

  if (!image) return null;

  const shareUrl = `${window.location.origin}/gallery?img=${encodeURIComponent(image)}`;
  const shareText = `Check out this highlight from HinduVahini Journey:`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Overlay/Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/95 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
        onClick={onClose}
      ></div>
      
      {/* Close Button - Fixed to viewport */}
      <button 
        onClick={onClose} 
        className="fixed top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-black/40 hover:bg-black/60 rounded-full text-white hover:text-saffron transition-colors z-[110] pointer-events-auto shadow-xl"
        aria-label="Close Preview"
      >
        <X size={24} className="md:w-8 md:h-8" weight="bold" />
      </button>

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-full flex flex-col items-center justify-center animation-scale-up pointer-events-none">

        {/* Image Container */}
        <div className="relative bg-dark/20 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto mb-6">
          <img 
            src={image} 
            alt="Full size preview" 
            className="w-full h-auto max-h-[75vh] md:max-h-[80vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>

        {/* Action Bar - Glassmorphism */}
        <div className="pointer-events-auto bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-full flex items-center gap-6 shadow-2xl animation-slide-up">
          <div className="hidden md:flex items-center gap-2 text-white/70 mr-2 border-r border-white/10 pr-6">
            <ShareNetwork size={20} weight="bold" />
            <span className="text-xs font-bold uppercase tracking-widest">Share Image</span>
          </div>

          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-dark hover:bg-saffron hover:text-white'}`}
          >
            {copied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          <button 
            onClick={shareOnWhatsApp}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <WhatsappLogo size={18} weight="fill" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
