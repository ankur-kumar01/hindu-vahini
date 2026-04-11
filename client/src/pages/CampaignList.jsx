import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Megaphone, 
  HandHeart, 
  ChartLineUp, 
  UsersThree
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
                title="Active Missions" 
                description="Join our active welfare missions. From animal rescue to child nutrition, see how your contributions create a direct impact."
                url="/campaigns"
            />

            {/* Hero Section */}
            <section className="bg-dark py-16 md:py-24 px-6 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-saffron/10 opacity-30"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 font-heading text-white leading-tight">
                        Our Active <span className="text-saffron">Missions</span>
                    </h1>
                    <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                        Direct impact through targeted welfare programs. Choose a cause close to your heart and witness the change you help create.
                    </p>
                </div>
            </section>

            {/* Stats Overview */}
            <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 group hover:border-saffron/30 transition-all">
                        <div className="w-12 h-12 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron group-hover:scale-110 transition-transform">
                            <HandHeart size={28} weight="duotone" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark">{campaigns.length}+</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Causes</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 group hover:border-saffron/30 transition-all">
                        <div className="w-12 h-12 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron group-hover:scale-110 transition-transform">
                            <ChartLineUp size={28} weight="duotone" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark">100%</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Direct Impact</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 group hover:border-saffron/30 transition-all">
                        <div className="w-12 h-12 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron group-hover:scale-110 transition-transform">
                            <UsersThree size={28} weight="duotone" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark">5k+</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lives Touched</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Campaign Grid */}
            <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-30">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-saffron rounded-full animate-spin"></div>
                        <p className="mt-4 font-bold text-xs uppercase tracking-widest text-gray-400">Fetching Missions...</p>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                         <Megaphone size={48} className="mx-auto text-gray-200 mb-4" />
                         <p className="text-gray-400 font-medium">No active campaigns at the moment. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {campaigns.map((campaign) => (
                           <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="bg-light py-20 border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-block p-4 bg-white rounded-3xl shadow-soft mb-8">
                        <Megaphone size={32} className="text-saffron" weight="duotone" />
                    </div>
                    <h2 className="text-3xl font-bold text-dark mb-6">Support Our Vision</h2>
                    <p className="text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
                        Every big change starts with a small gesture. Whether it's a fixed donation or a specific item contribution, your contribution goes directly to the ground.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/donate" className="w-full sm:w-auto bg-dark hover:bg-dark/90 text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all active:scale-95">
                            Direct Contribution
                        </Link>
                        <Link to="/contact" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-dark border border-gray-100 px-10 py-4 rounded-full font-bold shadow-md transition-all active:scale-95">
                            Contact Organizers
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CampaignList;
