import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Copy,
  Check,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  ChevronDown,
  Layers,
  Leaf,
  Scale,
  FileText,
  RotateCcw,
} from 'lucide-react';
import {
  GemmaMessage,
  sendGemmaChatMessage,
  checkGemmaHealth,
  GemmaHealthResponse,
} from '../../services/gemmaService';
import { useProjectData } from '../../hooks/useProjectData';

interface GemmaPlanningAssistantProps {
  initialOpen?: boolean;
  onClose?: () => void;
  defaultTask?: string;
}

export const GemmaPlanningAssistant: React.FC<GemmaPlanningAssistantProps> = ({
  initialOpen = false,
  onClose,
  defaultTask = 'general',
}) => {
  const { data } = useProjectData();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<string>(defaultTask);
  const [health, setHealth] = useState<GemmaHealthResponse | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<GemmaMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your **Gemma 4 Smart City Planning Assistant**.\n\nI can analyze site boundaries, evaluate Autodesk Forma environmental simulations (Daylight, Lawson Wind CFD, Embodied Carbon), compare design alternatives, and recommend sustainable green infrastructure for the **${data.site.name}** (${data.site.manuallyStatedAreaKm2 || 1.28} km²).\n\nHow can I assist your urban planning review today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDemoMode: false,
      modelUsed: 'gemma-4-31b-it',
    },
  ]);

  // Check backend Gemma status on mount
  useEffect(() => {
    checkGemmaHealth().then((res) => {
      setHealth(res);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const taskPresets = [
    {
      id: 'general',
      label: 'General Q&A',
      icon: <Bot className="w-3.5 h-3.5" />,
      prompt: 'Summarize the primary sustainability priorities for this 1.28 km² site development.',
    },
    {
      id: 'green_infra',
      label: 'Green Infrastructure',
      icon: <Leaf className="w-3.5 h-3.5" />,
      prompt: 'Suggest specific green infrastructure and biophilic public spaces to mitigate urban heat island effects.',
    },
    {
      id: 'comparison',
      label: 'Compare Proposals',
      icon: <Scale className="w-3.5 h-3.5" />,
      prompt: 'Compare Proposal A (TOD) and Proposal B (Superblocks) on embodied carbon and transit access.',
    },
    {
      id: 'constraints',
      label: 'Zoning & Constraints',
      icon: <Layers className="w-3.5 h-3.5" />,
      prompt: 'Analyze zoning constraints for building heights, daylight envelopes, and permeable ground surfaces.',
    },
    {
      id: 'report',
      label: 'Planning Report',
      icon: <FileText className="w-3.5 h-3.5" />,
      prompt: 'Generate an executive summary report for municipal submission covering Forma simulation results.',
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: GemmaMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const siteContext = {
        name: data.site.name,
        areaKm2: data.site.manuallyStatedAreaKm2 || 1.28,
        location: data.site.location,
        lat: data.site.centerCoordinates.lat,
        lng: data.site.centerCoordinates.lng,
      };

      const proposalContext = {
        activeProposal: data.proposals[0]?.name,
        proposalCount: data.proposals.length,
        metrics: data.proposals[0]?.metrics,
      };

      const res = await sendGemmaChatMessage(
        text,
        messages,
        siteContext,
        proposalContext,
        activeTask
      );

      const aiMsg: GemmaMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemoMode: res.isDemoMode,
        modelUsed: res.modelUsed,
        notice: res.notice,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: GemmaMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: Unable to complete request (${err.message || 'Unknown network error'}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemoMode: true,
        modelUsed: 'error',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Conversation refreshed. Ready to assist with site analysis, Forma simulations, and BIM workflows for **${data.site.name}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemoMode: false,
        modelUsed: 'gemma-4-31b-it',
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20"
          title="Open Gemma 4 Planning Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <Sparkles className="w-4 h-4 text-teal-200" />
          <span>Gemma 4 AI Assistant</span>
          <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] bg-black/20 font-mono">
            Open-Source
          </span>
        </button>
      )}

      {/* Main Slide-Over / Floating Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[480px] h-[85vh] max-h-[720px] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight">Gemma 4 Planning Assistant</h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700/60">
                    31B-IT
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  <span>
                    {health?.gemmaConfigured ? 'Live Gemma 4 Engine' : 'Heuristic Demo Mode (Key Not Set)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Restart Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
                title={isExpanded ? 'Restore Size' : 'Expand View'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Site Context Ribbon */}
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-600 dark:text-slate-300 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-slate-900 dark:text-white">Active Site:</span>
              <span className="truncate">{data.site.name}</span>
              <span className="text-teal-600 dark:text-teal-400 font-mono font-bold">
                ({data.site.manuallyStatedAreaKm2 || 1.28} km²)
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 shrink-0 hidden sm:inline">
              Autodesk Forma + Revit Data Linked
            </span>
          </div>

          {/* Task Presets Toolbar */}
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 bg-white dark:bg-slate-900">
            {taskPresets.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTask(t.id);
                  handleSend(t.prompt);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors ${
                  activeTask === t.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 relative group ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/60'
                  }`}
                >
                  {/* Model Provenance Badge */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200 dark:border-slate-700/80 text-[10px]">
                      <span className="font-mono font-bold flex items-center gap-1 text-teal-600 dark:text-teal-400">
                        {msg.isDemoMode ? (
                          <span className="text-amber-500">DEMO MODE (HEURISTIC)</span>
                        ) : (
                          <span className="text-emerald-500 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            AI GENERATED (GEMMA 4)
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-teal-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Notice if fallback occurred */}
                  {msg.notice && (
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[10px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{msg.notice}</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                  <div
                    className={`text-[9px] font-mono text-right ${
                      msg.role === 'user' ? 'text-teal-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center text-xs text-slate-500 dark:text-slate-400 p-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-500 flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400">
                    Gemma 4 is synthesizing planning recommendations...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Gemma 4 about zoning, microclimate, carbon, or TOD..."
                disabled={isLoading}
                className="flex-1 p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white transition-colors flex items-center justify-center shrink-0"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Server-side API — Private key never sent to client</span>
              <span className="font-mono">Hacktoberfest 2026 Edition</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
