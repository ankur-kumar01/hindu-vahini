import { useState } from 'react';
import { CheckCircle, UserPlus, UsersThree, FlowerLotus, HandHeart, ShieldCheck } from '@phosphor-icons/react';
import SEO from '../components/SEO';

export default function JoinUs() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    interests: 'Community Welfare',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Membership Application:', formData);
    setSubmitted(true);
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
            Thank you for your interest in joining HinduVahini. Our membership committee will review your application and reach out to you within 3-5 working days.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-saffron text-white px-8 py-3 rounded-full font-bold hover:bg-saffronLight transition-all"
          >
            Back to Home
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
          
          <div className="space-y-12">
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
            <div className="bg-saffron p-8 text-white text-center">
              <UserPlus size={48} weight="bold" className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Membership Form</h3>
              <p className="text-white/80 text-sm mt-1">Fill in your details to get started</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-5">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
                  <input 
                    required
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com" 
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
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">City / State</label>
                <input 
                  required
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Lucknow, UP" 
                  className="w-full bg-light border-2 border-transparent focus:border-saffron focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-dark font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Area of Interest</label>
                <select 
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="w-full bg-light border-2 border-transparent focus:border-saffron focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-dark font-medium appearance-none"
                >
                  <option>Community Welfare</option>
                  <option>Cultural Preservation</option>
                  <option>Youth Empowerment</option>
                  <option>Education Support</option>
                  <option>Digital Volunteer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Motivation</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3" 
                  placeholder="Tell us a bit about why you'd like to join..."
                  className="w-full bg-light border-2 border-transparent focus:border-saffron focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all text-dark font-medium resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-dark text-white py-4 rounded-xl font-bold shadow-xl hover:bg-dark/90 active:scale-95 transition-all text-lg mt-4"
              >
                Submit Application
              </button>

              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                By submitting this form, you agree to HinduVahini's terms of service and code of conduct for community members.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
