import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LeaderCard from '../components/LeaderCard';
import LeaderIDModal from '../components/LeaderIDModal';
import SEO from '../components/SEO';

export default function Leadership() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaders from MySQL Backend CMS
  useEffect(() => {
    fetch('/api/leaders')
      .then(res => res.json())
      .then(data => {
        setLeaders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch leaders:', err);
        setLoading(false);
      });
  }, []);

  // Sync selectedLeader with URL param 'leader'
  useEffect(() => {
    if (leaders.length === 0) return;
    const leaderParam = searchParams.get('leader');
    if (leaderParam) {
      const exists = leaders.find(l => l.name === leaderParam);
      if (exists) {
        setSelectedLeader(exists);
      }
    } else {
      setSelectedLeader(null);
    }
  }, [searchParams, leaders]);

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
        image={selectedLeader ? selectedLeader.image_url : undefined}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4 drop-shadow-sm font-heading tracking-tight">Our Leadership</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Meet the dedicated core members driving HinduVahini's vision of cultural preservation and community welfare across the nation.
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading Leadership...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
            <div key={leader.id || index} className="animation-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <LeaderCard 
                leader={leader} 
                isVertical={true} 
                onClick={() => handleLeaderSelect(leader)}
              />
            </div>
          ))}
          </div>
        )}
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
