import { Link } from 'react-router-dom';
import { FacebookLogo, TwitterLogo, InstagramLogo, YoutubeLogo, MapPin, Envelope, Phone, Code, WhatsappLogo, CrownSimple } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-dark text-white/80 pt-20 pb-0 shrink-0">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* National President Profile */}
        <div className="flex flex-col">
          <h4 className="text-white text-xl font-heading font-semibold mb-8 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-saffron whitespace-nowrap">Rashtriya Adhyaksh</h4>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <img 
                  src="/uploads/leaders_img/ashwani_mishra.jpg" 
                  alt="Ashwani Mishra" 
                  className="h-20 w-20 object-cover rounded-3xl border-2 border-saffron/30 shadow-lg group-hover:border-saffron transition-all duration-500" 
                />
                <div className="absolute -bottom-2 -right-2 bg-saffron text-white p-2 rounded-xl shadow-lg">
                  <CrownSimple size={16} weight="bold" />
                </div>
              </div>
              <div>
                <h4 className="text-white font-black text-xl tracking-tight leading-tight">Ashwani Mishra</h4>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-white/50 font-medium italic">
              "Shri Ashwani Mishra ji leads HinduVahini's national mission with unwavering dedication to Hindu cultural values."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron shadow-sm">
                <Phone size={14} weight="fill" />
              </div>
              <a href="tel:+919935568569" className="text-white font-bold text-sm tracking-wide hover:text-saffron transition-colors">+91 99355 68569</a>
            </div>
          </div>
        </div>

        {/* Development Head Profile */}
        <div className="flex flex-col">
          <h4 className="text-white text-xl font-heading font-semibold mb-8 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-saffron whitespace-nowrap">Website Team</h4>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <img 
                  src="/uploads/img/Chief Technology Head- Ankur Kumar.jpeg" 
                  alt="Ankur Kumar" 
                  className="h-20 w-20 object-cover rounded-3xl border-2 border-saffron/30 shadow-lg group-hover:border-saffron transition-all duration-500" 
                />
                <div className="absolute -bottom-2 -right-2 bg-saffron text-white p-2 rounded-xl shadow-lg">
                  <Code size={16} weight="bold" />
                </div>
              </div>
              <div>
                <h4 className="text-white font-black text-xl tracking-tight leading-tight">Ankur Kumar</h4>
              </div>
            </div>
            
            <div className="bg-green-600/90 text-white px-4 py-2 rounded-xl border border-green-500/50 shadow-lg shadow-green-900/20 animation-pulse-subtle">
              <p className="text-[11px] font-bold leading-tight flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-blink shrink-0"></span>
                सॉफ्टवेयर व वेबसाइट कार्य हेतु संपर्क करें
              </p>
            </div>

            <div className="flex flex-nowrap items-center gap-2 mt-2 w-full">
              <Link 
                to="/developer"
                className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-[#25D366] text-white px-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#25D366]/20 whitespace-nowrap text-center"
              >
                <Code size={14} weight="bold" /> Contact
              </Link>
              
              <a 
                href="https://wa.me/917518421180?text=Hi,%20Hindu%20Vahini%20Team" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-[#25D366] text-white px-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#25D366]/20 whitespace-nowrap text-center"
              >
                <WhatsappLogo size={14} weight="fill" /> Chat
              </a>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="lg:pl-8">
          <h4 className="text-white text-xl font-heading font-semibold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-saffron">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/leadership" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Leadership</Link></li>
            <li><Link to="/gallery" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Gallery</Link></li>
            <li><Link to="/campaigns" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Donation Campaign</Link></li>
            <li><Link to="/donate" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Donate Now</Link></li>
            <li><Link to="/contact" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-white text-xl font-heading font-semibold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-saffron">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3"><MapPin size={22} className="text-saffron shrink-0" /> <span className="text-white/70">Lucknow, Uttar Pradesh, India</span></li>
            <li className="flex items-center gap-3"><Envelope size={22} className="text-saffron shrink-0" /> <span className="text-white/70">info@hinduvahini.online</span></li>
            <li className="flex items-center gap-3"><Phone size={22} className="text-saffron shrink-0" /> <a href="tel:+919935568569" className="hover:text-saffron transition-colors text-white/70">+91 99355 68569</a></li>
          </ul>

          <div className="flex gap-4 mt-8">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex flex-col items-center justify-center text-xl hover:bg-saffron hover:text-white transition-all duration-300"><FacebookLogo weight="fill" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex flex-col items-center justify-center text-xl hover:bg-saffron hover:text-white transition-all duration-300"><TwitterLogo weight="fill" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex flex-col items-center justify-center text-xl hover:bg-saffron hover:text-white transition-all duration-300"><InstagramLogo weight="fill" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex flex-col items-center justify-center text-xl hover:bg-saffron hover:text-white transition-all duration-300"><YoutubeLogo weight="fill" /></a>
          </div>
        </div>

      </div>
      
      {/* Footer Bottom */}
      <div className="border-t border-white/10 text-center py-6 text-sm">
        <p>&copy; 2026 HinduVahini NGO. All rights reserved. | <a href="#" className="hover:text-saffron transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-saffron transition-colors">Terms of Service</a></p>
      </div>
    </footer>
  );
}
