import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjectData } from '../hooks/useProjectData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Badge } from '../components/common/Badge';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { ImageComparisonSlider } from '../components/comparison/ImageComparisonSlider';
import {
  Layers,
  Building,
  TreePine,
  Car,
  Compass,
  ArrowRight,
  TrendingDown,
  Sun,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const Proposals: React.FC = () => {
  const { data } = useProjectData();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultId = searchParams.get('id') || data.proposals[0]?.id || 'prop-a';
  const [activeProposalId, setActiveProposalId] = useState(defaultId);

  const activeProposal =
    data.proposals.find((p) => p.id === activeProposalId) || data.proposals[0];

  // Land use validation
  const landUseSum = (activeProposal?.landUseDistribution || []).reduce(
    (acc, curr) => acc + curr.percent,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Autodesk Forma Generative Modeling
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Design Proposals & Spatial Benchmarks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comparative architectural massing, density metrics, and land-use distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
        </div>
      </div>

      {/* Proposal Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        {data.proposals.map((prop) => (
          <button
            key={prop.id}
            onClick={() => {
              setActiveProposalId(prop.id);
              setSearchParams({ id: prop.id });
            }}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 ${
              activeProposalId === prop.id
                ? 'bg-[#102A43] dark:bg-teal-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4 text-teal-400" />
            <span>{prop.name.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Proposal Hero Overview */}
      {activeProposal && (
        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
              <div className="max-w-2xl">
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  {activeProposal.id.toUpperCase()}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {activeProposal.name}
                </h2>
                <p className="text-sm font-medium text-teal-700 dark:text-teal-300 mt-1">
                  &ldquo;{activeProposal.tagline}&rdquo;
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                  {activeProposal.description}
                </p>
              </div>

              {/* High-Level Score Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] text-slate-500 uppercase">Gross Floor Area</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {activeProposal.grossFloorAreaM2?.toLocaleString() ?? '--'} m²
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] text-slate-500 uppercase">Green Space</span>
                  <p className="text-base font-bold text-teal-600 dark:text-teal-400">
                    {activeProposal.greenSpacePercent ?? '--'}%
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[10px] text-slate-500 uppercase">Building Count</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">
                    {activeProposal.buildingsCount ?? '--'} blocks
                  </p>
                </div>
              </div>
            </div>

            {/* Architectural Strategy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Design Philosophy</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeProposal.designPhilosophy}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>Planning Strategy</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeProposal.planningStrategy}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" />
                  <span>Transportation Highlights</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeProposal.transportationHighlights}
                </p>
              </div>
            </div>
          </div>

          {/* Land-Use Donut Chart & Screenshot Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Land-Use Distribution Recharts Donut */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Land-Use Distribution Ratio
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    Math.abs(landUseSum - 100) <= 1
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  Total: {landUseSum}% (100% Target)
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Floor plate allocation across functional smart city zoning categories.
              </p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeProposal.landUseDistribution}
                      dataKey="percent"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {activeProposal.landUseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any, item: any) => [
                        `${value}% (${item.payload.areaM2 ? item.payload.areaM2.toLocaleString() + ' m²' : ''})`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: '1px solid #334155',
                        color: '#F8FAFC',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/80">
                {activeProposal.landUseDistribution.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
                    </div>
                    <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {item.percent}% {item.areaM2 ? `(${item.areaM2.toLocaleString()} m²)` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Forma Screenshots Carousel / Deliverable Placeholder */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Autodesk Forma Model Deliverable
                </h3>
                <Badge source="TEAM VERIFIED" />
              </div>
              <p className="text-xs text-slate-500">
                Official project screenshot exported directly from Autodesk Forma workspace.
              </p>

              {activeProposal.formaScreenshots && activeProposal.formaScreenshots.length > 0 ? (
                <div className="space-y-3">
                  {activeProposal.formaScreenshots.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${activeProposal.name} - View ${idx + 1}`}
                      className="w-full rounded-2xl object-cover aspect-video border border-slate-200 dark:border-slate-700 shadow-sm"
                    />
                  ))}
                </div>
              ) : (
                <PlaceholderImage
                  label={`Add ${activeProposal.name.split(':')[0]} Forma Screenshot`}
                  sublabel="Attach authentic 3D axonometric view or master layout exported from Forma"
                  aspectRatio="video"
                  category="Autodesk Forma Deliverable"
                />
              )}

              {activeProposal.teamNotes && (
                <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-200 leading-relaxed">
                  <strong>Team Engineering Note:</strong> {activeProposal.teamNotes}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Before & After Proposal Comparison Slider */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Interactive Proposal Cross-Comparison Slider
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Drag the slider horizontally to compare Proposal A (TOD) and Proposal B (Superblocks).
                </p>
              </div>
              <span className="text-xs font-mono text-teal-600 dark:text-teal-400">
                ↔ DRAG TO COMPARE
              </span>
            </div>

            <ImageComparisonSlider
              imageA={data.proposals[0]?.formaScreenshots?.[0] || null}
              imageB={data.proposals[1]?.formaScreenshots?.[0] || null}
              labelA="Proposal A: Biophilic TOD Core"
              labelB="Proposal B: Polycentric Superblocks"
            />
          </div>
        </div>
      )}
    </div>
  );
};
