import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Sun, Moon, Lock, FileText } from 'lucide-react';
// (Instagram still used in the footer + mobile-menu handle preview.)
import Button from './Button';
import ContactFAB from './ContactFAB';
import ScrollToTop from './ScrollToTop';
import CookieBanner from './CookieBanner';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { CONTACT } from '../constants';
import { prefetchRoute } from '../utils/routePrefetch';
import LanguageSwitcher from './LanguageSwitcher';
import CreatorSignature from './CreatorSignature';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const footerRef = React.useRef<HTMLElement>(null);

  const location = useLocation();
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep back-to-top visible when the footer enters the viewport.
  useEffect(() => {
    let ticking = false;
    let last = false;
    const check = () => {
      ticking = false;
      const el = footerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next = rect.top < window.innerHeight * 0.7;
      if (next !== last) {
        last = next;
        setAtFooter(next);
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(check);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  // Only the Home page starts with a dark hero video behind the header.
  // Everywhere else, "not scrolled" means the header sits over the page's
  // own background (white in light mode) — so header text must be
  // theme-aware, not hardcoded white.
  const isOverDarkHero = !isScrolled && location.pathname === '/';
  // Header color helpers — used everywhere the old code did
  // `headerText` etc.
  const headerText = isOverDarkHero ? 'text-white' : 'text-light';
  const headerMuted = isOverDarkHero ? 'text-gray-300' : 'text-muted';

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.collections'), path: '/gallery' },
    { name: t('nav.faq'), path: '/faq' },
  ];

  const CATALOG_URL = '/catalog/shayish-kfar-yassif-catalog-v2.pdf';

  // Language switching is now handled by the <LanguageSwitcher /> dropdown.

  return (
    <div className={`min-h-screen flex flex-col font-sans text-light bg-primary transition-colors duration-300 ${language === 'ar' ? 'font-arabic' : ''}`} dir={dir}>
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-primary backdrop-blur-md border-divider py-4 shadow-sm'
            : isOverDarkHero
              ? 'bg-[#101916]/85 backdrop-blur-md border-[#c3a16f]/35 py-4 shadow-lg'
              : 'bg-primary/95 backdrop-blur-md border-divider py-4'
        }`}
      >
        <div className="container mx-auto px-8 flex items-center justify-between">
          <Link to="/" className="z-50 group">
             <div className={`text-xl md:text-2xl font-serif tracking-tighter ${headerText} transition-colors`}>
                <span className="text-accent">Shayish</span> Kfar Yassif
             </div>
             <div className={`text-xs group-hover:text-accent transition-colors mt-1 font-light tracking-widest ${headerMuted}`}>
                 שיש כפר יאסיף
             </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label={t('nav.primary')}>
             {/* Language + Theme Switcher */}
            <div className="flex items-center gap-6 border-e border-divider pe-6 me-4">

              {/* Language dropdown */}
              <LanguageSwitcher anchorClass={headerText} size={18} />

              {/* Theme Toggle */}
              <button onClick={toggleTheme} className={`hover:text-accent transition-colors ${headerText}`} aria-label="Toggle Theme">
                 {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onMouseEnter={() => prefetchRoute(link.path)}
                onFocus={() => prefetchRoute(link.path)}
                onTouchStart={() => prefetchRoute(link.path)}
                className={`text-sm font-semibold tracking-wide hover:text-accent transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full ${
                    location.pathname === link.path ? 'text-accent after:w-full' : headerText
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-semibold tracking-wide hover:text-accent transition-colors duration-300 inline-flex items-center gap-2 ${headerText}`}
            >
              <FileText size={15} /> {t('nav.catalog')}
            </a>
            <Link to="/contact">
              <Button size="sm" variant="gold">
                {t('nav.consultation')}
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-5 md:hidden z-50">
            <button onClick={toggleTheme} className={headerText} aria-label="Toggle Theme">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <LanguageSwitcher anchorClass={headerText} size={20} compact />

            <button
              className={headerText}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t('nav.close_menu') : t('nav.open_menu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay — use `inert` instead of aria-hidden so
          focusable descendants can't retain focus while hidden. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        inert={!isMobileMenuOpen}
        className={`fixed inset-0 z-40 bg-black transition-transform duration-700 ease-in-out md:hidden flex flex-col items-center justify-center ${isMobileMenuOpen ? 'translate-x-0' : (dir === 'rtl' ? '-translate-x-full' : 'translate-x-full')}`}
      >
          <nav className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onTouchStart={() => prefetchRoute(link.path)}
                className="text-3xl font-serif text-white hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl font-serif text-white hover:text-accent transition-colors inline-flex items-center gap-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FileText size={26} /> {t('nav.catalog')}
            </a>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-8">
              <Button size="lg" variant="gold">{t('nav.consultation')}</Button>
            </Link>
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="mt-6 flex items-center gap-2 text-white hover:text-accent transition-colors text-sm uppercase tracking-widest"
            >
              <Instagram size={20} />
              <span>@{CONTACT.instagramHandle}</span>
            </a>
          </nav>
      </div>

      {/* Main Content */}
      <main id="main-content" className="flex-grow" role="main" tabIndex={-1}>
        {children}
      </main>

      {/* Extra bottom space keeps the persistent contact and back-to-top
          controls clear of the legal links at the end of the page. */}
      <footer
        ref={footerRef}
        className="bg-secondary text-light border-t border-divider pt-20 pb-44 transition-colors duration-300"
      >
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-1">
             <div className="text-2xl font-serif tracking-tighter text-light mb-6">
                <span className="text-accent">Shayish</span> Kfar Yassif
             </div>
            <p className="text-muted text-sm leading-relaxed mb-8">
              {t('footer.desc')}
            </p>
            <div className="flex gap-6">
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted hover:text-accent transition-colors"
              >
                <Instagram size={20} />
              </a>
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
              <li><a href={CATALOG_URL} target="_blank" rel="noopener noreferrer" className="hover:text-light transition-colors">{t('nav.catalog')}</a></li>
              <li><Link to="/contact" className="hover:text-light transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-8">{t('footer.visit')}</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li>{t('contact.address_lines.1')}</li>
              <li>{t('contact.address_lines.0')}</li>
              <li className="pt-4"><a href={`tel:${CONTACT.phoneTel}`} className="text-light hover:text-accent text-lg font-serif" dir="ltr">{CONTACT.phoneDisplay}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted px-8">
          <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
             <Link to="/privacy-policy" className="hover:text-accent transition-colors">{t('footer.privacyPolicy')}</Link>
             <Link to="/accessibility-statement" className="hover:text-accent transition-colors">{t('footer.accessibility')}</Link>
             <Link to="/terms-of-use" className="hover:text-accent transition-colors">{t('footer.termsOfUse')}</Link>
             {/* Discreet owner-only link. Public visibility is fine — the panel
                 is password-gated + rate-limited + noindexed; the extra bot
                 traffic on /api/admin/login is negligible against the 5/15-min
                 IP limit. Lock icon disambiguates it from the legal links. */}
             <Link
               to="/admin"
               rel="nofollow"
               className="inline-flex items-center gap-1 opacity-60 hover:opacity-100 hover:text-accent transition-all"
               aria-label={t('footer.admin')}
             >
               <Lock size={12} />
               <span>{t('footer.admin')}</span>
             </Link>
          </div>
        </div>
        <CreatorSignature />
      </footer>

      <ContactFAB />
      <ScrollToTop forceVisible={atFooter} />
      <CookieBanner />
    </div>
  );
};

export default Layout;
