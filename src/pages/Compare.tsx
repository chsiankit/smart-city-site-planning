import React, { useState } from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { calculateNormalizedScores } from '../utils/scoring';
import { Badge } from '../components/common/Badge';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Sliders,
  Award,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const Compare: React.FC = () => {
  const { data } = useProjectData();
  const metricsConfig = data.comparison.metrics;
  const proposals = data.proposals;

  // State for interactive user weight adjustment sliders (default from project.json)
  const [customWeights, setCustomWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    metricsConfig.forEach((m) => {
      initial[m.key] = m.weight;
    });
    return initial;
  });

  const [sortField, setSortField] = useState<string>('totalScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Compute live scores based on weights
  const scoredResults = calculateNormalizedScores(proposals, metricsConfig, customWeights);

  // Determine top-ranked proposal from live weights
  const topScored = [...scoredResults].sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0))[0];

  // Construct Radar Chart Data
  const radarChartData = metricsConfig.map((cfg) => {
    const item: Record<string, any> = {
      metric: cfg.label,
    };
    scoredResults.forEach((s) => {
      item[s.proposalName] = s.normalizedMetrics[cfg.key] ?? 0;
    });
    return item;
  });

  const handleWeightChange = (key: string, val: number) => {
    setCustomWeights((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleResetWeights = () => {
    const reset: Record<string, number> = {};
    metricsConfig.forEach((m) => {
      reset[m.key] = m.weight;
    });
    setCustomWeights(reset);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Multi-Criteria Decision Evaluation
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Autodesk Forma Board Comparison & Selection Matrix
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Min-Max normalized trade-off benchmark with adjustable multi-criteria weighting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
        </div>
      </div>

      {/* Official Forma Board Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Evaluation Governance Note:</strong> &ldquo;
          {data.comparison.scoringDisclaimer}&rdquo;
        </div>
      </div>

      {/* Live Weighted Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scoredResults.map((result) => {
          const isTop = topScored && topScored.proposalId === result.proposalId;
          const isOfficialSelected = data.comparison.recommendedProposalId === result.proposalId;

          return (
            <div
              key={result.proposalId}
              className={`p-6 rounded-3xl border transition-all ${
                isOfficialSelected
                  ? 'bg-white dark:bg-slate-800 border-teal-500 ring-2 ring-teal-500/20 shadow-xl'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {result.proposalName}
                    </h3>
                    {isOfficialSelected && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500 text-white">
                        OFFICIAL SELECTION
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {result.availableMetricsCount} metrics evaluated ({result.missingMetricsCount} missing)
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Weighted Index
                  </span>
                  <div className="text-3xl font-black text-teal-600 dark:text-teal-400">
                    {result.totalScore !== null ? result.totalScore : '--'}
                    <span className="text-sm font-semibold text-slate-400">/100</span>
                  </div>
                </div>
              </div>

              {/* Progress bar of composite score */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${result.totalScore ?? 0}%` }}
                />
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-slate-100 dark:border-slate-700/80">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <span className="text-[10px] text-slate-400 block">Green Space</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {result.metricValues.greenSpacePercent ?? '--'}%
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <span className="text-[10px] text-slate-400 block">Embodied Carbon</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {result.metricValues.embodiedCarbon ?? '--'} kg/m²
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <span className="text-[10px] text-slate-400 block">Daylight Autonomy</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {result.metricValues.daylightPotential ?? '--'}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radar Chart & Weight Sliders Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Radar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Multi-Criteria Performance Radar (0–100 Normalized)
            </h3>
            <Badge source="CALCULATED FROM PROVIDED DATA" className="text-[9px]" />
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="#64748B" opacity={0.2} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748B' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar
                  name={proposals[0]?.name.split(':')[0] || 'Proposal A'}
                  dataKey={proposals[0]?.name || ''}
                  stroke="#0F766E"
                  fill="#0F766E"
                  fillOpacity={0.4}
                />
                <Radar
                  name={proposals[1]?.name.split(':')[0] || 'Proposal B'}
                  dataKey={proposals[1]?.name || ''}
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.35}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Weight Tuning Sliders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Adjust Decision Criteria Weights
              </h3>
            </div>
            <button
              onClick={handleResetWeights}
              className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
            >
              Reset to Defaults
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Modify the importance multiplier (0 to 10) for each environmental indicator to observe how
            competing municipal priorities alter the composite trade-off score.
          </p>

          <div className="space-y-4 pt-2">
            {metricsConfig.map((cfg) => (
              <div key={cfg.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-slate-400">({cfg.unit})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      {cfg.direction === 'higher_is_better' ? 'Higher is better' : 'Lower is better'}
                    </span>
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400 w-4 text-right">
                      {customWeights[cfg.key] ?? cfg.weight}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={customWeights[cfg.key] ?? cfg.weight}
                  onChange={(e) => handleWeightChange(cfg.key, Number(e.target.value))}
                  className="w-full accent-teal-600 dark:accent-teal-400 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Side-by-Side Sortable Comparison Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Detailed Metric Breakdown Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Evaluation Indicator</th>
                <th className="py-3 px-4">Ideal Direction</th>
                <th className="py-3 px-4">Proposal A (TOD)</th>
                <th className="py-3 px-4">Proposal B (Superblocks)</th>
                <th className="py-3 px-4">Current Weight</th>
                <th className="py-3 px-4">Leading Scheme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
              {metricsConfig.map((cfg) => {
                const valA = proposals[0]?.metrics?.[cfg.key];
                const valB = proposals[1]?.metrics?.[cfg.key];
                const scoreA = scoredResults[0]?.normalizedMetrics[cfg.key];
                const scoreB = scoredResults[1]?.normalizedMetrics[cfg.key];

                const aWins = (scoreA ?? 0) > (scoreB ?? 0);
                const bWins = (scoreB ?? 0) > (scoreA ?? 0);

                return (
                  <tr key={cfg.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {cfg.label}
                    </td>
                    <td className="py-3 px-4">
                      {cfg.direction === 'higher_is_better' ? (
                        <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400">
                          <TrendingUp className="w-3 h-3" /> Maximize
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                          <TrendingDown className="w-3 h-3" /> Minimize
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {typeof valA === 'number' ? `${valA} ${cfg.unit}` : '--'}{' '}
                      <span className="text-[10px] text-slate-400">({scoreA ?? '--'}/100)</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      {typeof valB === 'number' ? `${valB} ${cfg.unit}` : '--'}{' '}
                      <span className="text-[10px] text-slate-400">({scoreB ?? '--'}/100)</span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {customWeights[cfg.key] ?? cfg.weight}x
                    </td>
                    <td className="py-3 px-4">
                      {aWins ? (
                        <span className="font-bold text-teal-600 dark:text-teal-400">
                          Proposal A (+{((scoreA ?? 0) - (scoreB ?? 0)).toFixed(1)})
                        </span>
                      ) : bWins ? (
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          Proposal B (+{((scoreB ?? 0) - (scoreA ?? 0)).toFixed(1)})
                        </span>
                      ) : (
                        <span className="text-slate-400">Parity</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Team Decision & Official Justification */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#102A43] to-[#0A3A40] text-white shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-teal-300 font-bold tracking-wider">
              Official Autodesk Forma Board Selection
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              {data.comparison.teamDecision}
            </h2>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <p>
            <strong className="text-white">Engineering & Planning Justification:</strong>{' '}
            {data.comparison.teamJustification}
          </p>
        </div>
      </div>
    </div>
  );
};
