# Contributing to Smart City Site Planning

Thank you for your interest in contributing to **Smart City Site Planning**! This project is an open-source, AI-assisted urban planning and site-design platform submitted for **Hacktoberfest Hack Day Kanpur × AI Club 2026**.

We welcome contributions from software developers, computational architects, urban planners, and GIS specialists.

---

## Code of Conduct

All contributors and participants agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the project maintainers.

---

## Target Categories for Hacktoberfest 2026

1. **Best Open-Source AI Project:** Clean codebase, comprehensive documentation, reusable components, and open collaboration.
2. **Best Use of Gemma 4:** Meaningful integration of Google DeepMind's open-weights Gemma 4 model (`gemma-4-31b-it`) for sustainable site design, trade-off analysis, and environmental optimization.

---

## How You Can Contribute

### 1. Contributing New Planning & Analysis Modules
To add a new environmental or urban planning metric (e.g., Acoustic Comfort, Stormwater Runoff, Evaporative Cooling):
1. **Define Schema:** Add your metric definition, unit, and direction rule in `/src/data/schema.ts`.
2. **Update Central Dataset:** Add baseline simulation records for Proposal A and Proposal B in `/src/data/project.json`.
3. **Add Visualizations:** Create responsive Recharts components in `/src/pages/Analysis.tsx` or `/src/pages/Compare.tsx`.
4. **Tag Provenance:** Every metric card must include an appropriate badge (`TEAM VERIFIED`, `CALCULATED FROM PROVIDED DATA`, or `AI RECOMMENDATION (GEMMA 4)`).

### 2. Improving Gemma 4 AI Prompts & System Instructions
The backend Gemma 4 engine is located in `/server.ts`. You can improve:
1. **System Instructions:** Enhance the urban planning specialist persona with specific municipal bylaws, LEED v4.1 criteria, or climate zone adaptations.
2. **Workflow Prompts:** Refine the 6-step prompt templates for structured report generation.
3. **Heuristic Fallback Engine:** Extend `generateHeuristicResponse()` in `/server.ts` to provide richer rule-based urban planning recommendations when offline or in demo mode.

### 3. Adding GIS, Weather & BIM Data Integrations
We welcome PRs that connect external open APIs:
- **GIS:** Integrating municipal open data portals or Overpass QL queries for public transport stops and green buffers.
- **Microclimate & Weather:** Extending `/src/services/weatherService.ts` with atmospheric pollution indexes (PM2.5 / PM10) or solar radiation histories.
- **BIM & CAD:** Adding Three.js / WebGL viewers for exported Autodesk Forma and Revit `.obj` / `.gltf` massing files.

---

## Local Development Workflow

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Quick Start
```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/smart-city-site-planning.git
cd smart-city-site-planning

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Set GEMINI_API_KEY if you want live Gemma 4 inference.
# If unset, the app gracefully runs in Heuristic Demo Mode.

# 4. Run the development server (runs full-stack Express + Vite)
npm run dev

# 5. Run tests
npm test

# 6. Check TypeScript types
npm run lint

# 7. Test production build
npm run build
```

The app will be accessible at `http://localhost:3000`.

---

## Key Development Rules & Policies

1. **Security & API Keys:** 
   - **Never** expose private API keys in client-side code, `VITE_` variables, or Git commits.
   - All Gemma 4 and AI API calls must run server-side in `/server.ts`.
2. **Zero-Hallucination Data Policy:**
   - Never fabricate simulated environmental data or fake sensor readings.
   - Distinctly label real Autodesk Forma simulation findings vs. AI-generated recommendations.
3. **No Fake Metrics or Imaginary Team Members:**
   - Keep all credentials, affiliations, and data genuine and transparent.

---

## Pull Request Guidelines

1. Create a feature branch: `git checkout -b feature/your-feature-name`.
2. Commit your changes with clear, descriptive commit messages:
   - `feat(gemma): add microclimate prompt template for wind Lawson CFD`
   - `fix(map): correct polygon coordinate winding order`
   - `docs: improve contributing guidelines for hacktoberfest`
3. Verify that `npm test`, `npm run lint`, and `npm run build` all pass without errors.
4. Push to your fork: `git push origin feature/your-feature-name`.
5. Open a Pull Request using our [PR Template](.github/PULL_REQUEST_TEMPLATE.md).
