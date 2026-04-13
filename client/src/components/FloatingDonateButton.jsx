import { useLocation, useNavigate } from 'react-router-dom';
import { HandHeart } from '@phosphor-icons/react';

export default function FloatingDonateButton() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    // Temporarily disabled as requested
    return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-200/30 shadow-2xl animation-slide-up">
            <button 
                onClick={() => navigate('/donate')}
                className="w-full bg-saffron text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-saffron/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
                <HandHeart size={20} weight="fill" /> Contribute Support
            </button>
        </div>
    );
}
