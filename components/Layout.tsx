import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, Globe, Sun, Moon } from 'lucide-react';
import Button from './Button';
import FloatingActions from './FloatingActions';
import ScrollToTop from './ScrollToTop';
import CookieBanner from './CookieBanner';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.collections'), path: '/gallery' },
    { name: t('nav.process'), path: '/process' },
    { name: t('nav.materials'), path: '/materials' },
    { name: t('nav.studio'), path: '/about' },
  ];

  const cycleLanguage = () => {
      const langs = ['en', 'he', 'ar'] as const;
      const currentIndex = langs.indexOf(language);
      const nextIndex = (currentIndex + 1) % langs.length;
      setLanguage(langs[nextIndex]);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans text-light bg-primary transition-colors duration-300 ${language === 'ar' ? 'font-arabic' : ''}`} dir={dir}>
      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-primary/95 backdrop-blur-md border-neutral-800 py-4 shadow-sm' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-8 flex items-center justify-between">
          <Link to="/" className="z-50 group">
             <div className={`text-xl md:text-2xl font-serif tracking-tighter ${isScrolled ? 'text-light' : 'text-white'} transition-colors`}>
                <span className="text-accent">Shayish</span> Kfar Yassif
             </div>
             <div className={`text-xs text-gray-400 group-hover:text-accent transition-colors mt-1 font-light tracking-widest ${isScrolled ? 'text-muted' : 'text-gray-300'}`}>
                 שיש כפר יאסיף
             </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
             {/* Language & Theme Switcher */}
            <div className="flex items-center gap-6 border-e border-gray-700 pe-6 me-4">

              {/* Language Toggle - Cycles on click */}
              <button onClick={cycleLanguage} className={`flex items-center gap-2 hover:text-accent transition-colors ${isScrolled ? 'text-light' : 'text-white'}`} aria-label="Switch Language">
                <Globe size={18} />
                <span className="text-xs font-bold uppercase">{language}</span>
              </button>

              {/* Theme Toggle */}
              <button onClick={toggleTheme} className={`hover:text-accent transition-colors ${isScrolled ? 'text-light' : 'text-white'}`} aria-label="Toggle Theme">
                 {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full ${
                    location.pathname === link.path ? 'text-accent after:w-full' : (isScrolled ? 'text-light' : 'text-gray-300')
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/contact">
              <Button size="sm" variant="gold">
                {t('nav.consultation')}
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-5 md:hidden z-50">
            <button onClick={toggleTheme} className={isScrolled ? 'text-light' : 'text-white'} aria-label="Toggle Theme">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button onClick={cycleLanguage} className={`flex items-center gap-1 ${isScrolled ? 'text-light' : 'text-white'}`} aria-label="Switch Language">
               <Globe size={20} />
               <span className="text-xs font-bold uppercase w-4">{language}</span>
            </button>

            <button 
              className={isScrolled ? 'text-light' : 'text-white'}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open Menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-black transition-transform duration-700 ease-in-out md:hidden flex flex-col items-center justify-center ${isMobileMenuOpen ? 'translate-x-0' : (dir === 'rtl' ? '-translate-x-full' : 'translate-x-full')}`}>
          <nav className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="text-3xl font-serif text-white hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-8">
              <Button size="lg" variant="gold">{t('nav.consultation')}</Button>
            </Link>
          </nav>
      </div>

      {/* Main Content */}
      <main id="main-content" className="flex-grow" role="main" tabIndex={-1}>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-light border-t border-neutral-800 pt-20 pb-10 transition-colors duration-300">
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-1">
             <div className="text-2xl font-serif tracking-tighter text-light mb-6">
                <span className="text-accent">Shayish</span> Kfar Yassif
             </div>
            <p className="text-muted text-sm leading-relaxed mb-8">
              {t('footer.desc')}
            </p>
            <div className="flex gap-6">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors"><Instagram size={20} /></a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors"><Facebook size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-8">{t('footer.collections')}</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><Link to="/gallery" className="hover:text-light transition-colors">{t('footer.ceramic')}</Link></li>
              <li><Link to="/gallery" className="hover:text-light transition-colors">{t('footer.marble')}</Link></li>
              <li><Link to="/gallery" className="hover:text-light transition-colors">{t('footer.islands')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-8">{t('footer.studio')}</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><Link to="/about" className="hover:text-light transition-colors">{t('footer.story')}</Link></li>
              <li><Link to="/process" className="hover:text-light transition-colors">{t('footer.process')}</Link></li>
              <li><Link to="/materials" className="hover:text-light transition-colors">{t('nav.materials')}</Link></li>
              <li><Link to="/contact" className="hover:text-light transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-8">{t('footer.visit')}</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li>{t('contact.address_lines.1')}</li>
              <li>{t('contact.address_lines.0')}</li>
              <li className="pt-4"><a href="tel:+972500000000" className="text-light hover:text-accent text-lg font-serif" dir="ltr">+972 50-000-0000</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted px-8">
          <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <Link to="/privacy-policy" className="hover:text-accent transition-colors">{t('footer.privacyPolicy')}</Link>
             <Link to="/accessibility-statement" className="hover:text-accent transition-colors">{t('footer.accessibility')}</Link>
             <Link to="/terms-of-use" className="hover:text-accent transition-colors">{t('footer.termsOfUse')}</Link>
          </div>
        </div>
      </footer>

      <FloatingActions />
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
};

export default Layout;