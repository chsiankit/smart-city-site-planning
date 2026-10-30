/**
 * Gemma 4 Client Service
 * Communicates with server-side API endpoints for AI-assisted urban planning.
 * Never exposes API keys on the client.
 */

export interface GemmaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isDemoMode?: boolean;
  modelUsed?: string;
  notice?: string;
}

export interface GemmaHealthResponse {
  status: string;
  projectName: string;
  gemmaConfigured: boolean;
  model: string;
  timestamp: string;
}

export interface GemmaChatResponse {
  success: boolean;
  isDemoMode: boolean;
  modelUsed: string;
  notice?: string;
  response: string;
  error?: string;
}

export interface WorkflowStepPayload {
  step: number;
  siteInfo: {
    name: string;
    area: string;
    location: string;
  };
  goals: string;
  constraints: string;
  selectedProposal: string;
}

export interface WorkflowResponse {
  success: boolean;
  isDemoMode: boolean;
  modelUsed: string;
  notice?: string;
  report: string;
  error?: string;
}

export async function checkGemmaHealth(): Promise<GemmaHealthResponse> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`Health check returned status ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return {
      status: 'offline',
      projectName: 'Smart City Site Planning',
      gemmaConfigured: false,
      model: 'gemma-4-31b-it (fallback)',
      timestamp: new Date().toISOString(),
    };
  }
}

export async function sendGemmaChatMessage(
  prompt: string,
  history: GemmaMessage[] = [],
  siteContext?: any,
  proposalContext?: any,
  taskType?: string
): Promise<GemmaChatResponse> {
  try {
    const formattedMessages = history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      content: m.content,
    }));

    const res = await fetch('/api/gemma/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        messages: formattedMessages,
        siteContext,
        proposalContext,
        taskType,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('[GemmaService] Network/Server fallback:', err);
    return {
      success: true,
      isDemoMode: true,
      modelUsed: 'client-offline-heuristic',
      notice: 'Server endpoint unreachable or timed out. Generated using offline urban planning heuristic simulation.',
      response: `### Heuristic Urban Planning Analysis (Offline Fallback)

**Prompt:** "${prompt}"

**Key Design Guidance:**
1. **Sustainable Zoning:** Optimize building heights based on solar azimuth and prevailing winds from the southwest to promote natural cross-ventilation.
2. **Pedestrian Connectivity:** Ensure all high-density residential clusters reside within a 5-minute (400m) walking shed of transit corridors.
3. **Microclimate Buffering:** Incorporate layered native vegetation along the perimeter to achieve a minimum 30% reduction in acoustic street noise and mitigate urban heat island effects.

*(Note: Operating in local client heuristic fallback mode).*`,
    };
  }
}

export async function executeWorkflowStep(
  payload: WorkflowStepPayload
): Promise<WorkflowResponse> {
  try {
    const res = await fetch('/api/gemma/workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Workflow server returned ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn('[GemmaService] Workflow fallback:', err);
    return {
      success: true,
      isDemoMode: true,
      modelUsed: 'client-offline-heuristic',
      notice: 'Server endpoint unreachable. Showing offline heuristic urban planning workflow output.',
      report: `### AI Planning Workflow: Step ${payload.step} — Synthesis Report

**Project:** ${payload.siteInfo.name} (${payload.siteInfo.area})
**Strategy:** ${payload.selectedProposal}

#### 1. Strategic Goals & Constraint Compliance
- **Goals Addressed:** ${payload.goals}
- **Zoning Constraints:** ${payload.constraints}

#### 2. Spatial Recommendations
- Allocate 40% mixed-use residential, 35% public green corridors, and 15% commercial civic core.
- Apply step-down building envelope massing to preserve winter solstice sun hours across inner public squares.

#### 3. Environmental & Revit Pipeline
- Validate CFD wind comfort in Autodesk Forma before finalizing structural grid boundaries in Autodesk Revit 2025.`,
    };
  }
}
