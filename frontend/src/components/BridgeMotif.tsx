import React from 'react';

interface BridgeMotifProps {
  className?: string;
  variant?: 'subtle' | 'divider' | 'compact' | 'flow';
}

export const BridgeMotif: React.FC<BridgeMotifProps> = ({
  className = '',
  variant = 'subtle',
}) => {
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`} aria-hidden="true">
        <span className="w-2 h-1 rounded-full bg-[#E07A2B]" title="Saffron Orange" />
        <span className="w-2 h-1 rounded-full bg-[#1D4ED8]" title="Chakra Blue" />
        <span className="w-2 h-1 rounded-full bg-[#4F765E]" title="India Green" />
      </div>
    );
  }

  if (variant === 'divider') {
    return (
      <div className={`w-full flex items-center justify-center py-6 ${className}`} aria-hidden="true">
        <div className="flex items-center gap-2 max-w-sm w-full">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E07A2B]/40 to-[#E07A2B]/70" />
          <div className="flex items-center gap-1.5 px-2">
            <span className="w-2 h-2 rounded-full bg-[#E07A2B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
            <span className="w-2 h-2 rounded-full bg-[#4F765E]" />
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[#4F765E]/70 via-[#4F765E]/40 to-transparent" />
        </div>
      </div>
    );
  }

  if (variant === 'flow') {
    return (
      <svg
        viewBox="0 0 400 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-8 overflow-visible opacity-85 ${className}`}
        aria-hidden="true"
      >
        <path
          d="M 10 13 Q 100 2 200 13 T 390 13"
          stroke="#E07A2B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
        <path
          d="M 10 16 Q 100 10 200 16 T 390 16"
          stroke="#1D4ED8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        <path
          d="M 10 19 Q 100 28 200 19 T 390 19"
          stroke="#4F765E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
        <circle cx="200" cy="16" r="4.5" fill="#183D32" />
        <circle cx="200" cy="16" r="8" stroke="#1D4ED8" strokeWidth="1.5" strokeOpacity="0.6" />
      </svg>
    );
  }

  // Default subtle curve motif
  return (
    <div className={`relative flex items-center justify-center overflow-hidden py-1 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 240 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-56 h-4 opacity-80"
      >
        <path
          d="M 4 14 C 45 4, 85 4, 120 14"
          stroke="#E07A2B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="120" cy="14" r="2" fill="#1D4ED8" />
        <path
          d="M 120 14 C 155 4, 195 4, 236 14"
          stroke="#4F765E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
