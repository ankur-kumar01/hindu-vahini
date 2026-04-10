import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Images, Plus, Trash, X, UploadSimple, CornersOut, GridFour } from '@phosphor-icons/react';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Selection/Upload State
  const [spanClass, setSpanClass] = useState('row-span-1 col-span-1');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('Failed to fetch gallery');
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      setImages(images.filter(img => img.id !== id));
    } catch (err) {
      alert(err.message);
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
    if (!imageFile) return alert('Please select an image first.');
    
    setSubmitting(true);
    const token = localStorage.getItem('admin_token');
    
    const data = new FormData();
    data.append('image', imageFile);
    data.append('span_classes', spanClass);
    data.append('display_order', displayOrder);

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (!response.ok) throw new Error('Upload failed');
      
      setShowModal(false);
      setImageFile(null);
      setImagePreview(null);
      fetchGallery(); // Refresh list
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const spanOptions = [
    { label: 'Standard (1x1)', value: 'row-span-1 col-span-1' },
    { label: 'Vertical (2x1)', value: 'row-span-2 col-span-1' },
    { label: 'Horizontal (1x2)', value: 'row-span-1 col-span-2' },
    { label: 'Large Square (2x2)', value: 'row-span-2 col-span-2' },
  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Manage Gallery | Admin Dashboard</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Images size={28} className="text-saffron" weight="duotone" />
            Manage Gallery
          </h1>
          <p className="text-gray-500 mt-1">Upload and organize photos in the website journey section.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-saffron hover:bg-saffron/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-saffron/20 active:scale-95"
        >
          <Plus size={20} weight="bold" />
          Upload New Image
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-10 h-10 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin mx-auto mb-4"></div>
          Loading gallery...
        </div>
      ) : error ? (
        <div className="p-10 text-center text-red-400 bg-white/5 rounded-2xl border border-white/10">{error}</div>
      ) : images.length === 0 ? (
        <div className="p-20 text-center bg-white/5 rounded-2xl border border-white/10">
          <Images size={48} className="mx-auto text-gray-700 mb-4" weight="light" />
          <p className="text-gray-500">The gallery is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden aspect-square transition-all hover:border-saffron/30">
              <img src={img.image_url} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              
              {/* Badge for span type */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[9px] font-bold text-gray-400 uppercase tracking-widest border border-white/5">
                 {img.span_classes.split(' ')[0]}
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <button 
                    onClick={() => handleDelete(img.id)}
                    className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-2xl transition-all hover:scale-110 shadow-lg"
                 >
                    <Trash size={22} weight="bold" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)}></div>
          <div className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animation-scale-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UploadSimple size={24} className="text-saffron" />
                Upload Gallery Image
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                disabled={submitting}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Dropzone UI */}
              <div className="relative group">
                <div className={`w-full h-56 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden gap-3 ${
                  imagePreview ? 'border-saffron/50 bg-saffron/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                }`}>
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <div className="p-4 bg-white/5 rounded-full text-gray-400 group-hover:scale-110 transition-transform">
                        <Plus size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-300">Choose a file or drag & drop</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">JPEG, PNG or WebP up to 5MB</p>
                      </div>
                    </>
                  )}
                  <input 
                    type="file" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <GridFour size={14} />
                    Grid Layout Span
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {spanOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSpanClass(opt.value)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                          spanClass === opt.value 
                            ? 'bg-saffron/10 border-saffron text-saffron' 
                            : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <CornersOut size={14} />
                    Priority Order
                  </label>
                  <input 
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron/50 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                  <button 
                    type="button" 
                    disabled={submitting}
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-[2] bg-saffron hover:bg-saffron/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-saffron/20 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      'Save to Gallery'
                    )}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
