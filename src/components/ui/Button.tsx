import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  isLoading, 
  variant = 'primary', 
  ...props 
}) => {
  const variants = {
    primary: 'btn-primary bg-primary text-white hover:bg-primary-hover active:scale-[0.98] border-none',
    secondary: 'btn-primary bg-background-secondary text-text-primary hover:bg-border border-none active:scale-[0.98]',
    outline: 'btn-primary bg-white border border-text-primary text-text-primary hover:bg-background-secondary active:scale-[0.98] shadow-none',
  };

  return (
    <button 
      disabled={isLoading || props.disabled}
      className={cn(
        variants[variant],
        'flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};
