# SMART CITY SITE PLANNING
## Sustainable Urban Development Through Intelligent Site Design

> **"An integrated urban planning initiative exploring sustainable land utilization, environmental performance, intelligent transportation, green infrastructure, and resilient urban development using Autodesk Forma and Revit."**

---

## 1. Project Overview & Objective

This platform is a production-ready, interactive showcase for **Smart City Site Planning Using Autodesk Forma Site Design** followed by detailed building development using **Autodesk Revit 2025**.

The project establishes a comprehensive smart-city redevelopment proposal covering a verified area of **1.28 km²** (surpassing the minimum planning threshold of ≥ 1.0 km²). It demonstrates how intelligent computational urban planning addresses rapid urbanization, environmental microclimate sustainability, pedestrian comfort, embodied carbon reduction, and BIM interoperability.

### Non-Negotiable Authenticity Policy
> **"Original work made in Autodesk Forma — no AI-generated content."**
- Every metric, massing shape, and chart is based on authentic modeling in Autodesk Forma and Autodesk Revit.
- No AI image generators, synthetic renders, or fabricated simulations are used.
- Clear data provenance badges are displayed across the interface:
  - `TEAM VERIFIED`
  - `LIVE API DATA`
  - `CALCULATED FROM PROVIDED DATA`
  - `PLACEHOLDER`
  - `NOT AVAILABLE`

---

## 2. Implemented Pages & Features

1. **Home (`/`)**:
   - Hero section with `"SMART URBAN DEVELOPMENT PROJECT"` badge, professional project information strip, and animated real-time counters.
   - Project introduction, scope, core pillars, and the 4 mandatory components preview.
   - 6-step generative workflow pipeline (*Site Selection → Context Research → Design → Analysis → Forma Board → Revit Export*).
   - Instant project summary PDF download button.

2. **Site Overview (`/site`)**:
   - Full-width interactive Leaflet map with OpenStreetMap tiles.
   - Georeferenced GeoJSON polygon boundary with automated spherical geodesic area calculation (**1.28 km²**).
   - Real-time boundary validation: `Area >= 1.0 km² = Threshold Satisfied`.
   - Live external weather integration via **Open-Meteo API** (ambient temperature, wind speed/direction, humidity, direct normal solar irradiance).
   - Contextual GIS features via **Overpass OSM API** (nearby roads, buildings, parks, amenities).
   - 4 Core Planning Component status cards: *Site Limits, Landscaping, Buildings, Transportation*.

3. **Design Proposals (`/proposals`)**:
   - Tab switching between **Proposal A: Biophilic Transit-Oriented Core (TOD)** and **Proposal B: Polycentric Microclimate Superblocks**.
   - Recharts Donut Chart of land-use distribution with automatic 100% target validation.
   - Interactive horizontal **Before-and-After drag slider** for cross-proposal comparisons.
   - Authentic screenshot carousel with CAD blueprint fallback placeholders.

4. **Autodesk Forma Analysis Dashboard (`/analysis`)**:
   - Complete documentation for all **8 Autodesk Forma Analysis Modules**:
     1. *Area Metrics & Density*
     2. *Embodied Carbon Analysis (kg CO₂e/m²)*
     3. *Sun Hours Analysis (Equinox & Solstice)*
     4. *Daylight Potential (% Floor Area meeting sDA)*
     5. *Wind Comfort & Aerodynamics (Lawson CFD Criteria)*
     6. *Microclimate & UTCI Thermal Comfort Variance*
     7. *Noise Analysis & Acoustic Buffering (dBA)*
     8. *Solar Energy & Photovoltaic Yield (kWh/m²/yr)*
   - Responsive Recharts visualizations (Bar & Line charts) with proposal filtering.
   - Authentic engineering insights and deliverable evidence cards.

5. **Forma Board Comparison (`/compare`)**:
   - Side-by-side comparative matrix across all criteria.
   - Direction rules explicitly enforced (*Lower is better* for Embodied Carbon & Noise; *Higher is better* for Green Space, Daylight, Solar Yield).
   - **Interactive multi-criteria weight sliders (0–10)** updating normalized composite scores in real-time.
   - Multi-axis Radar chart comparing normalized indicator equilibrium (0–100 scale).
   - Official Forma Board decision and engineering justification.

