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
    ShieldCheck
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
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-8">
                <ShieldCheck size={48} className="text-gray-300" />
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
        <div className="pt-24 md:pt-32 min-h-screen bg-light pb-24">
            <SEO 
                title={`${campaign.title} | HinduVahini Mission`} 
                description={campaign.short_description || campaign.description}
                image={campaign.image_url}
                url={`/campaigns/${id}`}
            />

            <div className="max-w-7xl mx-auto px-6">
                {/* Top Navigation */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <Link to="/campaigns" className="inline-flex items-center gap-3 text-gray-400 hover:text-saffron text-xs font-black uppercase tracking-[0.2em] transition-all group">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-all">
                            <ArrowLeft size={16} weight="bold" />
                        </div>
                        Back to Missions
                    </Link>
                    
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-soft border border-gray-100">
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 border-r border-gray-100">Share Mission</span>
                         <button 
                            onClick={shareOnWhatsApp} 
                            className="p-3 bg-[#25D366] text-white rounded-xl hover:scale-105 transition-all shadow-md active:scale-95"
                         >
                            <WhatsappLogo size={20} weight="fill" />
                         </button>
                         <button 
                            onClick={copyLink} 
                            className={`p-3 rounded-xl transition-all shadow-md active:scale-95 ${copied ? 'bg-green-500 text-white' : 'bg-dark text-white hover:scale-105'}`}
                         >
                            {copied ? <Check size={20} weight="bold" /> : <Copy size={20} weight="bold" />}
                         </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">
                    
                    {/* Left Column: Mission Content */}
                    <div className="space-y-12">
                        <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl border border-white/50 relative">
                             <div className="relative h-[350px] md:h-[500px] overflow-hidden">
                                <img 
                                    src={campaign.image_url || '/placeholder-banner.jpg'} 
                                    className="w-full h-full object-cover" 
                                    alt={campaign.title} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="inline-flex items-center gap-2 bg-saffron text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-xl">
                                        <ShieldCheck size={16} weight="fill" /> Official Mission
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-black text-white font-heading leading-tight tracking-tighter drop-shadow-lg">
                                        {campaign.title}
                                    </h1>
                                </div>
                             </div>

                             <div className="p-8 md:p-14">
                                <div className="flex flex-wrap items-center gap-8 mb-12 py-6 border-b border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-saffron/10 flex items-center justify-center text-saffron">
                                            <Clock size={32} weight="duotone" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Since</p>
                                            <p className="font-bold text-dark">{new Date(campaign.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-dark/5 flex items-center justify-center text-dark">
                                            <HandHeart size={32} weight="duotone" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</p>
                                            <p className="font-bold text-dark">Impact Driven</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-xl max-w-none text-gray-600 leading-relaxed font-medium">
                                    {campaign.description?.split('\n').map((para, i) => (
                                        <p key={i} className="mb-6">{para}</p>
                                    ))}
                                </div>
                             </div>
                        </div>

                        {/* Item Grids */}
                        {campaign.items && campaign.items.length > 0 && (
                            <div className="bg-white rounded-[48px] p-8 md:p-14 shadow-2xl border border-white/50">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-2xl md:text-3xl font-black text-dark tracking-tight flex items-center gap-4">
                                        <div className="w-12 h-12 bg-saffron rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <ShoppingCart size={28} weight="fill" />
                                        </div>
                                        Sponsor Items
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {campaign.items.map(item => (
                                        <div 
                                            key={item.id}
                                            className="group bg-light/50 p-8 rounded-[40px] border border-gray-100/50 hover:bg-white hover:border-saffron/30 hover:shadow-2xl transition-all duration-500"
                                        >
                                            <div className="flex items-center gap-6 mb-8">
                                                <div className="w-24 h-24 rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-500">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.item_name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <ShoppingCart size={40} className="text-gray-100" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-dark text-xl leading-tight mb-2">{item.item_name}</h4>
                                                    <div className="inline-block bg-saffron text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        ₹{item.price_per_unit} / {item.unit_name}
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleSponsor(item)}
                                                className="w-full py-5 bg-dark text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-saffron transition-all duration-300 shadow-xl active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                Sponsor Item <HandHeart size={20} weight="fill" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-white/50 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-saffron"></div>
                            
                            <div className="mb-10 text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Current Fundraising Progress</p>
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <span className="text-5xl font-black text-dark tracking-tighter">₹{campaign.current_amount.toLocaleString()}</span>
                                    <div className="bg-saffron/10 text-saffron px-3 py-1.5 rounded-xl font-black text-sm">
                                        {Math.round(progress)}%
                                    </div>
                                </div>
                                <div className="h-4 w-full bg-light rounded-full overflow-hidden shadow-inner p-[4px] mb-4">
                                    <div 
                                        className="h-full bg-saffron rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,153,51,0.5)] relative" 
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 font-bold tracking-tight">
                                    Target Milestone: <span className="text-dark">₹{campaign.goal_amount.toLocaleString()}</span>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={() => handleSponsor(null)}
                                    className="w-full bg-saffron text-white py-6 rounded-[28px] font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(255,153,51,0.3)] hover:bg-dark hover:shadow-dark/20 transition-all duration-500 active:scale-95 flex items-center justify-center gap-4 text-sm"
                                >
                                    <HandHeart size={28} weight="fill" className="animate-pulse" /> Contribute Support
                                </button>
                                <div className="flex items-center justify-center gap-3 py-4 border-t border-gray-50 mt-6">
                                    <ShieldCheck size={20} className="text-green-500" weight="fill" />
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Secure UPI Verification</p>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action Sidebar */}
                        <div className="bg-dark rounded-[48px] p-10 shadow-2xl text-white relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                           <h4 className="text-2xl font-black mb-4 relative z-10 tracking-tight">Need Bulk Support?</h4>
                           <p className="text-white/60 text-sm mb-10 leading-relaxed relative z-10 font-medium">
                               For corporate CSR or large scale mission support, please get in touch with our national team directly.
                           </p>
                           <Link 
                            to="/contact" 
                            className="bg-white/10 hover:bg-white text-white hover:text-dark w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-white/10"
                           >
                            Contact National Team
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
