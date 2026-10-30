# Smart City Site Planning
### Sustainable Urban Development Through Intelligent Site Design & Gemma 4 AI

[![MIT License](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2026-orange.svg)](https://hacktoberfest.com)
[![Model](https://img.shields.io/badge/AI%20Model-Gemma%204%20(31B--IT)-009688.svg)](https://ai.google.dev/gemma)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)

> **Submitted for Hacktoberfest Hack Day Kanpur × AI Club 2026**  
> **Target Award Categories:**  
> 1. 🏆 **Best Open-Source AI Project**  
> 2. ⚡ **Best Use of Gemma 4**

---

## 1. Project Overview

**Smart City Site Planning** is an open-source, AI-assisted urban development and computational site-design platform. It integrates generative architectural workflows across **Autodesk Forma** (conceptual massing, microclimate, daylight, wind, and carbon simulations), **Autodesk Revit 2025** (BIM drawing blocks and structural coordination), and **Google DeepMind's open-weights Gemma 4** (`gemma-4-31b-it`).

Covering a verified **1.28 km² urban district**, the platform models two distinct master plan alternatives:
- **Proposal A:** Biophilic Transit-Oriented Core (TOD) with 34.2% green cover and 10.9% lower embodied carbon.
- **Proposal B:** Polycentric Microclimate Superblocks with staggered wind buffering and decentralized neighborhood amenities.

### Non-Negotiable Authenticity & Zero-Hallucination Policy
> **"Original work made in Autodesk Forma — no AI-generated content."**
- All spatial polygons, building heights, and environmental analytical data originate from verified engineering runs in Autodesk Forma and Revit.
- Gemma 4 recommendations are strictly separated from verified simulation findings via transparent provenance tags (`TEAM VERIFIED`, `CALCULATED FROM PROVIDED DATA`, `AI GENERATED (GEMMA 4)`, `DEMO HEURISTIC MODE`).
- No fabricated sensor readings or fake statistics.

---

## 2. Gemma 4 Integration Architecture

The platform features a dedicated server-side AI planning engine powered by **Gemma 4** (`gemma-4-31b-it`), Google's instruction-tuned, open-weights multimodal language model.

```
┌─────────────────────────────────────────────────────────────┐
│                   Client Browser (React 19)                 │
│  - Floating AI Planning Assistant (GemmaPlanningAssistant)   │
│  - 6-Step AI Planning Workflow (/workflow)                  │
│  - Embedded Environmental Advisory Panel (/analysis)        │
│  - Multi-Criteria Trade-Off Advisor (/compare)              │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON RPC / REST (No API Key)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Full-Stack Server (Express / Node)          │
│  - Isolated GEMINI_API_KEY environment variable             │
│  - Timeout protection (12s Promise.race guard)              │
│  - Grounding prompts with active 1.28 km² site data         │
│  - Graceful Heuristic Demo Mode Fallback                    │
└──────────────────────────────┬──────────────────────────────┘
                               │ @google/genai SDK
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Google DeepMind Gemma 4                     │
│  - Model: gemma-4-31b-it (256K context window)              │
│  - Primary: Gemma 4 instruction-tuned model                 │
│  - Secondary Fallback: gemini-3.8-flash                     │
└─────────────────────────────────────────────────────────────┘
```

### Key Gemma 4 Capabilities
1. **Site Analysis Advisory:** Translates complex Lawson CFD wind laws, daylight autonomy (sDA), and embodied carbon metrics into actionable massing advice.
2. **Biophilic & Green Infrastructure:** Recommends native canopy buffers, permeable ground corridors, and sustainable urban drainage systems (SuDS).
3. **Multi-Criteria Proposal Comparison:** Synthesizes trade-offs between Proposal A and Proposal B in real-time as users adjust criteria weight sliders.
4. **Zoning & Constraint Audits:** Validates floor area ratio (FAR), solar setback angles, and pedestrian accessibility.
5. **Master Planning Reports:** Generates structured markdown deliverables suitable for municipal review.

---

## 3. 6-Step Practical AI Planning Workflow

Navigate to `/workflow` to run the end-to-end planning engine:
- **Step 1: Site Profile Selection:** Select or input site area, geographic coordinates, and terrain conditions.
- **Step 2: Goals & Constraints:** Define targets for green cover %, embodied carbon reduction, FAR, and UN SDGs (SDG 11 & 13).
- **Step 3: Gemma 4 Generative Synthesis:** Trigger server-side inference to generate a multi-section planning strategy.
- **Step 4: Review & Live Editing:** Edit the generated markdown directly in the browser to reflect local municipal bylaws.
- **Step 5: Compare Planning Alternatives:** Evaluate whether Proposal A or Proposal B best satisfies your revised targets.
- **Step 6: Export Master Report:** Instant one-click copy or `.md` file download.

---

## 4. Implemented Pages & Features

| Route | Page | Purpose & Technical Highlight |
|---|---|---|
| `/` | **Home** | Hero with live animated counters, core pillars, and quick workflow launchers. |
| `/site` | **Site Overview** | Leaflet map with georeferenced 1.28 km² boundary, geodesic polygon area validation, and live Open-Meteo weather API integration. |
| `/proposals` | **Design Proposals** | Interactive before/after split slider and Recharts land-use donut charts. |
| `/analysis` | **Forma Analysis** | Complete documentation for all 8 Forma modules + **Embedded Gemma 4 Advisory Panel**. |
| `/compare` | **Forma Board** | Multi-criteria radar chart with live weight sliders (0–10) + **Gemma 4 Trade-off Advisor**. |
| `/workflow` | **AI Planning Workflow** | 6-step guided practical workflow generating structured master planning reports. |
| `/open-source` | **Open Source & AI** | Dedicated Hacktoberfest 2026 page explaining open architecture and Gemma 4 usage. |
| `/smart-city` | **Smart City Features** | Filterable cards across transportation, energy, water, and resilience networks. |
| `/revit-bim` | **Revit & BIM** | 7-step interoperability pipeline from Forma massing to Revit 2025 drawing blocks. |
| `/gallery` | **Project Gallery** | Lightbox gallery with keyboard navigation (`←`, `→`, `Esc`) and 30s video walkthrough. |
| `/tracker` | **Project Progress** | 13-item deliverables checklist with `localStorage` persistence and 5–7 slide validator. |
| `/team` | **Team & Resources** | Project team roles, academic guidance, and official Autodesk & ULI documentation. |
| `/about` | **About & Methodology** | SDG alignments (SDGs 11, 13, 7) and non-negotiable authenticity declarations. |
| `/admin` | **Project Editor** | In-browser JSON editor with real-time Zod schema validation and import/export. |
| `/contact` | **Contact** | Validated inquiry form with Formspree integration and truthful `mailto:` fallback. |

---

## 5. Technology Stack

- **Frontend:** React 19, TypeScript (Strict Mode), Vite, Tailwind CSS
- **AI Engine:** Google DeepMind Gemma 4 (`gemma-4-31b-it`), `@google/genai` SDK
- **Backend:** Express full-stack proxy with Vite dev middleware
- **Geospatial & Maps:** Leaflet, OpenStreetMap, Spherical geodesic area calculator
- **Visualizations:** Recharts (Bar, Line, Radar, Donut charts)
- **Validation & Persistence:** Zod runtime validation, browser `localStorage`
- **PDF Export:** client-side `jsPDF`
- **Testing:** Vitest

---

## 6. Getting Started Locally

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Setup Instructions
```bash
# 1. Clone the repository
git clone https://github.com/your-username/smart-city-site-planning.git
cd smart-city-site-planning

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# Optional: Add GEMINI_API_KEY in .env for live Gemma 4 inference.
# If unset, the app gracefully operates in Heuristic Demo Mode.

# 4. Start full-stack development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Quality Verification
```bash
# Run unit tests
npm test

# Run TypeScript typechecks
npm run lint

# Build for production
npm run build
```

---

## 7. Open-Source Contribution Guide

We actively welcome contributions for Hacktoberfest 2026!
- Read our [Contributing Guidelines](CONTRIBUTING.md) to learn how to add new analysis modules, improve AI prompts, or connect open GIS APIs.
- Abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
- Follow our [Security Policy](SECURITY.md) (never commit API keys).
- Use our [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) or [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) issue templates.

---

## 8. License

This project is licensed under the [MIT License](LICENSE).
