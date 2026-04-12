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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchGallery();
  }, []);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension 1200px
          const MAX_SIZE = 1200;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.7); // 70% quality
        };
      };
    });
  };

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
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);
      setUploadStatus('');
      
      const filePreviews = [];
      files.slice(0, 4).forEach(file => { // Preview only first 4
        const reader = new FileReader();
        reader.onloadend = () => {
          filePreviews.push(reader.result);
          if (filePreviews.length === Math.min(files.length, 4)) {
            setImagePreviews(filePreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) return;

    setSubmitting(true);
    const token = localStorage.getItem('admin_token');
    const data = new FormData();

    try {
      setUploadStatus(`Optimizing 1 of ${imageFiles.length}...`);
      
      // Compress and add all files
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadStatus(`Optimizing ${i + 1} of ${imageFiles.length}...`);
        const compressed = await compressImage(imageFiles[i]);
        data.append('images', compressed);
      }

      setUploadStatus('Sending to Cloud...');
      const response = await fetch('/api/admin/gallery/bulk', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      setImageFiles([]);
      setImagePreviews([]);
      setShowUploader(false);
      setUploadStatus('');
      setCurrentPage(1);
      fetchGallery();
    } catch (err) {
      alert(err.message);
      setUploadStatus('Error!');
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
              <h3 className="text-sm font-black uppercase tracking-widest text-saffron">
                {imageFiles.length > 0 ? `${imageFiles.length} Snaps Ready` : 'New Snaps'}
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">
                {uploadStatus || 'Select up to 50 photos to add to gallery'}
              </p>
            </div>

            <div className={`relative min-h-[16rem] w-full rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center p-4 gap-4 ${
              imagePreviews.length > 0 ? 'border-saffron bg-saffron/5' : 'border-white/10 bg-white/[0.02]'
            }`}>
               {imagePreviews.length > 0 ? (
                 <div className="grid grid-cols-2 gap-2 w-full h-full">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-white/10 relative">
                         <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                         {idx === 3 && imageFiles.length > 4 && (
                           <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-xs">
                             +{imageFiles.length - 4} More
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
               ) : (
                 <>
                   <div className="p-5 bg-saffron/10 text-saffron rounded-full animate-pulse-subtle">
                      <UploadSimple size={36} />
                   </div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tap to Select Photos</p>
                 </>
               )}
               <input 
                 type="file" 
                 multiple
                 accept="image/*" 
                 onChange={handleImageChange}
                 className="absolute inset-0 opacity-0 cursor-pointer"
                 required
               />
            </div>

            <div className="flex gap-3">
               <button 
                 type="button" 
                 disabled={submitting}
                 onClick={() => { setShowUploader(false); setImagePreviews([]); setImageFiles([]); setUploadStatus(''); }}
                 className="flex-1 bg-white/5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest disabled:opacity-30"
               >
                 Cancel
               </button>
               <button 
                 type="submit" 
                 disabled={submitting || imageFiles.length === 0}
                 className="flex-[2] bg-saffron disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-saffron/20"
               >
                 {submitting ? (
                   <>
                     <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                     {uploadStatus || 'Uploading...'}
                   </>
                 ) : (
                   `Upload ${imageFiles.length || ''} Photos`
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
