import React, { useState, useEffect } from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { Badge } from '../components/common/Badge';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { GalleryItem } from '../data/schema';
import {
  Film,
  Image,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Maximize2,
  FileText,
} from 'lucide-react';

export const Gallery: React.FC = () => {
  const { data } = useProjectData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Forma Screenshots',
    'Proposal A',
    'Proposal B',
    'Analysis',
    'Revit',
    'Forma Board',
    'Final Renders',
  ];

  const galleryItems = data.gallery;
  const filteredGallery =
    selectedCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  // Keyboard navigation for lightbox (Left, Right, Escape)
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : filteredGallery.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev < filteredGallery.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredGallery.length]);

  const activeItem =
    activeLightboxIndex !== null ? filteredGallery[activeLightboxIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Deliverables & Renders Showcase
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Authentic Project Gallery & 30-Second Walkthrough
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Software-native screenshots and video walkthrough produced directly in Autodesk Forma and Revit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
        </div>
      </div>

      {/* 30-Second Walkthrough Video Section */}
      <div className="p-8 rounded-3xl bg-[#091521] text-white border border-teal-900/60 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {data.video.title}
              </h2>
              <span className="text-xs text-teal-400 font-mono">
                PROJECT DELIVERABLE: 30-SECOND WALKTHROUGH
              </span>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-teal-950 border border-teal-700 text-teal-300">
            30 SECONDS
          </span>
        </div>

        {/* Video Player or Elegant Upload Placeholder */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
          {data.video.localVideoUrl ? (
            <video
              src={data.video.localVideoUrl}
              controls
              className="w-full h-full object-cover"
            />
          ) : data.video.youtubeUrl ? (
            <iframe
              src={data.video.youtubeUrl}
              title="Walkthrough Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
              <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
                <Play className="w-8 h-8 ml-1" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                30-Second Walkthrough Video
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {data.video.placeholderMessage}
              </p>
              <span className="px-3 py-1 rounded text-xs font-mono bg-slate-800 border border-slate-700 text-amber-400">
                STATUS: READY FOR EMBED (ADMIN)
              </span>
            </div>
          )}
        </div>

        {/* Video Chapters Timeline */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official 30-Second Walkthrough Chapters
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.video.chapters.map((ch, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-teal-400 text-xs font-mono font-bold mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ch.timestamp}</span>
                  </div>
                  <h5 className="text-xs font-bold text-white mb-1">
                    {ch.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {ch.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Deliverables & Model Renders</span>
          </h2>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxIndex(idx)}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md group cursor-pointer hover:border-teal-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden rounded-2xl mb-3 aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  {item.imageUrl && !item.imageUrl.includes('placeholder') ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <PlaceholderImage
                      label={item.title}
                      sublabel={item.caption}
                      aspectRatio="video"
                      category={item.category}
                    />
                  )}

                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    {item.category}
                  </span>
                  <Badge source={item.sourceLabel} className="text-[9px]" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.caption}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Click to expand in Lightbox</span>
                <span className="font-mono text-teal-600 dark:text-teal-400">View ↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  {activeItem.category}
                </span>
                <Badge source={activeItem.sourceLabel} />
              </div>
              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Image / CAD Preview */}
            <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
              {activeItem.imageUrl && !activeItem.imageUrl.includes('placeholder') ? (
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <PlaceholderImage
                  label={activeItem.title}
                  sublabel={activeItem.caption}
                  aspectRatio="video"
                  category={activeItem.category}
                />
              )}

              {/* Prev / Next controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : filteredGallery.length - 1
                  );
                }}
                className="absolute left-3 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex((prev) =>
                    prev !== null && prev < filteredGallery.length - 1 ? prev + 1 : 0
                  );
                }}
                className="absolute right-3 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white"
                title="Next (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Caption & Navigation Hint */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeItem.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeItem.caption}
                </p>
              </div>
              <div className="text-[11px] text-slate-500 font-mono shrink-0">
                Use ← / → keys to navigate • Esc to close
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
