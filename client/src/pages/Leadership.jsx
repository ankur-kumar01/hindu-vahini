import LeaderCard from '../components/LeaderCard';
import { LEADERS } from '../constants/data';
import SEO from '../components/SEO';

export default function Leadership() {
  return (
    <div className="pt-32 pb-24 bg-light min-h-screen">
      <SEO 
        title="Our Leadership" 
        description="Meet the dedicated core members driving HinduVahini's vision of cultural preservation and community welfare across the nation."
        url="/leadership"
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4 drop-shadow-sm">Our Leadership</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Meet the dedicated core members driving HinduVahini's vision of cultural preservation and community welfare across the nation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LEADERS.map((leader, index) => (
            <div key={index} className="animation-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <LeaderCard leader={leader} isVertical={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
