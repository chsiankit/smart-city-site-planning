import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProjectData } from '../hooks/useProjectData';
import { Badge } from '../components/common/Badge';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import {
  Cpu,
  Car,
  TreePine,
  Zap,
  Droplets,
  Wind,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  Clock,
  Check,
} from 'lucide-react';

export const SmartCity: React.FC = () => {
  const { data } = useProjectData();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryParam = searchParams.get('cat') || 'All';
  const [activeCategory, setActiveCategory] = useState<string>(activeCategoryParam);

  const categories = [
    'All',
    'Transportation',
    'Green Infrastructure',
    'Energy',
    'Water',
    'Environmental Comfort',
    'Resilience',
  ];

  const features = data.smartCityFeatures;
  const filteredFeatures =
    activeCategory === 'All'
      ? features
      : features.filter((f) => f.category.toLowerCase() === activeCategory.toLowerCase());

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'transportation':
        return <Car className="w-4 h-4 text-sky-500" />;
      case 'green infrastructure':
        return <TreePine className="w-4 h-4 text-emerald-500" />;
      case 'energy':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'environmental comfort':
        return <Wind className="w-4 h-4 text-teal-500" />;
      case 'resilience':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default:
        return <Cpu className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Urban Systems Architecture
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart City Features & Infrastructure Integration
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Data-verified engineering systems addressing resilience, decarbonization, and mobility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              if (cat === 'All') {
                setSearchParams({});
              } else {
                setSearchParams({ cat });
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeCategory === cat
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {cat !== 'All' && getCategoryIcon(cat)}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feat) => {
          const isVerified = feat.status === 'Verified' || feat.status === 'Implemented';

          return (
            <div
              key={feat.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700">
                      {getCategoryIcon(feat.category)}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {feat.category}
                    </span>
                  </div>
                  <Badge source={feat.dataSource} className="text-[9px]" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {feat.description}
                </p>

                {/* Evidence Image / Placeholder */}
                <div className="mb-4">
                  {feat.evidenceImage ? (
                    <img
                      src={feat.evidenceImage}
                      alt={feat.title}
                      className="w-full rounded-xl object-cover aspect-video"
                    />
                  ) : (
                    <PlaceholderImage
                      label={feat.title}
                      sublabel="Upload engineering diagram or Forma screenshot"
                      aspectRatio="video"
                      category={feat.category}
                    />
                  )}
                </div>
              </div>

              {/* Status and Related Info Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Implementation:</span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      isVerified ? 'text-teal-600 dark:text-teal-400' : 'text-amber-500'
                    }`}
                  >
                    {isVerified ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{feat.status}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Proposal: {feat.relatedProposal}</span>
                  {feat.relatedAnalysis && (
                    <Link
                      to={`/analysis?module=${feat.relatedAnalysis}`}
                      className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>Forma Data</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
