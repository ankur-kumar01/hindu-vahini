import { useState } from 'react';
import { CheckCircle, UserPlus, UsersThree, FlowerLotus, HandHeart, ShieldCheck, WarningCircle, XCircle, Camera, Check, Copy } from '@phosphor-icons/react';
import { QRCodeCanvas } from 'qrcode.react';
import SEO from '../components/SEO';

export default function JoinUs() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    state: '',
    country: 'India',
    membership_type: 'Normal Member'
  });

  const [proofImage, setProofImage] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  const membershipFees = {
    'Normal Member': 50,
    'Active Member': 200,
    'Leader': 1000
  };

  const amount = membershipFees[formData.membership_type];
  const upiId = "9935568569m@pnb";
  const trustName = "Hindu Vahini Trust";
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(trustName)}&am=${amount}&cu=INR`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofImage) {
      setError('Please upload your payment screenshot to proceed.');
      return;
    }

    setLoading(true);
    setError('');

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('phone', formData.phone);
    submissionData.append('city', formData.city);
    submissionData.append('state', formData.state);
    submissionData.append('country', formData.country);
    submissionData.append('membership_type', formData.membership_type);
    submissionData.append('amount', amount);
    submissionData.append('proof_image', proofImage);

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        body: submissionData
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Connection refused. Please ensure the server is running.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="pt-24 min-h-screen bg-light flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl p-10 text-center animation-scale-up">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} weight="fill" />
          </div>
          <h2 className="text-3xl font-bold text-dark mb-4">Application Received!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for your contribution. Our membership committee will verify your payment and review your application. You will be notified soon.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({...formData, name: '', phone: '', city: '', state: ''});
              clearProof();
            }}
            className="bg-saffron text-white px-8 py-3 rounded-full font-bold hover:bg-saffronLight transition-all"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-light">
      <SEO 
        title="Become a Member" 
        description="Join HinduVahini to preserve cultural heritage, foster unity, and contribute to community welfare. Together, we empower the future."
        url="/join-us"
      />

      {/* Hero Section */}
      <section className="bg-dark py-20 md:py-32 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-saffron/10 opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-saffron rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-saffron rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block bg-saffron/20 text-saffron text-xs font-bold uppercase tracking-[3px] py-2 px-6 rounded-full mb-6 border border-saffron/40">
            Membership Drive 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading leading-tight text-white">
            Become a Pillar of <span className="text-saffron">Dharma</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Join thousands of volunteers dedicated to preserving our rich cultural legacy and building a self-reliant society.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-16 items-start">
          
          <div className="space-y-12 shrink-0 max-w-2xl">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-saffron">
                Why Join HinduVahini?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                As a member, you become part of a nationwide network of cultural ambassadors. We work together to protect traditional values while addressing modern social challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
                  <FlowerLotus size={28} weight="fill" />
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-2 text-lg">Cultural Impact</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Participate in heritage preservation and classical art promotion projects.</p>
                </div>
              </div>
              
              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
                  <UsersThree size={28} weight="fill" />
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-2 text-lg">Weekly Satsangs</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Access to exclusive community gatherings and spiritual symposia.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
                  <HandHeart size={28} weight="fill" />
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-2 text-lg">Service Network</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Front-line volunteer opportunities in our disaster relief and welfare programs.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
                  <ShieldCheck size={28} weight="fill" />
                </div>
                <div>
                  <h4 className="font-bold text-dark mb-2 text-lg">Official Badge</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Receive official membership identification and digital credentials.</p>
                </div>
              </div>
            </div>

            <div className="bg-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-saffron opacity-20 blur-3xl rounded-full"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                  <div className="text-4xl font-bold text-saffron">25k+</div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Active Community Members</h5>
                    <p className="text-white/60 text-sm">Join the fastest growing movement for cultural preservation in Bharat.</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Registration Form Card */}
          <div id="join-form" className="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden sticky top-24">
            
            {step === 1 && (
              <>
                <div className="bg-saffron p-8 text-white text-center">
                  <UserPlus size={48} weight="bold" className="mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Membership Form</h3>
                  <p className="text-white/80 text-sm mt-1">Fill in your details to get started</p>
                </div>
                
                <form onSubmit={handleNextStep} className="p-8 md:p-10 space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma" 
                      className="w-full bg-light border-2 border-transparent focus:border-saffron focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-dark font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone No.</label>
                    <input 
                      required
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000" 
                      className="w-full bg-light border-2 border-transparent focus:border-saffron focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-dark font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">City</label>
                      <input 
                        required
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Lucknow" 
                        className="w-full bg-light border-2 border-transparent focus:border-saffron focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-dark font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">State</label>
                      <input 
                        required
                        type="text" 
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. UP" 
                        className="w-full bg-light border-2 border-transparent focus:border-saffron focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-dark font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Country</label>
                    <input 
                      disabled
                      type="text" 
                      name="country"
                      value={formData.country}
                      className="w-full bg-gray-100 border-2 border-transparent text-gray-500 px-5 py-3.5 rounded-xl outline-none transition-all font-bold opacity-70"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                      <span>Membership Type</span>
                      <span className="text-saffron font-black text-sm">₹{amount}</span>
                    </label>
                    <div className="flex gap-2">
                      {['Normal Member', 'Active Member', 'Leader'].map(type => (
                         <button 
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, membership_type: type})}
                          className={`flex-1 py-3 px-2 rounded-xl border-2 font-bold transition-all text-xs ${formData.membership_type === type ? 'bg-saffron border-saffron text-white ring-4 ring-saffron/20 shadow-lg shadow-saffron/20' : 'border-gray-50 text-gray-500 hover:border-saffron/30 hover:bg-saffron/5'}`}
                         >
                          {type}
                         </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-saffron text-white py-4 rounded-xl font-bold shadow-xl shadow-saffron/20 transition-all text-lg mt-4 hover:bg-saffron/90 active:scale-95"
                  >
                    Proceed to Payment →
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
               <div className="animation-slide-up">
                  <div className="bg-saffron p-8 text-white text-center relative">
                    <button type="button" onClick={() => setStep(1)} className="absolute top-6 left-6 text-white/50 hover:text-white font-bold text-sm">← Back</button>
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/70 mb-2 mt-4">Membership Fee</h4>
                    <p className="text-3xl font-black text-white tracking-tighter">₹{amount.toLocaleString()}</p>
                    <p className="text-xs mt-1 text-white/80">{formData.membership_type}</p>
                  </div>

                  <div className="p-8">
                     <div className="text-center animation-slide-up">
                        <div className="bg-white p-4 rounded-[32px] inline-block shadow-inner border border-gray-100 mb-6 mx-auto">
                            {import.meta.env.VITE_QR_COMPONENT ? (
                              <QRCodeCanvas 
                                value={upiUri} 
                                size={150}
                                level="H"
                                includeMargin={true}
                                imageSettings={{
                                  src: "/logo.png",
                                  x: undefined, y: undefined, height: 30, width: 30, excavate: true,
                                }}
                              />
                            ) : (
                              // Fallback QR rendering
                              <div className="w-[150px] h-[150px] bg-gray-100 p-2">
                                <QRCodeCanvas 
                                  value={upiUri} 
                                  size={134}
                                  level="H"
                                  includeMargin={false}
                                />
                              </div>
                            )}
                        </div>
                        
                        <div className="bg-light p-3 rounded-2xl mb-6 flex items-center justify-between gap-3 max-w-[200px] mx-auto">
                           <code className="text-[10px] font-bold text-gray-500 truncate">{upiId}</code>
                           <button onClick={copyUpiId} className={`p-1.5 rounded-lg transition-all ${copiedId ? 'bg-green-500 text-white' : 'bg-white text-saffron shadow-sm'}`}>
                             {copiedId ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
                           </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 text-left border-t border-gray-100 pt-6">
                           {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 text-sm">
                              {error}
                            </div>
                           )}

                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-saffron uppercase tracking-widest ml-1">Upload Payment Screenshot</label>
                              <div className="relative h-32 bg-saffron/5 hover:bg-saffron/10 rounded-2xl border-2 border-dashed border-saffron/50 focus-within:border-saffron hover:border-saffron overflow-hidden flex items-center justify-center transition-all group shadow-[0_0_20px_rgba(255,153,51,0.1)]">
                                 {proofPreview ? (
                                   <>
                                     <img src={proofPreview} className="w-full h-full object-cover" />
                                     <button type="button" onClick={clearProof} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors">
                                       <XCircle size={16} weight="bold" />
                                     </button>
                                   </>
                                 ) : (
                                   <div className="flex flex-col items-center gap-2 text-saffron transition-transform group-hover:scale-105">
                                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg shadow-saffron/20 mb-1">
                                        <Camera size={24} weight="duotone" className="text-saffron" />
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4 leading-tight">Tap to Confirm<br/>Upload Receipt <span className="text-red-500">*</span></span>
                                   </div>
                                 )}
                                 <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                              </div>
                           </div>
                           
                           <div className="pt-2">
                              <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-saffron hover:bg-saffron/90 text-white font-bold py-4 rounded-xl shadow-xl shadow-saffron/20 transition-all flex items-center justify-center gap-3 text-sm"
                              >
                                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Confirm & Complete Registration'}
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            )}
            
          </div>
        </div>
      </section>
    </div>
  );
}
