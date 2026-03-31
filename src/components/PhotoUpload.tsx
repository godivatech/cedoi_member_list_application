import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface PhotoUploadProps {
  onUpload: (file: File) => void;
  imageUrl?: string;
  isLoading?: boolean;
  label?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload, imageUrl, isLoading, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(imageUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full mb-6">
      <label className="label">{label || 'Business Photo'}</label>
      <div 
        className={cn(
          "relative w-full aspect-video rounded-airbnb-lg border-2 border-dashed border-border overflow-hidden flex flex-col items-center justify-center transition-all duration-200 bg-background-secondary",
          preview ? "border-solid border-primary/20 bg-primary/5" : "hover:border-primary/50"
        )}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 flex gap-2">
              <button 
                onClick={handleRemove}
                className="p-2 bg-white/90 backdrop-blur rounded-full shadow-soft text-text-secondary hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-sm font-medium text-primary">Uploading...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer flex flex-col items-center gap-3 p-6 text-center"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-soft text-primary">
              <Camera size={28} />
            </div>
            <div>
              <p className="font-semibold text-text-primary">Take a photo</p>
              <p className="text-sm text-text-secondary mt-1">Directly from your camera</p>
            </div>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
