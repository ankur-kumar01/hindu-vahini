import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Check, 
  Copy, 
  ShareNetwork, 
  WhatsappLogo, 
  Link as LinkIcon, 
  HandHeart, 
  ShoppingCart, 
  Megaphone, 
  Plus, 
  Minus,
  SealCheck,
  WarningCircle,
  CurrencyInr,
  XCircle,
  Camera
} from '@phosphor-icons/react';
import SEO from '../components/SEO';

export default function Donate() {
  const location = useLocation();
  const [mode, setMode] = useState('general'); // 'general' or 'mission'
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState('50');
  
  // Verification Form State
  const [step, setStep] = useState(1); // 1: Payment, 2: Verification
  const [donorName, setDonorName] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const upiId = "9935568569m@pnb";
  const trustName = "Hindu Vahini Trust";
  const pageUrl = "https://hinduvahini.online/donate";

  useEffect(() => {
    fetchCampaigns();
    // Handle pre-selected data from CampaignDetail
    if (location.state?.campaign) {
      setMode('mission');
      setSelectedCampaign(location.state.campaign);
      if (location.state.item) {
        setSelectedItem(location.state.item);
        setAmount(location.state.item.price_per_unit);
      }
    }
  }, [location]);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error('Failed to fetch campaigns', err);
    }
  };

  const calculateTotal = () => {
    if (selectedItem) return (selectedItem.price_per_unit * quantity).toString();
    return amount;
  };

  const totalAmount = calculateTotal();
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(trustName)}&am=${totalAmount}&cu=INR`;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'general') {
      setSelectedCampaign(null);
      setSelectedItem(null);
      setAmount('50');
    }
    setStep(1);
    setProofImage(null);
    setProofPreview(null);
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedItem(null);
    setAmount('500');
    setStep(1);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setStep(1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearProof = () => {
    setProofImage(null);
    setProofPreview(null);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!donorName || !proofImage) {
      alert('Please provide your name and upload a Payment Screenshot.');
      return;
    }
    
    setSubmitting(true);
    const formData = new FormData();
    formData.append('donor_name', donorName);
    formData.append('amount', totalAmount);
    formData.append('campaign_id', selectedCampaign?.id || '');
    formData.append('proof_image', proofImage);

    try {
      const res = await fetch('/api/donations/verify', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Submission failed. Please try again.');
      }
    } catch (err) {
      alert('Error submitting verification.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-light pb-20">
      <SEO 
        title="Contribute to the Cause" 
        description="Support our mission-driven welfare campaigns through direct UPI contribution and item-based sponsorship."
        url="/donate"
      />

      <section className="bg-dark py-16 md:py-24 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-saffron/10 opacity-30"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-heading text-white">
            Support the <span className="text-saffron">Welfare Mission</span>
          </h1>
          <p className="text-sm md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Your contribution directly impacts ground-level initiatives. Choose a specific mission or support the general trust fund.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-10 md:-mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Selection Area */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mode Switcher */}
            <div className="bg-white p-2 rounded-[28px] shadow-xl flex gap-2 border border-gray-100">
                <button 
                  onClick={() => handleModeChange('general')}
                  className={`flex-1 py-4 px-6 rounded-[22px] font-bold transition-all flex items-center justify-center gap-3 ${mode === 'general' ? 'bg-saffron text-white shadow-lg shadow-saffron/20' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <HandHeart size={20} weight={mode === 'general' ? 'fill' : 'bold'} />
                  General Support
                </button>
                <button 
                  onClick={() => handleModeChange('mission')}
                  className={`flex-1 py-4 px-6 rounded-[22px] font-bold transition-all flex items-center justify-center gap-3 ${mode === 'mission' ? 'bg-saffron text-white shadow-lg shadow-saffron/20' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <Megaphone size={20} weight={mode === 'mission' ? 'fill' : 'bold'} />
                  Contribute to Mission
                </button>
            </div>

            {mode === 'mission' && (
              <div className="space-y-6 animation-slide-up">
                {/* Mission List */}
                <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-100">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Choose Active Mission</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaigns.map(camp => (
                      <button 
                        key={camp.id}
                        onClick={() => handleCampaignSelect(camp)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${selectedCampaign?.id === camp.id ? 'border-saffron bg-saffron/5 ring-4 ring-saffron/5' : 'border-gray-50 bg-gray-50/50 hover:bg-white hover:border-saffron/20'}`}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                          <img src={camp.image_url || '/placeholder-banner.jpg'} className="w-full h-full object-cover" />
                        </div>
                        <span className={`font-bold text-sm leading-tight ${selectedCampaign?.id === camp.id ? 'text-dark' : 'text-gray-500'}`}>{camp.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Item List (if mission selected) */}
                {selectedCampaign && (
                  <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-100 animation-slide-up">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Contribution Options</h3>
                    {selectedCampaign.items?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleItemSelect(null)}
                          className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${!selectedItem ? 'border-saffron bg-saffron/5 ring-4 ring-saffron/5' : 'border-gray-50 hover:border-saffron/20'}`}
                        >
                           <CurrencyInr size={32} className={!selectedItem ? 'text-saffron' : 'text-gray-300'} weight="bold" />
                           <span className="font-bold text-sm text-dark">Any Amount</span>
                        </button>
                        {selectedCampaign.items.map(item => (
                          <button 
                            key={item.id}
                            onClick={() => handleItemSelect(item)}
                            className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${selectedItem?.id === item.id ? 'border-saffron bg-saffron/5 ring-4 ring-saffron/5' : 'border-gray-50 hover:border-saffron/20'}`}
                          >
                             <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <ShoppingCart size={24} className="text-gray-300" />}
                             </div>
                             <div className="text-left">
                               <p className="font-bold text-xs text-dark leading-tight">{item.item_name}</p>
                               <p className="text-[10px] font-black text-saffron uppercase mt-1">₹{item.price_per_unit} / {item.unit_name}</p>
                             </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic py-4">Direct amount donation only for this mission.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Amount / Quantity Control */}
            <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-100">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Contribution Details</h3>
               
               {selectedItem ? (
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-light rounded-2xl">
                    <div className="text-center sm:text-left">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Set Quantity</p>
                       <p className="text-xl font-bold text-dark">{selectedItem.item_name}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-100">
                       <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg">
                          <Minus size={20} weight="bold" />
                       </button>
                       <span className="w-10 text-center text-3xl font-black text-saffron">{quantity}</span>
                       <button onClick={() => setQuantity(q => q + 1)} className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg">
                          <Plus size={20} weight="bold" />
                       </button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                       {['50', '200', '500', '1000'].map(amt => (
                         <button 
                          key={amt}
                          onClick={() => setAmount(amt)}
                          className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all text-sm ${amount === amt ? 'bg-dark border-dark text-white ring-4 ring-dark/10' : 'border-gray-50 text-gray-500 hover:border-saffron/30'}`}
                         >
                          ₹{amt}
                         </button>
                       ))}
                    </div>
                    <div className="relative">
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-200">₹</span>
                       <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-light border-2 border-transparent focus:bg-white focus:border-saffron py-6 px-12 rounded-2xl text-4xl font-black text-dark outline-none transition-all"
                       />
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* RIGHT: QR & Verification Portal */}
          <div className="lg:col-span-5 sticky top-32">
             <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-saffron p-8 text-white text-center">
                   <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/70 mb-2">Checkout Portal</h4>
                   <p className="text-3xl font-black text-white tracking-tighter">₹{totalAmount.toLocaleString()}</p>
                </div>

                <div className="p-8">
                   {submitted ? (
                     <div className="py-12 text-center animation-scale-in">
                        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                           <Check size={40} weight="bold" />
                        </div>
                        <h4 className="text-2xl font-bold text-dark mb-2">Thank You, Donor!</h4>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">Your payment proof has been submitted. It will reflect on the mission tracker once verified.</p>
                        <button onClick={() => setSubmitted(false)} className="text-saffron font-bold underline">Make another contribution</button>
                     </div>
                   ) : step === 1 ? (
                     <div className="text-center animation-slide-up">
                        <div className="bg-white p-6 rounded-[32px] inline-block shadow-inner border border-gray-100 mb-8 mx-auto">
                            <QRCodeCanvas 
                              value={upiUri} 
                              size={200}
                              level="H"
                              includeMargin={true}
                              imageSettings={{
                                src: "/logo.png",
                                x: undefined, y: undefined, height: 40, width: 40, excavate: true,
                              }}
                            />
                        </div>
                        
                        <div className="bg-light p-4 rounded-2xl mb-8 flex items-center justify-between gap-4">
                           <code className="text-xs font-bold text-gray-500 truncate">{upiId}</code>
                           <button onClick={copyUpiId} className={`p-2 rounded-lg transition-all ${copiedId ? 'bg-green-500 text-white' : 'bg-white text-saffron shadow-sm'}`}>
                             {copiedId ? <Check size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
                           </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <a 
                              href={upiUri}
                              className="w-full bg-saffron hover:bg-saffron/90 text-white font-bold py-5 rounded-3xl shadow-xl shadow-saffron/20 transition-all active:scale-95 text-lg flex items-center justify-center gap-3"
                            >
                              <CheckCircle size={24} weight="fill" /> Pay Via UPI App
                            </a>
                            <button 
                              onClick={() => setStep(2)}
                              className="w-full bg-dark hover:bg-dark/90 text-white font-bold py-5 rounded-3xl shadow-xl transition-all active:scale-95 text-lg flex items-center justify-center gap-3"
                            >
                              I Have Paid <CheckCircle size={24} weight="fill" />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-4 leading-relaxed flex items-center justify-center gap-1">
                          <SealCheck size={14} className="text-green-500" weight="fill" /> Secure SSL Encrypted UPI Gateway
                        </p>
                     </div>
                   ) : (
                     <div className="animation-slide-up">
                        <div className="flex items-center gap-3 mb-6">
                           <WarningCircle size={28} className="text-saffron" weight="fill" />
                           <h4 className="text-xl font-bold text-dark">Verify Payment</h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-8 leading-relaxed">Please provide your name and **attach a screenshot** of your payment for verification.</p>
                        
                        <form onSubmit={handleVerifySubmit} className="space-y-6">
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                              <input 
                                type="text"
                                required
                                value={donorName}
                                onChange={e => setDonorName(e.target.value)}
                                placeholder="E.g. Ashwani Mishra"
                                className="w-full bg-light border-2 border-transparent focus:border-saffron py-4 px-5 rounded-2xl text-sm font-bold text-dark outline-none transition-all"
                              />
                           </div>

                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Screenshot</label>
                              <div className="relative h-40 bg-light rounded-3xl border-2 border-dashed border-gray-200 focus-within:border-saffron overflow-hidden flex items-center justify-center transition-all">
                                 {proofPreview ? (
                                   <>
                                     <img src={proofPreview} className="w-full h-full object-cover" />
                                     <button type="button" onClick={clearProof} className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg">
                                       <XCircle size={18} weight="bold" />
                                     </button>
                                   </>
                                 ) : (
                                   <div className="flex flex-col items-center gap-2 text-gray-400">
                                      <Camera size={32} weight="light" />
                                      <span className="text-[10px] font-bold uppercase tracking-widest">Tap to Upload Receipt</span>
                                   </div>
                                 )}
                                 <input type="file" required onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                              </div>
                           </div>
                           
                           <div className="pt-2 flex flex-col gap-3">
                              <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-saffron hover:bg-saffron/90 text-white font-bold py-5 rounded-3xl shadow-xl shadow-saffron/20 transition-all flex items-center justify-center gap-3"
                              >
                                {submitting ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Confirm & Submit'}
                              </button>
                              <button type="button" onClick={() => setStep(1)} className="text-[11px] font-bold text-gray-400 hover:text-dark transition-colors">← Back to QR Code</button>
                           </div>
                        </form>
                     </div>
                   )}
                </div>
             </div>
          </div>

        </div>
      </section>
    </div>
  );
}

function CheckCircle({ size, weight, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" className={className}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>
    </svg>
  );
}
