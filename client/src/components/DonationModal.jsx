import { QRCodeCanvas } from 'qrcode.react';
import { X, Check, Copy, PaperPlaneTilt, Plus, Minus, Info, Camera, XCircle } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';

export default function DonationModal({ 
  isOpen, 
  onClose, 
  initialAmount, 
  campaignItem = null, 
  campaignId = null, 
  campaignTitle = null 
}) {
  const [amount, setAmount] = useState(initialAmount || '');
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState(1); // 1: QR/Payment, 2: Details
  const [donorName, setDonorName] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiId = "9935568569m@pnb";
  const trustName = "Hindu Vahini Trust";

  // Handle quantity changes for item sponsorship
  useEffect(() => {
    if (campaignItem) {
      setAmount(campaignItem.price_per_unit * quantity);
    } else if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [quantity, campaignItem, initialAmount]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setIsSuccess(false);
      setDonorName('');
      setProofImage(null);
      setProofPreview(null);
      setQuantity(1);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(trustName)}&am=${amount}&cu=INR`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!donorName || !proofImage) {
      alert('Please provide your name and upload a Payment Screenshot.');
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('donor_name', donorName);
    formData.append('amount', amount);
    formData.append('campaign_id', campaignId || '');
    formData.append('proof_image', proofImage);

    try {
      const res = await fetch('/api/donations/verify', {
          method: 'POST',
          body: formData
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Submission failed');
      }
      setIsSuccess(true);
      setTimeout(() => onClose(), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm transition-opacity" onClick={() => !isSubmitting && onClose()}></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-y-auto max-h-[90vh] transition-all">
        
        {/* Header */}
        <div className="bg-saffron p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10">
            <X size={20} weight="bold" />
          </button>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg relative z-10 border-2 border-white/20">
             <img src="/logo.png" alt="Logo" className="w-10 h-10 object-cover rounded-full" />
          </div>
          <h2 className="text-xl font-bold font-heading leading-tight relative z-10">
            {isSuccess ? 'Contribution Received!' : (campaignTitle || trustName)}
          </h2>
          {campaignItem && !isSuccess && (
            <p className="text-white/80 text-[10px] mt-1 uppercase tracking-widest font-bold bg-black/10 inline-block px-3 py-1 rounded-full relative z-10">
               Contribution for: {campaignItem.item_name}
            </p>
          )}
        </div>

        {isSuccess ? (
            <div className="p-10 text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 scale-in">
                    <Check size={40} weight="bold" />
                </div>
                <h3 className="text-xl font-bold text-dark italic">Thank You for Your Support!</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium px-4">
                    Your contribution proof has been received. We will verify your transaction and update the mission progress shortly.
                </p>
            </div>
        ) : step === 1 ? (
            <div className="p-6 text-center">
                {/* Mode 1: Item Sponsorship Quantity */}
                {campaignItem && (
                    <div className="mb-8 p-4 bg-light rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Quantity</p>
                            <p className="font-bold text-dark">₹{campaignItem.price_per_unit} / {campaignItem.unit_name}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                             <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-gray-50 text-gray-400 rounded-lg">
                                <Minus size={14} weight="bold" />
                             </button>
                             <span className="w-8 text-lg font-bold text-saffron">{quantity}</span>
                             <button onClick={() => setQuantity(q => q + 1)} className="p-2 hover:bg-gray-50 text-gray-400 rounded-lg">
                                <Plus size={14} weight="bold" />
                             </button>
                        </div>
                    </div>
                )}

                {/* Amount Display */}
                <div className="mb-6">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Amount</label>
                    <div className="relative inline-block w-full max-w-[200px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-bold text-saffron opacity-40">₹</span>
                        <input 
                            type="number" 
                            disabled={!!campaignItem}
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className={`w-full text-4xl font-black text-dark text-center py-2 bg-transparent border-b-2 outline-none transition-all ${campaignItem ? 'border-transparent' : 'border-gray-100 focus:border-saffron'}`}
                            autoFocus={!campaignItem}
                        />
                    </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-5 rounded-[32px] inline-block shadow-soft border border-gray-50 mb-6 group">
                    {amount > 0 ? (
                        <div className="relative">
                            <QRCodeCanvas value={upiUri} size={180} level="H" includeMargin={true} imageSettings={{ src: "/logo.png", height: 36, width: 36, excavate: true }} />
                            <div className="absolute inset-0 border-4 border-saffron/10 rounded-[24px] pointer-events-none group-hover:border-saffron/20 transition-all"></div>
                        </div>
                    ) : (
                        <div className="w-[180px] h-[180px] flex items-center justify-center text-gray-400 text-xs font-medium italic leading-relaxed p-6 text-center">
                            Set amount above <br/> to generate secure QR
                        </div>
                    )}
                </div>

                {/* UPI Details */}
                <div className="flex items-center justify-center gap-2 mb-8 group">
                    <code className="bg-light px-4 py-2 rounded-xl text-xs font-mono text-gray-600 border border-gray-100 group-hover:border-saffron/20 transition-all">{upiId}</code>
                    <button onClick={copyToClipboard} className={`p-2 rounded-xl transition-all shadow-sm ${copied ? 'bg-green-500 text-white' : 'bg-saffron/10 text-saffron hover:bg-saffron/20'}`}>
                        {copied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <a 
                      href={upiUri}
                      className="w-full bg-saffron hover:bg-saffron/90 text-white font-bold py-4 rounded-3xl shadow-xl shadow-saffron/20 transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
                    >
                      <Check size={18} weight="bold" /> Pay Via UPI App
                    </a>
                    <button 
                        onClick={() => amount > 0 && campaignId ? setStep(2) : amount > 0 ? onClose() : null}
                        className={`w-full py-4 rounded-3xl text-sm font-bold text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${amount > 0 ? 'bg-dark hover:bg-dark/90 shadow-dark/20' : 'bg-gray-200 pointer-events-none'}`}
                    >
                        {campaignId ? 'I Have Paid' : 'Close After Payment'}
                        <PaperPlaneTilt size={18} weight="fill" />
                    </button>
                </div>
            </div>
        ) : (
            <form onSubmit={handleFinalSubmit} className="p-8 space-y-6">
                <div className="text-center mb-4">
                    <h3 className="font-bold text-dark text-lg">Verify Contribution</h3>
                    <p className="text-xs text-gray-500 mt-1">Please provide your details and skip UTR—just upload the receipt.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Full Name</label>
                        <input 
                            required
                            type="text" 
                            value={donorName}
                            onChange={e => setDonorName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full bg-light border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:border-saffron/50 outline-none transition-all font-medium"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Payment Screenshot</label>
                        <div className="relative h-28 bg-light rounded-2xl border-2 border-dashed border-gray-200 focus-within:border-saffron overflow-hidden flex items-center justify-center transition-all">
                            {proofPreview ? (
                            <>
                                <img src={proofPreview} className="w-full h-full object-cover" />
                                <button type="button" onClick={clearProof} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg">
                                <XCircle size={16} weight="bold" />
                                </button>
                            </>
                            ) : (
                            <div className="flex flex-col items-center gap-1 text-gray-400">
                                <Camera size={24} weight="light" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-center">Upload Screenshot</span>
                            </div>
                            )}
                            <input type="file" required onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-saffron hover:bg-saffron/90 text-white font-bold py-4 rounded-3xl transition-all shadow-xl shadow-saffron/20 flex items-center justify-center gap-2 group"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>Submit Proof <Check size={20} weight="bold" /></>
                    )}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-dark transition-colors">Go Back</button>
            </form>
        )}
      </div>
    </div>
  );
}
