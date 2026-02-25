/**
 * Privacy Policy Page
 *
 * Compliant with:
 * - Protection of Privacy Law (PPL) 5741-1981, Section 11
 * - Amendment 13 (effective August 14, 2025)
 * - PPA July 2022 official notification guidelines
 *
 * Last Updated: 2025-02-23
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, ExternalLink, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type PrivacyLanguage = 'he' | 'ar' | 'en' | 'ru';

interface Section {
  id: string;
  title: string;
}

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [privacyLang, setPrivacyLang] = useState<PrivacyLanguage>('he');
  const { dir } = useLanguage();

  // Set page title (WCAG 2.4.2 - Unique descriptive page titles)
  useEffect(() => {
    document.title = 'מדיניות פרטיות - Privacy Policy | שיש כפר יאסיף - Shayish Kfar Yassif';
  }, []);

  // Detect language from browser or use Hebrew as default
  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('he')) {
      setPrivacyLang('he');
    } else if (browserLang.startsWith('ar')) {
      setPrivacyLang('ar');
    } else if (browserLang.startsWith('ru')) {
      setPrivacyLang('ru');
    } else {
      setPrivacyLang('en');
    }
  }, []);

  // Scroll spy for active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      const scrollPos = window.scrollY + 150;

      sections.forEach((section) => {
        const top = (section as HTMLElement).offsetTop;
        const height = (section as HTMLElement).offsetHeight;
        const id = section.getAttribute('data-section');

        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(id || '');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isRTL = privacyLang === 'he' || privacyLang === 'ar';
  const textDir = isRTL ? 'rtl' : 'ltr';

  // Table of contents sections
  const sections: Section[] = [
    { id: 'introduction', title: translations[privacyLang].toc.introduction },
    { id: 'data-collected', title: translations[privacyLang].toc.dataCollected },
    { id: 'purpose-basis', title: translations[privacyLang].toc.purposeBasis },
    { id: 'data-recipients', title: translations[privacyLang].toc.dataRecipients },
    { id: 'international-transfer', title: translations[privacyLang].toc.internationalTransfer },
    { id: 'retention', title: translations[privacyLang].toc.retention },
    { id: 'consequences', title: translations[privacyLang].toc.consequences },
    { id: 'your-rights', title: translations[privacyLang].toc.yourRights },
    { id: 'complaint', title: translations[privacyLang].toc.complaint },
    { id: 'cookies', title: translations[privacyLang].toc.cookies },
    { id: 'automated-decisions', title: translations[privacyLang].toc.automatedDecisions },
    { id: 'security', title: translations[privacyLang].toc.security },
    { id: 'updates', title: translations[privacyLang].toc.updates },
    { id: 'gdpr-addendum', title: translations[privacyLang].toc.gdprAddendum },
  ];

  const t = translations[privacyLang];
  const today = new Date().toLocaleDateString(privacyLang === 'he' ? 'he-IL' : privacyLang === 'ar' ? 'ar-IL' : privacyLang === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setMobileTocOpen(false);
    }
  };

  return (
    <div className={`min-h-screen bg-primary text-light transition-colors duration-300`} dir={textDir}>
      {/* Header */}
      <header className="bg-secondary border-b border-neutral-800 py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-accent text-sm font-bold uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-light transition-colors">
              {t.nav.home}
            </Link>
            <ChevronRight size={14} />
            <span>{t.nav.privacy}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-light mb-6">
            {t.title}
          </h1>

          <p className="text-muted text-lg mb-8">
            {t.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <span className="font-bold">{t.lastUpdated}:</span>
              <span className="text-light">{today}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{t.readingTime}:</span>
              <span className="text-light">~4 {t.minutes}</span>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-xs text-muted uppercase tracking-wider">{t.language}:</span>
            <div className="flex gap-1">
              {(['he', 'ar', 'en', 'ru'] as PrivacyLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setPrivacyLang(lang)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded transition-colors ${
                    privacyLang === lang
                      ? 'bg-accent text-white'
                      : 'bg-neutral-800 text-muted hover:text-light'
                  }`}
                  aria-label={`Switch to ${lang === 'he' ? 'Hebrew' : lang === 'ar' ? 'Arabic' : lang === 'en' ? 'English' : 'Russian'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Table of Contents - Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            {/* Mobile TOC Toggle */}
            <button
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="lg:hidden w-full flex items-center justify-between p-4 bg-secondary border border-neutral-700 rounded-sm mb-6"
              aria-label="Toggle table of contents"
            >
              <span className="font-bold text-sm uppercase tracking-wider">{t.tableOfContents}</span>
              {mobileTocOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* TOC Navigation */}
            <nav
              className={`${
                mobileTocOpen ? 'block' : 'hidden'
              } lg:block sticky top-32 bg-secondary border border-neutral-700 rounded-sm p-6 max-h-[calc(100vh-200px)] overflow-y-auto`}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">
                {t.tableOfContents}
              </h3>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left text-sm py-2 px-3 rounded transition-colors flex items-center gap-2 ${
                        activeSection === section.id
                          ? 'bg-accent/20 text-accent font-bold'
                          : 'text-muted hover:text-light hover:bg-neutral-800'
                      }`}
                    >
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{section.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            <div className="bg-secondary border border-neutral-700 rounded-sm p-8 md:p-12 space-y-12">
              {/* Section 1 - Introduction */}
              <section data-section="introduction" id="introduction" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">1.</span> {t.section1.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted leading-relaxed mb-4">{t.section1.para1}</p>

                  <div className="bg-neutral-800/50 border border-neutral-700 rounded-sm p-6 my-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">
                      {t.section1.controllerTitle}
                    </h4>
                    <dl className="space-y-3 text-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <dt className="text-muted font-bold">{t.section1.businessName}:</dt>
                        <dd className="text-light">שיש כפר יאסיף - Shayish Kfar Yassif</dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <dt className="text-muted font-bold">{t.section1.ownerName}:</dt>
                        <dd className="text-light">[OWNER_FULL_NAME]</dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <dt className="text-muted font-bold">{t.section1.address}:</dt>
                        <dd className="text-light">{t.section1.addressValue}</dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <dt className="text-muted font-bold">{t.section1.email}:</dt>
                        <dd className="text-light">
                          <a href="mailto:info@shayish-yasif.co.il" className="text-accent hover:text-light transition-colors">
                            info@shayish-yasif.co.il
                          </a>
                        </dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <dt className="text-muted font-bold">{t.section1.website}:</dt>
                        <dd className="text-light">
                          <a href="https://[YOUR_DOMAIN]" className="text-accent hover:text-light transition-colors">
                            [YOUR_DOMAIN]
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <p className="text-muted leading-relaxed">
                    {t.section1.compliance}
                  </p>
                </div>
              </section>

              {/* Section 2 - Data Collected */}
              <section data-section="data-collected" id="data-collected" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">2.</span> {t.section2.title}
                </h2>

                <div className="space-y-6">
                  {/* Direct Data */}
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-6">
                    <h3 className="text-lg font-bold text-light mb-4 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm">א</span>
                      {t.section2.directData.title}
                    </h3>
                    <p className="text-muted mb-4">{t.section2.directData.desc}</p>
                    <ul className="space-y-2 text-sm text-muted">
                      <li className="flex items-start gap-3">
                        <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                        <span>{t.section2.directData.item1}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                        <span>{t.section2.directData.item2}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                        <span>{t.section2.directData.item3}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Automatic Data */}
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-6">
                    <h3 className="text-lg font-bold text-light mb-4 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm">ב</span>
                      {t.section2.autoData.title}
                    </h3>
                    <p className="text-muted mb-4">{t.section2.autoData.desc}</p>
                    <div className="bg-warning-20 border-l-4 border-accent p-4 my-4">
                      <p className="text-sm text-light">
                        <strong className="text-accent">{t.section2.autoData.noticeLabel}:</strong> {t.section2.autoData.notice}
                      </p>
                    </div>
                    <ul className="space-y-2 text-sm text-muted">
                      <li className="flex items-start gap-3">
                        <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                        <span>{t.section2.autoData.item1}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                        <span>{t.section2.autoData.item2}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                        <span>{t.section2.autoData.item3}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                        <span>{t.section2.autoData.item4}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                        <span>{t.section2.autoData.item5}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Third-party Data */}
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-6">
                    <h3 className="text-lg font-bold text-light mb-4 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white text-sm">ג</span>
                      {t.section2.thirdPartyData.title}
                    </h3>
                    <p className="text-muted mb-4">{t.section2.thirdPartyData.desc}</p>

                    <div className="space-y-4">
                      {/* Google Analytics */}
                      <div className="border border-neutral-600 rounded-sm p-4">
                        <h4 className="font-bold text-light mb-2">Google Analytics 4</h4>
                        <p className="text-sm text-muted">{t.section2.thirdPartyData.ga4}</p>
                      </div>

                      {/* Facebook Pixel */}
                      <div className="border border-neutral-600 rounded-sm p-4">
                        <h4 className="font-bold text-light mb-2">Facebook Pixel / Meta</h4>
                        <p className="text-sm text-muted">{t.section2.thirdPartyData.facebook}</p>
                      </div>

                      {/* Google Ads */}
                      <div className="border border-neutral-600 rounded-sm p-4">
                        <h4 className="font-bold text-light mb-2">Google Ads</h4>
                        <p className="text-sm text-muted">{t.section2.thirdPartyData.googleAds}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 - Purpose and Legal Basis */}
              <section data-section="purpose-basis" id="purpose-basis" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">3.</span> {t.section3.title}
                </h2>

                <p className="text-muted leading-relaxed mb-6">{t.section3.intro}</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-600">
                        <th className="text-right p-4 font-bold text-light">{t.section3.table.purpose}</th>
                        <th className="text-right p-4 font-bold text-light">{t.section3.table.legalBasis}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-700 bg-neutral-800/30">
                        <td className="p-4 text-light">{t.section3.table.row1.purpose}</td>
                        <td className="p-4">
                          <span className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-bold uppercase">
                            {t.section3.table.legitimateInterest}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-neutral-700">
                        <td className="p-4 text-light">{t.section3.table.row2.purpose}</td>
                        <td className="p-4">
                          <span className="inline-block px-3 py-1 bg-green-900/30 text-green-400 rounded text-xs font-bold uppercase">
                            {t.section3.table.consent}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-neutral-700 bg-neutral-800/30">
                        <td className="p-4 text-light">{t.section3.table.row3.purpose}</td>
                        <td className="p-4">
                          <span className="inline-block px-3 py-1 bg-green-900/30 text-green-400 rounded text-xs font-bold uppercase">
                            {t.section3.table.consent}
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-neutral-800/30">
                        <td className="p-4 text-light">{t.section3.table.row4.purpose}</td>
                        <td className="p-4">
                          <span className="inline-block px-3 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-bold uppercase">
                            {t.section3.table.legitimateInterest}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 4 - Data Recipients */}
              <section data-section="data-recipients" id="data-recipients" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">4.</span> {t.section4.title}
                </h2>

                <p className="text-muted leading-relaxed mb-6">{t.section4.intro}</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-neutral-800/30 border border-neutral-700 rounded-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded flex items-center justify-center text-accent font-bold text-lg">G</div>
                    <div>
                      <h4 className="font-bold text-light">Google LLC</h4>
                      <p className="text-sm text-muted">{t.section4.google}</p>
                      <p className="text-xs text-muted mt-1">🇺🇸 USA</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-neutral-800/30 border border-neutral-700 rounded-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded flex items-center justify-center text-accent font-bold text-lg">M</div>
                    <div>
                      <h4 className="font-bold text-light">Meta Platforms Inc.</h4>
                      <p className="text-sm text-muted">{t.section4.meta}</p>
                      <p className="text-xs text-muted mt-1">🇺🇸 USA</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-neutral-800/30 border border-neutral-700 rounded-sm">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded flex items-center justify-center text-accent font-bold text-lg">H</div>
                    <div>
                      <h4 className="font-bold text-light">{t.section4.hosting}</h4>
                      <p className="text-sm text-muted">{t.section4.hostingDesc}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-sm">
                  <p className="text-sm text-light font-bold">
                    {t.section4.noSale}
                  </p>
                </div>
              </section>

              {/* Section 5 - International Transfers */}
              <section data-section="international-transfer" id="international-transfer" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">5.</span> {t.section5.title}
                </h2>

                <p className="text-muted leading-relaxed mb-4">{t.section5.para1}</p>
                <p className="text-muted leading-relaxed mb-4">{t.section5.para2}</p>

                <div className="bg-neutral-800/50 border border-neutral-700 rounded-sm p-6 my-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-3">
                    {t.section5.safeguards}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-3">
                      <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{t.section5.safeguard1}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{t.section5.safeguard2}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{t.section5.safeguard3}</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 6 - Data Retention */}
              <section data-section="retention" id="retention" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">6.</span> {t.section6.title}
                </h2>

                <p className="text-muted leading-relaxed mb-6">{t.section6.intro}</p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-neutral-800/30 border border-neutral-700 rounded-sm">
                    <span className="text-light">{t.section6.contactForm}</span>
                    <span className="text-accent font-bold">24 {t.section6.months}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-neutral-800/30 border border-neutral-700 rounded-sm">
                    <span className="text-light">{t.section6.analytics}</span>
                    <span className="text-accent font-bold">14 {t.section6.months}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-neutral-800/30 border border-neutral-700 rounded-sm">
                    <span className="text-light">{t.section6.marketing}</span>
                    <span className="text-accent font-bold">{t.section6.untilUnsubscribe}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-neutral-800/30 border border-neutral-700 rounded-sm">
                    <span className="text-light">{t.section6.serverLogs}</span>
                    <span className="text-accent font-bold">90 {t.section6.days}</span>
                  </div>
                </div>
              </section>

              {/* Section 7 - Consequences (MANDATORY under Section 11) */}
              <section data-section="consequences" id="consequences" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">7.</span> {t.section7.title}
                  <span className="ml-2 text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded uppercase tracking-wider">{t.section7.mandatory}</span>
                </h2>

                <div className="space-y-4">
                  <div className="bg-neutral-800/50 border-l-4 border-accent p-6 rounded-r-sm">
                    <h4 className="font-bold text-light mb-2">{t.section7.contactFormTitle}</h4>
                    <p className="text-sm text-muted">{t.section7.contactFormText}</p>
                  </div>

                  <div className="bg-neutral-800/50 border-l-4 border-accent p-6 rounded-r-sm">
                    <h4 className="font-bold text-light mb-2">{t.section7.cookiesTitle}</h4>
                    <p className="text-sm text-muted">{t.section7.cookiesText}</p>
                  </div>
                </div>
              </section>

              {/* Section 8 - Your Rights */}
              <section data-section="your-rights" id="your-rights" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">8.</span> {t.section8.title}
                </h2>

                <p className="text-muted leading-relaxed mb-6">{t.section8.intro}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-5">
                    <h4 className="font-bold text-accent mb-2">{t.section8.right1.title}</h4>
                    <p className="text-sm text-muted">{t.section8.right1.desc}</p>
                  </div>
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-5">
                    <h4 className="font-bold text-accent mb-2">{t.section8.right2.title}</h4>
                    <p className="text-sm text-muted">{t.section8.right2.desc}</p>
                  </div>
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-5">
                    <h4 className="font-bold text-accent mb-2">{t.section8.right3.title}</h4>
                    <p className="text-sm text-muted">{t.section8.right3.desc}</p>
                  </div>
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-5">
                    <h4 className="font-bold text-accent mb-2">{t.section8.right4.title}</h4>
                    <p className="text-sm text-muted">{t.section8.right4.desc}</p>
                  </div>
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-5">
                    <h4 className="font-bold text-accent mb-2">{t.section8.right5.title}</h4>
                    <p className="text-sm text-muted">{t.section8.right5.desc}</p>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-sm p-6">
                  <h4 className="font-bold text-light mb-3">{t.section8.howToExercise}</h4>
                  <p className="text-sm text-muted mb-3">{t.section8.emailUs}:</p>
                  <a
                    href="mailto:info@shayish-yasif.co.il?subject=Privacy%20Rights%20Request"
                    className="inline-flex items-center gap-2 text-accent hover:text-light transition-colors"
                  >
                    <span>info@shayish-yasif.co.il</span>
                    <ExternalLink size={14} />
                  </a>
                  <p className="text-sm text-muted mt-4">
                    <strong>{t.section8.responseTime}:</strong> {t.section8.within30Days}
                  </p>
                </div>
              </section>

              {/* Section 9 - Right to Complain */}
              <section data-section="complaint" id="complaint" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">9.</span> {t.section9.title}
                </h2>

                <p className="text-muted leading-relaxed mb-6">{t.section9.intro}</p>

                <div className="bg-neutral-800/50 border border-neutral-700 rounded-sm p-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">
                    Privacy Protection Authority (PPA)
                  </h4>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-3">
                      <span className="text-muted">📍</span>
                      <span>{t.section9.address}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-muted">🌐</span>
                      <a
                        href="https://gov.il/en/departments/the_privacy_protection_authority"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-light transition-colors flex items-center gap-2"
                      >
                        {t.section9.website}
                        <ExternalLink size={12} />
                      </a>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 10 - Cookies */}
              <section data-section="cookies" id="cookies" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">10.</span> {t.section10.title}
                </h2>

                <p className="text-muted leading-relaxed mb-6">{t.section10.intro}</p>

                <div className="space-y-4">
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-5">
                    <h4 className="font-bold text-light mb-2">{t.section10.necessary.title}</h4>
                    <p className="text-sm text-muted">{t.section10.necessary.desc}</p>
                  </div>
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-5">
                    <h4 className="font-bold text-light mb-2">{t.section10.analytics.title}</h4>
                    <p className="text-sm text-muted">{t.section10.analytics.desc}</p>
                  </div>
                  <div className="bg-neutral-800/30 border border-neutral-700 rounded-sm p-5">
                    <h4 className="font-bold text-light mb-2">{t.section10.marketing.title}</h4>
                    <p className="text-sm text-muted">{t.section10.marketing.desc}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-sm">
                  <p className="text-sm text-light">
                    {t.section10.changePref} <Link to="/" className="text-accent hover:text-light underline underline-offset-2">{t.section10.cookieBanner}</Link>
                  </p>
                </div>
              </section>

              {/* Section 11 - Automated Decisions */}
              <section data-section="automated-decisions" id="automated-decisions" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">11.</span> {t.section11.title}
                </h2>

                <p className="text-muted leading-relaxed">
                  {t.section11.content}
                </p>
              </section>

              {/* Section 12 - Data Security */}
              <section data-section="security" id="security" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">12.</span> {t.section12.title}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-900/30 rounded flex items-center justify-center text-green-400">🔒</div>
                    <div>
                      <h4 className="font-bold text-light mb-1">{t.section12.encryption}</h4>
                      <p className="text-sm text-muted">{t.section12.encryptionDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-900/30 rounded flex items-center justify-center text-green-400">👥</div>
                    <div>
                      <h4 className="font-bold text-light mb-1">{t.section12.accessControl}</h4>
                      <p className="text-sm text-muted">{t.section12.accessControlDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-900/30 rounded flex items-center justify-center text-orange-400">⚠️</div>
                    <div>
                      <h4 className="font-bold text-light mb-1">{t.section12.breach}</h4>
                      <p className="text-sm text-muted">{t.section12.breachDesc}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 13 - Policy Updates */}
              <section data-section="updates" id="updates" className="scroll-mt-32">
                <h2 className="text-2xl font-serif text-light mb-6 pb-3 border-b border-neutral-700">
                  <span className="text-accent">13.</span> {t.section13.title}
                </h2>

                <p className="text-muted leading-relaxed mb-4">{t.section13.para1}</p>
                <p className="text-muted leading-relaxed">{t.section13.para2}</p>
              </section>

              {/* Section 14 - GDPR Addendum for EU/EEA Residents */}
              <section data-section="gdpr-addendum" id="gdpr-addendum" className="scroll-mt-32">
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-sm p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🇪🇺</span>
                    <h2 className="text-2xl font-serif text-light">
                      <span className="text-accent">14.</span> {t.section14.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted">{t.section14.notice}</p>
                </div>

                <p className="text-muted leading-relaxed mb-6">{t.section14.intro}</p>

                {/* GDPR Legal Bases Table */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-sm p-6 mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">
                    {t.section14.legalBasisTitle}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-600">
                          <th className="text-right p-3 font-bold text-light">{t.section14.table.activity}</th>
                          <th className="text-right p-3 font-bold text-light">{t.section14.table.legalBasis}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-neutral-700 bg-neutral-800/30">
                          <td className="p-3 text-light">{t.section14.table.row1.activity}</td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
                              {t.section14.table.row1.basis}
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-neutral-700">
                          <td className="p-3 text-light">{t.section14.table.row2.activity}</td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                              {t.section14.table.row2.basis}
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-neutral-700 bg-neutral-800/30">
                          <td className="p-3 text-light">{t.section14.table.row3.activity}</td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                              {t.section14.table.row3.basis}
                            </span>
                          </td>
                        </tr>
                        <tr className="bg-neutral-800/30">
                          <td className="p-3 text-light">{t.section14.table.row4.activity}</td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
                              {t.section14.table.row4.basis}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* GDPR Additional Rights */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-sm p-6 mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">
                    {t.section14.additionalRightsTitle}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-900/50 border border-neutral-600 rounded-sm p-4">
                      <h5 className="font-bold text-light mb-2 flex items-center gap-2">
                        <span className="text-accent">Article 20</span>
                        <span className="text-sm text-accent">📦</span>
                      </h5>
                      <p className="text-sm text-muted">{t.section14.rightPortability}</p>
                      <p className="text-xs text-muted mt-2">{t.section14.rightPortabilityDesc}</p>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-600 rounded-sm p-4">
                      <h5 className="font-bold text-light mb-2 flex items-center gap-2">
                        <span className="text-accent">Article 18</span>
                        <span className="text-sm text-accent">🔒</span>
                      </h5>
                      <p className="text-sm text-muted">{t.section14.rightRestriction}</p>
                      <p className="text-xs text-muted mt-2">{t.section14.rightRestrictionDesc}</p>
                    </div>
                  </div>
                </div>

                {/* Supervisory Authority */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-sm p-6 mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">
                    {t.section14.supervisoryAuthorityTitle}
                  </h4>
                  <p className="text-sm text-muted mb-4">{t.section14.supervisoryAuthorityDesc}</p>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-3">
                      <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{t.section14.supervisoryAuthority1}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ChevronRight size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{t.section14.supervisoryAuthority2}</span>
                    </li>
                  </ul>
                </div>

                {/* International Transfers */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-sm p-6 mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">
                    {t.section14.internationalTransfersTitle}
                  </h4>
                  <p className="text-sm text-muted mb-4">{t.section14.internationalTransfersDesc}</p>
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-sm p-4">
                    <p className="text-sm text-light">
                      <strong className="text-accent">SCC (Standard Contractual Clauses):</strong> {t.section14.sccDesc}
                    </p>
                  </div>
                </div>

                {/* GDPR Request Form Link */}
                <div className="bg-accent/10 border border-accent/30 rounded-sm p-6">
                  <h4 className="font-bold text-light mb-3">{t.section14.requestFormTitle}</h4>
                  <p className="text-sm text-muted mb-4">{t.section14.requestFormDesc}</p>
                  <Link
                    to="/gdpr-request"
                    className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-sm font-bold hover:bg-light hover:text-primary transition-colors"
                  >
                    {t.section14.requestFormButton}
                    <ExternalLink size={16} />
                  </Link>
                  <p className="text-xs text-muted mt-3">
                    <strong>{t.section14.responseTime}:</strong> {t.section14.within30Days}
                  </p>
                </div>
              </section>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-sm text-muted">
              <p>{t.footerNote}</p>
              <p className="mt-2">© {new Date().getFullYear()} שיש כפר יאסיף - Shayish Kfar Yassif</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Translations for all 4 languages
const translations: Record<PrivacyLanguage, any> = {
  he: {
    nav: {
      home: 'דף הבית',
      privacy: 'מדיניות פרטיות'
    },
    title: 'מדיניות פרטיות',
    subtitle: 'המדיניות הזו מסבירה איך אנחנו אוספים, משתמשים ומגנים על המידע האישי שלך.',
    lastUpdated: 'עודכן לאחרונה',
    readingTime: 'זמן קריאה',
    minutes: 'דקות',
    language: 'שפה',
    tableOfContents: 'תוכן עניינים',
    toc: {
      introduction: 'מבוא וזהות בעל המידע',
      dataCollected: 'איזה מידע אנחנו אוספים',
      purposeBasis: 'מטרה ובסיס משפטי',
      dataRecipients: 'מי מקבל את המידע שלך',
      internationalTransfer: 'העברת מידע לחו״ל',
      retention: 'תקופות שמירת מידע',
      consequences: 'השלכות אי-מסירת מידע',
      yourRights: 'הזכויות שלך לפי חוק הגנת הפרטיות',
      complaint: 'זכות הגשת תלונה לרשות',
      cookies: 'עוגיות (Cookies)',
      automatedDecisions: 'החלטות אוטומטיות ובינה מלאכותית',
      security: 'אבטחת מידע',
      updates: 'עדכוני מדיניות',
      gdprAddendum: 'תוספת GDPR לתושבי אירופה'
    },
    section1: {
      title: 'מבוא וזהות בעל המידע',
      para1: 'ברוכים הבאים למדיניות הפרטיות של שיש כפר יאסיף. אנחנו מחויבים להגן על הפרטיות שלך ולפעול בהתאם לחוק הגנת הפרטיות, התשמ״א-1981 ותיקון 13 (החל מ-14 באוגוסט 2025).',
      controllerTitle: 'פרטי בעל המידע',
      businessName: 'שם העסק',
      ownerName: 'שם בעל העסק',
      address: 'כתובת',
      addressValue: 'אזור התעשייה, כפר יאסיף, ישראל',
      email: 'אימייל',
      website: 'אתר אינטרנט',
      compliance: 'מדיניות זו נכתבה בהתאם לחוק הגנת הפרטיות (התשמ״א-1981) ותיקון 13 (אוגוסט 2025).'
    },
    section2: {
      title: 'איזה מידע אנחנו אוספים',
      directData: {
        title: 'מידע שאתה מספק ישירות',
        desc: 'אנחנו אוספים מידע שאתה מספק מרצונך:',
        item1: 'שם מלא, כתובת אימייל ומספר טלפון (דרך טופס יצירת קשר או הרשמה לשירות)',
        item2: 'הודעות ופניות שאתה שולח אלינו דרך הטופס או אימייל',
        item3: 'כל מידע אחר שאתה בוחר לספק בהתכתבות איתנו'
      },
      autoData: {
        title: 'מידע שנאסף אוטומטית',
        desc: 'כשאתה מבקר באתר שלנו, אנחנו אוספים מידע מסוים אוטומטית:',
        noticeLabel: 'הערה חשובה',
        notice: 'כתובת ה-IP שלך מוגדרת כמידע אישי לפי תיקון 13 לחוק הגנת הפרטיות.',
        item1: 'כתובת IP (מזוהה כמידע אישי על פי תיקון 13)',
        item2: 'סוג הדפדפן והגרסה שלו',
        item3: 'סוג המכשיר (נייד או מחשב שולחני)',
        item4: 'דפים שביקרת בהם וזמן שהייה באתר',
        item5: 'כתובת האתר המפנה (referring URL)'
      },
      thirdPartyData: {
        title: 'מידע מכלי צד שלישי',
        desc: 'אנחנו משתמשים בכלים ממומנים לניתוח ושיווק. הנה מה שכל אחד מהם אוסף:',
        ga4: 'נתוני סשן, צפיות בדף, מידע על מכשיר, מיקום משוער. הנתונים מאוחסנים בשרתי Google.',
        facebook: 'התנהגות גלישה למטרות מיקוד פרסומות ומעקב המרות. ניתן להשתמש בפרטיך לפרסום ממוקד בפלטפורמת Meta.',
        googleAds: 'נתוני המרה והתנהגות גלישה לשיפור הפרסום ב-Google.'
      }
    },
    section3: {
      title: 'מטרת השימוש והבסיס המשפטי',
      intro: 'להלן המטרות שבגינן אנו משתמשים במידע האישי שלך, והבסיס המשפטי לכל אחת מהן:',
      table: {
        purpose: 'מטרה',
        legalBasis: 'בסיס משפטי',
        legitimateInterest: 'אינטרס חוקי',
        consent: 'הסכמה',
        row1: { purpose: 'מתן מענה לפניות דרך טופס יצירת קשר' },
        row2: { purpose: 'ניתוח ושיפור האתר וחוויית המשתמש' },
        row3: { purpose: 'שיווק ופרסום - הצגת פרסומות רלוונטיות' },
        row4: { purpose: 'אבטחת האתר ומניעת הונאה' }
      }
    },
    section4: {
      title: 'מי מקבל את המידע שלך',
      intro: 'אנחנו משתפים את המידע שלך עם ספקי שירות החיצוניים שעוזרים לנו להפעיל את האתר ולספק שירותים. להלן רשימת הנמענים:',
      google: 'שירותי ניתוח אתרים ופרסום מקוון',
      meta: 'מעקב ומיקוד פרסומות בפלטפורמות Meta',
      hosting: 'ספק אחסון שרתים ותשתית דיגיטלית',
      hostingDesc: 'האתר מאוחסן על שרתים מאובטחים. פרטי הספק משתנים בהתאם לתצורת האחסון הנוכחית.',
      noSale: 'אנחנו לא מוכרים את המידע האישי שלך לצד שלישי כלשהו.'
    },
    section5: {
      title: 'העברת מידע לחו״ל',
      para1: 'חלק מספקי השירות שלנו נמצאים מחוץ לישראל, בעיקר בארה״ב. ארה״ב אינה מוגדרת כמדינה עם רמת הגנה מספקת (adequate) על פי הרגולציה הישראלית.',
      para2: 'אנחנו דואגים שהעברת המידע תעשה בתוספת אמצעי הגנה מתאימים:',
      safeguards: 'אמצעי הגנה',
      safeguard1: 'סעיפי חוזה סטנדרטיים (Standard Contractual Clauses - SCC) עם כל ספק באירופה',
      safeguard2: 'ספקים אמריקאים מאושרים תחת מסגרת Data Privacy Framework או בעלי אמצעי הגנה שקולים',
      safeguard3: 'העברה מוצפנת בפרוטוקולי HTTPS/TLS'
    },
    section6: {
      title: 'תקופות שמירת המידע',
      intro: 'אנחנו שומרים את המידע האישי שלך רק כל עוד נדרש למטרות שלשמן נאסף, אלא אם כן נדרש אחרת על פי חוק:',
      months: 'חודשים',
      days: 'ימים',
      untilUnsubscribe: 'עד ביטול ההרשמה או בקשת מחיקה',
      contactForm: 'נתוני טופס יצירת קשר',
      analytics: 'נתוני ניתוח (Google Analytics)',
      marketing: 'נתוני שיווק',
      serverLogs: 'יומני שרת (כתובות IP)'
    },
    section7: {
      title: 'השלכות אי-מסירת מידע',
      mandatory: 'חובה על פי סעיף 11',
      contactFormTitle: 'טופס יצירת קשר',
      contactFormText: 'מסירת השם וכתובת האימייל בטופס היא מרצון. עם זאת, אם לא תספק אותם, לא נוכל להשיב לפנייתך.',
      cookiesTitle: 'עוגיות (Cookies)',
      cookiesText: 'ניתן לסרב לעוגיות ניתוח ושיווק. האתר ימשיך לתפקד באופן מלא — רק יכולות המעקב יבוטלו.'
    },
    section8: {
      title: 'הזכויות שלך לפי חוק הגנת הפרטיות',
      intro: 'על פי חוק הגנת הפרטיות, הזכות לך להיות מודע למידע, לתקן אותו ולמחוק אותו. להלן הזכויות העיקריות שלך:',
      right1: { title: 'זכות הגישה', desc: 'תוכל לבקש עותק של כל המידע האישי שלנו עלייך.' },
      right2: { title: 'זכות התיקון', desc: 'תוכל לבקש שנתקן מידע לא מדויק או נושן.' },
      right3: { title: 'זכות המחיקה', desc: 'תוכל לבקש מחיקת מידע כאשר אינו נדרש עוד למטרה שלשמה נאסף.' },
      right4: { title: 'זכות ההתנגדות', desc: 'תוכל להתנגד לשימוש במידע למטרות שיווק ישיר.' },
      right5: { title: 'זכות ביטול הסכמה', desc: 'תוכל לבטל את הסכמתך בכל עת, מבלי שהדבר ישפיע על עיבוד שנעשה קודם לכן.' },
      howToExercise: 'כיצד לממש את הזכויות שלך',
      emailUs: 'שלח אימייל לכתובת',
      responseTime: 'זמן תגובה',
      within30Days: 'תוך 30 יום מקבלת הבקשה'
    },
    section9: {
      title: 'זכות הגשת תלונה לרשות הגנת הפרטיות',
      intro: 'אם לדעתך זכויות הפרטיות שלך הופרו, באפשרותך להגיש תלונה לרשות הגנת הפרטיות (PPA):',
      address: 'רח׳ כנפי נשרים 66, ירושלים, ישראל',
      website: 'gov.il/en/departments/the_privacy_protection_authority'
    },
    section10: {
      title: 'עוגיות (Cookies)',
      intro: 'אנחנו משתמשים בשלוש קטגוריות של עוגיות. לחץ על כל קטגוריה כדי ללמוד יותר:',
      necessary: {
        title: 'עוגיות נדרשות',
        desc: 'חיוניות לתפקוד האתר. ללא הן, אפשרויות מסוימות לא יעבדו. תמיד פעילות.'
      },
      analytics: {
        title: 'עוגיות ניתוח',
        desc: 'עוזרות לנו להבין איך משתמשים משתמשים באתר. ניתן לבטל.'
      },
      marketing: {
        title: 'עוגיות שיווק',
        desc: 'משמשות להצגת פרסומות רלוונטיות. ניתן לבטל.'
      },
      changePref: 'לשנות את העדפות העוגיות שלך, לחץ על',
      cookieBanner: 'באנר העוגיות בתחתית הדף'
    },
    section11: {
      title: 'קבלת החלטות אוטומטית ושימוש בבינה מלאכותית',
      content: 'אנחנו לא משתמשים בקבלת החלטות אוטומטית או בינה מלאכותית שמשפיעות עליך באופן משמעותי על סמך המידע האישי שלך.'
    },
    section12: {
      title: 'אבטחת מידע',
      encryption: 'הצפנה בתעבורה',
      encryptionDesc: 'כל המידע מועבר בפרוטוקול HTTPS/SSL מוצפן.',
      accessControl: 'בקרת גישה',
      accessControlDesc: 'רק אנשי צוות מורשים יכולים לגשת למידע האישי.',
      breach: 'הליך במקרה של דליפת מידע',
      breachDesc: 'במקרה של דליפת מידע משמעותית, נודיע למשתמשים המושפעים ולרשות הגנת הפרטיות תוך 72 שעות מגילוי הדליפה.'
    },
    section13: {
      title: 'עדכוני מדיניות',
      para1: 'אנחנו עשויים לעדכן מדיניות זו מעת לעת. תאריך העדכון האחרון מוצג למעלה.',
      para2: 'שינויים מהותיים יועברו אליך באימייל או בהודעה בולטת באתר.'
    },
    section14: {
      title: 'תוספת GDPR לתושבי האיחוד האירופי והמרחב הכלכלי האירופי',
      notice: 'סעיף זה חל רק על תושבי אירופה שנמצאים באיחוד האירופי (EU), המרחב הכלכלי האירופי (EEA), או הממלכה המאוחדת בעת איסוף המידע.',
      intro: 'החוק הכללי להגנת מידע (GDPR) מספק הגנות נוספות על המידע האישי שלך. להלן הזכויות והבסיס המשפטי שחלים עליך כתושב אירופה:',
      legalBasisTitle: 'בסיס משפטי לעיבוד המידע (סעיף 6 ל-GDPR)',
      table: {
        activity: 'פעילות עיבוד',
        legalBasis: 'בסיס משפטי',
        row1: { activity: 'מתן מענה לפניות ואבטחת האתר', basis: 'סעיף 6(1)(ג) - אינטרס חוקי' },
        row2: { activity: 'עוגיות ניתוח (Google Analytics)', basis: 'סעיף 6(1)(א) - הסכמה' },
        row3: { activity: 'עוגיות שיווק (פרסום ממוקד)', basis: 'סעיף 6(1)(א) - הסכמה' },
        row4: { activity: 'שיפור שירותים וחוויית משתמש', basis: 'סעיף 6(1)(ו) - אינטרס חוקי' }
      },
      additionalRightsTitle: 'זכויות נוספות לפי GDPR',
      rightPortability: 'זכות לניידות נתונים (Article 20)',
      rightPortabilityDesc: 'תוכל לבקש לקבל את המידע האישי שלך בפורמט מובנה וממוכן (JSON/CSV), או להעבירו לספק אחר.',
      rightRestriction: 'זכות להגבלת עיבוד (Article 18)',
      rightRestrictionDesc: 'תוכל לבקש שנגביל את השימוש במידע שלך במקום למחוק אותו, למשל במקרה של סכסוך משפטי.',
      supervisoryAuthorityTitle: 'זכות להגיש תלונה לרשות פיקוח מקומית',
      supervisoryAuthorityDesc: 'לצד הזכות להגיש תלונה לרשות הישראלית, כתושב אירופה יש לך גם הזכות להגיש תלונה לרשות הפיקוח במדינת האיחוד שבה אתה גר:',
      supervisoryAuthority1: 'בגרמניה: Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)',
      supervisoryAuthority2: 'בצרפת: Commission Nationale de l\'Informatique et des Libertés (CNIL) — ורשויות מקבילות בכל מדינות האיחוד',
      internationalTransfersTitle: 'העברת מידמחוץ לאירופה',
      internationalTransfersDesc: 'המידע שלך עשוי להיות מועבר למדינות שמחוץ לאירופה (כגון ישראל, ארה״ב). אנחנו דואגים להעברה מאובטחת:',
      sccDesc: 'העברות מחוץ לאירופה מוגנות על ידי סעיפים חוזיים סטנדרטיים (Standard Contractual Clauses - SCC) המאושרים על ידי הנציבות האירופית.',
      requestFormTitle: 'טופס בקשה לזכויות GDPR',
      requestFormDesc: 'להגשת בקשה לגישה, תיקון, מחיקה, ניידות נתונים או הגבלת עיבוד, השתמש בטופס הבקשה הייעודי ל-GDPR:',
      requestFormButton: 'פתח טופס בקשה ל-GDPR',
      responseTime: 'זמן תגובה',
      within30Days: 'תוך 30 יום מקבלת הבקשה (סעיף 12(3) ל-GDPR)'
    },
    footerNote: 'מדיניות זו נכתבה בהתאם לחוק הגנת הפרטיות (התשמ״א-1981) סעיף 11 ותיקון 13, והנחיות רשות הגנת הפרטיות מיולי 2022.'
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      privacy: 'سياسة الخصوصية'
    },
    title: 'سياسة الخصوصية',
    subtitle: 'تشرح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك الشخصية.',
    lastUpdated: 'آخر تحديث',
    readingTime: 'وقت القراءة',
    minutes: 'دقائق',
    language: 'اللغة',
    tableOfContents: 'جدول المحتويات',
    toc: {
      introduction: 'المقدمة وهوية مسيطر البيانات',
      dataCollected: 'البيانات التي نجمعها',
      purposeBasis: 'الغرض والأساس القانوني',
      dataRecipients: 'من يتلقى بياناتك',
      internationalTransfer: 'النقل الدولي للبيانات',
      retention: 'فترات الاحتفاظ بالبيانات',
      consequences: 'عوائد عدم تقديم البيانات',
      yourRights: 'حقوقك بموجب قانون حماية الخصوصية',
      complaint: 'الحق في تقديم شكوى للهيئة',
      cookies: 'ملفات تعريف الارتباط',
      automatedDecisions: 'القرارات الآلية والذكاء الاصطناعي',
      security: 'أمان البيانات',
      updates: 'تحديثات السياسة',
      gdprAddendum: 'ملحق GDPR لسكان الاتحاد الأوروبي'
    },
    section1: {
      title: 'المقدمة وهوية مسيطر البيانات',
      para1: 'مرحبًا بكم في سياسة الخصوصية لشايش كفر ياسيف. نحن ملتزمون بحماية خصوصيتك والعمل وفقًا لقانون حماية الخصوصية 5741-1981 والتعديل 13 (اعتبارًا من 14 أغسطس 2025).',
      controllerTitle: 'تفاصيل مسيطر البيانات',
      businessName: 'اسم العمل',
      ownerName: 'اسم المالك',
      address: 'العنوان',
      addressValue: 'المنطقة الصناعية، كفر ياسيف، إسرائيل',
      email: 'البريد الإلكتروني',
      website: 'الموقع الإلكتروني',
      compliance: 'تمت كتابة هذه السياسة وفقًا لقانون حماية الخصوصية (5741-1981) والتعديل 13 (أغسطس 2025).'
    },
    section2: {
      title: 'البيانات التي نجمعها',
      directData: {
        title: 'بيانات تقدمها مباشرة',
        desc: 'نجمع البيانات التي تقدمها طواعية:',
        item1: 'الاسم الكامل وعنوان البريد الإلكتروني ورقم الهاتف (عبر نموذج الاتصال أو التسجيل)',
        item2: 'الرسائل والاستفسارات التي ترسلها إلينا عبر النموذج أو البريد الإلكتروني',
        item3: 'أي بيانات أخرى تختار تقديمها في مراسلاتك معنا'
      },
      autoData: {
        title: 'البيانات المجمعة تلقائيًا',
        desc: 'عند زيارة موقعنا، نجمع بعض المعلومات تلقائيًا:',
        noticeLabel: 'ملاحظة مهمة',
        notice: 'عنوان IP الخاص بك مصنف كبيانات شخصية بموجب التعديل 13 لقانون حماية الخصوصية.',
        item1: 'عنوان IP (مصنف كبيانات شخصية بموجب التعديل 13)',
        item2: 'نوع المتصفح وإصداره',
        item3: 'نوع الجهاز (موبايل أو سطح مكتب)',
        item4: 'الصفحات التي تمت زيارتها والوقت المقضي في الموقع',
        item5: 'عنوان الموقع المُحيل (referring URL)'
      },
      thirdPartyData: {
        title: 'البيانات من أدوات الطرف الثالث',
        desc: 'نستخدم أدوات مدفوعة للتحليل والتسويق. إليك ما يجمعه كل منها:',
        ga4: 'بيانات الجلسة ومرات مشاهدة الصفحة ومعلومات الجهاز والموقع المقدر. البيانات مخزنة على خوادم Google.',
        facebook: 'سلوك التصفح لاستهداف الإعلانات وتتبع التحويلات. قد يتم استخدام بياناتك للإعلانات الموجهة على منصة Meta.',
        googleAds: 'بيانات التحويل وسلوك التصفح لتحسين الإعلان على Google.'
      }
    },
    section3: {
      title: 'الغرض والأساس القانوني',
      intro: 'فيما يلي الأغراض التي نستخدم بياناتك الشخصية من أجلها، والأساس القانوني لكل منها:',
      table: {
        purpose: 'الغرض',
        legalBasis: 'الأساس القانوني',
        legitimateInterest: 'مصلحة مشروعة',
        consent: 'موافقة',
        row1: { purpose: 'الرد على الاستفسارات عبر نموذج الاتصال' },
        row2: { purpose: 'التحليل وتحسين الموقع وتجربة المستخدم' },
        row3: { purpose: 'التسويق والإعلان - عرض إعلانات ذات صلة' },
        row4: { purpose: 'تأمين الموقع ومنع الاحتيال' }
      }
    },
    section4: {
      title: 'من يتلقى بياناتك',
      intro: 'نشارك بياناتك مع مقدمي الخدمات الخارجيين الذين يساعدوننا في تشغيل الموقع وتقديم الخدمات. فيما يلي قائمة المستلمين:',
      google: 'خدمات تحليل المواقع والإعلان عبر الإنترنت',
      meta: 'التتبع والاستهداف الإعلاني على منصات Meta',
      hosting: 'مزود استضافة الخوادم والبنية التحتية الرقمية',
      hostingDesc: 'الموقع مستضاف على خوادم آمنة. تفاصيل المزود تتغير وفق تكوين الاستضافة الحالي.',
      noSale: 'نحن لا نبيع بياناتك الشخصية لأي طرف ثالث.'
    },
    section5: {
      title: 'النقل الدولي للبيانات',
      para1: 'بعض مقدمي الخدمات لدينا موجودون خارج إسرائيل، خاصة في الولايات المتحدة. الولايات المتحدة ليست مصنفة كدولة ذات حماية كافية (adequate) وفق اللوائح الإسرائيلية.',
      para2: 'نحرص على أن يتم نقل البيانات مع إضافة تدابير حماية مناسبة:',
      safeguards: 'تدابير الحماية',
      safeguard1: 'بنود تعاقدية قياسية (SCC) مع كل مزود في أوروبا',
      safeguard2: 'مزودون أمريكيون معتمدون ضمن إطار Data Privacy Framework أو لديهم تدابير حماية معادلة',
      safeguard3: 'نقل مشفر عبر بروتوكولات HTTPS/TLS'
    },
    section6: {
      title: 'فترات الاحتفاظ بالبيانات',
      intro: 'نحتفظ ببياناتك الشخصية فقط طالما كان مطلوبًا للأغراض التي جُمعت من أجلها، ما لم يقتضِ القانون خلاف ذلك:',
      months: 'أشهر',
      days: 'أيام',
      untilUnsubscribe: 'حتى إلغاء الاشتراك أو طلب الحذف',
      contactForm: 'بيانات نموذج الاتصال',
      analytics: 'بيانات التحليل (Google Analytics)',
      marketing: 'بيانات التسويق',
      serverLogs: 'سجلات الخادم (عناوين IP)'
    },
    section7: {
      title: 'عوائد عدم تقديم البيانات',
      mandatory: 'إلزامي بموجب المادة 11',
      contactFormTitle: 'نموذج الاتصال',
      contactFormText: 'تقديم الاسم وعنوان البريد الإلكتروني في النموذج طوعي. ومع ذلك، إذا لم تقدمهما، لن نتمكن من الرد على استفسارك.',
      cookiesTitle: 'ملفات تعريف الارتباط',
      cookiesText: 'يمكنك رفض ملفات تعريف الارتباط للتحليل والتسويق. سيستمر الموقع في العمل بالكامل — سيتم تعطيل وظائف التتبع فقط.'
    },
    section8: {
      title: 'حقوقك بموجب قانون حماية الخصوصية',
      intro: 'بموجب قانون حماية الخصوصية، يحق لك الوعي ببياناتك وتصحيحها وحذفها. فيما يلي حقوقك الرئيسية:',
      right1: { title: 'حق الوصول', desc: 'يمكنك طلب نسخة من جميع بياناتك الشخصية لدينا.' },
      right2: { title: 'حق التصحيح', desc: 'يمكنك طلب تصحيح البيانات غير الدقيقة أو القديمة.' },
      right3: { title: 'حق الحذف', desc: 'يمكنك طلب حذف البيانات عندما لم تعد مطلوبة للغرض الذي جُمعت من أجله.' },
      right4: { title: 'حق الاعتراض', desc: 'يمكنك الاعتراض على استخدام البيانات لأغراض التسويق المباشر.' },
      right5: { title: 'حق سحب الموافقة', desc: 'يمكنك سحب موافقتك في أي وقت، دون التأثير على المعالجة التي تمت قبل ذلك.' },
      howToExercise: 'كيف تمارس حقوقك',
      emailUs: 'أرسل بريدًا إلكترونيًا إلى',
      responseTime: 'وقت الاستجابة',
      within30Days: 'خلال 30 يومًا من استلام الطلب'
    },
    section9: {
      title: 'الحق في تقديم شكوى للهيئة',
      intro: 'إذا كنت تعتقد أن حقوق الخصوصية الخاصة بك قد انتُهكت، يمكنك تقديم شكوى إلى هيئة حماية الخصوصية (PPA):',
      address: 'شارع كنفي نيشاريم 66، القدس، إسرائيل',
      website: 'gov.il/en/departments/the_privacy_protection_authority'
    },
    section10: {
      title: 'ملفات تعريف الارتباط',
      intro: 'نستخدم ثلاث فئات من ملفات تعريف الارتباط. انقر فوق كل فئة لمعرفة المزيد:',
      necessary: {
        title: 'ملفات تعريف الارتباط الضرورية',
        desc: 'ضرورية لعمل الموقع. بدونها، لن تعمل بعض الميزات. دائمًا مفعلة.'
      },
      analytics: {
        title: 'ملفات تعريف الارتباط للتحليل',
        desc: 'تساعدنا على فهم كيفية استخدام المستخدمين للموقع. يمكن تعطيلها.'
      },
      marketing: {
        title: 'ملفات تعريف الارتباط للتسويق',
        desc: 'تستخدم لعرض الإعلانات ذات الصلة. يمكن تعطيلها.'
      },
      changePref: 'لتغيير تفضيلات ملفات تعريف الارتباط، انقر فوق',
      cookieBanner: 'بانر ملفات تعريف الارتباط أسفل الصفحة'
    },
    section11: {
      title: 'القرارات الآلية والذكاء الاصطناعي',
      content: 'نحن لا نتخذ قرارات آلية أو نستخدم الذكاء الاصطناعي تؤثر عليك بشكل كبير بناءً على بياناتك الشخصية.'
    },
    section12: {
      title: 'أمان البيانات',
      encryption: 'التشفير أثناء النقل',
      encryptionDesc: 'جميع البيانات تُنقل عبر بروتوكول HTTPS/SSL المشفر.',
      accessControl: 'التحكم في الوصول',
      accessControlDesc: 'فقط الموظفون المصرح لهم يمكنهم الوصول إلى البيانات الشخصية.',
      breach: 'إجراء في حالة تسريب البيانات',
      breachDesc: 'في حالة تسريب بيانات كبير، سنُبلغ المستخدمين المتأثرين وهيئة حماية الخصوصية خلال 72 ساعة من اكتشاف التسريب.'
    },
    section13: {
      title: 'تحديثات السياسة',
      para1: 'قد نقوم بتحديث هذه السياسة من وقت لآخر. تاريخ آخر تحديث معروض أعلاه.',
      para2: 'سيتم إبلاغك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار بارز في الموقع.'
    },
    section14: {
      title: 'ملحق GDPR لسكان الاتحاد الأوروبي والمنطقة الاقتصادية الأوروبية',
      notice: 'ينطبق هذا القسم فقط على المقيمين في أوروبا الموجودين في الاتحاد الأوروبي (EU) أو المنطقة الاقتصادية الأوروبية (EEA) أو المملكة المتحدة عند جمع البيانات.',
      intro: 'اللائحة العامة لحماية البيانات (GDPR) توفر حماية إضافية لبياناتك الشخصية. فيما يلي الحقوق والأساس القانوني المطبق عليك كمقيم في أوروبا:',
      legalBasisTitle: 'الأساس القانوني لمعالجة البيانات (المادة 6 من GDPR)',
      table: {
        activity: 'نشاط المعالجة',
        legalBasis: 'الأساس القانوني',
        row1: { activity: 'الرد على الاستفسارات وأمان الموقع', basis: 'المادة 6(1)(ج) - المصلحة المشروعة' },
        row2: { activity: 'ملفات تعريف الارتباط للتحليل (Google Analytics)', basis: 'المادة 6(1)(أ) - الموافقة' },
        row3: { activity: 'ملفات تعريف الارتباط للتسويق (الإعلانات الموجهة)', basis: 'المادة 6(1)(أ) - الموافقة' },
        row4: { activity: 'تحسين الخدمات وتجربة المستخدم', basis: 'المادة 6(1)(و) - المصلحة المشروعة' }
      },
      additionalRightsTitle: 'حقوق إضافية بموجب GDPR',
      rightPortability: 'حق نقل البيانات (المادة 20)',
      rightPortabilityDesc: 'يمكنك طلب بياناتك الشخصية بتنسيق منظم وم可以直接阅读 (JSON/CSV) أو نقلها إلى مزود آخر.',
      rightRestriction: 'حق تقييد المعالجة (المادة 18)',
      rightRestrictionDesc: 'يمكنك طلب تقييد استخدام بياناتك بدلاً من حذفها، على سبيل المثال في حالة نزاع قانوني.',
      supervisoryAuthorityTitle: 'الحق في تقديم شكوى إلى هيئة رقابية محلية',
      supervisoryAuthorityDesc: 'إلى جانب الحق في تقديم شكوى إلى الهيئة الإسرائيلية، بصفتك مقيمًا في أوروبا، لديك أيضًا الحق في تقديم شكوى إلى هيئة الرقابة في دولة الاتحاد التي تقيم فيها:',
      supervisoryAuthority1: 'في ألمانيا: Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)',
      supervisoryAuthority2: 'في فرنسا: Commission Nationale de l\'Informatique et des Libertés (CNIL) — وهيئات مماثلة في جميع دول الاتحاد',
      internationalTransfersTitle: 'النقل الدولي للبيانات خارج أوروبا',
      internationalTransfersDesc: 'قد يتم نقل بياناتك إلى دول خارج أوروبا (مثل إسرائيل والولايات المتحدة). نحن نضمن النقل الآمن:',
      sccDesc: 'النقل خارج أوروبا محمي بواسطة البنود التعاقدية القياسية (Standard Contractual Clauses - SCC) المعتمدة من المفوضية الأوروبية.',
      requestFormTitle: 'نموذج طلب حقوق GDPR',
      requestFormDesc: 'لتقديم طلب للوصول أو التصحيح أو الحذف أو نقل البيانات أو تقييد المعالجة، استخدم نموذج طلب GDPR المخصص:',
      requestFormButton: 'افتح نموذج طلب GDPR',
      responseTime: 'وقت الاستجابة',
      within30Days: 'خلال 30 يومًا من استلام الطلب (المادة 12(3) من GDPR)'
    },
    footerNote: 'تمت كتابة هذه السياسة وفقًا لقانون حماية الخصوصية (5741-1981) المادة 11 والتعديل 13، وإرشادات هيئة حماية الخصوصية يوليو 2022.'
  },
  en: {
    nav: {
      home: 'Home',
      privacy: 'Privacy Policy'
    },
    title: 'Privacy Policy',
    subtitle: 'This policy explains how we collect, use, and protect your personal information.',
    lastUpdated: 'Last Updated',
    readingTime: 'Reading Time',
    minutes: 'minutes',
    language: 'Language',
    tableOfContents: 'Table of Contents',
    toc: {
      introduction: 'Introduction & Data Controller Identity',
      dataCollected: 'What Data We Collect',
      purposeBasis: 'Purpose and Legal Basis',
      dataRecipients: 'Who Receives Your Data',
      internationalTransfer: 'International Data Transfers',
      retention: 'Data Retention Periods',
      consequences: 'Consequences of Not Providing Data',
      yourRights: 'Your Rights Under Israeli Law',
      complaint: 'Right to Complain to the PPA',
      cookies: 'Cookies',
      automatedDecisions: 'Automated Decision-Making and AI',
      security: 'Data Security',
      updates: 'Policy Updates',
      gdprAddendum: 'GDPR Addendum for EU/EEA Residents'
    },
    section1: {
      title: 'Introduction & Data Controller Identity',
      para1: 'Welcome to the Privacy Policy of Shayish Kfar Yassif. We are committed to protecting your privacy and operating in accordance with the Protection of Privacy Law 5741-1981 and Amendment 13 (effective August 14, 2025).',
      controllerTitle: 'Data Controller Details',
      businessName: 'Business Name',
      ownerName: 'Owner Name',
      address: 'Address',
      addressValue: 'Industrial Zone, Kfar Yassif, Israel',
      email: 'Email',
      website: 'Website',
      compliance: 'This policy is written in accordance with the Protection of Privacy Law (5741-1981) and Amendment 13 (August 2025).'
    },
    section2: {
      title: 'What Data We Collect',
      directData: {
        title: 'Data You Provide Directly',
        desc: 'We collect information that you voluntarily provide:',
        item1: 'Full name, email address, and phone number (via contact form or registration)',
        item2: 'Messages and inquiries you send us via the form or email',
        item3: 'Any other information you choose to provide in your correspondence with us'
      },
      autoData: {
        title: 'Data Collected Automatically',
        desc: 'When you visit our website, we collect certain information automatically:',
        noticeLabel: 'Important Notice',
        notice: 'Your IP address is classified as personal data under Amendment 13 to the Privacy Protection Law.',
        item1: 'IP address (classified as personal data under Amendment 13)',
        item2: 'Browser type and version',
        item3: 'Device type (mobile or desktop)',
        item4: 'Pages visited and time spent on site',
        item5: 'Referring website URL'
      },
      thirdPartyData: {
        title: 'Data from Third-Party Tools',
        desc: 'We use paid tools for analytics and marketing. Here is what each one collects:',
        ga4: 'Session data, page views, device info, estimated location. Data is stored on Google servers.',
        facebook: 'Browsing behavior for ad targeting and conversion tracking. Your data may be used for targeted advertising on Meta platforms.',
        googleAds: 'Conversion data and browsing behavior to improve advertising on Google.'
      }
    },
    section3: {
      title: 'Purpose and Legal Basis',
      intro: 'Below are the purposes for which we use your personal data, and the legal basis for each:',
      table: {
        purpose: 'Purpose',
        legalBasis: 'Legal Basis',
        legitimateInterest: 'Legitimate Interest',
        consent: 'Consent',
        row1: { purpose: 'Responding to contact form submissions' },
        row2: { purpose: 'Analytics and website improvement' },
        row3: { purpose: 'Marketing and advertising - showing relevant ads' },
        row4: { purpose: 'Website security and fraud prevention' }
      }
    },
    section4: {
      title: 'Who Receives Your Data',
      intro: 'We share your data with external service providers who help us operate the website and provide services. Here is the list of recipients:',
      google: 'Website analytics and online advertising services',
      meta: 'Tracking and ad targeting on Meta platforms',
      hosting: 'Server hosting and digital infrastructure provider',
      hostingDesc: 'The website is hosted on secure servers. Provider details vary based on current hosting configuration.',
      noSale: 'We do not sell your personal data to any third party.'
    },
    section5: {
      title: 'International Data Transfers',
      para1: 'Some of our service providers are located outside Israel, primarily in the United States. The US is not classified as an adequate country under Israeli regulations.',
      para2: 'We ensure that data transfer is made with appropriate additional safeguards:',
      safeguards: 'Safeguards',
      safeguard1: 'Standard Contractual Clauses (SCC) with each provider in Europe',
      safeguard2: 'US providers approved under Data Privacy Framework or with equivalent safeguards',
      safeguard3: 'Encrypted transfer via HTTPS/TLS protocols'
    },
    section6: {
      title: 'Data Retention Periods',
      intro: 'We retain your personal data only as long as required for the purposes it was collected, unless otherwise required by law:',
      months: 'months',
      days: 'days',
      untilUnsubscribe: 'Until unsubscribe or deletion request',
      contactForm: 'Contact form data',
      analytics: 'Analytics data (Google Analytics)',
      marketing: 'Marketing data',
      serverLogs: 'Server logs (IP addresses)'
    },
    section7: {
      title: 'Consequences of Not Providing Data',
      mandatory: 'MANDATORY under Section 11',
      contactFormTitle: 'Contact Form',
      contactFormText: 'Providing your name and email in the contact form is voluntary. However, if you do not provide them, we cannot respond to your inquiry.',
      cookiesTitle: 'Cookies',
      cookiesText: 'You may decline analytics and marketing cookies. The website will still function fully — only tracking features will be disabled.'
    },
    section8: {
      title: 'Your Rights Under Israeli Law',
      intro: 'Under the Privacy Protection Law, you have the right to be aware of your data, to correct it, and to delete it. Here are your main rights:',
      right1: { title: 'Right of Access', desc: 'You may request a copy of all your personal data we hold.' },
      right2: { title: 'Right of Correction', desc: 'You may request we correct inaccurate or outdated data.' },
      right3: { title: 'Right of Deletion', desc: 'You may request deletion of data when no longer required for the purpose it was collected.' },
      right4: { title: 'Right to Object', desc: 'You may object to the use of your data for direct marketing purposes.' },
      right5: { title: 'Right to Withdraw Consent', desc: 'You may withdraw your consent at any time, without affecting prior processing.' },
      howToExercise: 'How to Exercise Your Rights',
      emailUs: 'Send an email to',
      responseTime: 'Response Time',
      within30Days: 'Within 30 days of receiving the request'
    },
    section9: {
      title: 'Right to Complain to the PPA',
      intro: 'If you believe your privacy rights have been violated, you may file a complaint with the Privacy Protection Authority (PPA):',
      address: '66 Kanfei Nesharim St., Jerusalem, Israel',
      website: 'gov.il/en/departments/the_privacy_protection_authority'
    },
    section10: {
      title: 'Cookies',
      intro: 'We use three categories of cookies. Click on each category to learn more:',
      necessary: {
        title: 'Necessary Cookies',
        desc: 'Essential for the website to function. Without them, certain features will not work. Always active.'
      },
      analytics: {
        title: 'Analytics Cookies',
        desc: 'Help us understand how users use the website. Can be disabled.'
      },
      marketing: {
        title: 'Marketing Cookies',
        desc: 'Used to display relevant advertisements. Can be disabled.'
      },
      changePref: 'To change your cookie preferences, click on the',
      cookieBanner: 'cookie banner at the bottom of the page'
    },
    section11: {
      title: 'Automated Decision-Making and AI',
      content: 'We do not use automated decision-making or artificial intelligence that significantly affects you based on your personal data.'
    },
    section12: {
      title: 'Data Security',
      encryption: 'Encryption in Transit',
      encryptionDesc: 'All data is transmitted via encrypted HTTPS/SSL protocol.',
      accessControl: 'Access Control',
      accessControlDesc: 'Only authorized staff can access personal data.',
      breach: 'Data Breach Procedure',
      breachDesc: 'In the event of a significant data breach, we will notify affected users and the Privacy Protection Authority within 72 hours of discovery.'
    },
    section13: {
      title: 'Policy Updates',
      para1: 'We may update this policy from time to time. The last updated date is shown above.',
      para2: 'Material changes will be communicated to you via email or prominent notice on the website.'
    },
    section14: {
      title: 'GDPR Addendum for European Union and European Economic Area Residents',
      notice: 'This section only applies to residents located in the European Union (EU), European Economic Area (EEA), or United Kingdom at the time of data collection.',
      intro: 'The General Data Protection Regulation (GDPR) provides additional protections for your personal data. Below are your rights and the legal basis that apply to you as a European resident:',
      legalBasisTitle: 'Legal Basis for Data Processing (GDPR Article 6)',
      table: {
        activity: 'Processing Activity',
        legalBasis: 'Legal Basis',
        row1: { activity: 'Responding to inquiries and website security', basis: 'Article 6(1)(c) - Legitimate Interests' },
        row2: { activity: 'Analytics cookies (Google Analytics)', basis: 'Article 6(1)(a) - Consent' },
        row3: { activity: 'Marketing cookies (targeted advertising)', basis: 'Article 6(1)(a) - Consent' },
        row4: { activity: 'Service improvements and user experience', basis: 'Article 6(1)(f) - Legitimate Interests' }
      },
      additionalRightsTitle: 'Additional Rights Under GDPR',
      rightPortability: 'Right to Data Portability (Article 20)',
      rightPortabilityDesc: 'You may request your personal data in a structured, machine-readable format (JSON/CSV) or have it transferred to another provider.',
      rightRestriction: 'Right to Restrict Processing (Article 18)',
      rightRestrictionDesc: 'You may request we restrict the use of your data instead of deleting it, for example during a legal dispute.',
      supervisoryAuthorityTitle: 'Right to Complain to a Local Supervisory Authority',
      supervisoryAuthorityDesc: 'In addition to your right to complain to the Israeli authority, as a European resident you also have the right to complain to the supervisory authority in the EU member state where you reside:',
      supervisoryAuthority1: 'In Germany: Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)',
      supervisoryAuthority2: 'In France: Commission Nationale de l\'Informatique et des Libertés (CNIL) — and equivalent authorities in all EU member states',
      internationalTransfersTitle: 'International Data Transfers Outside Europe',
      internationalTransfersDesc: 'Your data may be transferred to countries outside Europe (such as Israel, USA). We ensure secure transfers:',
      sccDesc: 'Transfers outside Europe are protected by Standard Contractual Clauses (SCC) approved by the European Commission.',
      requestFormTitle: 'GDPR Rights Request Form',
      requestFormDesc: 'To submit a request for access, correction, deletion, data portability, or processing restriction, use the dedicated GDPR request form:',
      requestFormButton: 'Open GDPR Request Form',
      responseTime: 'Response Time',
      within30Days: 'Within 30 days of receiving the request (GDPR Article 12(3))'
    },
    footerNote: 'This policy is written in accordance with the Privacy Protection Law (5741-1981) Section 11 and Amendment 13, and the PPA July 2022 guidelines.'
  },
  ru: {
    nav: {
      home: 'Главная',
      privacy: 'Политика конфиденциальности'
    },
    title: 'Политика конфиденциальности',
    subtitle: 'Эта политика объясняет, как мы собираем, используем и защищаем вашу личную информацию.',
    lastUpdated: 'Последнее обновление',
    readingTime: 'Время чтения',
    minutes: 'минут',
    language: 'Язык',
    tableOfContents: 'Содержание',
    toc: {
      introduction: 'Введение и личность контролера данных',
      dataCollected: 'Какие данные мы собираем',
      purposeBasis: 'Цель и правовая основа',
      dataRecipients: 'Кто получает ваши данные',
      internationalTransfer: 'Международная передача данных',
      retention: 'Сроки хранения данных',
      consequences: 'Последствия непредоставления данных',
      yourRights: 'Ваши права согласно израильскому закону',
      complaint: 'Право на жалобу в PPA',
      cookies: 'Файлы cookie',
      automatedDecisions: 'Автоматические решения и ИИ',
      security: 'Безопасность данных',
      updates: 'Обновления политики',
      gdprAddendum: 'Дополнение GDPR для резидентов ЕЭС/ЕС'
    },
    section1: {
      title: 'Введение и личность контролера данных',
      para1: 'Добро пожаловать в Политику конфиденциальности Шайиш Кфар-Ясиф. Мы обязаны защищать вашу конфиденциальность и действовать в соответствии с Законом о защите конфиденциальности 5741-1981 и поправкой 13 (с 14 августа 2025 года).',
      controllerTitle: 'Данные контролера данных',
      businessName: 'Название бизнеса',
      ownerName: 'Имя владельца',
      address: 'Адрес',
      addressValue: 'Промышленная зона, Кфар-Ясиф, Израиль',
      email: 'Эл. почта',
      website: 'Веб-сайт',
      compliance: 'Эта политика написана в соответствии с Законом о защите конфиденциальности (5741-1981) и поправкой 13 (август 2025).'
    },
    section2: {
      title: 'Какие данные мы собираем',
      directData: {
        title: 'Данные, которые вы предоставляете напрямую',
        desc: 'Мы собираем информацию, которую вы предоставляете добровольно:',
        item1: 'Полное имя, адрес электронной почты и номер телефона (через форму контакта или регистрацию)',
        item2: 'Сообщения и запросы, которые вы отправляете нам через форму или электронную почту',
        item3: 'Любая другая информация, которую вы выбираете для предоставления в вашей переписке с нами'
      },
      autoData: {
        title: 'Данные, собранные автоматически',
        desc: 'Когда вы посещаете наш веб-сайт, мы автоматически собираем определенную информацию:',
        noticeLabel: 'Важное уведомление',
        notice: 'Ваш IP-адрес классифицируется как личные данные согласно поправке 13 к Закону о защите конфиденциальности.',
        item1: 'IP-адрес (классифицируется как личные данные согласно поправке 13)',
        item2: 'Тип и версия браузера',
        item3: 'Тип устройства (мобильный или настольный)',
        item4: 'Посещенные страницы и время на сайте',
        item5: 'URL ссылающегося веб-сайта'
      },
      thirdPartyData: {
        title: 'Данные от сторонних инструментов',
        desc: 'Мы используем платные инструменты для аналитики и маркетинга. Вот что собирает каждый из них:',
        ga4: 'Данные сеанса, просмотры страниц, информация об устройстве, предполагаемое местоположение. Данные хранятся на серверах Google.',
        facebook: 'Поведение при просмотре для таргетинга рекламы и отслеживания конверсий. Ваши данные могут использоваться для таргетированной рекламы на платформах Meta.',
        googleAds: 'Данные конверсии и поведение при просмотре для улучшения рекламы в Google.'
      }
    },
    section3: {
      title: 'Цель и правовая основа',
      intro: 'Ниже приведены цели, для которых мы используем ваши личные данные, и правовая основа для каждой:',
      table: {
        purpose: 'Цель',
        legalBasis: 'Правовая основа',
        legitimateInterest: 'Законный интерес',
        consent: 'Согласие',
        row1: { purpose: 'Ответ на отправки контактной формы' },
        row2: { purpose: 'Аналитика и улучшение веб-сайта' },
        row3: { purpose: 'Маркетинг и реклама - показ релевантных объявлений' },
        row4: { purpose: 'Безопасность веб-сайта и предотвращение мошенничества' }
      }
    },
    section4: {
      title: 'Кто получает ваши данные',
      intro: 'Мы делимся вашими данными с внешними поставщиками услуг, которые помогают нам работать с веб-сайтом и предоставлять услуги. Вот список получателей:',
      google: 'Услуги аналитики веб-сайтов и онлайн-рекламы',
      meta: 'Отслеживание и таргетинг рекламы на платформах Meta',
      hosting: 'Поставщик хостинга серверов и цифровой инфраструктуры',
      hostingDesc: 'Веб-сайт размещен на защищенных серверах. Детали поставщика зависят от текущей конфигурации хостинга.',
      noSale: 'Мы не продаем ваши личные данные третьим лицам.'
    },
    section5: {
      title: 'Международная передача данных',
      para1: 'Некоторые из наших поставщиков услуг находятся за пределами Израиля, в основном в Соединенных Штатах. США не классифицируются как страна с адекватной защитой согласно израильским правилам.',
      para2: 'Мы обеспечиваем передачу данных с соответствующими дополнительными гарантиями:',
      safeguards: 'Гарантии',
      safeguard1: 'Стандартные контрактные положения (SCC) с каждым поставщиком в Европе',
      safeguard2: 'Поставщики из США, одобренные в рамках Data Privacy Framework или с эквивалентными гарантиями',
      safeguard3: 'Зашифрованная передача через протоколы HTTPS/TLS'
    },
    section6: {
      title: 'Сроки хранения данных',
      intro: 'Мы храним ваши личные данные только до тех пор, пока это необходимо для целей, для которых они были собраны, если иное не требуется законом:',
      months: 'месяцев',
      days: 'дней',
      untilUnsubscribe: 'До отмены подписки или запроса на удаление',
      contactForm: 'Данные контактной формы',
      analytics: 'Данные аналитики (Google Analytics)',
      marketing: 'Данные маркетинга',
      serverLogs: 'Журналы сервера (IP-адреса)'
    },
    section7: {
      title: 'Последствия непредоставления данных',
      mandatory: 'ОБЯЗАТЕЛЬНО согласно разделу 11',
      contactFormTitle: 'Контактная форма',
      contactFormText: 'Предоставление вашего имени и адреса электронной почты в контактной форме является добровольным. Однако, если вы их не предоставите, мы не сможем ответить на ваш запрос.',
      cookiesTitle: 'Файлы cookie',
      cookiesText: 'Вы можете отказаться от файлов cookie аналитики и маркетинга. Веб-сайт будет продолжать работать полностью — будут отключены только функции отслеживания.'
    },
    section8: {
      title: 'Ваши права согласно израильскому закону',
      intro: 'Согласно Закону о защите конфиденциальности, вы имеете право знать о своих данных, исправлять их и удалять их. Вот ваши основные права:',
      right1: { title: 'Право на доступ', desc: 'Вы можете запросить копию всех ваших личных данных, которые мы храним.' },
      right2: { title: 'Право на исправление', desc: 'Вы можете запросить исправление неточных или устаревших данных.' },
      right3: { title: 'Право на удаление', desc: 'Вы можете запросить удаление данных, когда они больше не требуются для цели, для которой были собраны.' },
      right4: { title: 'Право на возражение', desc: 'Вы можете возразить против использования ваших данных для целей прямого маркетинга.' },
      right5: { title: 'Право на отзыв согласия', desc: 'Вы можете отозвать свое согласие в любое время, не влияя на предыдущую обработку.' },
      howToExercise: 'Как осуществить ваши права',
      emailUs: 'Отправьте электронное письмо на',
      responseTime: 'Время ответа',
      within30Days: 'В течение 30 дней с момента получения запроса'
    },
    section9: {
      title: 'Право на жалобу в PPA',
      intro: 'Если вы считаете, что ваши права на конфиденциальность были нарушены, вы можете подать жалобу в Управление по защите конфиденциальности (PPA):',
      address: 'ул. Канфей Нешарим, 66, Иерусалим, Израиль',
      website: 'gov.il/en/departments/the_privacy_protection_authority'
    },
    section10: {
      title: 'Файлы cookie',
      intro: 'Мы используем три категории файлов cookie. Нажмите на каждую категорию, чтобы узнать больше:',
      necessary: {
        title: 'Необходимые файлы cookie',
        desc: 'Необходимы для работы веб-сайта. Без них некоторые функции не будут работать. Всегда активны.'
      },
      analytics: {
        title: 'Файлы cookie аналитики',
        desc: 'Помогают нам понять, как пользователи используют веб-сайт. Могут быть отключены.'
      },
      marketing: {
        title: 'Файлы cookie маркетинга',
        desc: 'Используются для отображения релевантной рекламы. Могут быть отключены.'
      },
      changePref: 'Чтобы изменить настройки файлов cookie, нажмите на',
      cookieBanner: 'баннер файлов cookie внизу страницы'
    },
    section11: {
      title: 'Автоматические решения и ИИ',
      content: 'Мы не используем автоматические решения или искусственный интеллект, которые существенно влияют на вас на основе ваших личных данных.'
    },
    section12: {
      title: 'Безопасность данных',
      encryption: 'Шифрование при передаче',
      encryptionDesc: 'Все данные передаются через зашифрованный протокол HTTPS/SSL.',
      accessControl: 'Контроль доступа',
      accessControlDesc: 'Только авторизованный персонал может получить доступ к личным данным.',
      breach: 'Процедура утечки данных',
      breachDesc: 'В случае значительной утечки данных мы уведомим затронутых пользователей и Управление по защите конфиденциальности в течение 72 часов с момента обнаружения.'
    },
    section13: {
      title: 'Обновления политики',
      para1: 'Мы можем время от времени обновлять эту политику. Дата последнего обновления показана выше.',
      para2: 'О существенных изменениях будет сообщено вам по электронной почте или с помощью заметного уведомления на веб-сайте.'
    },
    section14: {
      title: 'Дополнение GDPR для резидентов Европейского союза и Европейской экономической зоны',
      notice: 'Этот раздел применяется только к резидентам, находящимся в Европейском союзе (ЕС), Европейской экономической зоне (ЕЭЗ) или Великобритании во время сбора данных.',
      intro: 'Общий регламент защиты данных (GDPR) предоставляет дополнительную защиту ваших личных данных. Ниже приведены ваши права и правовая основа, применяемые к вам как к резиденту Европы:',
      legalBasisTitle: 'Правовая основа для обработки данных (Статья 6 GDPR)',
      table: {
        activity: 'Деятельность по обработке',
        legalBasis: 'Правовая основа',
        row1: { activity: 'Ответ на запросы и безопасность веб-сайта', basis: 'Статья 6(1)(c) - Законные интересы' },
        row2: { activity: 'Файлы cookie аналитики (Google Analytics)', basis: 'Статья 6(1)(a) - Согласие' },
        row3: { activity: 'Файлы cookie маркетинга (таргетированная реклама)', basis: 'Статья 6(1)(a) - Согласие' },
        row4: { activity: 'Улучшение услуг и пользовательского опыта', basis: 'Статья 6(1)(f) - Законные интересы' }
      },
      additionalRightsTitle: 'Дополнительные права согласно GDPR',
      rightPortability: 'Право на переносимость данных (Статья 20)',
      rightPortabilityDesc: 'Вы можете запросить свои личные данные в структурированном, машиночитаемом формате (JSON/CSV) или передать их другому поставщику.',
      rightRestriction: 'Право на ограничение обработки (Статья 18)',
      rightRestrictionDesc: 'Вы можете запросить ограничение использования ваших данных вместо их удаления, например, во время судебного спора.',
      supervisoryAuthorityTitle: 'Право на жалобу в местный надзорный орган',
      supervisoryAuthorityDesc: 'Помимо права на жалобу в израильский орган, как резидент Европы вы также имеете право подать жалобу в надзорный орган в государстве-члене ЕС, в котором вы проживаете:',
      supervisoryAuthority1: 'В Германии: Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)',
      supervisoryAuthority2: 'Во Франции: Commission Nationale de l\'Informatique et des Libertés (CNIL) — и аналогичные органы во всех государствах-членах ЕС',
      internationalTransfersTitle: 'Международная передача данных за пределы Европы',
      internationalTransfersDesc: 'Ваши данные могут передаваться в страны за пределами Европы (например, Израиль, США). Мы обеспечиваем безопасную передачу:',
      sccDesc: 'Передачи за пределы Европы защищены стандартными контрактными условиями (Standard Contractual Clauses - SCC), утвержденными Европейской комиссией.',
      requestFormTitle: 'Форма запроса прав GDPR',
      requestFormDesc: 'Для подачи запроса на доступ, исправление, удаление, переносимость данных или ограничение обработки используйте специальную форму запроса GDPR:',
      requestFormButton: 'Открыть форму запроса GDPR',
      responseTime: 'Время ответа',
      within30Days: 'В течение 30 дней с момента получения запроса (Статья 12(3) GDPR)'
    },
    footerNote: 'Эта политика написана в соответствии с Законом о защите конфиденциальности (5741-1981) раздел 11 и поправкой 13, а также рекомендациями PPA от июля 2022 года.'
  }
};

export default PrivacyPolicy;
