import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List } from '@phosphor-icons/react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // If not on the homepage, navbar is usually solid depending on design.
    // For simplicity, we will apply solid style if not homepage or if scrolled.
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolid = scrolled || !isHomePage;

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isSolid ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="HinduVahini" className="h-[50px] w-[50px] object-cover rounded-full border-2 border-saffron shadow-sm transition-all" style={{ height: isSolid ? '45px' : '55px', width: isSolid ? '45px' : '55px' }} />
          <span className={`text-[26px] font-bold tracking-tight ${isSolid ? 'text-dark' : 'text-white'}`}>
            Hindu<em className="text-saffron not-italic">Vahini</em>
          </span>
        </Link>
        
        <button className={`md:hidden text-3xl ${isSolid ? 'text-dark' : 'text-white'}`}>
          <List />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={`font-medium hover:text-saffron transition-colors ${isSolid ? 'text-gray-800' : 'text-white/90'}`}>Home</Link>
          <a href="/#about" className={`font-medium hover:text-saffron transition-colors ${isSolid ? 'text-gray-800' : 'text-white/90'}`}>About</a>
          <a href="/#initiatives" className={`font-medium hover:text-saffron transition-colors ${isSolid ? 'text-gray-800' : 'text-white/90'}`}>Initiatives</a>
          <a href="/#donate" className={`font-medium border-2 rounded-full px-6 py-2.5 transition-colors ${isSolid ? 'border-saffron text-saffron hover:bg-saffron hover:text-white' : 'border-white/50 text-white hover:border-white hover:bg-white/10'}`}>Donate</a>
          <a href="#contact" className="font-medium bg-saffron text-white rounded-full px-8 py-2.5 shadow-md hover:bg-saffronLight hover:-translate-y-0.5 transition-all">Join Us</a>
        </nav>
      </div>
    </header>
  );
}
