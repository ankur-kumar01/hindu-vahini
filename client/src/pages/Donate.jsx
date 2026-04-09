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
    <div className="pt-24 min-h-screen bg-light">
      <SEO 
        title="Support Our Mission" 
        description="Your contribution empowers HinduVahini to protect cultural heritage and uplift communities. Make a direct impact via secure UPI donation."
        url="/donate"
      />

      {/* Page Hero */}
      <section className="bg-dark py-20 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-saffron/10 opacity-30"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-heading text-white">Support the <span className="text-saffron">Cultural Renaissance</span></h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Your generous contributions directly fund our educational programs, community welfare initiatives, and heritage preservation projects across the nation.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center gap-16">
        
        {/* TOP: Payment Card (Priority) */}
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden animation-slide-up">
           <div className="bg-saffron p-8 text-white text-center relative">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-white/20">
                 <img src="/logo.png" alt="Logo" className="w-12 h-12 object-cover rounded-full" />
              </div>
              <h2 className="text-2xl font-bold font-heading leading-tight">{trustName}</h2>
              <p className="text-white/80 text-xs mt-1 font-semibold tracking-wider uppercase">Direct UPI Donation Portal</p>
           </div>

           <div className="p-10 text-center">
              {/* Preset Amounts */}
              <div className="flex justify-between gap-3 mb-8">
                {['50', '200'].map((amt) => (
                  <button 
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`flex-1 py-3 px-2 rounded-xl border-2 font-bold transition-all ${amount === amt ? 'bg-saffron border-saffron text-white shadow-lg' : 'border-gray-100 text-gray-500 hover:border-saffron/40'}`}
                  >
                    ₹{amt}
                  </button>
                ))}
                <button 
                    onClick={() => setAmount('')}
                    className="flex-1 py-3 px-2 rounded-xl border-2 font-bold transition-all border-dark/10 text-dark/60 hover:border-dark/40"
                  >
                    Custom
                </button>
              </div>

              {/* Amount Input */}
              <div className="mb-8">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Donation Amount</label>
                <div className="relative inline-block w-full">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-300">₹</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full text-4xl font-bold text-dark text-center py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-saffron focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-6 rounded-3xl inline-block shadow-inner border border-gray-100 mb-8">
                {amount > 0 ? (
                  <QRCodeCanvas 
                    value={upiUri} 
                    size={220}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "/logo.png",
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }}
                  />
                ) : (
                  <div className="w-[220px] h-[220px] flex items-center justify-center text-gray-400 font-medium italic animate-pulse">
                    Please enter an amount <br/> to generate your QR
                  </div>
                )}
              </div>

              {/* UPI ID Copy */}
              <div className="flex items-center justify-center gap-3 mb-10">
                <div className="bg-light px-5 py-3 rounded-xl border border-gray-100 text-sm font-mono text-gray-600 select-all">
                  {upiId}
                </div>
                <button 
                  onClick={copyUpiId}
                  className={`p-3 rounded-xl transition-all shadow-sm ${copiedId ? 'bg-green-500 text-white' : 'bg-saffron/10 text-saffron hover:bg-saffron/20'}`}
                >
                  {copiedId ? <Check size={24} weight="bold" /> : <Copy size={24} weight="bold" />}
                </button>
              </div>

              <div className="space-y-4">
                <a 
                  href={upiUri} 
                  className={`w-full py-5 rounded-full font-bold text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${amount > 0 ? 'bg-dark hover:bg-dark/90 shadow-dark/20' : 'bg-gray-300 pointer-events-none'}`}
                >
                  Complete in your UPI App
                </a>
                <p className="text-[11px] text-gray-400 italic leading-relaxed px-4">
                  100% Secure Transaction. We do not store any bank details.
                </p>
              </div>
           </div>
        </div>

        {/* BOTTOM: Info & Trust Message */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-soft border-l-[6px] border-saffron h-full">
            <h2 className="text-2xl font-bold text-dark mb-6">Why Your Support Matters</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                HinduVahini is committed to a self-reliant and culturally rooted society. Every contribution, no matter the size, helps us maintain our independence and transparency in service.
              </p>
              <div className="grid grid-cols-1 gap-4 pt-2">
                <div className="bg-light p-4 rounded-xl">
                  <h4 className="font-bold text-dark text-sm mb-1">Transparency</h4>
                  <p className="text-xs">100% of your donation goes directly to field programs.</p>
                </div>
                <div className="bg-light p-4 rounded-xl">
                  <h4 className="font-bold text-dark text-sm mb-1">Cultural Impact</h4>
                  <p className="text-xs">We focus on sustainability of traditional arts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-soft h-full flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
              <ShareNetwork size={32} className="text-saffron" />
              Spread the Word
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm">
              A single share can go a long way. Share this donation page with your family and friends.
            </p>
            <div className="flex flex-col gap-4">
                <button 
                  onClick={shareOnWhatsApp}
                  className="w-full flex items-center justify-center gap-3 bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-all shadow-md active:scale-95"
                >
                  <WhatsappLogo size={24} weight="bold" /> Share on WhatsApp
                </button>
                <button 
                  onClick={copyPageLink}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold transition-all shadow-md active:scale-95 ${copiedLink ? 'bg-indigo-600 text-white' : 'bg-dark text-white hover:bg-dark/90'}`}
                >
                  {copiedLink ? <Check size={24} weight="bold" /> : <LinkIcon size={24} weight="bold" />}
                  {copiedLink ? 'Link Copied!' : 'Copy Page Link'}
                </button>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
