import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { GALLERY_IMAGES } from '../constants/data';
import SEO from '../components/SEO';
import ImageModal from '../components/ImageModal';

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const itemsPerPage = 8;
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(GALLERY_IMAGES.length / itemsPerPage);
  const validPage = Math.max(1, Math.min(currentPage, totalPages));

  // Sync selectedImage with URL param 'img'
  useEffect(() => {
    const imgParam = searchParams.get('img');
    if (imgParam) {
      const exists = GALLERY_IMAGES.find(i => i.src === imgParam);
      if (exists) {
        setSelectedImage(imgParam);
        const imgIndex = GALLERY_IMAGES.findIndex(i => i.src === imgParam);
        const imgPage = Math.floor(imgIndex / itemsPerPage) + 1;
        if (imgPage !== validPage) {
          setSearchParams(prev => {
            prev.set('page', imgPage);
            return prev;
          }, { replace: true });
        }
      }
    } else {
      setSelectedImage(null);
    }
  }, [searchParams, validPage]);

  const handleSelectImage = (src) => {
    setSearchParams(prev => {
      prev.set('img', src);
      return prev;
    });
  };

  const handleCloseImage = () => {
    setSearchParams(prev => {
      prev.delete('img');
      return prev;
    });
  };

  const paginate = (pageNumber) => {
    setSearchParams(prev => {
      prev.set('page', pageNumber);
      return prev;
    });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const indexOfLastItem = validPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = GALLERY_IMAGES.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="pt-32 pb-24 bg-light min-h-screen">
      <SEO 
        title={`Journey Highlights — Page ${validPage}`} 
        description={`Explore our recent event photos on page ${validPage}. Glimpses of community gatherings and cultural initiatives.`}
        url={`/gallery?page=${validPage}`}
      />
       <div className="max-w-7xl mx-auto px-6 text-center">
         <div className="mb-16">
           <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4 drop-shadow-sm font-heading">Journey Highlights</h1>
           <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">Glimpses of our recent events, community gatherings, and cultural initiatives.</p>
         </div>
         
         {/* Gallery Grid */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] mb-16 px-2">
           {currentItems.map((img, i) => (
             <div 
               key={i} 
               onClick={() => handleSelectImage(img.src)}
               className={`relative rounded-xl overflow-hidden shadow-sm hover:shadow-img transition-shadow duration-300 ${img.span} animation-slide-up group cursor-pointer`} 
               style={{ animationDelay: `${(i % itemsPerPage) * 0.1}s` }}
             >
               <img src={img.src} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                 <span className="text-white font-medium tracking-wide bg-dark/40 px-4 py-2 rounded-full text-sm">View Full Size</span>
               </div>
             </div>
           ))}
         </div>

         {/* Pagination Controls */}
         {totalPages > 1 && (
           <div className="flex items-center justify-center gap-2 md:gap-4 mt-12 overflow-x-auto py-2">
             <button
               onClick={() => paginate(validPage - 1)}
               disabled={validPage === 1}
               className={`p-2 rounded-full border border-gray-200 transition-all ${validPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-dark hover:bg-saffron hover:text-white hover:border-saffron shadow-sm'}`}
             >
               <CaretLeft size={24} weight="bold" />
             </button>

             <div className="flex items-center gap-2">
               {[...Array(totalPages)].map((_, i) => (
                 <button
                   key={i}
                   onClick={() => paginate(i + 1)}
                   className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold transition-all border ${validPage === i + 1 ? 'bg-saffron border-saffron text-white shadow-md scale-110' : 'bg-white border-gray-200 text-gray-500 hover:border-saffron hover:text-saffron'}`}
                 >
                   {i + 1}
                 </button>
               ))}
             </div>

             <button
               onClick={() => paginate(validPage + 1)}
               disabled={validPage === totalPages}
               className={`p-2 rounded-full border border-gray-200 transition-all ${validPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-dark hover:bg-saffron hover:text-white hover:border-saffron shadow-sm'}`}
             >
               <CaretRight size={24} weight="bold" />
             </button>
           </div>
         )}

         {/* Image Modal */}
         {selectedImage && (
           <ImageModal 
             image={selectedImage} 
             onClose={handleCloseImage} 
           />
         )}
       </div>
    </div>
  );
}
