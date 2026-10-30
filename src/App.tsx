import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './hooks/useProjectData';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Core Pages
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

// Auth & Personalization Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

// AI Assistant
import { GemmaPlanningAssistant } from './components/ai/GemmaPlanningAssistant';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
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
                    <Route path="/ai-workflow" element={<AIWorkflow />} />
                    <Route path="/open-source" element={<OpenSourceAI />} />
                    <Route path="/open-source-ai" element={<OpenSourceAI />} />
                    <Route path="/tracker" element={<Tracker />} />
                    <Route path="/team" element={<TeamResources />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<Admin />} />

                    {/* Auth & Personalization Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/settings" element={<Settings />} />

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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
