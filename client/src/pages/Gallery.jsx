import { GALLERY_IMAGES } from '../constants/data';

export default function Gallery() {
  return (
    <div className="pt-32 pb-24 bg-light min-h-screen">
       <div className="max-w-7xl mx-auto px-6 text-center">
         <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Journey Highlights</h1>
         <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">Glimpses of our recent events, community gatherings, and cultural initiatives.</p>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
           {GALLERY_IMAGES.map((img, i) => (
             <div key={i} className={`relative rounded-xl overflow-hidden shadow-sm hover:shadow-img transition-shadow duration-300 ${img.span} animation-slide-up group`} style={{ animationDelay: `${i * 0.1}s` }}>
               <img src={img.src} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <span className="text-white font-medium tracking-wide">Zoom In</span>
               </div>
             </div>
           ))}
         </div>
       </div>
    </div>
  );
}
