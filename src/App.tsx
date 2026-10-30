import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { ProjectProvider } from './hooks/useProjectData';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { SiteOverview } from './pages/SiteOverview';
import { Proposals } from './pages/Proposals';
import { Analysis } from './pages/Analysis';
import { Compare } from './pages/Compare';
import { SmartCity } from './pages/SmartCity';
import { RevitBIM } from './pages/RevitBIM';
import { Gallery } from './pages/Gallery';
import { Tracker } from './pages/Tracker';
import { TeamResources } from './pages/TeamResources';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { AIWorkflow } from './pages/AIWorkflow';
import { OpenSourceAI } from './pages/OpenSourceAI';
import { NotFound } from './pages/NotFound';
import { GemmaPlanningAssistant } from './components/ai/GemmaPlanningAssistant';

export function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#F5F8FA] dark:bg-[#091521] text-[#172B3A] dark:text-[#F0F4F8] transition-colors duration-200">
            <Navbar />
            <main className="flex-1 w-full">
              <Suspense
                fallback={
                  <div className="min-h-[50vh] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/site" element={<SiteOverview />} />
                  <Route path="/proposals" element={<Proposals />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/smart-city" element={<SmartCity />} />
                  <Route path="/revit-bim" element={<RevitBIM />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/workflow" element={<AIWorkflow />} />
                  <Route path="/open-source" element={<OpenSourceAI />} />
                  <Route path="/tracker" element={<Tracker />} />
                  <Route path="/team" element={<TeamResources />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            {/* Global Gemma 4 Planning Assistant Launcher */}
            <GemmaPlanningAssistant />
          </div>
        </BrowserRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;
