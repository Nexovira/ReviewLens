import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  lightMode?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full', 
  lightMode = false,
  className = '' 
}) => {
  // Size dimensions
  const dimensions = {
    sm: { icon: 28, text: 'text-base', slogan: 'text-[8px]', gap: 'gap-2' },
    md: { icon: 36, text: 'text-xl', slogan: 'text-[9px]', gap: 'gap-2.5' },
    lg: { icon: 48, text: 'text-2xl', slogan: 'text-[10px]', gap: 'gap-3' },
    xl: { icon: 64, text: 'text-4xl', slogan: 'text-[11px]', gap: 'gap-4' }
  }[size];

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className={`flex items-center ${dimensions.gap}`}>
        {/* Vector Logo Icon (Magnifying Lens + Speech Bubble + Stars + Bar Chart) */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <svg 
            width={dimensions.icon} 
            height={dimensions.icon * 0.9} 
            viewBox="0 0 160 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            <defs>
              {/* Lens Outer Gradient */}
              <linearGradient id="lensRingGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00A3FF" />
                <stop offset="50%" stopColor="#0066FF" />
                <stop offset="100%" stopColor="#2E08A7" />
              </linearGradient>

              {/* Handle Gradient */}
              <linearGradient id="handleGrad" x1="70" y1="70" x2="105" y2="105" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0055FF" />
                <stop offset="100%" stopColor="#0A1150" />
              </linearGradient>

              {/* Chart Bars Gradient */}
              <linearGradient id="barGrad1" x1="95" y1="85" x2="95" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00D2FF" />
                <stop offset="100%" stopColor="#0085FF" />
              </linearGradient>
              <linearGradient id="barGrad2" x1="115" y1="85" x2="115" y2="45" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0085FF" />
                <stop offset="100%" stopColor="#6C00FF" />
              </linearGradient>
              <linearGradient id="barGrad3" x1="135" y1="85" x2="135" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6C00FF" />
                <stop offset="100%" stopColor="#A812FF" />
              </linearGradient>

              {/* Trendline Gradient */}
              <linearGradient id="lineGrad" x1="90" y1="70" x2="140" y2="25" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="50%" stopColor="#FFC700" />
                <stop offset="100%" stopColor="#A812FF" />
              </linearGradient>
            </defs>

            {/* Magnifying Glass Outer Blue Ring */}
            <circle cx="50" cy="50" r="38" fill="url(#lensRingGrad)" />
            <circle cx="50" cy="50" r="28" fill="#FFFFFF" />

            {/* Speech Bubble inside lens */}
            <path 
              d="M32 36 C32 32, 68 32, 68 36 L68 56 C68 60, 32 60, 32 56 Z" 
              fill="#F0F6FF" 
            />
            <path 
              d="M36 56 L33 63 L43 56 Z" 
              fill="#F0F6FF" 
            />

            {/* 4 Gold Stars */}
            <g fill="#FFB800">
              {/* Star 1 */}
              <polygon points="38,40 39.5,43 43,43.5 40.5,46 41,49.5 38,47.5 35,49.5 35.5,46 33,43.5 36.5,43" />
              {/* Star 2 */}
              <polygon points="46,40 47.5,43 51,43.5 48.5,46 49,49.5 46,47.5 43,49.5 43.5,46 41,43.5 44.5,43" />
              {/* Star 3 */}
              <polygon points="54,40 55.5,43 59,43.5 56.5,46 57,49.5 54,47.5 51,49.5 51.5,46 49,43.5 52.5,43" />
              {/* Star 4 */}
              <polygon points="62,40 63.5,43 67,43.5 64.5,46 65,49.5 62,47.5 59,49.5 59.5,46 57,43.5 60.5,43" />
            </g>

            {/* Magnifying Glass Handle */}
            <path 
              d="M75 75 L98 98 C102 102, 108 96, 104 92 L81 69 Z" 
              fill="url(#handleGrad)" 
            />

            {/* Bar Chart (Right side) */}
            <rect x="90" y="65" width="10" height="25" rx="3" fill="url(#barGrad1)" />
            <rect x="105" y="48" width="10" height="42" rx="3" fill="url(#barGrad2)" />
            <rect x="120" y="32" width="10" height="58" rx="3" fill="url(#barGrad3)" />

            {/* Trend Line with Nodes */}
            <path 
              d="M90 68 L110 45 L130 25" 
              stroke="url(#lineGrad)" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            <circle cx="90" cy="68" r="4" fill="#00E5FF" />
            <circle cx="110" cy="45" r="5" fill="#FFC700" />
            <circle cx="130" cy="25" r="6" fill="#A812FF" />

            {/* Spark lines top right */}
            <rect x="75" y="18" width="12" height="4" rx="2" fill="#00E5FF" transform="rotate(-40 75 18)" />
            <rect x="85" y="24" width="10" height="4" rx="2" fill="#FFC700" transform="rotate(-15 85 24)" />
            <rect x="88" y="36" width="12" height="4" rx="2" fill="#A812FF" transform="rotate(20 88 36)" />
          </svg>
        </div>

        {/* Text Logo: ReviewLens */}
        {variant !== 'icon' && (
          <div className="flex flex-col">
            <div className={`font-black tracking-tight leading-none ${dimensions.text}`}>
              <span className={lightMode ? 'text-slate-900' : 'text-white'}>Review</span>
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Lens</span>
            </div>
          </div>
        )}
      </div>

      {/* Slogan Pill Badge */}
      {variant === 'full' && (
        <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
          {/* AI Chip Icon */}
          <div className="w-3.5 h-3.5 rounded bg-blue-600 text-white flex items-center justify-center font-black text-[7px]">
            AI
          </div>
          <span className="text-slate-400 font-extrabold text-[8px] tracking-wider uppercase">
            Smarter Reviews. Better Decisions.
          </span>
        </div>
      )}
    </div>
  );
};
