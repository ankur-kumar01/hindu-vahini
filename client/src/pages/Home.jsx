import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { CheckCircle, UsersThree, FlowerLotus, Books, HandHeart, UsersFour, CrownSimple, Phone, Images } from '@phosphor-icons/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import LeaderCard from '../components/LeaderCard';
import DonationModal from '../components/DonationModal';
import SEO from '../components/SEO';
import { LEADERS, GALLERY_IMAGES } from '../constants/data';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');

  const openDonation = (amt = '') => {
    setSelectedAmount(amt);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <SEO 
        title="Preserving Culture. Empowering Communities." 
        description="HinduVahini is a cultural NGO dedicated to preserving our rich heritage, advancing educational empowerment, and creating a sustainable positive impact on society."
        url="/"
      />
      
      {/* Hero Section - Restored to original aesthetics */}
      <section id="home" className="relative flex items-center justify-center min-h-[95vh] text-center px-6 overflow-hidden pt-20">
        {/* Background Layer with Animation */}
        <div className="absolute inset-[-5%] z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-dark/95 to-dark/85 z-10"></div>
          <div className="absolute inset-0 hero-radial-gradient z-20"></div>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Akshardham_Temple_Delhi_%287367683918%29.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover animate-kenburns"
          />
        </div>

        <div className="relative z-30 max-w-4xl mx-auto flex flex-col items-center fade-in">
          <span className="bg-saffron/20 text-saffron text-sm font-bold uppercase tracking-[2px] py-2 px-5 rounded-full mb-6 border border-saffron/50">
            Together We Conserve
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Preserving Culture.<br /><span className="text-white">Empowering Communities.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Join us in our mission to protect heritage, foster unity, advance education, and create lasting social impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button 
              onClick={() => openDonation()} 
              className="bg-saffron text-white px-10 py-4 rounded-full font-bold hover:bg-saffronLight hover:-translate-y-1 transition-all w-full sm:w-auto shadow-[0_4px_15px_rgba(255,153,51,0.3)]"
            >
              Donate Now
            </button>
            <a 
              href="#about" 
              className="bg-transparent border-2 border-white/50 text-white px-10 py-[14px] rounded-full font-bold hover:bg-white hover:text-dark hover:border-white hover:-translate-y-1 transition-all w-full sm:w-auto"
            >
              Discover Our Mission
            </a>
          </div>
        </div>
      </section>

      {/* National President Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 items-center bg-light p-10 md:p-12 rounded-[20px] border-l-[6px] border-saffron shadow-soft">
            <div className="relative rounded-[15px] overflow-hidden aspect-[3/4] border-[5px] border-white shadow-img animation-slide-up mx-auto w-full max-w-[280px] md:max-w-full">
              <img src="/upload/leaders_img/ashwani_mishra.jpg" alt="Ashwani Mishra" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 bg-saffron text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                <CrownSimple weight="fill" size={24} />
              </div>
            </div>
            <div className="animation-slide-up animation-delay-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-dark">Ashwani Mishra</h2>
              <span className="inline-block text-lg font-semibold text-[#c65b13] mb-6">Rashtriya Adhyaksh — HinduVahini</span>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Shri Ashwani Mishra ji leads HinduVahini's national mission with unwavering dedication to Hindu cultural values, guiding our initiatives across Bharat to preserve heritage and empower communities unconditionally.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="tel:+919935568569" className="flex items-center gap-2 bg-saffron text-white px-6 py-2.5 rounded-full font-medium hover:bg-saffronLight transition-colors shadow-md">
                  <Phone weight="fill" /> +91 99355 68569
                </a>
                <a href="tel:+918318339152" className="flex items-center gap-2 bg-transparent border-2 border-saffron text-saffron px-6 py-2 rounded-full font-medium hover:bg-saffron hover:text-white transition-colors">
                  <Phone weight="fill" /> +91 83183 39152
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="animation-slide-up">
            <h2 className="text-4xl font-bold mb-6 text-dark relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-saffron">Our Vision</h2>
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">HinduVahini is a cultural NGO dedicated to preserving our rich heritage while creating a sustainable, positive impact on society. We bridge the gap between tradition and modern philanthropy.</p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">Through spiritual unity, educational empowerment, and social welfare, we strive to uplift communities unconditionally and connect individuals globally to their cultural roots.</p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-lg font-medium text-dark"><CheckCircle weight="fill" size={24} className="text-saffron" /> Cultural Preservation</li>
              <li className="flex items-center gap-3 text-lg font-medium text-dark"><CheckCircle weight="fill" size={24} className="text-saffron" /> Digital Community Building</li>
              <li className="flex items-center gap-3 text-lg font-medium text-dark"><CheckCircle weight="fill" size={24} className="text-saffron" /> Volunteer-driven Outreach</li>
            </ul>
          </div>
          <div className="relative animation-slide-up animation-delay-1">
            <img src="/our_vision.jpeg" alt="HinduVahini Vision" className="rounded-2xl shadow-img w-full object-cover" />
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-soft flex items-center gap-4 hidden sm:flex">
              <UsersThree weight="fill" size={48} className="text-saffron" />
              <div>
                <div className="text-2xl font-bold text-dark">10,000+</div>
                <div className="text-gray-500 font-medium">Volunteers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section id="initiatives" className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-dark relative inline-block pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-saffron">Our Initiatives</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">Empowering through action. Discover how we bring our mission to life through various focused projects.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:-translate-y-2 transition-transform duration-300 animation-slide-up">
              <div className="w-16 h-16 rounded-full bg-saffron/10 flex items-center justify-center text-saffron text-3xl mx-auto mb-6">
                <FlowerLotus weight="fill" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark">Cultural Preservation</h3>
              <p className="text-gray-600">Organizing heritage walks, digital archiving of ancient texts, and promoting classical arts & Sanskrit education.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:-translate-y-2 transition-transform duration-300 animation-slide-up animation-delay-1">
              <div className="w-16 h-16 rounded-full bg-saffron/10 flex items-center justify-center text-saffron text-3xl mx-auto mb-6">
                <Books weight="fill" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark">Education & Awareness</h3>
              <p className="text-gray-600">Providing scholarships, establishing gurukuls, and organizing awareness camps on foundational cultural values.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:-translate-y-2 transition-transform duration-300 animation-slide-up animation-delay-2">
              <div className="w-16 h-16 rounded-full bg-saffron/10 flex items-center justify-center text-saffron text-3xl mx-auto mb-6">
                <HandHeart weight="fill" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark">Social Welfare</h3>
              <p className="text-gray-600">Food distribution programs (Annadaan), health camps, and emergency relief services for vulnerable groups.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:-translate-y-2 transition-transform duration-300 animation-slide-up">
              <div className="w-16 h-16 rounded-full bg-saffron/10 flex items-center justify-center text-saffron text-3xl mx-auto mb-6">
                <UsersFour weight="fill" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-dark">Community Events</h3>
              <p className="text-gray-600">Bringing people together through grand festival celebrations, unity drives, and regular cultural symposiums.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Preview */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-dark relative inline-block pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-saffron">Meet Our Leadership</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">Guided by vision, driven by dharma and service.</p>
          
          <div className="mb-12">
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="px-4 py-12"
            >
              {LEADERS.map((leader, i) => (
                <SwiperSlide key={i}>
                  <LeaderCard leader={leader} isVertical={true} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <Link to="/leadership" className="inline-flex items-center gap-2 bg-transparent border-2 border-saffron text-saffron px-10 py-4 rounded-full font-bold hover:bg-saffron hover:text-white transition-all transform hover:-translate-y-1 shadow-md hover:shadow-lg">
            <UsersThree size={24} /> View All Team Members
          </Link>
        </div>
      </section>

      {/* Donation */}
      <section id="donate" className="py-24 bg-saffron relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Support the Dharma. Empower the Future.</h2>
          <p className="text-lg text-white/90 mb-12">Your contribution directly sustains our educational and welfare programs. Every drop makes an ocean.</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-10 text-left">
            <div className="flex justify-between text-sm font-semibold mb-3">
              <span>Raised: ₹5,12,000</span>
              <span>Goal: ₹10,00,000</span>
            </div>
            <div className="w-full bg-dark/20 rounded-full h-4 overflow-hidden">
              <div className="bg-white h-full rounded-full transition-all duration-1000" style={{width: '51%'}}></div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => openDonation('50')} className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors">₹50</button>
            <button onClick={() => openDonation('200')} className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors">₹200</button>
            <button onClick={() => openDonation('1000')} className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors">₹1000</button>
            <button onClick={() => openDonation()} className="bg-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-dark/90 transition-colors shadow-lg">Donate Custom</button>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4 text-dark relative inline-block pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-saffron">Journey Highlights</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">Glimpses of our recent community gatherings and cultural initiatives.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] mb-16">
            {GALLERY_IMAGES.slice(0, 5).map((img, i) => (
              <div key={i} className={`relative rounded-xl overflow-hidden shadow-sm hover:shadow-img transition-shadow duration-300 ${img.span} group`}>
                <img src={img.src} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium tracking-wide">View Image</span>
                </div>
              </div>
            ))}
          </div>

          <Link to="/gallery" className="inline-flex items-center gap-2 bg-transparent border-2 border-dark text-dark px-10 py-4 rounded-full font-bold hover:bg-dark hover:text-white transition-all transform hover:-translate-y-1 shadow-md hover:shadow-lg">
            <Images size={24} /> View Full Journey Gallery
          </Link>
        </div>
      </section>

      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialAmount={selectedAmount} 
      />
    </div>
  );
}
