import React, { useState, useRef, useCallback } from 'react';
import { PlaceholderImage } from '../common/PlaceholderImage';

interface ImageComparisonSliderProps {
  imageA?: string | null;
  imageB?: string | null;
  labelA?: string;
  labelB?: string;
  className?: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  imageA,
  imageB,
  labelA = 'Proposal A (Biophilic TOD)',
  labelB = 'Proposal B (Polycentric Superblocks)',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      className={`relative w-full aspect-16/9 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 select-none shadow-lg cursor-ew-resize bg-slate-900 ${className}`}
    >
      {/* Background / Image B (Right side) */}
      <div className="absolute inset-0 w-full h-full">
        {imageB ? (
          <img src={imageB} alt={labelB} className="w-full h-full object-cover" />
        ) : (
          <PlaceholderImage label={labelB} sublabel="Add authentic Forma screenshot for Proposal B" />
        )}
        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-white">
          {labelB}
        </div>
      </div>

      {/* Foreground / Image A (Left side, clipped) */}
      <div
        className="absolute inset-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="w-full h-full min-w-full" style={{ width: containerRef.current?.offsetWidth }}>
          {imageA ? (
            <img src={imageA} alt={labelA} className="w-full h-full object-cover" />
          ) : (
            <PlaceholderImage label={labelA} sublabel="Add authentic Forma screenshot for Proposal A" />
          )}
        </div>
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-md bg-teal-900/90 backdrop-blur-md border border-teal-600 text-xs font-semibold text-teal-200">
          {labelA}
        </div>
      </div>

      {/* Vertical Divider Line with Handle */}
      <div
        className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-2xl flex items-center justify-center cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
      >
        <div className="w-8 h-8 rounded-full bg-white text-slate-800 shadow-xl border-2 border-teal-600 flex items-center justify-center text-xs font-bold pointer-events-auto">
          ↔
        </div>
      </div>
    </div>
  );
};
