import React from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { Badge } from '../components/common/Badge';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import {
  Building,
  Layers,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Workflow,
  ExternalLink,
} from 'lucide-react';

export const RevitBIM: React.FC = () => {
  const { data } = useProjectData();
  const revitData = data.revit;

  const deliverableStatuses = [
    { label: 'Forma Site Model', status: revitData.deliverableStatus.formaModel },
    { label: 'Site BIM Export', status: revitData.deliverableStatus.siteBimExport },
    { label: 'Revit Sync Pipeline', status: revitData.deliverableStatus.revitSync },
    { label: 'Building Drawing Block', status: revitData.deliverableStatus.drawingBlock },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Autodesk Forma to Revit Interoperability
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Autodesk Revit & BIM Architectural Workflow
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Seamless geometric transfer of massing solids into Autodesk Revit 2025 for parametric building drawing blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
        </div>
      </div>

      {/* Deliverable Status Pills Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {deliverableStatuses.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
              {item.label}
            </span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 7-Step Forma to Revit Progression */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>7-Step Forma to Revit Technical Pipeline</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified interoperability sequence from macro zoning envelope to micro drawing blocks.
            </p>
          </div>
          <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">
            REViT 2025 COMPATIBLE
          </span>
        </div>

        <div className="space-y-4">
          {revitData.workflowSteps.map((step) => (
            <div
              key={step.order}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  0{step.order}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {step.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BIM Deliverables & Drawing Block Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Revit Drawing Block Preview */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Revit Building Drawing Block Deliverable
            </h3>
            <Badge source="TEAM VERIFIED" />
          </div>
          <p className="text-xs text-slate-500">
            Dimensioned architectural plans, elevations, and structural column grid generated in Revit.
          </p>

          {revitData.buildingDrawingBlockPreview ? (
            <img
              src={revitData.buildingDrawingBlockPreview}
              alt="Revit Building Drawing Block"
              className="w-full rounded-2xl object-cover aspect-video border border-slate-200 dark:border-slate-700 shadow-sm"
            />
          ) : (
            <PlaceholderImage
              label="Add Revit Building Drawing Block Screenshot"
              sublabel="Upload dimensioned floor plans, elevations, or wall section schedules generated in Revit 2025"
              aspectRatio="video"
              category="Revit BIM Deliverable"
            />
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>BIM Documentation:</strong> Core massing was synchronized via Autodesk Forma Add-In
            for Revit. Structural grids and curtain wall types configured with EPD embodied carbon values.
          </div>
        </div>

        {/* Exported Site BIM Model Download & Synchronization Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Exported Site BIM Deliverable
            </h3>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              Interoperability Confirmed
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The project workflow utilizes an exported Site BIM model originating from Autodesk Forma for downstream
            structural and architectural refinement.
          </p>

          <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Proposal_A_Site_BIM_Georeferenced.obj / .rvt
                </span>
              </div>
              <span className="text-[10px] font-mono text-teal-600 dark:text-teal-300">
                1.28 km²
              </span>
            </div>

            <p className="text-[11px] text-teal-800 dark:text-teal-200 leading-relaxed">
              Contains accurate terrain mesh, surrounding roadway geometries, and stepped building mass
              solids ready for direct Revit family assignment.
            </p>

            {revitData.siteBimModelUrl ? (
              <a
                href={revitData.siteBimModelUrl}
                download
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Exported Site BIM Model</span>
              </a>
            ) : (
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-teal-300 dark:border-teal-700 text-center text-xs text-teal-800 dark:text-teal-300">
                BIM Model link can be linked in Admin Settings (Autodesk Drive / Cloud).
              </div>
            )}
          </div>

          {/* Team Evidence Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Team Synchronization Evidence
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {revitData.teamEvidenceNotes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
