import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectData } from '../../hooks/useProjectData';
import { Search, Compass, BarChart2, Layers, Cpu, FileCheck, Users, HelpCircle, X, ArrowRight, Sparkles, Code } from 'lucide-react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string;
  category: 'Page' | 'Proposal' | 'Analysis' | 'Smart City' | 'Team' | 'Resource';
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const { data } = useProjectData();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Construct search pool
  const searchPool: SearchResultItem[] = [
    // Pages
    { id: 'page-home', category: 'Page', title: 'Home Overview', description: 'Landing page with project overview, workflow pipeline, and animated counters.', url: '/', icon: <Compass className="w-4 h-4" /> },
    { id: 'page-site', category: 'Page', title: 'Site Overview & Boundary Map', description: 'Interactive GeoJSON 1.28 km² site limits, climate, and topography.', url: '/site', icon: <Compass className="w-4 h-4" /> },
    { id: 'page-proposals', category: 'Page', title: 'Design Proposals (A & B)', description: 'Biophilic TOD vs Polycentric Superblocks with land use donut charts.', url: '/proposals', icon: <Layers className="w-4 h-4" /> },
    { id: 'page-analysis', category: 'Page', title: 'Autodesk Forma 8-Module Analysis', description: 'Embodied carbon, sun hours, daylight, CFD wind, UTCI microclimate, noise, solar.', url: '/analysis', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'page-compare', category: 'Page', title: 'Forma Board Comparison', description: 'Normalized multi-criteria radar chart with custom weight sliders and justification.', url: '/compare', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'page-smart-city', category: 'Page', title: 'Smart City Infrastructure', description: 'Mobility, sponge city drainage, solar microgrid, and resilience networks.', url: '/smart-city', icon: <Cpu className="w-4 h-4" /> },
    { id: 'page-revit', category: 'Page', title: 'Autodesk Revit & BIM Workflow', description: '7-step Forma to Revit BIM pipeline, drawing blocks, and sync status.', url: '/revit-bim', icon: <Layers className="w-4 h-4" /> },
    { id: 'page-gallery', category: 'Page', title: 'Gallery & 30s Walkthrough Video', description: 'Masonry gallery with lightbox and 30-second project walkthrough chapters.', url: '/gallery', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'page-workflow', category: 'Page', title: 'AI Planning Workflow (Gemma 4)', description: '6-step practical site planning workflow powered by Gemma 4.', url: '/workflow', icon: <Sparkles className="w-4 h-4 text-teal-400" /> },
    { id: 'page-opensource', category: 'Page', title: 'Open Source & AI (Hacktoberfest 2026)', description: 'Open-source repository docs, Gemma 4 architecture, contribution guide, and MIT license.', url: '/open-source', icon: <Code className="w-4 h-4 text-emerald-400" /> },
    { id: 'page-tracker', category: 'Page', title: 'Project Progress & Checklist', description: 'Development milestones, deliverable checklist, and slide deck validator.', url: '/tracker', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'page-team', category: 'Page', title: 'Team & Resources', description: 'Team roles, academic advisors, and official reference documentation.', url: '/team', icon: <Users className="w-4 h-4" /> },
    { id: 'page-about', category: 'Page', title: 'About & Methodology', description: 'Design philosophy, tools used, and Non-AI authenticity declaration.', url: '/about', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'page-admin', category: 'Page', title: 'Admin & Project JSON Editor', description: 'Live project editor, schema validation report, and JSON export/import.', url: '/admin', icon: <Cpu className="w-4 h-4" /> },

    // Proposals
    ...data.proposals.map((p) => ({
      id: `prop-${p.id}`,
      category: 'Proposal' as const,
      title: p.name,
      description: `${p.tagline} — ${p.buildingsCount ?? '--'} buildings, ${p.greenSpacePercent ?? '--'}% green space.`,
      url: `/proposals?id=${p.id}`,
      icon: <Layers className="w-4 h-4 text-teal-500" />,
    })),

    // Analyses
    ...Object.values(data.analyses).map((an) => ({
      id: `an-${an.id}`,
      category: 'Analysis' as const,
      title: `${an.title} (${an.unit})`,
      description: an.keyInsight,
      url: `/analysis?module=${an.id}`,
      icon: <BarChart2 className="w-4 h-4 text-amber-500" />,
    })),

    // Smart City Features
    ...data.smartCityFeatures.map((f) => ({
      id: `feat-${f.id}`,
      category: 'Smart City' as const,
      title: f.title,
      description: `[${f.category}] ${f.description}`,
      url: `/smart-city?cat=${encodeURIComponent(f.category)}`,
      icon: <Cpu className="w-4 h-4 text-indigo-500" />,
    })),

    // Team members
    ...data.team.map((m) => ({
      id: `team-${m.id}`,
      category: 'Team' as const,
      title: `${m.name} — ${m.role}`,
      description: `${m.department} | ${m.institution || ''}`,
      url: '/team',
      icon: <Users className="w-4 h-4 text-cyan-500" />,
    })),
  ];

  const filtered = query.trim()
    ? searchPool.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchPool.slice(0, 8); // Top default suggestions

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    navigate(item.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type to search proposals, analyses, BIM models, team (Cmd + K)..."
            className="w-full bg-transparent text-sm md:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No matching project content found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${
                  selectedIndex === idx
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                    <h5 className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 self-center opacity-60" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-teal-600 dark:text-teal-400 font-medium">
            Smart City Site Planning Project
          </span>
        </div>
      </div>
    </div>
  );
};
