import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, X } from '@phosphor-icons/react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isSolid = scrolled || !isHomePage;

  const navLinks = [
    { name: 'Home', path: '/', isHash: false },
    { name: 'Leadership', path: '/leadership', isHash: false },
    { name: 'Gallery', path: '/gallery', isHash: false },
    { name: 'About', path: '/#about', isHash: true },
    { name: 'Initiatives', path: '/#initiatives', isHash: true },
    { name: 'Contact', path: '/#contact', isHash: true },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isSolid ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="HinduVahini" className="h-[50px] w-[50px] object-cover rounded-full border-2 border-saffron shadow-sm transition-all" style={{ height: isSolid ? '45px' : '55px', width: isSolid ? '45px' : '55px' }} />
          <span className={`text-[26px] font-bold tracking-tight ${isSolid ? 'text-dark' : 'text-white'}`}>
            Hindu<em className="text-saffron not-italic">Vahini</em>
          </span>
        </Link>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className={`md:hidden text-3xl transition-colors ${isSolid ? 'text-dark hover:text-saffron' : 'text-white hover:text-saffron'}`}
        >
          <List />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.isHash ? (
              <a 
                key={link.name} 
                href={link.path} 
                className={`font-medium hover:text-saffron transition-colors ${isSolid ? 'text-gray-800' : 'text-white/90'}`}
              >
                {link.name}
              </a>
            ) : (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`font-medium hover:text-saffron transition-colors ${isSolid ? 'text-gray-800' : 'text-white/90'}`}
              >
                {link.name}
              </Link>
            )
          ))}
          <Link to="/donate" className={`font-medium border-2 rounded-full px-6 py-2.5 transition-colors ${isSolid ? 'border-saffron text-saffron hover:bg-saffron hover:text-white' : 'border-white/50 text-white hover:border-white hover:bg-white/10'}`}>Donate</Link>
          <Link to="/join-us" className="font-medium bg-saffron text-white rounded-full px-8 py-2.5 shadow-md hover:bg-saffronLight hover:-translate-y-0.5 transition-all">Join Us</Link>
        </nav>
      </div>

      {/* Mobile Menu Overlay/Drawer */}
      <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-dark/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsMenuOpen(false)}
        ></div>
        
        {/* Drawer */}
        <div className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <span className="text-xl font-bold text-dark">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-2xl text-gray-500 hover:text-dark">
              <X weight="bold" />
            </button>
          </div>
          
          <nav className="p-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              link.isHash ? (
                <a 
                  key={link.name} 
                  href={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-semibold text-gray-800 hover:text-saffron transition-colors flex items-center justify-between"
                >
                  {link.name}
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                </a>
              ) : (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-semibold text-gray-800 hover:text-saffron transition-colors flex items-center justify-between"
                >
                  {link.name}
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                </Link>
              )
            ))}
            <Link 
              to="/donate" 
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 bg-transparent border-2 border-saffron text-saffron text-center py-3.5 rounded-xl font-bold active:scale-95 transition-all"
            >
              Donate Now
            </Link>
            <Link 
              to="/join-us" 
              onClick={() => setIsMenuOpen(false)}
              className="bg-saffron text-white text-center py-4 rounded-xl font-bold shadow-lg shadow-saffron/20 active:scale-95 transition-all"
            >
              Join Us
            </Link>
          </nav>
          
          <div className="mt-auto p-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-4">Official NGO Portal</p>
            <img src="/logo.png" alt="Logo" className="h-16 w-16 mx-auto rounded-full border border-gray-100 shadow-sm" />
          </div>
        </div>
      </div>
    </header>
  );
}
