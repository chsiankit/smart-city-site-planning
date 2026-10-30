import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Bot,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  TrendingDown,
  Sun,
  Wind,
  Zap,
} from 'lucide-react';
import { sendGemmaChatMessage } from '../../services/gemmaService';

interface GemmaAnalysisPanelProps {
  activeModuleTitle: string;
  activeModuleDescription: string;
  moduleMetrics?: Record<string, any>;
  siteAreaKm2: string;
}

export const GemmaAnalysisPanel: React.FC<GemmaAnalysisPanelProps> = ({
  activeModuleTitle,
  activeModuleDescription,
  moduleMetrics,
  siteAreaKm2,
}) => {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customGoal, setCustomGoal] = useState('');

  const generateRecommendation = async () => {
    setIsLoading(true);
    setNotice(null);

    const prompt = `Analyze the Autodesk Forma simulation module "${activeModuleTitle}" for this ${siteAreaKm2} km² smart city site.
Module Description: ${activeModuleDescription}
Specific Metrics: ${JSON.stringify(moduleMetrics || {})}
Custom Optimization Target: ${customGoal.trim() || 'Maximize sustainability, resilience, and energy efficiency'}

Provide 3 actionable architectural recommendations to optimize performance in Autodesk Forma and Revit.`;

    try {
      const res = await sendGemmaChatMessage(prompt, [], {
        name: 'Smart City Planning District',
        areaKm2: siteAreaKm2,
      }, undefined, 'analysis_recommendation');

      setRecommendation(res.response);
      setIsDemoMode(res.isDemoMode);
      if (res.notice) setNotice(res.notice);
    } catch (err: any) {
      setRecommendation(`Failed to fetch AI recommendation: ${err.message}`);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!recommendation) return;
    navigator.clipboard.writeText(recommendation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B1E2E] to-slate-900 text-white border border-teal-500/30 shadow-xl space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Gemma 4 Environmental Advisory</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700/60">
                ACTIVE MODULE: {activeModuleTitle}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Generative AI optimization recommendations grounded in Autodesk Forma calculations.
            </p>
          </div>
        </div>

        <button
          onClick={generateRecommendation}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Analyzing...' : 'Generate AI Insights'}</span>
        </button>
      </div>

      {/* Optional Custom Target Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customGoal}
          onChange={(e) => setCustomGoal(e.target.value)}
          placeholder={`Optional: Specify constraint or goal for ${activeModuleTitle} (e.g. Target < 400 kg CO2e/m²)...`}
          className="flex-1 p-2.5 rounded-xl text-xs bg-slate-800/80 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-200 placeholder-slate-500"
        />
        {recommendation && (
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors shrink-0"
            title="Copy recommendation"
          >
            {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Output Container */}
      {recommendation ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="font-bold flex items-center gap-1.5 text-teal-400">
              {isDemoMode ? (
                <span className="text-amber-400">STATUS: DEMO HEURISTIC SIMULATION</span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  PROVENANCE: AI GENERATED (GEMMA 4 - 31B)
                </span>
              )}
            </span>
            <span className="text-slate-400">Distinct from Verified Forma Sim</span>
          </div>

          {notice && (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/80 text-[11px] text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{notice}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
            {recommendation}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-dashed border-slate-700/80 text-xs text-slate-400 flex items-center justify-between">
          <span>
            Click <strong>Generate AI Insights</strong> to run Gemma 4 analysis on the active <strong>{activeModuleTitle}</strong> module.
          </span>
          <span className="font-mono text-[10px] text-teal-400/80 hidden sm:inline">
            Zero-Hallucination Grounding
          </span>
        </div>
      )}
    </div>
  );
};
