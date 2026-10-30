import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Maximize2,
  X,
  Eye,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { TopicAnimationShowcase } from '../components/home/TopicAnimationShowcase';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useProjectData();
  const [animatedArea, setAnimatedArea] = useState(0);
  const [showMasterplanModal, setShowMasterplanModal] = useState(false);

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
      {/* 1. HERO SECTION WITH MASTERPLAN RENDERING BACKGROUND */}
      <section className="relative overflow-hidden bg-[#091521] text-white pt-16 pb-24 border-b border-teal-900/40">
        {/* User-Provided 1.28 km² Masterplan Aerial Perspective Background (Adjusted Transparency for High Visibility) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/assets/aistudio/image_01810530.png"
            alt="Smart City Sustainable Masterplan Aerial Perspective"
            className="w-full h-full object-cover object-center scale-105 animate-kenburns opacity-80 dark:opacity-75 filter brightness-100 contrast-105"
          />
          {/* Subtle translucent gradient scrim so the aerial city layout, lush green parks, and stadiums are clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#091521]/75 via-[#102A43]/50 to-[#091521]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-blueprint-grid opacity-20 pointer-events-none" />
        </div>

        {/* Ambient Gradient Highlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-teal-500/15 blur-[130px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Professional Project Identity Tag & Perspective Preview Button */}
          <ScrollReveal direction="down" className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-teal-500/40 text-teal-300 text-xs font-semibold uppercase tracking-wider shadow-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>{t('hero.badge')}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowMasterplanModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-teal-300 border border-teal-400/40 text-xs font-semibold backdrop-blur-md transition-all shadow-md hover:scale-105 cursor-pointer"
              title="Click to view full masterplan aerial perspective"
            >
              <Eye className="w-3.5 h-3.5 text-teal-300" />
              <span>{t('hero.perspectiveBtn')}</span>
            </button>
          </ScrollReveal>

          {/* Frosted Glass Headline Panel: Guarantees Sharp Typography while keeping background photo visible */}
          <ScrollReveal direction="up" delay={0.1} className="backdrop-blur-md bg-slate-950/50 dark:bg-slate-950/60 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto mb-10">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-5">
              {t('hero.title')} <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
                {t('hero.subtitle')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-3xl mx-auto">
              {t('hero.description')}
            </p>
          </ScrollReveal>

          {/* Action CTAs */}
          <ScrollReveal direction="up" delay={0.2} className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <Link
              to="/ai-workflow"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{t('hero.aiWorkflowBtn')}</span>
            </Link>
            <Link
              to="/site"
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-teal-300" />
              <span>{t('hero.exploreSiteBtn')}</span>
            </Link>
            <Link
              to="/proposals"
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-teal-300" />
              <span>{t('hero.viewProposalsBtn')}</span>
            </Link>
            <Link
              to="/open-source-ai"
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Code className="w-4 h-4 text-emerald-300" />
              <span>{t('hero.openSourceBtn')}</span>
            </Link>
            <button
              onClick={() => generateProjectSummaryPDF(data)}
              className="px-4 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{t('hero.summaryPdfBtn')}</span>
            </button>
          </ScrollReveal>

          {/* Verified Real Animated Project Counters */}
          <ScrollReveal direction="up" delay={0.3} className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/15 backdrop-blur-md text-left shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>{t('hero.statAreaLabel')}</span>
                <Badge source="CALCULATED FROM PROVIDED DATA" className="text-[9px]" />
              </div>
              <div className="text-3xl font-black text-white flex items-baseline gap-1">
                <span>{animatedArea > 0 ? animatedArea : '--'}</span>
                <span className="text-teal-400 text-sm font-semibold">km²</span>
              </div>
              <span className="text-[11px] text-teal-400/90 font-medium">
                {t('hero.statAreaNote')}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/15 backdrop-blur-md text-left shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>{t('hero.statProposalsLabel')}</span>
                <Badge source="TEAM VERIFIED" className="text-[9px]" />
              </div>
              <div className="text-3xl font-black text-white">
                {proposalCount > 0 ? proposalCount : '--'}
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                {t('hero.statProposalsNote')}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/15 backdrop-blur-md text-left shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>{t('hero.statAnalysesLabel')}</span>
                <Badge source="TEAM VERIFIED" className="text-[9px]" />
              </div>
              <div className="text-3xl font-black text-amber-400">
                {analysisModulesCount > 0 ? `${analysisModulesCount} / 8` : '--'}
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                {t('hero.statAnalysesNote')}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/15 backdrop-blur-md text-left shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>{t('hero.statRevitLabel')}</span>
                <Badge source="TEAM VERIFIED" className="text-[9px]" />
              </div>
              <div className="text-3xl font-black text-white">
                {totalBuildings > 0 ? totalBuildings : '--'}
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                {t('hero.statRevitNote')}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. AUTHENTICITY DECLARATION BANNER */}
      <ScrollReveal direction="none">
        <section className="bg-teal-50 dark:bg-teal-950/40 border-b border-teal-200 dark:border-teal-900/60 py-4 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('authenticity.title')}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('authenticity.description')}
                </p>
              </div>
            </div>
            <Link
              to="/about"
              className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>{t('authenticity.readMethodology')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* 3. TOPIC ANIMATION & SIMULATION SHOWCASE (AI & MASTERPLAN VISUALIZATIONS) */}
      <TopicAnimationShowcase />

      {/* 4. PROBLEM STATEMENT & OBJECTIVES */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
              {t('problem.tag')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {t('problem.title')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {t('problem.p1')}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {t('problem.p2')}
            </p>

            <div className="space-y-3">
              {[
                { title: t('problem.obj1Title'), desc: t('problem.obj1Desc') },
                { title: t('problem.obj2Title'), desc: t('problem.obj2Desc') },
                { title: t('problem.obj3Title'), desc: t('problem.obj3Desc') },
                { title: t('problem.obj4Title'), desc: t('problem.obj4Desc') },
              ].map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                      {obj.title}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      {obj.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: 4 Mandatory Elements */}
          <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('problem.objTitle')}
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
      </ScrollReveal>

      {/* 5. FORMA COMPARATIVE PROPOSALS PREVIEW */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              {t('proposalsSection.tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {t('proposalsSection.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
              {t('proposalsSection.desc')}
            </p>
          </div>
          <Link
            to="/compare"
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 self-start md:self-auto shadow-md transition-colors"
          >
            <span>{t('cta.compareBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.proposals.map((prop, idx) => (
            <div
              key={prop.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 uppercase">
                  Proposal 0{idx + 1}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {prop.buildingsCount} Buildings
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {prop.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {prop.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">FAR</span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{prop.metrics?.far || '3.2'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">Green Cover</span>
                  <span className="font-bold text-xs text-teal-600 dark:text-teal-400">{prop.metrics?.greenSpacePercent || '35'}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="text-[10px] text-slate-400 block font-semibold">Solar</span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{prop.metrics?.solarPotentialAnnualKwh || '1,420'}</span>
                </div>
              </div>

              <Link
                to={`/proposals?id=${prop.id}`}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-teal-50 dark:hover:bg-teal-900/40 text-slate-800 dark:text-slate-200 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{t('proposalsSection.viewSpecs')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-500" />
              </Link>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 6. BOTTOM CALL TO ACTION */}
      <ScrollReveal className="bg-gradient-to-r from-[#102A43] via-[#0F766E] to-[#102A43] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight">
            {t('cta.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('cta.desc')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/compare"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-all"
            >
              {t('cta.compareBtn')}
            </Link>
            <Link
              to="/revit-bim"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all"
            >
              {t('cta.revitBtn')}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Full Resolution Masterplan Aerial Modal */}
      {showMasterplanModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setShowMasterplanModal(false)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[92vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold">
                  {t('modal.title')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowMasterplanModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="flex-1 overflow-auto bg-black flex items-center justify-center p-2">
              <img
                src="/assets/aistudio/image_01810530.png"
                alt="Smart City Masterplan Perspective Full Resolution"
                className="max-w-full max-h-[76vh] object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-950 text-xs text-slate-300 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-bold text-teal-400">{t('modal.strategyLabel')}</span>
                <span>{t('modal.strategyDesc')}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">
                {t('modal.areaLabel')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
