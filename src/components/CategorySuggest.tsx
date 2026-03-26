import React, { useState } from 'react';
import { Input } from './ui/Input';

interface CategorySuggestProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const CATEGORIES = [
  'Restaurant', 'Cafe', 'Retail', 'Fashion', 'Grocery', 
  'Technology', 'Health & Beauty', 'Services', 'Education', 'Automotive'
];

export const CategorySuggest: React.FC<CategorySuggestProps> = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredCategories = CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <Input
        label="Business Category"
        placeholder="e.g. Restaurant, Cafe"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        error={error}
      />
      {isOpen && filteredCategories.length > 0 && (
        <div className="absolute z-10 w-full mt-[-16px] bg-white border border-border rounded-airbnb-lg shadow-premium max-h-48 overflow-auto py-1 animate-in fade-in zoom-in-95 duration-200">
          {filteredCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-primary/5 text-sm font-medium transition-colors"
              onClick={() => {
                onChange(cat);
                setIsOpen(false);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
