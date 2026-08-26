import React from 'react';

interface SolineLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}

export function SolineIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer rounded squircle */}
      <rect width="32" height="32" rx="9" fill="#000000" />
      {/* Solar precision 4-point astroid star */}
      <path
        d="M16 6.5C16 11.75 11.75 16 6.5 16C11.75 16 16 20.25 16 25.5C16 20.25 20.25 16 25.5 16C20.25 16 16 11.75 16 6.5Z"
        fill="#FFFFFF"
      />
      {/* Precision core dot */}
      <circle cx="16" cy="16" r="1.5" fill="#000000" />
    </svg>
  );
}

export function SolineLogo({
  size = 'md',
  showText = true,
  theme = 'light',
  className = '',
}: SolineLogoProps) {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const textColor = theme === 'dark' ? 'text-white' : 'text-black';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <SolineIcon className={iconSizes[size]} />
      {showText && (
        <span className={`font-black tracking-tight ${textSizes[size]} ${textColor}`}>
          SOLINE
        </span>
      )}
    </div>
  );
}

export default SolineLogo;
