import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    HandHeart, 
    ShoppingCart, 
    Clock, 
    ShareNetwork, 
    WhatsappLogo, 
    Copy, 
    Check,
    ArrowLeft,
    ShieldCheck,
    CaretRight,
    Target,
    ListChecks
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
            <div className="w-14 h-14 border-4 border-gray-100 border-t-saffron rounded-full animate-spin"></div>
        </div>
    );

    if (!campaign) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-light px-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-8">
                <ShieldCheck size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-dark mb-4">Mission Not Found</h1>
            <p className="text-gray-500 mb-8 max-w-sm">The campaign you are looking for might have been completed or moved to archives.</p>
            <Link to="/campaigns" className="bg-dark text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:bg-dark/90 transition-all">
                Explore Other Missions
            </Link>
        </div>
    );

    const progress = Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100);

    return (
        <div className="pt-20 md:pt-28 min-h-screen bg-light pb-32 md:pb-24">
            <SEO 
                title={`${campaign.title} | HinduVahini Mission`} 
                description={campaign.short_description || campaign.description}
                image={campaign.image_url}
                url={`/campaigns/${id}`}
            />

            {/* Mobile Sticky Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-200/30 shadow-2xl">
                <button 
                    onClick={() => handleSponsor(null)}
                    className="w-full bg-saffron text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-saffron/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <HandHeart size={20} weight="fill" /> Contribute Support
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="py-8 md:py-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Link to="/campaigns" className="text-gray-400 hover:text-saffron transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                            <ArrowLeft size={14} weight="bold" /> Missions
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-saffron text-[10px] font-black uppercase tracking-widest">Detail</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 bg-saffron/10 text-saffron px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                <ShieldCheck size={16} weight="fill" /> Verified Initiative
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark tracking-tighter leading-tight mb-4">
                                {campaign.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm font-semibold">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-saffron" weight="duotone" />
                                    <span>Added {new Date(campaign.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target size={18} className="text-saffron" weight="duotone" />
                                    <span>Direct Impact</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button 
                                onClick={shareOnWhatsApp}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shadow-sm active:scale-95"
                                title="Share on WhatsApp"
                            >
                                <WhatsappLogo size={24} weight="fill" />
                            </button>
                            <button 
                                onClick={copyLink}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all shadow-sm active:scale-95 ${copied ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-100 text-dark hover:bg-dark hover:text-white'}`}
                                title="Copy Link"
                            >
                                {copied ? <Check size={24} weight="bold" /> : <Copy size={24} weight="bold" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Banner: High Contrast rounding */}
                <div className="relative aspect-[16/8] md:aspect-[21/9] rounded-[32px] md:rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] mb-12 bg-dark">
                    <img 
                        src={campaign.image_url || '/placeholder-banner.jpg'} 
                        className="w-full h-full object-cover opacity-90 transition-transform duration-[3s] hover:scale-105" 
                        alt={campaign.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent"></div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
                    
                    {/* Left Side: Story & Items */}
                    <div className="space-y-12">
                        <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-soft border-t-8 border-t-saffron">
                            <h3 className="text-saffron font-black uppercase tracking-[0.3em] text-[10px] mb-6">Brief Summary</h3>
                            <p className="text-2xl md:text-3xl font-black text-dark tracking-tighter leading-tight mb-12">
                                {campaign.short_description || "Empowering the community through consistent support and transparent aid."}
                            </p>
                            
                            <div className="prose prose-lg md:prose-xl max-w-none text-gray-600 leading-relaxed font-medium">
                                {campaign.description?.split('\n').map((para, i) => (
                                    <p key={i} className="mb-6">{para}</p>
                                ))}
                            </div>
                        </div>

                        {/* Items Section */}
                        {campaign.items && campaign.items.length > 0 && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 px-4">
                                    <div className="w-10 h-10 rounded-xl bg-saffron flex items-center justify-center text-white shadow-lg">
                                        <ListChecks size={24} weight="bold" />
                                    </div>
                                    <h3 className="text-2xl font-black text-dark tracking-tight">Sponsor Essentials</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {campaign.items.map(item => (
                                        <div 
                                            key={item.id}
                                            className="group bg-white p-6 rounded-[32px] border border-gray-100 hover:border-saffron/30 hover:shadow-2xl transition-all duration-500"
                                        >
                                            <div className="flex items-center gap-5 mb-6">
                                                <div className="w-16 h-16 rounded-2xl bg-light overflow-hidden flex-shrink-0 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-500">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.item_name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <ShoppingCart size={24} className="text-gray-200" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-dark text-lg leading-snug mb-1 line-clamp-1">{item.item_name}</h4>
                                                    <p className="text-saffron font-black text-[10px] uppercase tracking-widest leading-none">₹{item.price_per_unit} / unit</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleSponsor(item)}
                                                className="w-full py-4 bg-saffron text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-saffron/20 hover:bg-dark active:scale-95"
                                            >
                                                Support Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Dashboard (Grounded with Dark Theme) */}
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-dark rounded-[40px] p-10 shadow-2xl relative overflow-hidden text-white border border-white/5">
                            <div className="absolute top-0 left-0 w-full h-2 bg-saffron"></div>
                            
                            <div className="mb-10">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8 text-center">Impact Dashboard</p>
                                
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <p className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">₹{campaign.current_amount.toLocaleString()}</p>
                                        <p className="text-[10px] font-black text-saffron uppercase tracking-widest">Amount Raised</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-saffron/20 border border-saffron/30 text-saffron px-3 py-1 rounded-xl font-black text-lg">
                                            {Math.round(progress)}%
                                        </div>
                                    </div>
                                </div>

                                <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden mb-6 p-[3px] border border-white/5 shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-saffron to-[#ffcc66] rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,153,51,0.6)] relative" 
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                                    </div>
                                </div>

                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/30 px-1">
                                    <span>Goal: ₹{campaign.goal_amount.toLocaleString()}</span>
                                    <span>100% Direct</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <button 
                                    onClick={() => handleSponsor(null)}
                                    className="w-full bg-saffron text-white py-6 rounded-[28px] font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(255,153,51,0.3)] hover:scale-105 hover:shadow-saffron/40 transition-all duration-500 active:scale-95 flex items-center justify-center gap-3 text-xs"
                                >
                                    Contribute Now <CaretRight size={18} weight="bold" />
                                </button>
                                <p className="text-[10px] text-center text-white/30 font-bold uppercase tracking-widest px-4 leading-relaxed">
                                    Direct UPI Payment with secure verification
                                </p>
                            </div>
                        </div>

                        {/* Security Sidebar Callout */}
                        <div className="bg-white rounded-[40px] p-10 shadow-soft border border-gray-100 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-light rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                           <h4 className="text-xl font-black text-dark mb-4 relative z-10 tracking-tight flex items-center gap-3">
                               <ShieldCheck size={28} className="text-saffron" weight="fill" />
                               Trust Pledge
                           </h4>
                           <p className="text-gray-500 text-sm leading-relaxed mb-10 relative z-10 font-medium">
                               Our portal ensures every contribution is tracked and verified. 100% of your support reaches the actual beneficiary on the ground.
                           </p>
                           <Link 
                            to="/leadership" 
                            className="bg-saffron text-white w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-dark shadow-md shadow-saffron/10 relative z-10 border border-saffron/20"
                           >
                            Meet Local Lead
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
