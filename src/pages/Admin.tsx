import React, { useState } from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { Badge } from '../components/common/Badge';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  FileCode,
  Save,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const Admin: React.FC = () => {
  const {
    data,
    validationErrors,
    isCustomized,
    updateProjectData,
    resetProjectData,
    exportJSON,
    importJSON,
  } = useProjectData();

  const [jsonText, setJsonText] = useState(() => JSON.stringify(data, null, 2));
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Form states for quick updates
  const [siteName, setSiteName] = useState(data.site.name);
  const [siteLocation, setSiteLocation] = useState(data.site.location);
  const [teamDecision, setTeamDecision] = useState(data.comparison.teamDecision);
  const [teamJustification, setTeamJustification] = useState(data.comparison.teamJustification);
  const [youtubeUrl, setYoutubeUrl] = useState(data.video.youtubeUrl || '');
  const [siteBimModelUrl, setSiteBimModelUrl] = useState(data.revit.siteBimModelUrl || '');

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...data,
      site: {
        ...data.site,
        name: siteName,
        location: siteLocation,
      },
      comparison: {
        ...data.comparison,
        teamDecision,
        teamJustification,
      },
      video: {
        ...data.video,
        youtubeUrl: youtubeUrl.trim() || null,
      },
      revit: {
        ...data.revit,
        siteBimModelUrl: siteBimModelUrl.trim() || null,
      },
    };
    updateProjectData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
    setImportStatus({ success: true, message: 'Project changes saved to browser storage!' });
  };

  const handleApplyRawJson = () => {
    const res = importJSON(jsonText);
    if (res.success) {
      setImportStatus({ success: true, message: 'JSON successfully validated and imported!' });
    } else {
      setImportStatus({ success: false, message: res.error || 'Failed to import JSON' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
      const res = importJSON(text);
      if (res.success) {
        setImportStatus({ success: true, message: `File "${file.name}" imported successfully!` });
      } else {
        setImportStatus({ success: false, message: res.error });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            Local Persistence Architecture
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Project Data Editor & Schema Auditor
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update project variables, attach video links, validate Zod schemas, and import/export project.json.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isCustomized && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              Browser Overrides Active
            </span>
          )}
          <button
            onClick={resetProjectData}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default project.json</span>
          </button>
        </div>
      </div>

      {/* Persistence Architecture Notice */}
      <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold">Editing Architecture Note:</strong>
          <p>
            Static client applications cannot write directly into git repositories from browser execution.
            All edits made here are instantly stored in your browser&apos;s localStorage and survive page refreshes.
            To save your changes into the codebase permanently, click <strong>Export project.json</strong> and place
            the downloaded file into <code>/src/data/project.json</code>.
          </p>
        </div>
      </div>

      {/* Validation Status & Error Report */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Runtime Schema Validation Audit
            </h2>
            <Badge source={validationErrors.length === 0 ? 'TEAM VERIFIED' : 'CALCULATED FROM PROVIDED DATA'} />
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded ${
              validationErrors.length === 0
                ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                : 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
            }`}
          >
            {validationErrors.length === 0 ? 'All Checks Passed' : `${validationErrors.length} Diagnostic Notices`}
          </span>
        </div>

        {validationErrors.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-teal-600 dark:text-teal-400 font-semibold p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>Project data schema is completely valid with no syntax, boundary, or unit errors.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {validationErrors.map((err, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 block mb-0.5">
                    {err.path}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">{err.message}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                    err.category === 'Critical'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {err.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Edit Form for Core Project Fields */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Quick Project Field Updates
        </h2>

        <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Site Location
              </label>
              <input
                type="text"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                30-Second Walkthrough Video URL (YouTube Embed / MP4)
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Site BIM Model Download Link (Autodesk Drive / Cloud)
              </label>
              <input
                type="text"
                value={siteBimModelUrl}
                onChange={(e) => setSiteBimModelUrl(e.target.value)}
                placeholder="https://drive.autodesk.com/..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Official Forma Board Selection Decision
            </label>
            <input
              type="text"
              value={teamDecision}
              onChange={(e) => setTeamDecision(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Official Team Justification
            </label>
            <textarea
              rows={3}
              value={teamJustification}
              onChange={(e) => setTeamJustification(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Updates to Browser Storage</span>
          </button>
        </form>
      </div>

      {/* Raw JSON Code Editor & Import / Export */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Full Raw project.json Editor & File I/O</span>
            </h2>
            <p className="text-xs text-slate-500">
              Export current configuration or upload a JSON backup to overwrite.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportJSON}
              className="px-3.5 py-1.5 rounded-xl bg-[#102A43] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export project.json</span>
            </button>

            <label className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {importStatus && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              importStatus.success
                ? 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200 border border-teal-200'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-200'
            }`}
          >
            {importStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{importStatus.message}</span>
          </div>
        )}

        <textarea
          rows={14}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="w-full font-mono text-[11px] p-4 rounded-2xl bg-slate-900 text-teal-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
          spellCheck={false}
        />

        <div className="flex items-center justify-between">
          <button
            onClick={handleApplyRawJson}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2 shadow"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Validate & Apply Raw JSON</span>
          </button>
          <span className="text-[11px] text-slate-400 font-mono">
            Zod schema validation performed automatically upon application
          </span>
        </div>
      </div>
    </div>
  );
};
