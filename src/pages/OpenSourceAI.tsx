import React, { useState, useEffect } from 'react';
import {
  Code,
  GitBranch,
  Github,
  Sparkles,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertTriangle,
  BookOpen,
  Copy,
  Check,
  Layers,
  Heart,
  ExternalLink,
  Cpu,
  Server,
  Zap,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { checkGemmaHealth, GemmaHealthResponse } from '../services/gemmaService';

export const OpenSourceAI: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [health, setHealth] = useState<GemmaHealthResponse | null>(null);

  useEffect(() => {
    checkGemmaHealth().then(setHealth);
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const localInstallSteps = [
    {
      id: 'clone',
      title: '1. Clone Repository',
      code: 'git clone https://github.com/your-username/smart-city-site-planning.git\ncd smart-city-site-planning',
    },
    {
      id: 'deps',
      title: '2. Install Dependencies',
      code: 'npm install',
    },
    {
      id: 'env',
      title: '3. Setup Environment Variables',
      code: 'cp .env.example .env\n# Add your GEMINI_API_KEY (optional for live Gemma 4 inference)',
    },
    {
      id: 'dev',
      title: '4. Start Full-Stack Dev Server',
      code: 'npm run dev',
    },
    {
      id: 'test',
      title: '5. Run Vitest Test Suite',
      code: 'npm test',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Hacktoberfest Hack Day Kanpur × AI Club 2026
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Open Source Architecture & Gemma 4 Integration
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Empowering sustainable urban planning through open architectural workflows and Google DeepMind&apos;s open-weights Gemma 4.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge source="TEAM VERIFIED" />
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
            MIT LICENSE
          </span>
        </div>
      </div>

      {/* Target Awards Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C1E30] via-[#08283B] to-[#0A1A2A] text-white border border-teal-500/40 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Target Hackathon Categories</h2>
            <p className="text-xs text-teal-300">
              Submitted for Hacktoberfest Hack Day Kanpur × AI Club 2026
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-400">CATEGORY 1</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-teal-950 text-teal-300 border border-teal-800">
                PRIMARY
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Best Open-Source AI Project</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fully transparent, MIT-licensed platform with zero fabricated data, standard GitHub issue/PR templates, automated CI, and accessible contribution pathways for urban designers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-400">CATEGORY 2</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-teal-950 text-teal-300 border border-teal-800">
                SPECIALIZED
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Best Use of Gemma 4</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Meaningful integration of Google&apos;s open-weights Gemma 4 model (<code className="text-teal-300">gemma-4-31b-it</code>) via secure full-stack server-side endpoints, with dedicated planning workflows and zero key exposure.
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Integration Status Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Gemma 4 Server-Side Engine Diagnostics
            </h3>
          </div>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
              health?.gemmaConfigured
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-500/30'
            }`}
          >
            {health?.gemmaConfigured ? 'LIVE GEMMA 4 ACTIVE' : 'DEMO HEURISTIC SIMULATION ACTIVE'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">CONFIGURED MODEL</span>
            <strong className="text-slate-900 dark:text-white">{health?.model || 'gemma-4-31b-it'}</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">BACKEND ARCHITECTURE</span>
            <strong className="text-slate-900 dark:text-white">Express + Vite + @google/genai</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px]">SECURITY DISCIPLINE</span>
            <strong className="text-teal-600 dark:text-teal-400">Zero Client-Side Keys</strong>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The application uses server-side proxy routes (<code className="text-teal-600 dark:text-teal-400">/api/gemma/chat</code> and <code className="text-teal-600 dark:text-teal-400">/api/gemma/workflow</code>) with automatic timeout protection. If an API key is not present in the environment, the system gracefully shifts to domain-specific heuristic rules clearly flagged with a <strong className="text-amber-500">DEMO MODE</strong> badge.
        </p>
      </div>

      {/* Why Open Source & How Gemma 4 Solves Real Problems */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Why Open-Source Urban Planning?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Rapid urbanization requires transparent, reproducible planning workflows. Traditional proprietary site analysis software creates data silos where citizens and independent architects cannot audit environmental trade-offs or carbon calculations.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            By open-sourcing our analytical framework under the MIT License, we empower municipalities, researchers, and university studios to build upon verified geospatial algorithms and open BIM pipelines.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            What Problems Does Gemma 4 Solve?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Interpreting complex computational fluid dynamics (CFD wind laws), spatial daylight autonomy (sDA), and embodied carbon matrices usually requires senior sustainability engineers.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Gemma 4 bridges this gap: it ingests authentic simulation metrics from Autodesk Forma, translates them into actionable massing adjustments, recommends biophilic public space configurations, and generates executive planning deliverables.
          </p>
        </div>
      </div>

      {/* How Developers Can Contribute */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>How Developers & Urban Planners Can Contribute</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            We welcome pull requests for Hacktoberfest 2026 across code, prompts, and GIS integrations!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">
              01. Planning Modules
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Add New Analysis Metrics
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Contribute new computational metrics to <code className="text-teal-600">/src/data/schema.ts</code> such as acoustic buffering coefficients, stormwater retention capacities, or EV charging infrastructure.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">
              02. AI Prompt Engineering
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Refine Gemma 4 Personas
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Enhance the system instructions in <code className="text-teal-600">server.ts</code> with localized municipal building bylaws, LEED v4.1 credits, or BREEAM Communities accreditation standards.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400 uppercase text-[10px]">
              03. GIS & BIM Integrations
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Expand Data Feeds
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Add real-time air quality feeds (WAQI API), regional transit timetable GTFS feeds, or WebGL glTF building massing viewers.
            </p>
          </div>
        </div>
      </div>

      {/* Local Setup & Getting Started */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Local Setup & Execution Guide</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Get the full-stack repository running locally in under 2 minutes.
          </p>
        </div>

        <div className="space-y-4">
          {localInstallSteps.map((st) => (
            <div
              key={st.id}
              className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-400">{st.title}</span>
                <button
                  onClick={() => handleCopy(st.id, st.code)}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                  title="Copy command"
                >
                  {copiedCmd === st.id ? (
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <pre className="font-mono text-xs overflow-x-auto text-slate-300">{st.code}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Issue & Pull Request Templates Callout */}
      <div className="p-6 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200">
            Found a Bug or Want to Propose a Feature?
          </h3>
          <p className="text-xs text-teal-800/80 dark:text-teal-300/80 mt-0.5">
            Check out our structured templates in <code className="font-mono">.github/ISSUE_TEMPLATE</code> and <code className="font-mono">CONTRIBUTING.md</code>.
          </p>
        </div>
        <a
          href="/tracker"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors shrink-0 shadow"
        >
          View Project Deliverables
        </a>
      </div>
    </div>
  );
};
