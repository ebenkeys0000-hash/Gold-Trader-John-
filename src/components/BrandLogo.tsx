import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withGlow?: boolean;
  priority?: boolean;
}

const sizeClasses = {
  xs: 'w-7 h-7',
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-24 h-24 sm:w-28 sm:h-28',
  xl: 'w-40 h-40 sm:w-48 sm:h-48'
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'sm',
  className = '',
  withGlow = true
}) => {
  const [hasError, setHasError] = useState(false);
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`relative rounded-full shrink-0 flex items-center justify-center select-none overflow-hidden group ${sizeClass} ${className}`}
    >
      {/* Outer subtle halo ring */}
      {withGlow && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-transparent to-pink-500/20 blur-sm pointer-events-none" />
      )}

      {/* Main Image */}
      {!hasError ? (
        <img
          src="/gold_trader_john_logo.jpg"
          alt="Gold Trader John Logo"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover rounded-full border border-slate-700/80 group-hover:scale-105 transition-transform duration-300 shadow-md"
        />
      ) : (
        /* Fallback if image asset fails to load */
        <div className="w-full h-full rounded-full bg-slate-900 border border-amber-400/40 flex items-center justify-center text-amber-300 font-extrabold font-mono text-xs">
          GTJ
        </div>
      )}
    </div>
  );
};
