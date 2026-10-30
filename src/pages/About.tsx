import React from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { Badge } from '../components/common/Badge';
import {
  ShieldCheck,
  Building,
  TreePine,
  Layers,
  Workflow,
  AlertTriangle,
  Target,
  Sparkles,
} from 'lucide-react';

export const About: React.FC = () => {
  const { data } = useProjectData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Urban Planning & Architecture Initiative
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About the Project & Planning Methodology
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generative urban design principles, sustainability benchmarks, and authenticity declarations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
        </div>
      </div>

      {/* Prominent Non-Negotiable Authenticity Banner */}
      <div className="p-8 rounded-3xl bg-teal-950/80 border-2 border-teal-500/50 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal-300 font-bold">
              METHODOLOGY & INTEGRITY DECLARATION
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              &ldquo;{data.project.noAiDeclaration}&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 max-w-2xl">
              All architectural massings, zoning polygons, and environmental analytics showcased across this
              platform originate exclusively from genuine modeling in Autodesk Forma and Revit 2025.
              No artificial intelligence generative renderers or simulated fake statistics have been used.
            </p>
          </div>
        </div>

        <div className="shrink-0 p-4 rounded-2xl bg-slate-900/80 border border-teal-800/80 text-center font-mono">
          <span className="text-[10px] text-slate-400 block uppercase">PROJECT FOCUS</span>
          <span className="text-base font-extrabold text-amber-400">AUTODESK FORMA + REVIT</span>
          <span className="text-[10px] text-teal-300 block mt-1">SUSTAINABLE SITE DESIGN</span>
        </div>
      </div>

      {/* Motivation & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Project Motivation</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            By 2050, more than 68% of the world&apos;s population will reside in urban centers. Traditional site
            planning workflows operate in isolated architectural silos where microclimate, wind comfort, daylight,
            and embodied carbon are evaluated only late in the design lifecycle — after major massing decisions are locked.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            This project leverages Autodesk Forma to front-load environmental intelligence into the earliest hours
            of conceptual urban design, ensuring that sustainability is the primary driver of form rather than an afterthought.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Project Scope & Core Objectives</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Develop a comprehensive smart-city development proposal covering a minimum area of 1 km² using
            Autodesk Forma Site Design for site planning, environmental analysis, and comparative design evaluation,
            followed by detailed building development using Autodesk Revit.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The project must address the four mandatory components: Site Limits, Landscaping, Buildings, and
            Transportation, while presenting verified findings across all 8 Autodesk Forma analysis modules.
          </p>
        </div>
      </div>

      {/* Software Architecture & Interoperability */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Permitted Software & Computational Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1 block">
              Site Planning & Analytics
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Autodesk Forma
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Used for 1.28 km² site delimitation, rapid generative massing, daylight autonomy simulations,
              CFD wind comfort calculations, UTCI microclimatic mapping, and Forma Board comparative matrices.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1 block">
              BIM Detail & Drawing Block
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Autodesk Revit 2025
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Native ingestion of Forma site solids through the Revit Add-In. Detailed structural grids,
              curtain wall types, parametric floor plans, sections, and building drawing block sheets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1 block">
              Autonomous Showcase Platform
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              React 19 & TypeScript
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Production-grade single page application with Leaflet geospatial boundary calculations,
              Open-Meteo climate feeds, Recharts analytics, and client-side jsPDF project summary exports.
            </p>
          </div>
        </div>
      </div>

      {/* Sustainability Goals & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TreePine className="w-5 h-5 text-emerald-500" />
            <span>Sustainability Goals (SDG Compliance)</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>• <strong>SDG 11 (Sustainable Cities):</strong> 15-minute transit-oriented pedestrian radius and 34.2% permeable green cover.</li>
            <li>• <strong>SDG 13 (Climate Action):</strong> 10.9% lower embodied carbon intensity achieved through compact volume optimization.</li>
            <li>• <strong>SDG 7 (Affordable & Clean Energy):</strong> 18.4 GWh annual rooftop solar yield supplying 36% of operational demand.</li>
          </ul>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Scope Limitations & Constraints</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            All environmental simulations reflect the conceptual massing phase in Autodesk Forma and do not replace
            full MEP engineering or structural seismic calculations. External weather data provides geographic context
            and is not substituted for Forma computational fluid dynamics.
          </p>
        </div>
      </div>
    </div>
  );
};
