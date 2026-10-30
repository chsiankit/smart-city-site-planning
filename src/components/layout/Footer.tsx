import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ExternalLink, Building } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-[#091521] text-slate-300 border-t border-slate-800">
      {/* Mandatory Non-Negotiable Authenticity Banner */}
      <div className="bg-teal-950/70 border-b border-teal-800/60 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-teal-300">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
            <span>
              &ldquo;Original work made in Autodesk Forma — no AI-generated content.&rdquo;
            </span>
          </div>
          <div className="text-[11px] text-teal-200/80 font-mono tracking-wide">
            PROJECT: <span className="font-bold text-amber-400">SMART CITY SITE PLANNING</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Project Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                <Building className="w-5 h-5 text-teal-100" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                SMART CITY <span className="text-teal-400">PLANNING</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="text-[11px] space-y-1 text-slate-400">
              <p><strong className="text-slate-300">Software:</strong> Autodesk Forma & Revit 2025</p>
              <p><strong className="text-slate-300">Developer:</strong> Ankit Yadav (AkkiCoder)</p>
            </div>
          </div>

          {/* Col 2: Core Project Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              {t('nav.home')} & Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/site" className="hover:text-teal-300 transition-colors">{t('nav.site')} (1.28 km²)</Link></li>
              <li><Link to="/proposals" className="hover:text-teal-300 transition-colors">{t('nav.proposals')}</Link></li>
              <li><Link to="/analysis" className="hover:text-teal-300 transition-colors">{t('nav.analysis')}</Link></li>
              <li><Link to="/compare" className="hover:text-teal-300 transition-colors">{t('nav.compare')}</Link></li>
              <li><Link to="/smart-city" className="hover:text-teal-300 transition-colors">{t('nav.smartCity')}</Link></li>
              <li><Link to="/revit-bim" className="hover:text-teal-300 transition-colors">{t('nav.revitBim')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Deliverables */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              AI & Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/ai-workflow" className="hover:text-teal-300 transition-colors text-amber-300 font-semibold">{t('nav.aiWorkflow')} (Gemma 4)</Link></li>
              <li><Link to="/open-source-ai" className="hover:text-teal-300 transition-colors text-emerald-300 font-semibold">{t('nav.openSourceAi')}</Link></li>
              <li><Link to="/tracker" className="hover:text-teal-300 transition-colors">Project Progress & Tracker</Link></li>
              <li><Link to="/gallery" className="hover:text-teal-300 transition-colors">{t('nav.gallery')}</Link></li>
              <li><Link to="/team" className="hover:text-teal-300 transition-colors">{t('nav.team')}</Link></li>
              <li><Link to="/about" className="hover:text-teal-300 transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/admin" className="hover:text-teal-300 transition-colors">{t('nav.projectEditor')}</Link></li>
            </ul>
          </div>

          {/* Col 4: Data Provenance & Ethics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Data Provenance & Policy
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every metric on this platform includes a strict provenance label:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-teal-950 border border-teal-700 text-teal-300 font-semibold">TEAM VERIFIED</span>
              <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-700 text-sky-300 font-semibold">LIVE API DATA</span>
              <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700 text-indigo-300 font-semibold">CALCULATED</span>
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-700 text-amber-300 font-semibold">PLACEHOLDER</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              External climate from Open-Meteo and roads from OpenStreetMap provide geographic context only, never substituted for Forma calculations.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            Independent Smart City Planning & Architectural Development Project • Solo Developer: Ankit Yadav (AkkiCoder).
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://help.autodesk.com/view/FORMA/ENU/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-teal-400 inline-flex items-center gap-1"
            >
              <span>Autodesk Forma Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
