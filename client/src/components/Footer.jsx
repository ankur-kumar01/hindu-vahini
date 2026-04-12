import { Link } from 'react-router-dom';
import { FacebookLogo, TwitterLogo, InstagramLogo, YoutubeLogo, MapPin, Envelope, Phone, Code, WhatsappLogo } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-dark text-white/80 pt-20 pb-0 shrink-0">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        
        {/* Brand / Development Head Profile */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-5 group">
            <div className="relative">
              <img 
                src="/uploads/img/Chief Technology Head- Ankur Kumar.jpeg" 
                alt="Ankur Kumar" 
                className="h-24 w-24 object-cover rounded-3xl border-2 border-saffron/30 shadow-lg group-hover:border-saffron transition-all duration-500" 
              />
              <div className="absolute -bottom-2 -right-2 bg-saffron text-white p-2 rounded-xl shadow-lg">
                <Code size={16} weight="bold" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-black text-2xl tracking-tight leading-tight">Ankur Kumar</h4>
              <p className="text-saffron font-black text-[10px] uppercase tracking-widest mt-1">Chief Technology Officer</p>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed text-white/60 font-medium italic">
            "Mr. Ankur Kumar manages all tech stack of Hindu Vahini Globally."
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
                <Phone size={16} weight="fill" />
              </div>
              <a href="tel:+917518421180" className="text-white font-bold text-sm tracking-wide hover:text-saffron transition-colors">+91 75184 21180</a>
            </div>
            
            <a 
              href="https://wa.me/917518421180?text=Hi,%20Hindu%20Vahini%20Team" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#25D366]/20"
            >
              <WhatsappLogo size={18} weight="fill" /> Chat
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white text-xl font-heading font-semibold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-saffron">Quick Links</h4>
          <ul className="flex flex-col gap-3">
            <li><Link to="/leadership" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Leadership</Link></li>
            <li><Link to="/gallery" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Gallery</Link></li>
            <li><Link to="/campaigns" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Donation Campaign</Link></li>
            <li><Link to="/donate" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Donate</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-white text-xl font-heading font-semibold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-saffron">Contact Us</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3"><MapPin size={22} className="text-saffron shrink-0" /> <span>Lucknow Uttar Pradesh India</span></li>
            <li className="flex items-center gap-3"><Envelope size={22} className="text-saffron shrink-0" /> <span>info@hinduvahini.online</span></li>
            <li className="flex items-center gap-3"><Phone size={22} className="text-saffron shrink-0" /> <a href="tel:+919935568569" className="hover:text-saffron transition-colors">+91 99355 68569</a></li>
            <li className="flex items-center gap-3"><Phone size={22} className="text-saffron shrink-0" /> <a href="tel:+918318339152" className="hover:text-saffron transition-colors">+91 83183 39152</a></li>
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
