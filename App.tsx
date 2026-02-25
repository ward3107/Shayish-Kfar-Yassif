import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Process from './pages/Process';
import Materials from './pages/Materials';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import AccessibilityStatement from './pages/AccessibilityStatement';
import GdprRequestForm from './pages/GdprRequestForm';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/process" element={<Process />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
              <Route path="/gdpr-request" element={<GdprRequestForm />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;