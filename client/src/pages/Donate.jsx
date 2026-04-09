import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Check, Copy, ShareNetwork, WhatsappLogo, Link as LinkIcon } from '@phosphor-icons/react';
import SEO from '../components/SEO';

export default function Donate() {
  const [amount, setAmount] = useState('50');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const upiId = "9935568569m@pnb";
  const trustName = "Hindu Vahini Trust";
  const pageUrl = "https://hinduvahini.online/donate";

  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(trustName)}&am=${amount}&cu=INR`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const text = `Join me in supporting HinduVahini Trust to preserve our cultural heritage. Make a direct contribution here: ${pageUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-light">
      <SEO 
        title="Support Our Mission" 
        description="Your contribution empowers HinduVahini to protect cultural heritage and uplift communities. Make a direct impact via secure UPI donation."
        url="/donate"
      />

      {/* Page Hero - Responsive padding and text */}
      <section className="bg-dark py-16 md:py-24 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-saffron/10 opacity-30"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 font-heading text-white leading-tight">
            Support the <span className="text-saffron">Cultural Renaissance</span>
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed px-2">
            Your generous contributions directly fund our educational programs, community welfare initiatives, and heritage preservation projects across the nation.
          </p>
        </div>
      </section>

      {/* Main Content Area - Responsive gap and padding */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 flex flex-col items-center gap-12 md:gap-16">
        
        {/* TOP: Payment Card (Priority) - Responsive width and padding */}
        <div className="w-full max-w-[440px] bg-white rounded-[24px] md:rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animation-slide-up">
           <div className="bg-saffron p-6 md:p-8 text-white text-center relative">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg border-2 border-white/20">
                 <img src="/logo.png" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-heading leading-tight">{trustName}</h2>
              <p className="text-white/80 text-[10px] md:text-xs mt-1 font-semibold tracking-wider uppercase">Direct UPI Donation Portal</p>
           </div>

           <div className="p-6 md:p-10 text-center">
              {/* Preset Amounts - Better mobile spacing */}
              <div className="flex flex-wrap justify-between gap-2 md:gap-3 mb-8">
                {['50', '200'].map((amt) => (
                  <button 
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-bold transition-all text-sm md:text-base ${amount === amt ? 'bg-saffron border-saffron text-white shadow-lg' : 'border-gray-100 text-gray-500 hover:border-saffron/40'}`}
                  >
                    ₹{amt}
                  </button>
                ))}
                <button 
                    onClick={() => setAmount('')}
                    className="flex-1 py-3 px-2 rounded-xl border-2 font-bold transition-all border-dark/10 text-dark/60 hover:border-dark/40 text-sm md:text-base"
                  >
                    Custom
                </button>
              </div>

              {/* Amount Input - Responsive text size */}
              <div className="mb-8">
                <label className="block text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Donation Amount</label>
                <div className="relative inline-block w-full">
                  <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-2xl md:text-3xl font-bold text-gray-300">₹</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full text-3xl md:text-4xl font-bold text-dark text-center py-3 md:py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-saffron focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* QR Code Container - Scalable size */}
              <div className="bg-white p-4 md:p-6 rounded-3xl inline-block shadow-inner border border-gray-100 mb-8 mx-auto">
                {amount > 0 ? (
                  <QRCodeCanvas 
                    value={upiUri} 
                    size={window.innerWidth < 640 ? 180 : 220}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "/logo.png",
                      x: undefined,
                      y: undefined,
                      height: window.innerWidth < 640 ? 40 : 48,
                      width: window.innerWidth < 640 ? 40 : 48,
                      excavate: true,
                    }}
                  />
                ) : (
                  <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] flex items-center justify-center text-gray-400 text-sm font-medium italic animate-pulse">
                    Enter amount <br/> to generate QR
                  </div>
                )}
              </div>

              {/* UPI ID Copy - Compact on mobile */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                <div className="w-full sm:w-auto bg-light px-4 py-2.5 rounded-xl border border-gray-100 text-[11px] md:text-sm font-mono text-gray-600 truncate max-w-full">
                  {upiId}
                </div>
                <button 
                  onClick={copyUpiId}
                  className={`w-full sm:w-auto p-2.5 md:p-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${copiedId ? 'bg-green-500 text-white' : 'bg-saffron/10 text-saffron hover:bg-saffron/20'}`}
                >
                  {copiedId ? <Check size={20} weight="bold" /> : <Copy size={20} weight="bold" />}
                  <span className="sm:hidden font-bold text-xs uppercase tracking-wider">{copiedId ? 'Copied' : 'Copy UPI ID'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <a 
                  href={upiUri} 
                  className={`w-full py-4 md:py-5 rounded-full font-bold text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base ${amount > 0 ? 'bg-dark hover:bg-dark/90 shadow-dark/20' : 'bg-gray-300 pointer-events-none'}`}
                >
                  Pay Securely Via UPI
                </a>
                <p className="text-[10px] md:text-[11px] text-gray-400 italic leading-relaxed px-4">
                  100% Secure Transaction. We do not store bank details.
                </p>
              </div>
           </div>
        </div>

        {/* BOTTOM: Info & Trust Message - Stacks elegantly */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white p-7 md:p-10 rounded-[24px] md:rounded-[32px] shadow-soft border-l-[6px] border-saffron h-full">
            <h2 className="text-xl md:text-2xl font-bold text-dark mb-4 md:mb-6">Why Your Support Matters</h2>
            <div className="space-y-4 md:space-y-6 text-sm md:text-base text-gray-600 leading-relaxed">
              <p>
                HinduVahini is committed to a self-reliant and culturally rooted society. Every contribution helps us maintain our independence.
              </p>
              <div className="grid grid-cols-1 gap-3 pt-2">
                <div className="bg-light p-4 rounded-xl">
                  <h4 className="font-bold text-dark text-xs md:text-sm mb-1 uppercase tracking-wide">Transparency</h4>
                  <p className="text-[11px] md:text-xs text-gray-500">100% of your donation goes directly to field programs.</p>
                </div>
                <div className="bg-light p-4 rounded-xl">
                  <h4 className="font-bold text-dark text-xs md:text-sm mb-1 uppercase tracking-wide">Cultural Impact</h4>
                  <p className="text-[11px] md:text-xs text-gray-500">We focus on sustainability of traditional arts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 md:p-10 rounded-[24px] md:rounded-[32px] shadow-soft h-full flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-bold text-dark mb-4 flex items-center gap-3">
              <ShareNetwork size={28} className="text-saffron" />
              Spread the Word
            </h3>
            <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base max-w-sm">
              A single share can go a long way. Share this donation page with your family and friends.
            </p>
            <div className="flex flex-col gap-3 md:gap-4">
                <button 
                  onClick={shareOnWhatsApp}
                  className="w-full flex items-center justify-center gap-3 bg-green-500 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold hover:bg-green-600 transition-all shadow-md active:scale-95 text-sm md:text-base"
                >
                  <WhatsappLogo size={20} md:size={24} weight="bold" /> Share on WhatsApp
                </button>
                <button 
                  onClick={copyPageLink}
                  className={`w-full flex items-center justify-center gap-3 px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold transition-all shadow-md active:scale-95 text-sm md:text-base ${copiedLink ? 'bg-indigo-600 text-white' : 'bg-dark text-white hover:bg-dark/90'}`}
                >
                  {copiedLink ? <Check size={20} md:size={24} weight="bold" /> : <LinkIcon size={20} md:size={24} weight="bold" />}
                  {copiedLink ? 'Link Copied!' : 'Copy Page Link'}
                </button>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
