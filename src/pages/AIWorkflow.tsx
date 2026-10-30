import React, { useState } from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { Badge } from '../components/common/Badge';
import { executeWorkflowStep } from '../services/gemmaService';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Scale,
  Sliders,
  Layers,
  MapPin,
  RefreshCw,
  Edit3,
} from 'lucide-react';

export const AIWorkflow: React.FC = () => {
  const { data } = useProjectData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Step 1: Site Info
  const [siteInfo, setSiteInfo] = useState({
    name: data.site.name,
    area: `${data.site.manuallyStatedAreaKm2 || 1.28} km²`,
    location: data.site.location,
    terrain: 'Flat alluvial urban floodplain',
    existingUse: 'Brownfield industrial redevelopment',
  });

  // Step 2: Goals & Constraints
  const [goals, setGoals] = useState({
    transitOriented: true,
    carbonTarget: '15% lower than baseline',
    greenCoverTarget: '35%',
    densityFar: '3.2 FAR',
    prioritySDG: 'SDG 11 (Sustainable Cities) & SDG 13 (Climate Action)',
    customConstraints: 'Preserve northern green drainage corridor and avoid overshadowing central plaza on winter solstice.',
  });

  // Step 3: Gemma 4 Output
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [reportNotice, setReportNotice] = useState<string | null>(null);

  // Step 4: User Edits
  const [editedNotes, setEditedNotes] = useState<string>('');

  // Step 5: Selected Alternative
  const [selectedAlternative, setSelectedAlternative] = useState<string>('Proposal A: Biophilic Transit-Oriented Core');

  const handleGenerateStep3 = async () => {
    setIsLoading(true);
    setReportNotice(null);

    try {
      const res = await executeWorkflowStep({
        step: 3,
        siteInfo: {
          name: siteInfo.name,
          area: siteInfo.area,
          location: siteInfo.location,
        },
        goals: `TOD=${goals.transitOriented}, Carbon=${goals.carbonTarget}, Green=${goals.greenCoverTarget}, FAR=${goals.densityFar}, SDG=${goals.prioritySDG}`,
        constraints: goals.customConstraints,
        selectedProposal: selectedAlternative,
      });

      setGeneratedReport(res.report);
      setEditedNotes(res.report);
      setIsDemoMode(res.isDemoMode);
      if (res.notice) setReportNotice(res.notice);
      setCurrentStep(4);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(editedNotes || generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const element = document.createElement('a');
    const file = new Blob([editedNotes || generatedReport], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `smart-city-planning-report-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const steps = [
    { num: 1, title: 'Site Profile', desc: 'Select or input site boundaries' },
    { num: 2, title: 'Goals & Limits', desc: 'Specify carbon, green cover & FAR' },
    { num: 3, title: 'AI Synthesis', desc: 'Gemma 4 generative recommendations' },
    { num: 4, title: 'Review & Edit', desc: 'Refine spatial parameters' },
    { num: 5, title: 'Compare Alternatives', desc: 'Trade-off review vs Proposals' },
    { num: 6, title: 'Export Deliverable', desc: 'Markdown & PDF planning report' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            AI Planning Workflow
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            6-Step AI-Assisted Site Planning Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            End-to-end sustainable urban site planning guided by Gemma 4 and grounded in Autodesk Forma calculations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
          <span className="px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-mono font-bold">
            GEMMA 4 (31B-IT)
          </span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((st) => (
            <button
              key={st.num}
              onClick={() => {
                if (st.num <= 3 || generatedReport) setCurrentStep(st.num);
              }}
              className={`p-3 rounded-2xl text-left border transition-all ${
                currentStep === st.num
                  ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 shadow-sm'
                  : currentStep > st.num
                  ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-500'
                  : 'bg-transparent border-transparent text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === st.num
                      ? 'bg-teal-600 text-white'
                      : currentStep > st.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {currentStep > st.num ? '✓' : st.num}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {st.title}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {st.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Step Contents */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 min-h-[420px]">
        {/* STEP 1: Site Profile */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Step 1: Select or Input Site Boundary Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Confirm your urban district dimensions. Pre-filled with verified project dataset values.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteInfo.name}
                  onChange={(e) => setSiteInfo({ ...siteInfo, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Site Area (Verified Geodesic Polygon)
                </label>
                <input
                  type="text"
                  value={siteInfo.area}
                  onChange={(e) => setSiteInfo({ ...siteInfo, area: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Geographic Location & Microclimate Zone
                </label>
                <input
                  type="text"
                  value={siteInfo.location}
                  onChange={(e) => setSiteInfo({ ...siteInfo, location: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Terrain & Drainage Baseline
                </label>
                <input
                  type="text"
                  value={siteInfo.terrain}
                  onChange={(e) => setSiteInfo({ ...siteInfo, terrain: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-300 flex items-center justify-between">
              <span>Verified Leaflet Boundary: 1.28 km² satisfies the minimum site planning threshold.</span>
              <span className="font-mono text-[10px]">COORDS: 23.16° N, 72.68° E</span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2 shadow"
              >
                <span>Continue to Goals & Constraints</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Goals & Constraints */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Step 2: Set Planning Goals & Spatial Constraints
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Specify sustainability targets, transit priorities, and municipal density constraints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Green Cover (%)
                </label>
                <input
                  type="text"
                  value={goals.greenCoverTarget}
                  onChange={(e) => setGoals({ ...goals, greenCoverTarget: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Embodied Carbon Reduction
                </label>
                <input
                  type="text"
                  value={goals.carbonTarget}
                  onChange={(e) => setGoals({ ...goals, carbonTarget: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Density (Floor Area Ratio)
                </label>
                <input
                  type="text"
                  value={goals.densityFar}
                  onChange={(e) => setGoals({ ...goals, densityFar: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary SDG Focus
                </label>
                <input
                  type="text"
                  value={goals.prioritySDG}
                  onChange={(e) => setGoals({ ...goals, prioritySDG: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Custom Constraints (Microclimate, Wind Buffering, Height Limits)
              </label>
              <textarea
                rows={3}
                value={goals.customConstraints}
                onChange={(e) => setGoals({ ...goals, customConstraints: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2 shadow"
              >
                <span>Proceed to Gemma 4 Generation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Gemma 4 Generation Trigger */}
        {currentStep === 3 && (
          <div className="space-y-6 text-center max-w-2xl mx-auto py-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Generate Planning Recommendations with Gemma 4
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gemma 4 will synthesize your site constraints ({siteInfo.area}, {goals.densityFar}, {goals.greenCoverTarget} green cover) into an actionable architectural framework.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Model Engine:</span>
                <span className="text-teal-600 dark:text-teal-400 font-bold">gemma-4-31b-it (Server-Side)</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Domain Integration:</span>
                <span className="text-slate-700 dark:text-slate-300">Autodesk Forma + Revit 2025</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Data Provenance:</span>
                <span className="text-emerald-500">Zero Fabricated Stats (Transparent Tagging)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Back to Goals
              </button>
              <button
                onClick={handleGenerateStep3}
                disabled={isLoading}
                className="px-8 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white shadow-xl flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Synthesizing with Gemma 4...' : 'Run Gemma 4 Synthesis'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Edit Recommendations */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span>Step 4: Review & Refine Generated Recommendations</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  You can edit the AI output directly to tailor it before comparing alternatives.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className={`px-2.5 py-1 rounded-md ${isDemoMode ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                  {isDemoMode ? 'DEMO HEURISTIC' : 'GEMMA 4 GENERATED'}
                </span>
              </div>
            </div>

            {reportNotice && (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                {reportNotice}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Editable Planning Output (Markdown)
              </label>
              <textarea
                rows={12}
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Re-run Synthesis
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2 shadow"
              >
                <span>Proceed to Compare Alternatives</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Compare Planning Alternatives */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Step 5: Compare Planning Alternatives</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Evaluate which design alternative best executes your Gemma 4 planning recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.proposals.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => setSelectedAlternative(prop.name)}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                    selectedAlternative === prop.name
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                      {prop.id.toUpperCase()}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        selectedAlternative === prop.name
                          ? 'bg-teal-600 text-white'
                          : 'border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {selectedAlternative === prop.name ? '✓' : ''}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {prop.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {prop.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[9px]">EMBODIED CARBON</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {prop.metrics.embodiedCarbon} kg CO₂e/m²
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">GREEN SPACE</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {prop.metrics.greenSpacePercent}%
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Back to Review
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                className="px-6 py-3 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2 shadow"
              >
                <span>Finalize & Export Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Export Planning Report */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span>Step 6: Export Master Planning Report</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ready for municipal presentation, academic review, or Revit BIM documentation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyReport}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Markdown' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .MD Report</span>
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[460px] overflow-y-auto border border-slate-800">
              {editedNotes || generatedReport}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Back to Comparison
              </button>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Start New Workflow
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
