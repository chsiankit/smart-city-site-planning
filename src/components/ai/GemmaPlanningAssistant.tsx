import React, { useState, useEffect, useRef } from 'react';
import { useProjectData } from '../../hooks/useProjectData';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  sendGemmaChatMessage,
  checkGemmaHealth,
  GemmaMessage,
  GemmaHealthResponse,
} from '../../services/gemmaService';
import {
  getSavedChatSessions,
  saveChatSessionRecord,
  deleteChatSessionRecord,
  ChatSessionRecord,
} from '../../services/firebase';
import {
  Sparkles,
  Send,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  RotateCcw,
  Bot,
  AlertCircle,
  Leaf,
  Scale,
  Layers,
  FileText,
  ShieldCheck,
  ChevronDown,
  History,
  PlusCircle,
  Trash2,
  User as UserIcon,
} from 'lucide-react';

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
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<string>(defaultTask);
  const [health, setHealth] = useState<GemmaHealthResponse | null>(null);

  // Saved sessions drawer
  const [showSessions, setShowSessions] = useState(false);
  const [savedSessions, setSavedSessions] = useState<ChatSessionRecord[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => `sess-${Date.now()}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcomeMessage: GemmaMessage = {
    id: 'welcome',
    role: 'assistant',
    content: `Hello! I am your **Gemma 4 Smart City Planning Assistant**.\n\nI can analyze site boundaries, evaluate Autodesk Forma environmental simulations (Daylight, Lawson Wind CFD, Embodied Carbon), compare design alternatives, and recommend sustainable green infrastructure for the **${data.site.name}** (${data.site.manuallyStatedAreaKm2 || 1.28} km²).\n\nHow can I assist your urban planning review today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isDemoMode: false,
    modelUsed: 'gemma-4-31b-it',
  };

  const [messages, setMessages] = useState<GemmaMessage[]>([initialWelcomeMessage]);

  // Check backend Gemma status on mount
  useEffect(() => {
    checkGemmaHealth().then((res) => {
      setHealth(res);
    });
  }, []);

  // Load saved sessions when user logs in
  useEffect(() => {
    if (user?.uid) {
      getSavedChatSessions(user.uid).then((sessions) => {
        setSavedSessions(sessions);
      });
    } else {
      setSavedSessions([]);
    }
  }, [user?.uid]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Save active session for authenticated users when messages change
  useEffect(() => {
    if (user?.uid && messages.length > 1) {
      const firstUserMsg = messages.find((m) => m.role === 'user');
      const title = firstUserMsg ? firstUserMsg.content.slice(0, 36) + '...' : 'Urban Planning Chat';
      const record: ChatSessionRecord = {
        id: currentSessionId,
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
          model: m.modelUsed,
        })),
      };
      saveChatSessionRecord(user.uid, record);
    }
  }, [messages, currentSessionId, user?.uid]);

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
        activeTask,
        i18n.language
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
    } catch (err: unknown) {
      const errorMsg: GemmaMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: Unable to complete request (${(err as Error).message || 'Unknown network error'}).`,
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

  const handleNewChat = () => {
    setCurrentSessionId(`sess-${Date.now()}`);
    setMessages([initialWelcomeMessage]);
    setShowSessions(false);
  };

  const handleLoadSession = (sess: ChatSessionRecord) => {
    setCurrentSessionId(sess.id);
    setMessages(
      sess.messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        timestamp: m.timestamp,
        modelUsed: m.model,
      }))
    );
    setShowSessions(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessId: string) => {
    e.stopPropagation();
    if (!user?.uid) return;
    await deleteChatSessionRecord(user.uid, sessId);
    setSavedSessions((prev) => prev.filter((s) => s.id !== sessId));
    if (currentSessionId === sessId) {
      handleNewChat();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 hover:scale-105 group border border-teal-400/30"
          aria-label="Open Gemma 4 Planning Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse text-teal-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <span className="tracking-wide">Ask Gemma 4</span>
          <span className="hidden sm:inline px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-white/20 text-white">
            31B
          </span>
        </button>
      )}

      {/* Assistant Modal / Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[480px] h-[640px] max-h-[90vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-[#102A43] to-teal-950 text-white rounded-t-3xl flex items-center justify-between border-b border-teal-500/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base leading-none">
                    Gemma 4 Planning Assistant
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                    31B-IT
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        health?.gemmaConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-teal-400'
                      }`}
                    />
                    {health?.gemmaConfigured ? 'Gemma 4 Live' : 'Forma Heuristic AI'}
                  </span>
                  <span>•</span>
                  <span>{user ? `Saved (${user.displayName?.split(' ')[0]})` : 'Guest Session'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              {/* History button for authenticated users */}
              {user && (
                <button
                  onClick={() => setShowSessions(!showSessions)}
                  title="Saved Sessions"
                  className={`p-1.5 rounded-lg transition-colors ${
                    showSessions ? 'bg-teal-600 text-white' : 'hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <History className="w-4 h-4" />
                </button>
              )}

              {/* New Chat Button */}
              <button
                onClick={handleNewChat}
                title="New Chat Session"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors hidden sm:block"
                title={isExpanded ? 'Restore Size' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onClose?.();
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
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
              Forma + Revit 2026 Grounded
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
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors border ${
                  activeTask === t.id
                    ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-500 text-teal-700 dark:text-teal-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Saved Sessions Drawer (Overlay) */}
          {showSessions && (
            <div className="absolute top-[88px] bottom-0 left-0 w-64 bg-slate-50 dark:bg-slate-850 border-r border-slate-200 dark:border-slate-700 z-20 flex flex-col shadow-xl">
              <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Saved Sessions
                </span>
                <button
                  onClick={handleNewChat}
                  className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold"
                >
                  + New
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {savedSessions.length === 0 ? (
                  <p className="text-xs text-slate-400 p-3 text-center">No saved chats yet.</p>
                ) : (
                  savedSessions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleLoadSession(s)}
                      className={`p-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-between group transition-colors ${
                        currentSessionId === s.id
                          ? 'bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 font-bold'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate flex-1 pr-2">{s.title}</span>
                      <button
                        onClick={(e) => handleDeleteSession(e, s.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Role / Time Label */}
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {m.role === 'user' ? (user?.displayName || 'You') : 'Gemma 4 AI'}
                  </span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {/* AI Metadata Tags */}
                  {m.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-200 dark:border-slate-700 text-[10px]">
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                        {m.modelUsed || 'gemma-4-31b-it'}
                      </span>
                      {m.isDemoMode && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold">
                          Heuristic Advisory
                        </span>
                      )}
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
                    {m.content}
                  </div>

                  {/* Message Action Bar (Copy) */}
                  {m.role === 'assistant' && (
                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                      <button
                        onClick={() => handleCopy(m.id, m.content)}
                        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-teal-500" />
                            <span className="text-teal-600 dark:text-teal-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col items-start space-y-1">
                <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-teal-600 dark:text-teal-400">Gemma 4</span>
                  <span>is reasoning...</span>
                </div>
                <div className="p-3.5 rounded-2xl rounded-bl-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping delay-100" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping delay-200" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 pl-1">
                    Synthesizing Forma simulations & urban standards...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box & Disclaimer */}
          <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 rounded-b-3xl shrink-0 space-y-2">
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
                placeholder="Ask Gemma about density, solar, wind, or building codes..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold transition-colors shadow-md shadow-teal-600/20 shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span className="truncate">
                Forma results are deterministic engineering models. Gemma 4 provides advisory insights.
              </span>
              <button
                onClick={handleNewChat}
                className="hover:text-slate-600 dark:hover:text-slate-200 underline shrink-0 ml-2"
              >
                Reset Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
