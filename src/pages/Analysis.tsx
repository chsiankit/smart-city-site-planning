import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjectData } from '../hooks/useProjectData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Badge } from '../components/common/Badge';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import { GemmaAnalysisPanel } from '../components/ai/GemmaAnalysisPanel';
import {
  BarChart2,
  Sun,
  Wind,
  Volume2,
  TreePine,
  Sparkles,
  Zap,
  TrendingDown,
  Activity,
  Layers,
  CheckCircle,
} from 'lucide-react';

export const Analysis: React.FC = () => {
  const { data } = useProjectData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProposalFilter, setActiveProposalFilter] = useState<'both' | 'propA' | 'propB'>('both');

  const analysesList = Object.values(data.analyses);
  const activeModuleQuery = searchParams.get('module');

  const filteredAnalyses = analysesList.filter((item) => {
    if (activeModuleQuery && activeModuleQuery !== 'all') {
      return item.id === activeModuleQuery;
    }
    if (selectedCategory === 'all') return true;
    return item.id === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            8 Mandatory Forma Modules
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Autodesk Forma Environmental Analysis Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authentic simulations executed using Autodesk Forma analytical engines for Proposals A & B.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
          <div className="text-xs font-bold text-teal-700 dark:text-teal-300 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
            8/8 Complete
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Module Selector Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchParams({});
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === 'all' && !activeModuleQuery
                ? 'bg-teal-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            All 8 Modules
          </button>
          {analysesList.map((an) => (
            <button
              key={an.id}
              onClick={() => {
                setSelectedCategory(an.id);
                setSearchParams({ module: an.id });
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                (activeModuleQuery === an.id || (selectedCategory === an.id && !activeModuleQuery))
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {an.title.split('&')[0].trim()}
            </button>
          ))}
        </div>

        {/* Proposal Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveProposalFilter('both')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeProposalFilter === 'both'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Both Proposals
          </button>
          <button
            onClick={() => setActiveProposalFilter('propA')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeProposalFilter === 'propA'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Proposal A
          </button>
          <button
            onClick={() => setActiveProposalFilter('propB')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              activeProposalFilter === 'propB'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Proposal B
          </button>
        </div>
      </div>

      {/* Embedded Gemma 4 Environmental Advisory Panel */}
      <GemmaAnalysisPanel
        activeModuleTitle={filteredAnalyses[0]?.title || 'Forma Environmental Simulation'}
        activeModuleDescription={filteredAnalyses[0]?.whatItMeasures || 'Forma site analysis'}
        moduleMetrics={filteredAnalyses[0]?.chartData?.[0]}
        siteAreaKm2={String(data.site.manuallyStatedAreaKm2 || 1.28)}
      />

      {/* Analysis Modules Grid */}
      <div className="space-y-10">
        {filteredAnalyses.map((module) => (
          <div
            key={module.id}
            id={module.id}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6"
          >
            {/* Header: Title, Unit, Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {module.title}
                  </h2>
                  <Badge source={module.dataSource} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Unit of Measurement: <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{module.unit}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Status: {module.verificationStatus}
                </span>
              </div>
            </div>

            {/* What it measures */}
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white">Scope & Analytical Metric:</strong>{' '}
              {module.whatItMeasures}
            </div>

            {/* Split Grid: Results & Chart vs Screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Visual Chart & Key Insight */}
              <div className="space-y-5">
                {/* Proposal A & B Numeric Summary Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
                    <span className="text-[10px] font-bold uppercase text-teal-700 dark:text-teal-400">
                      Proposal A (Biophilic TOD)
                    </span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-1">
                      {module.proposalAResults}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                    <span className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-400">
                      Proposal B (Superblocks)
                    </span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-1">
                      {module.proposalBResults}
                    </p>
                  </div>
                </div>

                {/* Recharts Chart Viewport */}
                <div className="h-64 w-full p-2 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    {module.chartType === 'line' ? (
                      <LineChart data={module.chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0F172A',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '12px',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        {(activeProposalFilter === 'both' || activeProposalFilter === 'propA') && (
                          <Line
                            type="monotone"
                            dataKey="proposalA"
                            name="Proposal A"
                            stroke="#0F766E"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        )}
                        {(activeProposalFilter === 'both' || activeProposalFilter === 'propB') && (
                          <Line
                            type="monotone"
                            dataKey="proposalB"
                            name="Proposal B"
                            stroke="#6366F1"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        )}
                      </LineChart>
                    ) : (
                      <BarChart data={module.chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0F172A',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '12px',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        {(activeProposalFilter === 'both' || activeProposalFilter === 'propA') && (
                          <Bar
                            dataKey="proposalA"
                            name="Proposal A"
                            fill="#0F766E"
                            radius={[4, 4, 0, 0]}
                          />
                        )}
                        {(activeProposalFilter === 'both' || activeProposalFilter === 'propB') && (
                          <Bar
                            dataKey="proposalB"
                            name="Proposal B"
                            fill="#6366F1"
                            radius={[4, 4, 0, 0]}
                          />
                        )}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Key Analytical Insight Box */}
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <strong className="font-bold text-amber-800 dark:text-amber-300">
                    Forma Engineering Insight:
                  </strong>{' '}
                  {module.keyInsight}
                </div>
              </div>

              {/* Right Column: Authentic Forma Screenshot / CAD Placeholder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Autodesk Forma Analytical Heatmap / View</span>
                  <span>Deliverable Evidence</span>
                </div>

                {module.formaScreenshot ? (
                  <img
                    src={module.formaScreenshot}
                    alt={`${module.title} Forma Simulation`}
                    className="w-full rounded-2xl object-cover aspect-video border border-slate-200 dark:border-slate-700 shadow-md"
                  />
                ) : (
                  <PlaceholderImage
                    label={`Add Forma ${module.title} Screenshot`}
                    sublabel={`Export native ${module.title.toLowerCase()} heatmap screenshot from Autodesk Forma`}
                    aspectRatio="video"
                    category={module.title}
                  />
                )}

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Analytical Model Verification:</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400">
                    Engine Solved & Documented
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
