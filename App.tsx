import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SoundProvider } from './contexts/SoundContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import { prefetchKeyRoutesOnIdle } from './utils/routePrefetch';

/**
 * Wrap lazy() so a stale-chunk failure (old tab open when a new deploy
 * shipped, so the referenced hashed chunk 404s) transparently force-reloads
 * the page ONCE instead of surfacing the cryptic
 *   "Failed to fetch dynamically imported module"
 * error. sessionStorage guards prevent an infinite reload loop when the
 * failure is actually a persistent problem (offline, CDN outage).
 */
const lazyWithReload = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) =>
  lazy(() =>
    factory().catch((err) => {
      const KEY = 'shayish.chunkReload';
      if (typeof window !== 'undefined' && !sessionStorage.getItem(KEY)) {
        sessionStorage.setItem(KEY, '1');
        window.location.reload();
        // Return a never-resolving promise so React doesn't error before reload.
        return new Promise<{ default: T }>(() => {});
      }
      throw err;
    })
  );

// Home is bundled with the main chunk (always the first view). Every other
// route is code-split, so a visitor landing on / doesn't pay the JS cost
// of legal pages, contact forms, or the accessibility statement they may
// never open.
const Gallery = lazyWithReload(() => import('./pages/Gallery'));
const Process = lazyWithReload(() => import('./pages/Process'));
const Materials = lazyWithReload(() => import('./pages/Materials'));
const About = lazyWithReload(() => import('./pages/About'));
const Contact = lazyWithReload(() => import('./pages/Contact'));
const FAQ = lazyWithReload(() => import('./pages/FAQ'));
const PrivacyPolicy = lazyWithReload(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazyWithReload(() => import('./pages/TermsOfUse'));
const AccessibilityStatement = lazyWithReload(() => import('./pages/AccessibilityStatement'));
const GdprRequestForm = lazyWithReload(() => import('./pages/GdprRequestForm'));
const NotFound = lazyWithReload(() => import('./pages/NotFound'));
const Admin = lazyWithReload(() => import('./pages/Admin'));

/**
 * Delayed loading spinner. Chunks that arrive in <250ms don't flash a
 * spinner — the page just appears. Only slow loads show feedback.
 */
const RouteFallback: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 250);
    return () => window.clearTimeout(id);
  }, []);
  if (!visible) return null;
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" aria-label="Loading" />
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    prefetchKeyRoutesOnIdle();
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
       <SoundProvider>
        <Router>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Admin lives outside the marketing Layout — no header, footer, or cookie banner. */}
              <Route path="/admin" element={<Admin />} />
              <Route
                path="*"
                element={
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
                }
              />
            </Routes>
          </Suspense>
        </Router>
       </SoundProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
