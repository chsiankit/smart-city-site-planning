import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, THEME_OPTIONS, ThemeColor, ThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { SUPPORTED_LANGUAGES, setAppLanguage } from '../i18n';
import {
  Sliders,
  Sun,
  Moon,
  Monitor,
  Palette,
  Globe,
  Sparkles,
  Database,
  Trash2,
  Download,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode, setMode, theme, setTheme } = useTheme();
  const { user, logout, deleteAccount, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();

  const [clearNotice, setClearNotice] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLanguageChange = (code: string) => {
    setAppLanguage(code);
  };

  const handleClearHistory = () => {
    if (user?.uid) {
      localStorage.removeItem(`smartcity_saved_chats_${user.uid}`);
    }
    localStorage.removeItem('smartcity_gemma_chat_history');
    setClearNotice('AI conversation history cleared successfully.');
    setTimeout(() => setClearNotice(null), 3000);
  };

  const handleExportHistory = () => {
    const rawLocal = localStorage.getItem('smartcity_gemma_chat_history');
    const rawUser = user?.uid ? localStorage.getItem(`smartcity_saved_chats_${user.uid}`) : null;
    const exportData = {
      user: user?.email || 'guest',
      exportedAt: new Date().toISOString(),
      activeChat: rawLocal ? JSON.parse(rawLocal) : [],
      savedSessions: rawUser ? JSON.parse(rawUser) : [],
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartcity_gemma_chats_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDeleteConfirm = async () => {
    await deleteAccount();
    setShowDeleteModal(false);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
          <Sliders className="w-3.5 h-3.5" />
          <span>User Preferences & Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {t('settings.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('settings.subtitle')}
        </p>
      </div>

      {clearNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{clearNotice}</span>
        </div>
      )}

      {/* SECTION 1: Appearance & Theme Customization */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {t('settings.appearanceSection')}
            </h2>
            <p className="text-xs text-slate-500">
              Customize lighting mode and color palette across all urban planning dashboards.
            </p>
          </div>
        </div>

        {/* Display Mode: Light / Dark / System */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t('settings.themeMode')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as ThemeMode)}
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/25 ring-2 ring-teal-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 Theme Color Palettes */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t('settings.themeColor')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id as ThemeColor)}
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-900 ring-2 ring-teal-500/30'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: opt.primaryColor }}
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{opt.name}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: Multi-Language & Locale (with RTL) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {t('settings.languageSection')}
            </h2>
            <p className="text-xs text-slate-500">
              Select your preferred language. Includes native scripts and bidirectional RTL support for Arabic.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-100 font-bold ring-2 ring-teal-500/20'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{lang.flag}</span>
                  <div>
                    <div className="font-bold">{lang.nativeName}</div>
                    <div className="text-[10px] text-slate-400">{lang.name} {lang.dir === 'rtl' ? '(RTL)' : ''}</div>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Gemma 4 AI Assistant Configuration */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {t('settings.aiSection')}
            </h2>
            <p className="text-xs text-slate-500">
              Gemma 4 integration configuration and chat history management.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">
              AI Architecture Model
            </span>
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">
              gemma-4-31b-it
            </span>
            <p className="text-slate-500 text-[11px] pt-1">
              Primary model running via server-side proxy route with automated fallback to Gemini 3.8 Flash.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold block uppercase text-[10px]">
              Advisory Role
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              Urban Design Specialist
            </span>
            <p className="text-slate-500 text-[11px] pt-1">
              Answers greetings naturally and provides multi-criteria advisory analysis grounded in 1.28 km² site data.
            </p>
          </div>
        </div>

        {/* Chat History Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleExportHistory}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t('ai.exportChat')} (JSON)</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-700 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('ai.clearChat')}</span>
          </button>
        </div>
      </div>

      {/* SECTION 4: Account & Security Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {t('settings.accountSection')}
            </h2>
            <p className="text-xs text-slate-500">
              Session management, authentication backend status, and account security.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              Authentication Backend
            </span>
            <span className="text-slate-500 text-[11px]">
              {isFirebaseConfigured
                ? 'Connected to Firebase Authentication & Firestore'
                : 'Running in Local Authenticated Session (configure Firebase keys in .env for production)'}
            </span>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
              isFirebaseConfigured
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                : 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300'
            }`}
          >
            {isFirebaseConfigured ? 'Live Firebase' : 'Active Session'}
          </span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.logout')}</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2.5 rounded-xl text-red-600 hover:text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Delete Planning Account</span>
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Delete Urban Planning Account?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This action will permanently delete your user profile, saved custom proposals, and AI conversation history. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm Account Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
