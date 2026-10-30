import React, { useState, useEffect } from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { Badge } from '../components/common/Badge';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Presentation,
  ShieldCheck,
  Check,
  FileText,
  Calendar,
} from 'lucide-react';

const CHECKLIST_STORAGE_KEY = 'smart_city_checklist_state';

export const Tracker: React.FC = () => {
  const { data, updateProjectData } = useProjectData();
  const submissionConfig = data.submission;

  // Local checklist state with localStorage persistence
  const [checklist, setChecklist] = useState<Array<{ id: string; completed: boolean }>>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return submissionConfig.checklist.map((c) => ({ id: c.id, completed: c.completed }));
  });

  const [slideCount, setSlideCount] = useState<number>(submissionConfig.currentSlideCount ?? 6);

  const completedCount = checklist.filter((c) => c.completed).length;
  const totalCount = submissionConfig.checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const toggleCheck = (id: string) => {
    setChecklist((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      try {
        localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleReset = () => {
    const reset = submissionConfig.checklist.map((c) => ({ id: c.id, completed: false }));
    setChecklist(reset);
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(reset));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSlideCountChange = (val: number) => {
    setSlideCount(val);
    updateProjectData({
      ...data,
      submission: {
        ...data.submission,
        currentSlideCount: val,
      },
    });
  };

  const isSlideCountValid = slideCount >= 5 && slideCount <= 7;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Project Governance & Milestones
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Project Progress & Deliverables Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track Autodesk Forma and Revit architectural milestones, quality audits, and deliverable checklists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Checklist</span>
          </button>
        </div>
      </div>

      {/* Project Milestones & Progress Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Milestone Phase Box */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Milestone Phase
            </span>
            <Calendar className="w-4 h-4 text-teal-500" />
          </div>

          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
            {submissionConfig.milestonePhase || 'Phase IV: Verification'}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Status: <strong className="text-teal-600 dark:text-teal-400">All 8 Forma modules verified</strong>; Revit BIM drawing blocks documented.
          </p>
        </div>

        {/* Completion Progress Gauge */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Deliverables Progress
            </span>
            <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
              {progressPercent}%
            </span>
          </div>

          <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {completedCount} <span className="text-sm font-normal text-slate-400">/ {totalCount} verified</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 5 to 7 Slide Presentation Validator */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Presentation className="w-3.5 h-3.5 text-teal-500" />
              <span>Project Deck Validator</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isSlideCountValid
                  ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
              }`}
            >
              {isSlideCountValid ? 'OPTIMAL (5-7 SLIDES)' : 'REVIEW LENGTH'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="20"
              value={slideCount}
              onChange={(e) => handleSlideCountChange(Number(e.target.value))}
              className="w-20 p-2 rounded-xl text-lg font-bold text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-500">
              Executive presentation deck target (5 to 7 slides recommended).
            </span>
          </div>

          {!isSlideCountValid && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              Notice: Standard project presentation format is between 5 and 7 concise slides.
            </p>
          )}
        </div>
      </div>

      {/* Detailed Interactive Checklist */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Project Deliverables Audit Checklist
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive milestone verification saved across browser sessions.
            </p>
          </div>
          <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold">
            {completedCount} / {totalCount} READY
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {submissionConfig.checklist.map((item) => {
            const isChecked = checklist.find((c) => c.id === item.id)?.completed ?? item.completed;

            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`py-4 px-3 rounded-2xl flex items-start gap-4 cursor-pointer transition-colors ${
                  isChecked
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                    : 'bg-amber-50/30 dark:bg-amber-950/20 hover:bg-amber-50/60'
                }`}
              >
                {/* Custom Checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                    isChecked
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {item.deliverableType}
                    </span>
                    <h4
                      className={`text-sm font-bold ${
                        isChecked
                          ? 'text-slate-900 dark:text-white'
                          : 'text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {item.label}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="text-right shrink-0 hidden sm:block">
                  <span className="text-[11px] text-slate-400 block font-mono">
                    Required Evidence:
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {item.evidenceRequired}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
