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
    <div className="w-full mb-10 overflow-hidden rounded-airbnb-lg shadow-premium group relative">
      <div className="aspect-[2/1] sm:aspect-[2.5/1] relative">
        <img
          src={imageSrc}
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle dark overlay for contrast without text */}
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      </div>
    </div>
  );
};
