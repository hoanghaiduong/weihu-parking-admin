import React from 'react';
import { Loader2, Check } from 'lucide-react';

// --- Glass Card ---
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div onClick={onClick} className={`
      bg-white dark:bg-gray-900/60 
      backdrop-blur-xl 
      border border-gray-200 dark:border-white/10 
      rounded-2xl 
      shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl
      transition-all duration-300
      ${className}
    `}>
      {children}
    </div>
  );
};

// --- Primary Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading, 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-4 py-2.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm active:scale-95";
  
  // Updated to use text-primary-500 and bg-primary-500 instead of hardcoded hex
  const variants = {
    primary: "bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 border border-transparent",
    secondary: "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10",
    danger: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20",
    ghost: "bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

// --- Glass Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}
export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`w-full 
            bg-gray-50 dark:bg-black/30 
            border border-gray-200 dark:border-white/10 
            text-gray-900 dark:text-gray-200 
            rounded-xl px-4 py-2.5 
            focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 
            transition-all 
            placeholder-gray-400 dark:placeholder-gray-600 font-mono text-sm 
            ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

// --- Custom Checkbox ---
interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}
export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, className = '' }) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div 
        onClick={() => onChange && onChange(!checked)}
        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200
          ${checked 
            ? 'bg-primary-500 border-primary-500 shadow-md shadow-primary-500/20' 
            : 'bg-gray-50 dark:bg-black/30 border-gray-300 dark:border-gray-600 group-hover:border-primary-500'
          }
        `}
      >
        <Check size={14} className={`text-white transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
      </div>
      {label && <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors select-none">{label}</span>}
    </label>
  );
};


// --- Status Badge ---
export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Active: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    Completed: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
    Issue: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    Monthly: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  const defaultStyle = 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-medium border ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  );
};