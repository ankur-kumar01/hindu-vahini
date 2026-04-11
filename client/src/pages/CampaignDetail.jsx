import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    CalendarBlank, 
    TrendUp, 
    HandHeart, 
    ShoppingCart, 
    TrendDown, 
    Clock, 
    ShareNetwork, 
    WhatsappLogo, 
    Copy, 
    Check,
    ArrowLeft
} from '@phosphor-icons/react';
import DonationModal from '../components/DonationModal';
import SEO from '../components/SEO';

export default function CampaignDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await fetch(`/api/campaigns/${id}`);
                if (!res.ok) throw new Error('Campaign not found');
                const data = await res.json();
                setCampaign(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

    const handleSponsor = (item = null) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOnWhatsApp = () => {
        const shareText = `Check out this mission: ${campaign.title}. Your support can make a huge difference! `;
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + window.location.href)}`;
        window.open(url, '_blank');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-light">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-saffron rounded-full animate-spin"></div>
        </div>
    );

    if (!campaign) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-light px-6 text-center">
            <h1 className="text-3xl font-bold text-dark mb-4">Mission Not Found</h1>
            <p className="text-gray-500 mb-8">The campaign you are looking for might have been completed or removed.</p>
            <Link to="/campaigns" className="bg-saffron text-white px-8 py-3 rounded-full font-bold shadow-lg">Back to Missions</Link>
        </div>
    );

    const progress = Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100);

    return (
        <div className="pt-24 md:pt-28 min-h-screen bg-light pb-20">
            <SEO 
                title={campaign.title} 
                description={campaign.short_description || campaign.description}
                image={campaign.image_url}
                url={`/campaigns/${id}`}
            />

            <div className="max-w-7xl mx-auto px-6">
                {/* Breadcrumb / Back */}
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/campaigns" className="inline-flex items-center gap-2 text-gray-500 hover:text-saffron font-bold transition-colors">
                        <ArrowLeft size={20} weight="bold" /> Back to Missions
                    </Link>
                    
                    {/* Share Bar Top Mobile */}
                    <div className="flex md:hidden items-center gap-3">
                         <button onClick={shareOnWhatsApp} className="p-2.5 bg-[#25D366]/10 text-[#25D366] rounded-full border border-[#25D366]/20">
                            <WhatsappLogo size={20} weight="fill" />
                         </button>
                         <button onClick={copyLink} className={`p-2.5 rounded-full border transition-all ${copied ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-saffron/10 text-saffron border-saffron/20'}`}>
                            {copied ? <Check size={20} weight="bold" /> : <Copy size={20} weight="bold" />}
                         </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                    
                    {/* Left Side: Content */}
                    <div className="space-y-10">
                        <div className="bg-white rounded-[40px] overflow-hidden shadow-soft border border-gray-100">
                             <div className="relative h-[300px] md:h-[450px]">
                                <img 
                                    src={campaign.image_url || '/placeholder-banner.jpg'} 
                                    className="w-full h-full object-cover" 
                                    alt={campaign.title} 
                                />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-black uppercase tracking-widest text-dark">Verified Mission</span>
                                </div>
                             </div>

                             <div className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                    <div className="max-w-2xl">
                                        <h1 className="text-3xl md:text-5xl font-bold text-dark font-heading leading-tight mb-4">
                                            {campaign.title}
                                        </h1>
                                        
                                        {/* Sharing Actions Desktop */}
                                        <div className="hidden md:flex items-center gap-4 py-4 border-y border-gray-50">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                                <ShareNetwork size={16} weight="bold" /> Spread the Word
                                            </span>
                                            <button 
                                                onClick={shareOnWhatsApp}
                                                className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2 rounded-full text-xs font-bold hover:scale-105 transition-all shadow-md active:scale-95"
                                            >
                                                <WhatsappLogo size={18} weight="fill" /> WhatsApp
                                            </button>
                                            <button 
                                                onClick={copyLink}
                                                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 ${copied ? 'bg-green-500 text-white' : 'bg-saffron text-white hover:scale-105'}`}
                                            >
                                                {copied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
                                                {copied ? 'Link Copied!' : 'Copy Link'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 bg-light p-4 rounded-3xl text-center border border-gray-100 min-w-[120px]">
                                        <Clock size={28} className="mx-auto text-saffron mb-2" weight="duotone" />
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ongoing Since</p>
                                        <p className="font-bold text-dark">{new Date(campaign.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                                    {campaign.description?.split('\n').map((para, i) => (
                                        <p key={i} className="mb-4">{para}</p>
                                    ))}
                                </div>
                             </div>
                        </div>

                        {/* Item Contributions */}
                        {campaign.items && campaign.items.length > 0 && (
                            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-bold text-dark mb-8 flex items-center gap-3">
                                    <ShoppingCart size={32} className="text-saffron" weight="duotone" /> 
                                    Support with Specific Items
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {campaign.items.map(item => (
                                        <div 
                                            key={item.id}
                                            className="group relative bg-gray-50/50 p-6 rounded-[32px] border border-gray-100 hover:bg-white hover:border-saffron/30 hover:shadow-2xl transition-all duration-500"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.item_name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <ShoppingCart size={32} className="text-gray-200" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-dark text-lg mb-1">{item.item_name}</h4>
                                                    <p className="text-saffron font-black text-xs uppercase tracking-widest">
                                                        ₹{item.price_per_unit} / {item.unit_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleSponsor(item)}
                                                className="mt-6 w-full py-4 bg-dark text-white rounded-2xl font-bold text-sm hover:bg-dark/90 transition-all flex items-center justify-center gap-2 group/btn"
                                            >
                                                Contribute Now <HandHeart size={18} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Sidebar Controls */}
                    <div className="sticky top-32 space-y-6">
                        <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100">
                            <div className="mb-8">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact Milestones</p>
                                        <h4 className="text-2xl font-black text-dark tracking-tighter">
                                            ₹{campaign.current_amount.toLocaleString()} 
                                            <span className="text-xs text-gray-400 font-bold ml-2 uppercase">Raised</span>
                                        </h4>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-saffron">{Math.round(progress)}%</span>
                                    </div>
                                </div>
                                <div className="h-3 w-full bg-light rounded-full overflow-hidden shadow-inner p-[3px]">
                                    <div 
                                        className="h-full bg-saffron rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,153,51,0.4)] relative" 
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-4 text-center font-bold uppercase tracking-widest">
                                    Goal: ₹{campaign.goal_amount.toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={() => handleSponsor(null)}
                                    className="w-full bg-saffron hover:bg-dark text-white py-5 rounded-[22px] font-black uppercase tracking-widest shadow-xl shadow-saffron/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm"
                                >
                                    <HandHeart size={24} weight="fill" /> Contribute Custom
                                </button>
                                <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed font-bold uppercase tracking-tight">
                                    Direct UPI contribution with instant photo verification
                                </p>
                            </div>
                        </div>

                        {/* Direct Support Card */}
                        <div className="bg-dark rounded-[40px] p-8 shadow-2xl text-white relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                           <h4 className="text-xl font-bold mb-4 relative z-10">Need Assistance?</h4>
                           <p className="text-white/60 text-sm mb-8 leading-relaxed relative z-10 font-medium">
                               If you have questions about this specific mission or wish to contribute in bulk, please contact our organizers.
                           </p>
                           <Link 
                            to="/contact" 
                            className="bg-white/10 hover:bg-white/20 text-white w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/10"
                           >
                            Contact Organizer
                           </Link>
                        </div>
                    </div>

                </div>
            </div>

            {isModalOpen && (
                <DonationModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    campaignId={id} 
                    campaignTitle={campaign.title}
                    campaignItem={selectedItem}
                />
            )}
        </div>
    );
}
