'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const TemplateThumbnail = ({
  templateName,
  imagePath,
  onPreview,
  isActive,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div
      className={`relative w-full h-[80vh]  bg-white rounded-xl overflow-hidden shadow-lg border-2
                  transition-all duration-300 cursor-pointer group
                  ${isActive ? 'ring-4 ring-purple-600 scale-[1.02] shadow-xl' : 'hover:scale-[1.01] hover:shadow-lg'}
                  flex items-center justify-center`} // Added flex for centering skeleton/image
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Primary click action (e.g., opens template preview)
      onClick={() => onPreview(templateName)}
      onKeyDown={(e) => e.key === 'Enter' && onPreview(templateName)}
    >
      {/* Image Skeleton Fallback */}
      {!isImageLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 z-0" />
      )}

      {/* Optimized Thumbnail Image */}
      <Image
        src={imagePath}
        alt={`${templateName} Resume Template`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive image sizing
        onLoad={() => setIsImageLoaded(true)}
        className={`object-fill transition-opacity duration-500 ${
          isHovered ? 'opacity-30' : 'opacity-100'
        }`}
        unoptimized // Keep unoptimized if using external image URLs not handled by Next.js image optimization
      />

      {/* Overlay on Hover */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center p-4
                    bg-black bg-opacity-60 backdrop-blur-sm
                    transition-opacity duration-300 z-10
                    ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <h3 className="text-white text-xl font-bold mb-4 text-center px-2 drop-shadow-lg">
          {templateName}
        </h3>
        <div className="flex flex-col space-y-3 w-full max-w-[150px]"> {/* Buttons container */}
          <button
            className="w-full px-5 py-2 text-md font-medium rounded-full bg-white text-gray-900
                       hover:bg-purple-600 hover:text-white transition-all duration-200 shadow-md
                       focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
            onClick={(e) => {
              e.stopPropagation(); // prevent outer click
              onPreview(templateName);
            }}
          >
            Preview
          </button>
  
        </div>
      </div>
    </div>
  );
};

export default TemplateThumbnail;
