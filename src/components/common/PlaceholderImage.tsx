import React from 'react';
import { Layers } from 'lucide-react';

interface PlaceholderImageProps {
  label?: string;
  sublabel?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'tall';
  className?: string;
  category?: string;
  status?: string;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  label = 'Autodesk Forma Site Model',
  sublabel = 'Verified Autodesk Forma & Revit BIM digital twin asset',
  aspectRatio = 'video',
  className = '',
  category = 'Autodesk Forma Deliverable',
  status = 'VERIFIED MODEL',
}) => {
  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'wide'
      ? 'aspect-21/9'
      : 'aspect-4/3';

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden rounded-xl border border-dashed border-teal-500/30 dark:border-teal-400/20 bg-slate-100/80 dark:bg-slate-900/80 flex flex-col items-center justify-center p-6 text-center group ${className}`}
    >
      {/* SVG Architectural Wireframe Pattern Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" />
          </pattern>
          <pattern id="isometricGrid" width="60" height="103.92" patternUnits="userSpaceOnUse">
            <path d="M30,0 L60,17.32 L60,51.96 L30,69.28 L0,51.96 L0,17.32 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#archGrid)" className="text-teal-600 dark:text-teal-400" />
      </svg>

      {/* Decorative Corner CAD Marks */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-teal-500/60" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-teal-500/60" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-teal-500/60" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-teal-500/60" />

      {/* Center CAD Icon and Text */}
      <div className="relative z-10 flex flex-col items-center max-w-md">
        <div className="w-12 h-12 rounded-lg bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-300 mb-3 group-hover:scale-105 transition-transform">
          <Layers className="w-6 h-6" />
        </div>
        <span className="text-[10px] tracking-wider uppercase font-semibold text-teal-700 dark:text-teal-400 mb-1">
          {category}
        </span>
        <h4 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
          {label}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {sublabel}
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          <span>STATUS:</span>
          <span className="font-semibold text-teal-600 dark:text-teal-400">{status}</span>
        </div>
      </div>
    </div>
  );
};
