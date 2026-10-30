import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useProjectData } from '../../hooks/useProjectData';
import { generateProjectSummaryPDF } from '../../utils/pdf';
import {
  Compass,
  Layers,
  BarChart2,
  Cpu,
  FileCheck,
  Users,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Download,
  Settings,
  ShieldCheck,
  Building,
  Sparkles,
  Code,
} from 'lucide-react';
import { GlobalSearch } from '../common/GlobalSearch';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { data } = useProjectData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { to: '/site', label: 'Site Overview', icon: <Compass className="w-4 h-4" /> },
    { to: '/proposals', label: 'Proposals', icon: <Layers className="w-4 h-4" /> },
    { to: '/analysis', label: 'Analysis', icon: <BarChart2 className="w-4 h-4" /> },
    { to: '/compare', label: 'Forma Board', icon: <BarChart2 className="w-4 h-4" /> },
    { to: '/workflow', label: 'AI Workflow', icon: <Sparkles className="w-4 h-4 text-teal-400" /> },
    { to: '/open-source', label: 'Open Source & AI', icon: <Code className="w-4 h-4 text-emerald-400" /> },
    { to: '/smart-city', label: 'Smart City Features', icon: <Cpu className="w-4 h-4" /> },
    { to: '/revit-bim', label: 'Revit & BIM', icon: <Building className="w-4 h-4" /> },
    { to: '/gallery', label: 'Gallery', icon: <FileCheck className="w-4 h-4" /> },
    { to: '/tracker', label: 'Project Progress', icon: <FileCheck className="w-4 h-4" /> },
    { to: '/team', label: 'Team & Resources', icon: <Users className="w-4 h-4" /> },
    { to: '/about', label: 'About', icon: <Compass className="w-4 h-4" /> },
    { to: '/contact', label: 'Contact', icon: <Users className="w-4 h-4" /> },
  ];

  const handleDownloadPDF = () => {
    setIsExportingPDF(true);
    try {
      generateProjectSummaryPDF(data);
    } catch (e) {
      console.error('PDF generation error:', e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        {/* Subtle Professional Project Information Strip */}
        <div className="bg-[#102A43] text-teal-300 text-[11px] font-medium px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap tracking-wide font-mono">
            <span className="text-white font-bold">SMART CITY DEVELOPMENT</span>
            <span className="text-teal-400">|</span>
            <span className="text-teal-300">AUTODESK FORMA + REVIT</span>
            <span className="text-teal-400 hidden sm:inline">|</span>
            <span className="text-amber-400 font-semibold hidden sm:inline">SUSTAINABLE URBAN PLANNING</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Original Work — No AI Renders</span>
            </span>
            <Link
              to="/admin"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors text-[11px]"
              title="Open Project Editor"
            >
              <Settings className="w-3 h-3" />
              <span>Project Editor</span>
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Project Title */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-[#102A43] flex items-center justify-center text-white font-bold shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Building className="w-5 h-5 text-teal-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                SMART CITY <span className="text-teal-600 dark:text-teal-400">PLANNING</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Autodesk Forma & Revit Showcase
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Scrollable or condensed) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons: Search, PDF, Theme, Mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-colors"
              title="Search Project (Cmd + K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono border border-slate-300 dark:border-slate-600">
                ⌘K
              </kbd>
            </button>

            {/* Download Summary PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#102A43] hover:bg-slate-800 text-white shadow-sm transition-all"
              title="Download verified project summary PDF"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{isExportingPDF ? 'Exporting...' : 'Export PDF'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="xl:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-1 animate-fade-in shadow-2xl">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleDownloadPDF();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-[#102A43] text-white"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Project Summary (PDF)</span>
              </button>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <Settings className="w-3.5 h-3.5 text-teal-600" />
                <span>Project Data Editor & Validation</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
