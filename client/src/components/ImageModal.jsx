import { X } from '@phosphor-icons/react';
import { useEffect } from 'react';

export default function ImageModal({ image, onClose }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Overlay/Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/90 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-full flex items-center justify-center animation-scale-up pointer-events-none">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute -top-12 right-0 md:-top-6 md:-right-12 p-3 text-white hover:text-saffron transition-colors pointer-events-auto"
          aria-label="Close Preview"
        >
          <X size={32} weight="bold" />
        </button>

        {/* Image */}
        <div className="relative bg-dark/20 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto">
          <img 
            src={image} 
            alt="Full size preview" 
            className="w-full h-auto max-h-[85vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      </div>
    </div>
  );
}
