import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme, THEME_OPTIONS, ThemeColor } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProjectData } from '../../hooks/useProjectData';
import { SUPPORTED_LANGUAGES, setAppLanguage } from '../../i18n';
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
  Globe,
  Palette,
  User as UserIcon,
  LogOut,
  Sliders,
  ChevronDown,
  Lock,
} from 'lucide-react';
import { GlobalSearch } from '../common/GlobalSearch';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode, setMode, theme, setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const { data } = useProjectData();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Dropdown states
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
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
    { to: '/', label: t('nav.home'), icon: <Compass className="w-3.5 h-3.5" /> },
    { to: '/site', label: t('nav.site'), icon: <Compass className="w-3.5 h-3.5" /> },
    { to: '/proposals', label: t('nav.proposals'), icon: <Layers className="w-3.5 h-3.5" /> },
    { to: '/analysis', label: t('nav.analysis'), icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { to: '/compare', label: t('nav.compare'), icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { to: '/ai-workflow', label: t('nav.aiWorkflow'), icon: <Sparkles className="w-3.5 h-3.5 text-teal-400" /> },
    { to: '/open-source-ai', label: t('nav.openSourceAi'), icon: <Code className="w-3.5 h-3.5 text-emerald-400" /> },
    { to: '/smart-city', label: t('nav.smartCity'), icon: <Cpu className="w-3.5 h-3.5" /> },
    { to: '/revit-bim', label: t('nav.revitBim'), icon: <Building className="w-3.5 h-3.5" /> },
    { to: '/gallery', label: 'Gallery', icon: <FileCheck className="w-3.5 h-3.5" /> },
    { to: '/team', label: t('nav.team'), icon: <Users className="w-3.5 h-3.5" /> },
    { to: '/about', label: t('nav.about'), icon: <Compass className="w-3.5 h-3.5" /> },
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

  const handleLanguageSelect = (code: string) => {
    setAppLanguage(code);
    setIsLangDropdownOpen(false);
  };

  const handleThemeColorSelect = (color: ThemeColor) => {
    setTheme(color);
    setIsThemeDropdownOpen(false);
  };

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
        {/* Top Professional Project Information Strip */}
        <div className="bg-[#102A43] text-teal-300 text-[11px] font-medium px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap tracking-wide font-mono">
            <span>{t('nav.projectInfo')}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('nav.authenticityPill')}</span>
            </span>
            <Link
              to="/admin"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors text-[11px]"
              title={t('nav.projectEditor')}
            >
              <Settings className="w-3 h-3" />
              <span>{t('nav.projectEditor')}</span>
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
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

          {/* Desktop Nav Links */}
          <nav className="hidden 2xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 ${
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

          {/* Action Toolbar: Search, Language, Theme, Auth, Mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Command Palette Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-colors cursor-pointer"
              title={`${t('nav.searchPlaceholder')} (⌘K)`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t('nav.searchPlaceholder')}</span>
              <kbd className="hidden lg:inline text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono border border-slate-300 dark:border-slate-600">
                ⌘K
              </kbd>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Select Interface Language"
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="hidden sm:inline uppercase text-[11px]">{currentLangObj.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 animate-fade-in text-xs">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Select Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                        i18n.language === lang.code
                          ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme & Palette Selector */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Customize Theme & Color Palette"
              >
                <Palette className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </button>

              {isThemeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-3 z-50 animate-fade-in text-xs space-y-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                      Mode
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setMode('light')}
                        className={`p-1.5 rounded-lg border text-center flex items-center justify-center gap-1.5 font-semibold ${
                          mode === 'light'
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Light</span>
                      </button>
                      <button
                        onClick={() => setMode('dark')}
                        className={`p-1.5 rounded-lg border text-center flex items-center justify-center gap-1.5 font-semibold ${
                          mode === 'dark'
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                      Palette
                    </div>
                    <div className="space-y-1">
                      {THEME_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleThemeColorSelect(opt.id)}
                          className={`w-full p-1.5 rounded-lg flex items-center justify-between text-left transition-colors ${
                            theme === opt.id
                              ? 'bg-slate-100 dark:bg-slate-800 font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0"
                              style={{ backgroundColor: opt.primaryColor }}
                            />
                            <span>{opt.name}</span>
                          </div>
                          {theme === opt.id && (
                            <span className="text-[10px] text-teal-600 dark:text-teal-400">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Dark/Light Toggle */}
            <button
              onClick={() => setMode(isDark ? 'light' : 'dark')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title={`Toggle ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Authentication / User Menu */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold transition-all hover:ring-2 hover:ring-teal-500/20"
                >
                  <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      (user.displayName || 'U').slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.displayName || 'Planner'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 animate-fade-in text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {user.displayName || 'Urban Planner'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                    >
                      <UserIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{t('nav.profile')}</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                    >
                      <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{t('nav.settings')}</span>
                    </Link>

                    <Link
                      to="/ai-workflow"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="w-full px-3 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                    >
                      <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>{t('nav.aiWorkflow')}</span>
                    </Link>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={async () => {
                          setIsUserDropdownOpen(false);
                          await logout();
                          navigate('/');
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-colors flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t('nav.login')}</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="2xl:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="2xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-1 animate-fade-in shadow-2xl max-h-[85vh] overflow-y-auto">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
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

            {/* Auth Section in Mobile Menu */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <UserIcon className="w-4 h-4 text-teal-500" />
                    <span>User Profile ({user.displayName || user.email})</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <Sliders className="w-4 h-4 text-teal-500" />
                    <span>Personalization Settings</span>
                  </Link>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl text-center bg-teal-600 text-white font-bold text-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl text-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
                  >
                    Register
                  </Link>
                </div>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleDownloadPDF();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-[#102A43] text-white"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Summary (PDF)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
