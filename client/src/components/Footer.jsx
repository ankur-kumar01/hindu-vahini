import { Link } from 'react-router-dom';
import { FacebookLogo, TwitterLogo, InstagramLogo, YoutubeLogo, MapPin, Envelope, Phone } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-dark text-white/80 pt-20 pb-0 shrink-0">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="HinduVahini Logo" className="h-16 w-16 object-cover rounded-full border-2 border-saffron/30 drop-shadow-md" />
            <span className="text-3xl font-bold tracking-tight text-white">Hindu<em className="text-saffron not-italic">Vahini</em></span>
          </Link>
          <p className="font-medium italic tracking-wide text-white/90">"Dharmo Rakshati Rakshitah" <br/> (Dharma Protects Those Who Protect It)</p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex flex-col items-center justify-center text-xl hover:bg-saffron hover:text-white transition-colors duration-300"><FacebookLogo weight="fill" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex flex-col items-center justify-center text-xl hover:bg-saffron hover:text-white transition-colors duration-300"><TwitterLogo weight="fill" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex flex-col items-center justify-center text-xl hover:bg-saffron hover:text-white transition-colors duration-300"><InstagramLogo weight="fill" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex flex-col items-center justify-center text-xl hover:bg-saffron hover:text-white transition-colors duration-300"><YoutubeLogo weight="fill" /></a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white text-xl font-heading font-semibold mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-saffron">Quick Links</h4>
          <ul className="flex flex-col gap-3">
            <li><Link to="/" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Home</Link></li>
            <li><a href="/#about" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">About Us</a></li>
            <li><a href="/#initiatives" className="hover:text-saffron hover:translate-x-1 transition-all inline-block">Our Initiatives</a></li>
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
        </div>

      </div>
      
      {/* Footer Bottom */}
      <div className="border-t border-white/10 text-center py-6 text-sm">
        <p>&copy; 2026 HinduVahini NGO. All rights reserved. | <a href="#" className="hover:text-saffron transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-saffron transition-colors">Terms of Service</a></p>
      </div>
    </footer>
  );
}
