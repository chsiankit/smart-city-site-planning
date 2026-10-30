import React, { useState } from 'react';
import {
  Sparkles,
  Scale,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { sendGemmaChatMessage } from '../../services/gemmaService';

interface GemmaComparisonAdvisorProps {
  proposals: Array<{
    name: string;
    metrics: Record<string, any>;
  }>;
  weights: Record<string, number>;
  siteAreaKm2: string;
}

export const GemmaComparisonAdvisor: React.FC<GemmaComparisonAdvisorProps> = ({
  proposals,
  weights,
  siteAreaKm2,
}) => {
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateSynthesis = async () => {
    setIsLoading(true);
    setNotice(null);

    const prompt = `Compare Proposal A vs Proposal B for a ${siteAreaKm2} km² smart city site planning development.
Proposal Data: ${JSON.stringify(proposals)}
Active Multi-Criteria Weights (0-10): ${JSON.stringify(weights)}

Synthesize the trade-offs:
1. Carbon & Environmental Performance vs. Pedestrian Wind & Daylight Comfort
2. Transit-Oriented Density vs. Polycentric Superblock Decentralization
3. Final Engineering Recommendation on which proposal best satisfies sustainable urban development standards.`;

    try {
      const res = await sendGemmaChatMessage(
        prompt,
        [],
        { name: 'Smart City Planning District', areaKm2: siteAreaKm2 },
        { proposals, weights },
        'comparison'
      );
      setSynthesis(res.response);
      setIsDemoMode(res.isDemoMode);
      if (res.notice) setNotice(res.notice);
    } catch (err: any) {
      setSynthesis(`Error generating synthesis: ${err.message}`);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!synthesis) return;
    navigator.clipboard.writeText(synthesis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0E2033] to-slate-900 text-white border border-teal-500/30 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Gemma 4 Multi-Criteria Trade-Off Advisor</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700/60">
                FORMA BOARD
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Generative decision analysis evaluating Proposal A vs Proposal B with real-time criteria weights.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateSynthesis}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white shadow-lg flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing...' : 'Run Gemma 4 Comparison'}</span>
        </button>
      </div>

      {synthesis ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="font-bold flex items-center gap-1.5 text-teal-400">
              {isDemoMode ? (
                <span className="text-amber-400">STATUS: DEMO HEURISTIC TRADE-OFF ADVISORY</span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  PROVENANCE: AI GENERATED (GEMMA 4 - 31B)
                </span>
              )}
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Synthesis'}</span>
            </button>
          </div>

          {notice && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-[11px] text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{notice}</span>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
            {synthesis}
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-slate-800/40 border border-dashed border-slate-700 text-xs text-slate-400 flex items-center justify-between">
          <span>
            Click <strong>Run Gemma 4 Comparison</strong> to evaluate the weighted balance between Proposal A (Transit-Oriented) and Proposal B (Polycentric Superblocks).
          </span>
          <span className="font-mono text-[10px] text-teal-400 shrink-0 hidden md:inline">
            Integrates Live Weight Sliders
          </span>
        </div>
      )}
    </div>
  );
};
