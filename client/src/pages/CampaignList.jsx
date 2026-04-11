import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Megaphone, 
  HandHeart, 
  ChartLineUp, 
  UsersThree,
  ArrowRight
} from '@phosphor-icons/react';
import SEO from '../components/SEO';
import CampaignCard from '../components/CampaignCard';

const CampaignList = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await fetch('/api/campaigns');
                const data = await res.json();
                setCampaigns(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    return (
        <div className="pt-20 md:pt-28 min-h-screen bg-light">
            <SEO 
                title="Active Missions | HinduVahini" 
                description="Join our active welfare missions. From cultural preservation to community empowerment, see how your contributions create a direct impact."
                url="/campaigns"
            />

            {/* Sub-Hero / Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                    <Link to="/" className="hover:text-saffron transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-saffron">Active Missions</span>
                </div>
            </div>

            {/* Page Header */}
            <section className="bg-dark py-20 px-6 text-center text-white relative overflow-hidden border-b border-white/5 shadow-2xl">
                <div className="absolute top-0 left-0 w-64 h-64 bg-saffron/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-saffron/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-20"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="inline-block px-4 py-1.5 bg-saffron/10 border border-saffron/30 rounded-full text-saffron text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        Service to Humanity is Service to God
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading text-white leading-tight tracking-tight">
                        Our Active <span className="text-saffron">Missions</span>
                    </h1>
                    <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
                        Direct impact through targeted welfare programs. Choose a cause close to your heart and witness the change you help create.
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: HandHeart, label: 'Active Missions', value: campaigns.length > 0 ? `${campaigns.length}+` : '12+' },
                        { icon: ChartLineUp, label: 'Transparency', value: '100%' },
                        { icon: UsersThree, label: 'Volunteers', value: '10k+' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100 flex items-center gap-6 group hover:border-saffron/30 transition-all duration-500">
                            <div className="w-16 h-16 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron group-hover:scale-110 group-hover:bg-saffron group-hover:text-white transition-all duration-500">
                                <stat.icon size={32} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-dark tracking-tighter">{stat.value}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Campaign Grid */}
            <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-14 h-14 border-4 border-gray-100 border-t-saffron rounded-full animate-spin shadow-lg"></div>
                        <p className="mt-6 font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Loading Active Missions</p>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100 shadow-inner">
                         <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Megaphone size={40} className="text-gray-300" />
                         </div>
                         <p className="text-dark font-bold text-xl mb-2">No missions active right now</p>
                         <p className="text-gray-400 max-w-sm mx-auto">We are preparing new initiatives. Check back soon for more opportunities to serve.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                        {campaigns.map((campaign, i) => (
                           <div key={campaign.id} className="animation-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                             <CampaignCard campaign={campaign} />
                           </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Impact Footer */}
            <section className="bg-white py-24 border-t border-gray-100 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl font-bold text-dark mb-6">Every Contribution Counts</h2>
                    <p className="text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed text-lg">
                        Our transparent framework ensures your support reaches those who need it most. Join our community of dedicated contributors today.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <Link to="/about" className="bg-dark text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:bg-dark/90 transition-all hover:-translate-y-1">
                            Learn Our Methodology
                        </Link>
                        <Link to="/contact" className="bg-transparent border-2 border-dark text-dark px-10 py-4 rounded-full font-bold hover:bg-dark hover:text-white transition-all hover:-translate-y-1">
                            Join as Volunteer
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CampaignList;
