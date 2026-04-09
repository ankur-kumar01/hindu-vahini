import { QRCodeCanvas } from 'qrcode.react';
import { X, WhatsappLogo, Check, Copy } from '@phosphor-icons/react';
import { useState } from 'react';

export default function DonationModal({ isOpen, onClose, initialAmount }) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm fade-in" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animation-slide-up">
        
        {/* Header */}
        <div className="bg-saffron p-6 text-white text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} weight="bold" />
          </button>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
             <img src="/logo.png" alt="Logo" className="w-12 h-12 object-cover rounded-full" />
          </div>
          <h2 className="text-2xl font-bold font-heading">{trustName}</h2>
          <p className="text-white/90 text-sm mt-1">Support the Cultural Renaissance</p>
        </div>

        {/* Amount Input */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Contribution Amount</label>
            <div className="relative inline-block w-full max-w-[200px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">₹</span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full text-4xl font-bold text-dark text-center py-2 bg-transparent border-b-2 border-gray-100 focus:border-saffron outline-none transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-light p-6 rounded-2xl inline-block shadow-inner mb-6 border border-gray-50">
            {amount > 0 ? (
              <QRCodeCanvas 
                value={upiUri} 
                size={200}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: "/logo.png",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-400 font-medium italic">
                Enter amount to <br/> generate QR
              </div>
            )}
          </div>

          {/* UPI ID Copy */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <code className="bg-gray-50 px-4 py-2 rounded-lg text-sm font-mono text-gray-600 border border-gray-100">{upiId}</code>
            <button 
              onClick={copyToClipboard}
              className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'bg-saffron/10 text-saffron hover:bg-saffron/20'}`}
            >
              {copied ? <Check size={20} weight="bold" /> : <Copy size={20} weight="bold" />}
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
             <a 
               href={upiUri} 
               className={`py-4 rounded-full font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${amount > 0 ? 'bg-dark hover:bg-dark/90' : 'bg-gray-300 pointer-events-none'}`}
             >
               Pay with UPI App
             </a>
             <p className="text-[10px] text-gray-400 px-4 mt-2 italic leading-relaxed">
               Secure payment via Unified Payments Interface. Your contribution goes directly to the Trust's social welfare foundation.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
