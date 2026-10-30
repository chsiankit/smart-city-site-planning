import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Building,
  Briefcase,
  FileText,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  Edit3,
  Save,
  Cpu,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfileData } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [role, setRole] = useState(user?.role || 'Senior Urban Planner / Architect');
  const [organization, setOrganization] = useState(user?.organization || 'AkkiCoder Urban Lab');
  const [bio, setBio] = useState(
    user?.bio ||
      'Sustainable urban planning researcher focusing on Autodesk Forma environmental simulations, Revit/BIM structural models, and Gemma 4 AI multi-criteria advisory workflows.'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({
      displayName,
      role,
      organization,
      bio,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#102A43] to-teal-950 p-8 sm:p-10 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-teal-500/20 border-2 border-teal-400/40 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-teal-600/30 flex items-center justify-center text-teal-300 font-black text-2xl">
                  {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'AP'}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black">
                  {user?.displayName || 'Urban Planner'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Urban Designer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 font-mono text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email || 'planner@smartcity.org'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-teal-400 font-semibold">{organization}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
            <Link
              to="/settings"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-md shadow-teal-600/30"
            >
              <Sliders className="w-4 h-4" />
              <span>Preferences</span>
            </Link>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Profile updated successfully in your authenticated workspace session!</span>
        </div>
      )}

      {/* Main Grid: Info + Editor + Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Details or Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Planner Credentials & Biography</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">UID: {user?.uid?.slice(0, 14)}...</span>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Professional Role / Title
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Organization / Team
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Research Focus & Urban Planning Bio
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-600/30"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Role & Responsibility
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                      {role}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Research Lab / Organization
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                      {organization}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Urban Planning Bio
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {bio}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">BIM Platform</span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Forma + Revit 2026</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-semibold">AI Assistant</span>
                    <span className="font-bold text-xs text-teal-600 dark:text-teal-400 font-mono">Gemma 4 (31B)</span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">Study Site Area</span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">1.28 km² Urban Core</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions & Workspace Statistics */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Planning Workspace
            </h3>

            <div className="space-y-3">
              <Link
                to="/ai-workflow"
                className="w-full p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 flex items-center justify-between text-teal-900 dark:text-teal-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <div className="text-left">
                    <div className="text-xs font-bold">Launch AI Workflow</div>
                    <div className="text-[10px] opacity-80">6-step guided planning suite</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/compare"
                className="w-full p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-indigo-900 dark:text-indigo-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <div className="text-left">
                    <div className="text-xs font-bold">Compare Proposals</div>
                    <div className="text-[10px] opacity-80">TOD vs Superblocks trade-offs</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/analysis"
                className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-900 dark:text-emerald-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-left">
                    <div className="text-xs font-bold">Forma Simulations</div>
                    <div className="text-[10px] opacity-80">Sunlight, wind, daylight, carbon</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Academic & Open-Source Attribution
            </span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              This project is built and maintained by <strong>Ankit Yadav</strong> (Solo, Team AkkiCoder) targeting Hacktoberfest Hack Day Kanpur × AI Club 2026.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>License: MIT</span>
              <Link to="/team" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                View Developer Page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
