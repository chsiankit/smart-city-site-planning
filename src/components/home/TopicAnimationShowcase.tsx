import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  X,
  Compass,
  Cpu,
  Leaf,
  Building,
} from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';

export interface ShowcaseSlide {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  description: string;
  metrics: { label: string; value: string; unit?: string }[];
  icon: React.ReactNode;
  tags: string[];
}

export const TopicAnimationShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<ShowcaseSlide | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const topicSlides: ShowcaseSlide[] = [
    {
      id: 'masterplan',
      title: t('showcase.slide1Title'),
      subtitle: t('showcase.slide1Subtitle'),
      category: t('showcase.slide1Category'),
      image: '/assets/aistudio/image_01810530.png',
      description: t('showcase.slide1Desc'),
      metrics: [
        { label: 'Site Footprint', value: '1.28', unit: 'km²' },
        { label: 'Green Spine Area', value: '38%', unit: 'canopy' },
        { label: 'Permeable Cover', value: '42%', unit: 'SuDS' },
      ],
      icon: <Compass className="w-4 h-4 text-teal-400" />,
      tags: ['Masterplan', '1.28 km²', 'Water Retention', 'Superblocks'],
    },
    {
      id: 'simulation',
      title: t('showcase.slide2Title'),
      subtitle: t('showcase.slide2Subtitle'),
      category: t('showcase.slide2Category'),
      image: '/src/assets/images/smart_city_simulation_1793350043248.jpg',
      description: t('showcase.slide2Desc'),
      metrics: [
        { label: 'Solar Potential', value: '1,450', unit: 'kWh/m²' },
        { label: 'Wind Velocity', value: '3.8', unit: 'm/s comfort' },
        { label: 'Daylight sDA', value: '60%', unit: 'autonomy' },
      ],
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      tags: ['Forma CFD', 'Solar Radiation', 'Microclimate', 'Daylight sDA'],
    },
    {
      id: 'biophilic_tod',
      title: t('showcase.slide3Title'),
      subtitle: t('showcase.slide3Subtitle'),
      category: t('showcase.slide3Category'),
      image: '/src/assets/images/smart_city_biophilic_tod_1793350061514.jpg',
      description: t('showcase.slide3Desc'),
      metrics: [
        { label: 'Transit Walking Radius', value: '400', unit: 'meters' },
        { label: 'Non-Motorized Share', value: '72%', unit: 'trips' },
        { label: 'UHI Cooling Delta', value: '-2.8', unit: '°C' },
      ],
      icon: <Leaf className="w-4 h-4 text-teal-400" />,
      tags: ['15-Minute City', 'Autonomous Tram', 'Bioswales', 'UHI Mitigation'],
    },
    {
      id: 'bim_twin',
      title: t('showcase.slide4Title'),
      subtitle: t('showcase.slide4Subtitle'),
      category: t('showcase.slide4Category'),
      image: '/src/assets/images/smart_city_bim_twin_1793350077263.jpg',
      description: t('showcase.slide4Desc'),
      metrics: [
        { label: 'Embodied Carbon', value: '-10.9%', unit: 'vs baseline' },
        { label: 'IFC LOD Level', value: 'LOD 350', unit: 'coordination' },
        { label: 'BIM Interop', value: '100%', unit: 'georeferenced' },
      ],
      icon: <Building className="w-4 h-4 text-indigo-400" />,
      tags: ['Revit 2026', 'Structural Grids', 'Digital Twin', 'Carbon Accounting'],
    },
  ];

  const activeSlide = topicSlides[currentIndex] || topicSlides[0];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % topicSlides.length);
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, topicSlides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % topicSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + topicSlides.length) % topicSlides.length);
  };

  return (
    <ScrollReveal className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t('showcase.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('showcase.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {t('showcase.subtitle')}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shadow-sm flex items-center gap-1.5 text-xs font-semibold"
            title={isPlaying ? 'Pause' : 'Resume'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            ) : (
              <Play className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            )}
            <span className="hidden sm:inline">
              {isPlaying ? t('showcase.autoplayOn') : t('showcase.paused')}
            </span>
          </button>

          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shadow-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Animated Showcase Display */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Left: Image Container with overlay & zoom */}
          <div
            className="lg:col-span-8 relative min-h-[340px] sm:min-h-[460px] overflow-hidden group cursor-pointer"
            onClick={() => setLightboxImage(activeSlide)}
          >
            <img
              key={activeSlide.id}
              src={activeSlide.image}
              alt={activeSlide.title}
              className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
            />
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-lg">
                {activeSlide.icon}
                <span>{activeSlide.category}</span>
              </span>
            </div>

            {/* Click to expand hint */}
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg border border-white/20">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{t('showcase.enlarge')}</span>
              </span>
            </div>

            {/* Bottom Floating Title on Image (Mobile) */}
            <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white z-10">
              <h3 className="text-lg font-black">{activeSlide.title}</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">{activeSlide.subtitle}</p>
            </div>
          </div>

          {/* Right: Technical Explanation & Metrics */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-50 dark:bg-slate-850">
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                {activeSlide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {activeSlide.title}
                </h3>
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-1">
                  {activeSlide.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeSlide.description}
              </p>

              {/* Verified Technical Metrics */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  {t('showcase.simParams')}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {activeSlide.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center"
                    >
                      <div className="text-base font-black text-slate-900 dark:text-white leading-tight">
                        {m.value}
                      </div>
                      <div className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                        {m.unit}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Slide Index Progress bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-750 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white">
                  0{currentIndex + 1}
                </span>
                <span>/</span>
                <span>0{topicSlides.length}</span>
              </div>
              <button
                onClick={() => setLightboxImage(activeSlide)}
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>{t('showcase.viewFullscreen')}</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {topicSlides.map((slide, idx) => {
            const isSelected = currentIndex === idx;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
                className={`p-2 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/60 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                />
                <div className="truncate">
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                    {slide.category.split(' ')[0]}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {slide.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  {lightboxImage.category}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-sm font-bold truncate">{lightboxImage.title}</span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-black flex items-center justify-center p-2">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl"
              />
            </div>

            <div className="p-4 bg-slate-950 text-xs text-slate-300 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="truncate max-w-2xl">{lightboxImage.description}</p>
              <div className="flex items-center gap-4 shrink-0 font-mono text-[11px] text-teal-400">
                {lightboxImage.metrics.map((m) => (
                  <span key={m.label}>
                    {m.label}: <strong>{m.value} {m.unit}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ScrollReveal>
  );
};
