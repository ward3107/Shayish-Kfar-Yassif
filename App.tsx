import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';

// Home is bundled with the main chunk (always the first view). Every other
// route is code-split, so a visitor landing on / doesn't pay the JS cost
// of legal pages, contact forms, or the accessibility statement they may
// never open.
const Gallery = lazy(() => import('./pages/Gallery'));
const Process = lazy(() => import('./pages/Process'));
const Materials = lazy(() => import('./pages/Materials'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const AccessibilityStatement = lazy(() => import('./pages/AccessibilityStatement'));
const GdprRequestForm = lazy(() => import('./pages/GdprRequestForm'));
const NotFound = lazy(() => import('./pages/NotFound'));

const RouteFallback: React.FC = () => (
  <div className="min-h-screen bg-primary flex items-center justify-center">
    <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-label="Loading" />
  </div>
);

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/process" element={<Process />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
                <Route path="/gdpr-request" element={<GdprRequestForm />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
