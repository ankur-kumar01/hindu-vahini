import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LeaderCard from '../components/LeaderCard';
import LeaderIDModal from '../components/LeaderIDModal';
import SEO from '../components/SEO';

const STATES = ['National', 'Uttar Pradesh', 'Haryana', 'Delhi', 'Uttarakhand', 'Bihar', 'Maharashtra'];

export default function Leadership() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeState, setActiveState] = useState('National');

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
        // Auto-switch to the leader's state tab
        if (exists.state) setActiveState(exists.state);
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

  // Filter leaders by active state tab
  const filteredLeaders = leaders.filter(l => {
    if (activeState === 'National') return !l.state || l.state === 'National';
    return l.state === activeState;
  });

  return (
    <div className="pt-32 pb-24 bg-light min-h-screen">
      <SEO 
        title={selectedLeader ? `${selectedLeader.name} | Leadership` : "Our Leadership"} 
        description={selectedLeader ? `View the official NGO profile of ${selectedLeader.name}, ${selectedLeader.role} at HinduVahini.` : "Meet the dedicated core members driving HinduVahini's vision of cultural preservation and community welfare."}
        url={selectedLeader ? `/leadership?leader=${encodeURIComponent(selectedLeader.name)}` : "/leadership"}
        image={selectedLeader ? selectedLeader.image_url : undefined}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4 drop-shadow-sm font-heading tracking-tight">Our Leadership</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Meet the dedicated core members driving HinduVahini's vision across the nation.
          </p>
        </div>

        {/* State Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12 px-2">
          {STATES.map(state => (
            <button
              key={state}
              onClick={() => setActiveState(state)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                activeState === state
                  ? 'bg-saffron text-white border-saffron shadow-md shadow-saffron/20 scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-saffron hover:text-saffron'
              }`}
            >
              {state === 'National' ? '🇮🇳 National' : state}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading Leadership...</div>
        ) : filteredLeaders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg font-medium">No leaders found for <span className="text-saffron font-bold">{activeState}</span>.</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon or browse other regions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLeaders.map((leader, index) => (
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
