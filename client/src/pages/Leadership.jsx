import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LeaderCard from '../components/LeaderCard';
import LeaderIDModal from '../components/LeaderIDModal';
import { LEADERS } from '../constants/data';
import SEO from '../components/SEO';

export default function Leadership() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLeader, setSelectedLeader] = useState(null);

  // Sync selectedLeader with URL param 'leader'
  useEffect(() => {
    const leaderParam = searchParams.get('leader');
    if (leaderParam) {
      const exists = LEADERS.find(l => l.name === leaderParam);
      if (exists) {
        setSelectedLeader(exists);
      }
    } else {
      setSelectedLeader(null);
    }
  }, [searchParams]);

  const handleLeaderSelect = (leader) => {
    setSearchParams({ leader: leader.name });
  };

  const handleLeaderClose = () => {
    setSearchParams({});
  };

  return (
    <div className="pt-32 pb-24 bg-light min-h-screen">
      <SEO 
        title={selectedLeader ? `${selectedLeader.name} | Leadership` : "Our Leadership"} 
        description={selectedLeader ? `View the official NGO profile of ${selectedLeader.name}, ${selectedLeader.role} at HinduVahini.` : "Meet the dedicated core members driving HinduVahini's vision of cultural preservation and community welfare."}
        url={selectedLeader ? `/leadership?leader=${encodeURIComponent(selectedLeader.name)}` : "/leadership"}
        image={selectedLeader ? selectedLeader.image : undefined}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4 drop-shadow-sm font-heading tracking-tight">Our Leadership</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Meet the dedicated core members driving HinduVahini's vision of cultural preservation and community welfare across the nation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LEADERS.map((leader, index) => (
            <div key={index} className="animation-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <LeaderCard 
                leader={leader} 
                isVertical={true} 
                onClick={() => handleLeaderSelect(leader)}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedLeader && (
        <LeaderIDModal 
            leader={selectedLeader} 
            onClose={handleLeaderClose} 
        />
      )}
    </div>
  );
}