6. **Smart City Features (`/smart-city`)**:
   - Filterable feature cards across 6 categories: *Transportation, Green Infrastructure, Energy, Water, Environmental Comfort, Resilience*.
   - Clear distinction between *Verified*, *Implemented*, and *Planned* systems.

7. **Revit & BIM Workflow (`/revit-bim`)**:
   - 7-step technical pipeline from conceptual Forma massing to Revit 2025 drawing blocks.
   - Deliverable status pills for Forma site model, Site BIM export, Revit sync, and building drawing sheets.
   - Download links and evidence notes.

8. **Gallery & 30-Second Walkthrough Video (`/gallery`)**:
   - Responsive masonry grid with category filters (*Forma Screenshots, Proposals, Analysis, Revit, Board, Renders*).
   - Fullscreen Lightbox modal with keyboard controls (`←`, `→`, `Esc`).
   - 30-second walkthrough video section with official timeline chapters.

9. **Project Progress (`/tracker`)**:
   - 13-item project deliverables checklist with `localStorage` persistence.
   - Active milestone tracker driven by editable project schema data.
   - Interactive presentation slide deck validator (*strictly checks 5–7 slide structure*).

10. **Team & Resources (`/team`)**:
    - Profiles for the student project team members.
    - Academic Advisor and Autodesk Technical Advisor guidance cards.
    - Reference documentation links (Autodesk Forma, Revit guides, ULI Sustainable Cities Standards).

11. **About (`/about`)**:
    - Deep dive into project motivation, methodology, SDG alignments (SDGs 11, 13, 7), and scope limitations.
    - Prominent methodology and integrity declaration banner.

12. **Contact (`/contact`)**:
    - Validated inquiry form with **Formspree** API integration and truthful `mailto:` fallback.

13. **Project Editor & Admin (`/admin`)**:
    - Live in-browser editing of site coordinates, video URLs, decision justifications, and metrics.
    - Real-time Zod schema validation diagnostic report.
    - One-click JSON export and import.

14. **Global Command Palette (Cmd + K / Ctrl + K)**:
    - Search pages, proposals, analysis modules, features, and team members instantly.

15. **PDF Summary Generator**:
    - Download formatted project summary PDF via client-side `jsPDF`.

---

## 3. Technology Stack

- **Framework**: React 19, TypeScript (Strict Mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Architectural blueprint patterns, Dark/Light modes
- **Maps & Geospatial**: Leaflet, OpenStreetMap, Spherical geodesic area calculator
- **Charts & Data**: Recharts, Responsive SVG
- **Validation**: Zod runtime schema validation
- **PDF Generation**: jsPDF
- **Testing**: Vitest, React Testing Library
- **APIs**: Open-Meteo Weather API, OpenStreetMap Overpass API, Formspree

---

## 4. Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### Run Unit Tests
```bash
npm test
```

### Production Build
```bash
npm run build
```

---

## 5. Configuration & Central Project Data

All core project content is controlled centrally by:
```
/src/data/project.json
```
You can edit this file directly in code or use the built-in visual editor at `/admin`.

### Environment Variables (`.env`)
```env
# Free Open-Meteo public API endpoint
VITE_OPEN_METEO_BASE_URL="https://api.open-meteo.com/v1"

# Free Overpass OSM public API endpoint
VITE_OVERPASS_BASE_URL="https://overpass-api.de/api/interpreter"

# Optional Formspree endpoint (falls back gracefully to mailto: if unset)
VITE_FORMSPREE_ENDPOINT=""

# Public deployment URL
VITE_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 6. Verification Checklist
- [x] Application compiles with zero TypeScript errors
- [x] All 12 requested pages and Admin editor fully functional
- [x] Geodesic polygon area validation calculates ≥ 1.0 km²
- [x] 8 Autodesk Forma analysis modules documented with Recharts
- [x] Forma Board comparison with live weight sliders and radar chart
- [x] Generic project milestone tracker driven by project data
- [x] Presentation slide deck validator operational
- [x] PDF export generation operational
- [x] Command Palette (Ctrl+K) active
- [x] 100% authentic architecture (No AI-generated renders)
