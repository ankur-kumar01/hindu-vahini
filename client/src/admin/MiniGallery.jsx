import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UploadSimple, Plus, Trash, Images, CheckCircle, Warning, X } from '@phosphor-icons/react';

export default function MiniGallery() {
  const { admin } = useOutletContext();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchGallery();
  }, []);

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const currentImages = images.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setImages(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setSubmitting(true);
    const token = localStorage.getItem('admin_token');
    const data = new FormData();
    data.append('image', imageFile);
    // Default values for mini-uploader
    data.append('span_classes', 'row-span-1 col-span-1');
    data.append('display_order', 0);

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (!response.ok) throw new Error('Upload failed');

      setImageFile(null);
      setImagePreview(null);
      setShowUploader(false);
      setCurrentPage(1); // Go to first page to see new upload
      fetchGallery();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (admin?.role !== 'admin') return;
    if (!window.confirm('Delete this photo?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Delete failed');
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-xl font-black flex items-center gap-2">
              <Images size={24} className="text-saffron" weight="duotone" />
              Gallery Journey
           </h2>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
             {images.length} Photos Captured
           </p>
        </div>

        {!showUploader && (
          <button 
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 bg-saffron text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-saffron/20 active:scale-90 transition-all"
          >
            <Plus size={18} weight="bold" /> Upload
          </button>
        )}
      </div>

      {/* Mini Uploader Overlay/Card */}
      {showUploader && (
        <div className="bg-white/5 border border-saffron/20 p-6 rounded-[2.5rem] relative animation-scale-in">
          <button 
            onClick={() => setShowUploader(false)}
            className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center mb-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-saffron">New Snap</h3>
              <p className="text-[10px] text-gray-400 mt-1">Select or take a photo to add to gallery</p>
            </div>

            <div className={`relative h-64 w-full rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-4 ${
              imagePreview ? 'border-saffron bg-saffron/5' : 'border-white/10 bg-white/[0.02]'
            }`}>
               {imagePreview ? (
                 <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
               ) : (
                 <>
                   <div className="p-5 bg-saffron/10 text-saffron rounded-full animate-pulse-subtle">
                      <UploadSimple size={36} />
                   </div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tap to Select Photo</p>
                 </>
               )}
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={handleImageChange}
                 className="absolute inset-0 opacity-0 cursor-pointer"
                 required
               />
            </div>

            <div className="flex gap-3">
               <button 
                 type="button" 
                 onClick={() => { setShowUploader(false); setImagePreview(null); setImageFile(null); }}
                 className="flex-1 bg-white/5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest"
               >
                 Cancel
               </button>
               <button 
                 type="submit" 
                 disabled={submitting || !imageFile}
                 className="flex-[2] bg-saffron disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-saffron/20"
               >
                 {submitting ? (
                   <>
                     <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                     Uploading...
                   </>
                 ) : (
                   'Post to Gallery'
                 )}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick View Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
           <div className="w-10 h-10 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin mx-auto"></div>
           <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Syncing Journey...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {currentImages.map(img => (
              <div key={img.id} className="relative aspect-square rounded-[1.25rem] overflow-hidden border border-white/5 bg-white/5 group">
                <img src={img.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery" />
                
                {/* Actions Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[8px] font-black uppercase tracking-widest text-white/60">
                     ID: {img.id}
                   </span>
                   
                   {admin?.role === 'admin' && (
                     <button 
                       onClick={() => handleDelete(img.id)}
                       className="p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-500 active:scale-75 transition-all shadow-md"
                     >
                       <Trash size={14} weight="bold" />
                     </button>
                   )}
                </div>

                {/* Protected Status for Sub-Admins */}
                {admin?.role !== 'admin' && (
                   <div className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/5 text-gray-400">
                      <CheckCircle size={12} weight="fill" className="text-green-500/70" />
                   </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
               <button 
                 disabled={currentPage === 1}
                 onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                 className="flex-1 py-3 bg-white/5 disabled:opacity-30 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
               >
                 Prev
               </button>
               
               <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Page <span className="text-saffron">{currentPage}</span> / {totalPages}
               </div>

               <button 
                 disabled={currentPage === totalPages}
                 onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                 className="flex-1 py-3 bg-white/5 disabled:opacity-30 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
               >
                 Next
               </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Hint */}
      {!showUploader && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-max px-4 py-2 bg-dark/60 backdrop-blur-lg border border-white/10 rounded-full flex items-center gap-3 shadow-2xl z-40 md:hidden">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-blink"></div>
           <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Admin Live Connection Active</span>
        </div>
      )}
    </div>
  );
}
