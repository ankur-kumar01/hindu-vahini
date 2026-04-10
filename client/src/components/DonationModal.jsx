import { QRCodeCanvas } from 'qrcode.react';
import { X, Check, Copy } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';

export default function DonationModal({ isOpen, onClose, initialAmount }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  const [amount, setAmount] = useState(initialAmount || '');
  const [copied, setCopied] = useState(false);
  const upiId = "9935568569m@pnb";
  const trustName = "Hindu Vahini Trust";

  if (!isOpen) return null;

  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(trustName)}&am=${amount}&cu=INR`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm fade-in" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-sm rounded-[28px] shadow-2xl overflow-y-auto max-h-[90vh] animation-slide-up">
        
        {/* Header - Scaled down */}
        <div className="bg-saffron p-5 text-white text-center relative">
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} weight="bold" />
          </button>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
             <img src="/logo.png" alt="Logo" className="w-9 h-9 object-cover rounded-full" />
          </div>
          <h2 className="text-xl font-bold font-heading leading-tight">{trustName}</h2>
          <p className="text-white/80 text-[10px] mt-0.5 uppercase tracking-wider font-semibold">Unity & Preservation</p>
        </div>

        {/* Amount Input - More compact */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Enter Amount</label>
            <div className="relative inline-block w-full max-w-[160px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₹</span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full text-3xl font-bold text-dark text-center py-1 bg-transparent border-b-2 border-gray-100 focus:border-saffron outline-none transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* QR Code - Smaller size for responsiveness */}
          <div className="bg-light p-4 rounded-xl inline-block shadow-inner mb-5 border border-gray-50">
            {amount > 0 ? (
              <QRCodeCanvas 
                value={upiUri} 
                size={160}
                level="M"
                includeMargin={true}
                imageSettings={{
                  src: "/logo.png",
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  excavate: true,
                }}
              />
            ) : (
              <div className="w-[160px] h-[160px] flex items-center justify-center text-gray-400 text-xs font-medium italic leading-tight p-4">
                Enter amount above <br/> to generate QR
              </div>
            )}
          </div>

          {/* UPI ID Copy - Compacted */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <code className="bg-gray-50 px-3 py-1.5 rounded-lg text-[11px] font-mono text-gray-500 border border-gray-100">{upiId}</code>
            <button 
              onClick={copyToClipboard}
              className={`p-1.5 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'bg-saffron/10 text-saffron hover:bg-saffron/20'}`}
            >
              {copied ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
             <a 
               href={upiUri} 
               className={`py-3.5 rounded-full text-sm font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${amount > 0 ? 'bg-dark hover:bg-dark/90' : 'bg-gray-300 pointer-events-none'}`}
             >
               Pay securely via UPI
             </a>
             <p className="text-[9px] text-gray-400 px-2 mt-1 leading-[1.4] italic">
               Secure direct transfer to our welfare foundation.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
