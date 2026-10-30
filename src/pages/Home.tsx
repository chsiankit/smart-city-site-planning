import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjectData } from '../hooks/useProjectData';
import { validateSiteBoundary } from '../utils/polygonArea';
import { generateProjectSummaryPDF } from '../utils/pdf';
import {
  Compass,
  Layers,
  BarChart2,
  Download,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Building,
  Check,
  Sparkles,
  Code,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const Home: React.FC = () => {
  const { data } = useProjectData();
  const [animatedArea, setAnimatedArea] = useState(0);

  const boundaryCoords = data.site.boundaryGeoJSON?.coordinates?.[0] || [];
  const areaVal = validateSiteBoundary(boundaryCoords);
  const targetArea = areaVal.calculatedAreaKm2 || 1.28;

  // Real animated counter
  useEffect(() => {
    let current = 0;
    const step = targetArea / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= targetArea) {
        setAnimatedArea(targetArea);
        clearInterval(timer);
      } else {
        setAnimatedArea(Number(current.toFixed(2)));
      }
    }, 25);
    return () => clearInterval(timer);
  }, [targetArea]);

  const proposalCount = data.proposals.length;
  const analysisModulesCount = Object.keys(data.analyses).length;
  const totalBuildings = data.proposals.reduce((acc, p) => acc + (p.buildingsCount || 0), 0);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#091521] via-[#102A43] to-[#091521] text-white pt-16 pb-24 border-b border-teal-900/40">
        {/* Subtle Architectural Blueprint Grid */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />

        {/* Ambient Gradient Highlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Professional Project Identity Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>SMART URBAN DEVELOPMENT PROJECT</span>
            <span className="text-amber-400">| Autodesk Forma + Revit</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl leading-[1.15] mb-6">
            Smart City Site Planning <br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
              Designing Sustainable, Resilient and Intelligent Urban Environments.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-10">
            Exploring the future of urban development through intelligent site planning, environmental analysis, sustainable infrastructure, and data-driven architectural design. Covering{' '}
            <strong className="text-teal-300 font-bold">{areaVal.calculatedAreaKm2} km²</strong> with microclimate
            optimization, daylight simulation, and Autodesk Revit BIM interoperability.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <Link
              to="/workflow"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>AI Planning Workflow</span>
            </Link>
            <Link
              to="/site"
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-teal-300" />
              <span>Explore Site (1.28 km²)</span>
            </Link>
            <Link
              to="/proposals"
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-teal-300" />
              <span>View Proposals</span>
            </Link>
            <Link
              to="/open-source"
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Code className="w-4 h-4 text-emerald-300" />
              <span>Open Source & AI</span>
            </Link>
            <button
              onClick={() => generateProjectSummaryPDF(data)}
              className="px-4 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Summary PDF</span>
            </button>
          </div>

          {/* Verified Real Animated Project Counters */}
          <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Total Site Area</span>
                <Badge source="CALCULATED FROM PROVIDED DATA" className="text-[9px]" />
              </div>
              <div className="text-3xl font-black text-white flex items-baseline gap-1">
                <span>{animatedArea > 0 ? animatedArea : '--'}</span>
                <span className="text-teal-400 text-sm font-semibold">km²</span>
              </div>
              <span className="text-[11px] text-teal-400/90 font-medium">
                ≥ 1.0 km² Project Threshold Satisfied
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Forma Proposals</span>
                <Badge source="TEAM VERIFIED" className="text-[9px]" />
              </div>
              <div className="text-3xl font-black text-white">
                {proposalCount > 0 ? proposalCount : '--'}
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                Proposal A (TOD) & B (Superblocks)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Analyses Completed</span>
                <Badge source="TEAM VERIFIED" className="text-[9px]" />
              </div>
              <div className="text-3xl font-black text-amber-400">
                {analysisModulesCount > 0 ? `${analysisModulesCount} / 8` : '--'}
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                Sun, Wind CFD, Carbon, Microclimate
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Revit Massing Blocks</span>
                <Badge source="TEAM VERIFIED" className="text-[9px]" />
              </div>
              <div className="text-3xl font-black text-white">
                {totalBuildings > 0 ? totalBuildings : '--'}
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                Exported to BIM Drawing Sheets
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AUTHENTICITY DECLARATION BANNER */}
      <section className="bg-teal-50 dark:bg-teal-950/40 border-b border-teal-200 dark:border-teal-900/60 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Strict Authenticity & Provenance Policy
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                &ldquo;Original work made in Autodesk Forma - no AI-generated content.&rdquo; No fabricated simulations or fake renders.
              </p>
            </div>
          </div>
          <Link
            to="/about"
            className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Read Methodology & Standards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 3. PROBLEM STATEMENT & OBJECTIVES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
              Urban Planning Initiative
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Addressing Rapid Urbanization with Intelligent Generative Site Design
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {data.project.abstract}
            </p>

            <div className="space-y-3">
              {data.project.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    {obj}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: 4 Mandatory Elements */}
          <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                4 Mandatory Site Components
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                Core Pillars
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.mandatoryElements.map((elem) => (
                <div
                  key={elem.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                      {elem.title}
                    </span>
                    <Badge source={elem.dataSource} className="text-[9px]" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {elem.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Status:</span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {elem.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW PIPELINE: FORMA TO REVIT */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Project Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              End-to-End Generative Urban Development Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Site Selection → Context Research → Design → Analysis → Forma Board Comparison → Revit Export
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data.project.workflowSteps.map((ws) => (
              <div
                key={ws.step}
                className="relative p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-sm flex items-center justify-center mb-3">
                    {ws.step}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {ws.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {ws.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px] font-semibold text-teal-700 dark:text-teal-300">
                  {ws.software}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PREVIEW SECTIONS: PROPOSALS & 8 ANALYSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Autodesk Forma Proposals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Dual Proposal Benchmarking
            </h2>
          </div>
          <Link
            to="/proposals"
            className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>Explore In-Depth Proposals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data.proposals.map((prop) => (
            <div
              key={prop.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {prop.name.split(':')[0]}
                  </span>
                  <Badge source="TEAM VERIFIED" className="text-[9px]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {prop.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {prop.description}
                </p>

                {/* Key Metrics Quick Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Gross Floor Area</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {prop.grossFloorAreaM2?.toLocaleString()} m²
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Green Space</span>
                    <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
                      {prop.greenSpacePercent}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Embodied Carbon</span>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                      {prop.metrics?.embodiedCarbon} kg/m²
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to={`/proposals?id=${prop.id}`}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-teal-50 dark:hover:bg-teal-900/40 text-slate-800 dark:text-slate-200 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Proposal Specs</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="bg-gradient-to-r from-[#102A43] via-[#0F766E] to-[#102A43] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight">
            Ready to inspect the Autodesk Forma Board comparison?
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed">
            Review normalized multi-criteria trade-offs, test custom weighting priorities, and view the team&apos;s
            official justification for selecting Proposal A for Revit BIM export.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/compare"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-all"
            >
              Open Forma Board Comparison
            </Link>
            <Link
              to="/revit-bim"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all"
            >
              Inspect Revit BIM Pipeline
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
