import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HandHeart, TrendUp, ShareNetwork, WhatsappLogo, Copy, Check } from '@phosphor-icons/react';

const CampaignCard = ({ campaign }) => {
    const [copied, setCopied] = useState(false);
    const progress = Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100);
    
    const shareUrl = `${window.location.origin}/campaigns/${campaign.id}`;
    const shareText = `Check out this mission: ${campaign.title}. Your support can make a huge difference! `;

    const copyLink = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOnWhatsApp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="bg-white rounded-[32px] overflow-hidden shadow-soft border border-gray-100 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col h-full relative">
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={campaign.image_url || '/placeholder-banner.jpg'} 
                    alt={campaign.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-dark">Active Mission</span>
                </div>

                {/* Quick Share Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                    <button 
                        onClick={shareOnWhatsApp}
                        className="w-9 h-9 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                        title="Share on WhatsApp"
                    >
                        <WhatsappLogo size={20} weight="fill" />
                    </button>
                    <button 
                        onClick={copyLink}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-saffron'}`}
                        title="Copy Mission Link"
                    >
                        {copied ? <Check size={20} weight="bold" /> : <Copy size={20} weight="bold" />}
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-dark mb-2 leading-tight line-clamp-2 h-14 group-hover:text-saffron transition-colors">
                    {campaign.title}
                </h3>
                <p className="text-gray-500 text-xs font-medium line-clamp-2 mb-6 h-8">
                    {campaign.short_description}
                </p>

                {/* Progress Area */}
                <div className="mt-auto space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-1.5">
                                <TrendUp size={16} className="text-saffron" weight="bold" />
                                <span className="text-xs font-black text-dark tracking-wide">
                                    ₹{campaign.current_amount.toLocaleString()} 
                                    <span className="text-gray-400 font-bold ml-1 uppercase text-[9px]">Raised</span>
                                </span>
                            </div>
                            <span className="text-saffron font-black text-sm">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 w-full bg-light rounded-full overflow-hidden shadow-inner p-[2px]">
                            <div 
                                className="h-full bg-saffron rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,153,51,0.3)]" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <Link 
                            to={`/campaigns/${campaign.id}`}
                            className="flex-1 bg-saffron hover:bg-dark text-white text-center py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-saffron/10"
                        >
                            Contribute Now <HandHeart size={18} weight="fill" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
