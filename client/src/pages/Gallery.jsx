import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Fire, Star, Heart, WhatsappLogo, Link as LinkIcon, Check } from '@phosphor-icons/react';
import SEO from '../components/SEO';
import ImageModal from '../components/ImageModal';

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('recent'); // 'recent', 'trending', 'promoted'
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likingId, setLikingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [burstId, setBurstId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Ref for double-tap logic
  const clickTimeout = useRef(null);

  // Sync selectedImage with URL param 'img'
  useEffect(() => {
    const imgParam = searchParams.get('img');
    if (imgParam) {
      setSelectedImage(imgParam);
    } else {
      setSelectedImage(null);
    }
  }, [searchParams]);

  // Fetch Gallery from Backend
  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setGalleryImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch gallery:', err);
        setLoading(false);
      });
  }, []);

  // Infinite Scroll Hook
  useEffect(() => {
    const handleScroll = () => {
       if (window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight) {
          setVisibleCount(prev => prev + 10);
       }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset infinite scroll count when swapping tabs
  useEffect(() => {
    setVisibleCount(10);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeTab]);

  const handleLike = async (id) => {
    if (likingId) return; // Prevent double taps
    setLikingId(id);
    try {
      const res = await fetch(`/api/gallery/${id}/like`, { method: 'PUT' });
      if (res.ok) {
        // Optimistic update
        setGalleryImages(prev => prev.map(img => 
          img.id === id ? { ...img, likes: (img.likes || 0) + 1 } : img
        ));
      }
    } catch (err) {
      console.error('Like failed', err);
    }
    setLikingId(null);
  };

  const copyToClipboard = (url, id) => {
    const fullUrl = `${window.location.origin}/gallery?img=${encodeURIComponent(url)}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareOnWhatsApp = (url) => {
    const fullUrl = `${window.location.origin}/gallery?img=${encodeURIComponent(url)}`;
    const shareText = `Check out this highlight from HinduVahini Journey:`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + fullUrl)}`, '_blank');
  };

  const handleSelectImage = (src) => {
    setSearchParams(prev => {
      prev.set('img', src);
      return prev;
    });
  };

  const handleImageInteraction = (img, event) => {
    // If it's a double tap (click count === 2)
    if (event.detail === 2) {
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
      handleLike(img.id);
      
      // Visual Heart flash animation
      setBurstId(img.id);
      setTimeout(() => setBurstId(null), 800);
    } else if (event.detail === 1) {
      // Single tap - slight delay to wait and see if it becomes a double tap
      clickTimeout.current = setTimeout(() => {
        handleSelectImage(img.image_url);
      }, 250);
    }
  };

  const handleCloseImage = () => {
    setSearchParams(prev => {
      prev.delete('img');
      return prev;
    });
  };

  // Filter and sort based on tab
  const getDisplayData = () => {
    let data = [...galleryImages];
    if (activeTab === 'promoted') {
      data = data.filter(img => img.is_promoted);
    } else if (activeTab === 'trending') {
      data.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    // "recent" is already sorted by the backend by display_order ASC, id DESC
    return data;
  };

  const allDisplayData = getDisplayData();
  const displayData = allDisplayData.slice(0, visibleCount);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      <SEO 
        title={selectedImage ? "Photo Highlight" : "Social Feed | HinduVahini Journey"} 
        description={selectedImage ? "View this special moment from our community journey." : "Explore our recent moments, trending activities, and sponsored posts in our dedicated social feed."}
        url={selectedImage ? `/gallery?img=${encodeURIComponent(selectedImage)}` : `/gallery`}
        image={selectedImage}
      />

      {/* Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-gray-100 px-4 py-3 shadow-sm flex items-center justify-between">
         <h1 className="text-xl font-bold font-heading text-dark tracking-tight">Journey Feed</h1>
         <div className="w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center font-bold text-xs uppercase tracking-widest border border-saffron/20">
           {activeTab.charAt(0)}
         </div>
      </header>

      {/* Feed Content */}
      <div className="max-w-xl mx-auto pt-4 pb-12 px-0 sm:px-4 space-y-6">
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-saffron rounded-full animate-spin mx-auto mb-3"></div>
            Loading Feed...
          </div>
        ) : displayData.length === 0 ? (
          <div className="text-center py-20 text-gray-400 px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-gray-300" />
            </div>
            <p className="text-lg font-bold text-gray-400 mb-1">No Posts Yet</p>
            <p className="text-sm">There are no {activeTab} posts to display right now. Check back later!</p>
          </div>
        ) : (
          displayData.map((img) => (
            <article key={img.id} className="bg-white border-y sm:border sm:rounded-2xl border-gray-100 overflow-hidden shadow-sm animation-slide-up">
              
              {/* Header/Sponsored Tag */}
              {img.is_promoted ? (
                <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50 bg-yellow-50/30">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-saffron/20 flex items-center justify-center text-saffron shadow-sm">
                       <Star size={12} weight="fill" />
                     </div>
                     <span className="text-xs font-black uppercase tracking-widest text-saffron">Sponsored Post</span>
                   </div>
                </div>
              ) : (
                <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-50">
                    <img src="/logo.png" alt="HV" className="w-6 h-6 rounded-full border border-gray-100" />
                    <span className="text-xs font-bold text-dark">HinduVahini</span>
                </div>
              )}

              {/* Image */}
              <div 
                className="relative bg-gray-100 w-full aspect-auto flex items-center justify-center group overflow-hidden cursor-pointer"
                onClick={(e) => handleImageInteraction(img, e)}
              >
                <img 
                  src={img.image_url} 
                  alt="Post" 
                  className="w-full h-auto object-cover max-h-[600px] transition-transform duration-700 bg-black group-hover:scale-105"
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px] pointer-events-none">
                  <span className="text-white font-medium tracking-wide bg-dark/40 px-4 py-2 rounded-full text-sm shadow-xl">Double Tap to Like</span>
                </div>

                {/* Animated Double-Tap Heart */}
                {burstId === img.id && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animation-scale-up">
                     <Heart size={120} weight="fill" className="text-white/90 drop-shadow-2xl opacity-90 animate-pulse-subtle" />
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="px-4 py-3 flex items-center gap-4">
                 <button 
                   onClick={() => handleLike(img.id)}
                   disabled={likingId === img.id}
                   className="flex items-center group transition-all hover:scale-110 active:scale-90"
                   aria-label="Like Post"
                 >
                    <Heart 
                      size={24} 
                      className="text-gray-400 group-hover:text-red-500 transition-colors" 
                      weight={img.likes > 0 ? "fill" : "regular"}
                      color={img.likes > 0 ? "#ef4444" : undefined}
                    />
                 </button>

                 <button 
                   onClick={() => shareOnWhatsApp(img.image_url)}
                   className="flex items-center text-[#25D366] hover:opacity-80 transition-all hover:scale-110 active:scale-90"
                   aria-label="Share via WhatsApp"
                 >
                    <WhatsappLogo size={22} weight="fill" />
                 </button>

                 <button 
                   onClick={() => copyToClipboard(img.image_url, img.id)}
                   className="flex items-center text-gray-400 hover:text-dark transition-all hover:scale-110 active:scale-90"
                   aria-label="Copy Link"
                 >
                    {copiedId === img.id ? (
                      <Check size={22} weight="bold" className="text-green-500" />
                    ) : (
                      <LinkIcon size={22} weight="bold" />
                    )}
                 </button>
              </div>

              {/* Meta & Description */}
              <div className="px-4 pb-4">
                {img.likes > 0 && (
                  <p className="text-sm font-bold text-dark mb-1">{img.likes.toLocaleString()} likes</p>
                )}
                
                {(img.title || img.description) && (
                  <div className="text-sm text-gray-800 leading-relaxed mt-2">
                    {img.title && <span className="font-bold mr-2">{img.title}</span>}
                    {img.description && <span className="text-gray-600">{img.description}</span>}
                  </div>
                )}
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-2 font-semibold">
                  {new Date(img.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </article>
          ))
        )}

        {!loading && displayData.length < allDisplayData.length && (
           <div className="w-full flex justify-center py-6">
             <div className="w-6 h-6 border-2 border-gray-200 border-t-saffron rounded-full animate-spin"></div>
           </div>
        )}
      </div>

      {/* Image Modal (Full Preview with its own sharing functions mapping identically to old layout) */}
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={handleCloseImage} 
        />
      )}

      {/* Bottom Navigation Menu */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 pb-safe">
        <ul className="flex items-center justify-around max-w-xl mx-auto h-16">
          <li>
            <button 
              onClick={() => setActiveTab('recent')}
              className={`flex flex-col items-center justify-center w-20 h-full gap-1 transition-all ${activeTab === 'recent' ? 'text-saffron scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Clock size={24} weight={activeTab === 'recent' ? 'fill' : 'regular'} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Recent</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('trending')}
              className={`flex flex-col items-center justify-center w-20 h-full gap-1 transition-all ${activeTab === 'trending' ? 'text-saffron scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Fire size={24} weight={activeTab === 'trending' ? 'fill' : 'regular'} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Trending</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('promoted')}
              className={`flex flex-col items-center justify-center w-20 h-full gap-1 transition-all ${activeTab === 'promoted' ? 'text-saffron scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Star size={24} weight={activeTab === 'promoted' ? 'fill' : 'regular'} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Promoted</span>
            </button>
          </li>
        </ul>
      </nav>
      
    </div>
  );
}
