import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  CaretLeft, 
  HandHeart, 
  ShoppingCart, 
  CurrencyInr, 
  SealCheck, 
  Info,
  CalendarBlank,
  ShareNetwork,
  Check
} from '@phosphor-icons/react';
import SEO from '../components/SEO';
import DonationModal from '../components/DonationModal';

const CampaignDetail = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDonationOpen, setIsDonationOpen] = useState(false);
    const [initialDonation, setInitialDonation] = useState({ amount: '', item: null });

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/campaigns/${id}`);
                const data = await res.json();
                setCampaign(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleSponsor = (item) => {
        setInitialDonation({ 
            amount: item.price_per_unit, 
            item: item,
            campaignId: campaign.id
        });
        setIsDonationOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-40 flex flex-col items-center justify-center grayscale opacity-30">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-saffron rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen pt-40 text-center">
                <h2 className="text-2xl font-bold text-dark">Campaign not found</h2>
                <Link to="/campaigns" className="text-saffron font-bold mt-4 inline-block underline">Back to missions</Link>
            </div>
        );
    }

    const progress = Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100);

    return (
        <div className="pt-20 md:pt-28 min-h-screen bg-light pb-20">
            <SEO 
                title={campaign.title} 
                description={campaign.short_description}
                url={`/campaigns/${campaign.id}`}
            />

            <div className="max-w-7xl mx-auto px-6">
                {/* Breakcrumbs */}
                <Link to="/campaigns" className="inline-flex items-center gap-2 text-gray-400 hover:text-saffron transition-colors text-xs font-bold uppercase tracking-widest mb-8">
                    <CaretLeft size={16} weight="bold" /> Back to missions
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Main Content */}
                    <div className="lg:col-span-8 space-y-8 md:space-y-12">
                        <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white h-64 md:h-[450px]">
                            <img src={campaign.image_url || '/placeholder-banner.jpg'} alt={campaign.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-10 left-10 right-10">
                                <h1 className="text-3xl md:text-5xl font-bold text-white font-heading leading-tight drop-shadow-lg">{campaign.title}</h1>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-soft border border-gray-100">
                             <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-saffron/10 rounded-2xl text-saffron">
                                    <Info size={24} weight="duotone" />
                                </div>
                                <h2 className="text-2xl font-bold text-dark font-heading">Mission Description</h2>
                             </div>
                             
                             <div className="prose prose-lg text-gray-500 leading-relaxed font-medium">
                                {campaign.description?.split('\n').map((para, i) => (
                                    <p key={i} className="mb-6">{para}</p>
                                ))}
                             </div>

                             {/* Trust Pillars */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-12 border-t border-gray-50">
                                 <div className="flex items-start gap-4 p-5 bg-light rounded-[24px]">
                                     <SealCheck size={32} className="text-green-500" weight="fill" />
                                     <div>
                                         <h4 className="font-bold text-dark text-sm uppercase tracking-wide">Verified Mission</h4>
                                         <p className="text-xs text-gray-500 mt-1">Managed directly by HinduVahini Trust committee.</p>
                                     </div>
                                 </div>
                                 <div className="flex items-start gap-4 p-5 bg-light rounded-[24px]">
                                     <ShareNetwork size={32} className="text-saffron" weight="fill" />
                                     <div>
                                         <h4 className="font-bold text-dark text-sm uppercase tracking-wide">Live Transparency</h4>
                                         <p className="text-xs text-gray-500 mt-1">Every approved donation reflects on the live goal tracker.</p>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Right: Sidebar / Widget */}
                    <div className="lg:col-span-4 space-y-8 sticky top-32 h-fit">
                        {/* Progress Widget */}
                        <div className="bg-white rounded-[40px] p-8 shadow-xl border-t-8 border-saffron group">
                            <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                                <HandHeart size={24} className="text-saffron" weight="fill" /> Support Goal
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impact Raised</p>
                                            <p className="text-3xl font-black text-dark tracking-tighter">₹{campaign.current_amount.toLocaleString()}</p>
                                        </div>
                                        <span className="text-saffron font-black text-2xl">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-light rounded-full overflow-hidden shadow-inner border border-gray-50">
                                        <div 
                                            className="h-full bg-saffron transition-all duration-1000 shadow-[0_0_15px_rgba(255,153,51,0.4)] relative" 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">Target: ₹{campaign.goal_amount.toLocaleString()}</p>
                                </div>

                                <button 
                                    onClick={() => {
                                        setInitialDonation({ amount: '', item: null, campaignId: campaign.id });
                                        setIsDonationOpen(true);
                                    }}
                                    className="w-full bg-dark hover:bg-dark/90 text-white font-bold py-5 rounded-3xl transition-all shadow-xl shadow-dark/20 active:scale-95 text-lg"
                                >
                                    Direct Donation
                                </button>
                                
                                <p className="text-[10px] text-center text-gray-400 italic px-4">
                                    Funds are allocated exclusively to this project's field expenses.
                                </p>
                            </div>
                        </div>

                        {/* Item Sponsorships */}
                        {campaign.items && campaign.items.length > 0 && (
                            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100">
                                <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                                    <ShoppingCart size={24} className="text-saffron" weight="duotone" /> Contribute to Items
                                </h3>
                                
                                <div className="space-y-4">
                                    {campaign.items.map(item => (
                                        <button 
                                            key={item.id}
                                            onClick={() => handleSponsor(item)}
                                            className="w-full group/item text-left p-4 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-saffron/30 hover:shadow-lg transition-all flex items-center gap-4"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm group-hover/item:border-saffron/20 transition-all">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ShoppingCart size={24} className="text-gray-300 group-hover/item:text-saffron transition-colors" weight="duotone" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-dark text-sm leading-tight truncate">{item.item_name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 group-hover/item:text-saffron transition-colors">
                                                    ₹{item.price_per_unit} / {item.unit_name}
                                                </p>
                                            </div>
                                            <div className="text-gray-300 group-hover/item:text-saffron transition-all">
                                                <Plus size={20} weight="bold" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reusable Donation Modal with Campaign Context */}
            <DonationModal 
                isOpen={isDonationOpen}
                onClose={() => setIsDonationOpen(false)}
                initialAmount={initialDonation.amount}
                campaignItem={initialDonation.item}
                campaignId={campaign.id}
                campaignTitle={campaign.title}
            />
        </div>
    );
};

// Simple Plus icon helper if not imported
const Plus = ({ size, weight, className }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" className={className}>
        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
    </svg>
);

export default CampaignDetail;
