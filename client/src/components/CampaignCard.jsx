import { HandHeart, ArrowsOutSimple } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const CampaignCard = ({ campaign }) => {
    const progress = Math.min(100, (campaign.current_amount / campaign.goal_amount) * 100);
    
    return (
        <div className="group bg-white rounded-[32px] overflow-hidden border border-gray-100/50 shadow-soft hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                    src={campaign.image_url || '/placeholder-mission.jpg'} 
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Impact Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[10px] font-black uppercase tracking-widest text-dark flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-saffron rounded-full animate-pulse"></div>
                        Direct Impact
                    </span>
                </div>

                <Link 
                    to={`/campaigns/${campaign.id}`}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-dark opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-saffron hover:text-white shadow-xl"
                >
                    <ArrowsOutSimple size={20} weight="bold" />
                </Link>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-dark group-hover:text-saffron transition-colors line-clamp-1 mb-2">
                        {campaign.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-medium">
                        {campaign.short_description || campaign.description}
                    </p>
                </div>

                <div className="mt-auto space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Raised So Far</p>
                                <p className="text-lg font-black text-dark tracking-tighter">₹{campaign.current_amount.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-black text-saffron">{Math.round(progress)}%</span>
                            </div>
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
                            className="flex-1 bg-saffron hover:bg-dark text-white text-center py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-saffron/10 group-hover:scale-[1.02]"
                        >
                            Contribute Now <HandHeart size={18} weight="fill" className="animate-pulse" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
