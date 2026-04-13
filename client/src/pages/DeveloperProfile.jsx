import { useState } from 'react';
import { Code, CheckCircle, Envelope, MapPin, Desktop, ShieldCheck } from '@phosphor-icons/react';
import SEO from '../components/SEO';

export default function DeveloperProfile() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    state: '',
    country: 'India',
    request_text: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/dev_requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Connection refused. Please try again later.');
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
          <div className="w-20 h-20 bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} weight="fill" />
          </div>
          <h2 className="text-3xl font-bold text-dark mb-4">Request Submitted!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for reaching out to the Website & Software Development Desk. We have received your request and will contact you shortly.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-[#25D366] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#25D366]/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-light">
      <SEO 
        title="Developer Profile - HinduVahini" 
        description="Contact the Website & Software Development Desk for technical support and application development requests."
        url="/developer"
      />

      {/* Hero Section */}
      <section className="bg-dark py-20 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#25D366]/5 opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#25D366] rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-[#25D366]/20 shadow-2xl mb-6 relative group">
             <img 
               src="/uploads/img/Chief Technology Head- Ankur Kumar.jpeg" 
               alt="Ankur Kumar" 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=Ankur+Kumar&background=25d366&color=fff`; }}
             />
             <div className="absolute -bottom-2 -right-2 bg-[#25D366] p-2 rounded-xl text-white shadow-lg shadow-[#25D366]/50">
               <Code size={20} weight="bold" />
             </div>
          </div>
          
          <span className="inline-block bg-[#25D366]/20 text-[#25D366] text-[10px] font-black uppercase tracking-[3px] py-2 px-6 rounded-full mb-4 border border-[#25D366]/40">
            Website Team
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 font-heading leading-tight text-white">
            Chief Technology Head <span className="text-[#25D366]">Ankur Kumar</span>
          </h1>
          <p className="text-sm md:text-md text-white/60 max-w-2xl mx-auto leading-relaxed">
            Software & Website Development Desk
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-12 items-start">
          
          <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-[#25D366] p-6 text-white text-center">
              <Desktop size={32} weight="duotone" className="mx-auto mb-3" />
              <h3 className="text-xl font-bold">Development Request Form</h3>
              <p className="text-white/80 text-xs mt-1">Submit your requirements securely</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Full Name</label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  className="w-full bg-light border-2 border-transparent focus:border-[#25D366] focus:bg-white px-4 py-3 rounded-xl outline-none transition-all text-dark text-sm font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Phone No.</label>
                <input 
                  required
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 00000 00000" 
                  className="w-full bg-light border-2 border-transparent focus:border-[#25D366] focus:bg-white px-4 py-3 rounded-xl outline-none transition-all text-dark text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">City</label>
                  <input 
                    required
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="E.g. Lucknow" 
                    className="w-full bg-light border-2 border-transparent focus:border-[#25D366] focus:bg-white px-4 py-3 rounded-xl outline-none transition-all text-dark text-sm font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">State</label>
                  <input 
                    required
                    type="text" 
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="E.g. UP" 
                    className="w-full bg-light border-2 border-transparent focus:border-[#25D366] focus:bg-white px-4 py-3 rounded-xl outline-none transition-all text-dark text-sm font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Country</label>
                <input 
                  disabled
                  type="text" 
                  name="country"
                  value={formData.country}
                  className="w-full bg-gray-100 border-2 border-transparent text-gray-400 px-4 py-3 rounded-xl outline-none transition-all text-sm font-bold opacity-70"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center justify-between">
                  <span>Development Request Details</span>
                  <span className="text-gray-300 font-normal">Optional</span>
                </label>
                <textarea 
                  name="request_text"
                  value={formData.request_text}
                  onChange={handleChange}
                  rows="4" 
                  placeholder="Briefly describe what kind of software or website functionality you need..."
                  className="w-full bg-light border-2 border-transparent focus:border-[#25D366] focus:bg-white px-4 py-3 rounded-xl outline-none transition-all text-dark text-sm font-medium resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold shadow-xl shadow-[#25D366]/20 transition-all text-sm mt-2 hover:bg-[#20ba59] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Envelope size={18} weight="bold" /> Send Request</>}
              </button>
            </form>
          </div>

          <div className="space-y-6 lg:sticky lg:top-32">
            <div className="bg-dark text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366] opacity-10 blur-3xl rounded-full"></div>
               <ShieldCheck size={32} weight="duotone" className="text-[#25D366] mb-4" />
               <h4 className="text-lg font-bold mb-2">Secure & Confidential</h4>
               <p className="text-white/60 text-sm leading-relaxed">
                 All development requests are processed securely and directly monitored by the Website Team. We do not share your structural requests publicly.
               </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft">
               <h4 className="text-sm font-black uppercase tracking-widest text-dark mb-4 border-b border-gray-100 pb-2">Direct Contact Specs</h4>
               <ul className="space-y-4 text-sm text-gray-500 font-medium">
                 <li className="flex items-center gap-3"><MapPin size={20} className="text-[#25D366]" weight="fill" /> Lucknow, Uttar Pradesh</li>
                 <li className="flex items-center gap-3"><Desktop size={20} className="text-[#25D366]" weight="fill" /> Custom Software & Apps</li>
                 <li className="flex items-center gap-3"><Code size={20} className="text-[#25D366]" weight="fill" /> Modern Web Technologies</li>
               </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
