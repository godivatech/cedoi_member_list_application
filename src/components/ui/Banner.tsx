import React from 'react';

interface BannerProps {
  imageSrc: string;
  altText: string;
}

export const Banner: React.FC<BannerProps> = ({ 
  imageSrc, 
  altText
}) => {
  return (
    <div className="w-full mb-10 overflow-hidden rounded-airbnb-lg shadow-premium group relative bg-gray-50">
      <img
        src={imageSrc}
        alt={altText}
        className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
      />
      {/* Subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none rounded-airbnb-lg" />
    </div>
  );
};
