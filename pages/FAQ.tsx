import React, { useEffect, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import WhatsAppCTA from '../components/WhatsAppCTA';

/**
 * FAQ page. Two jobs:
 *   1. Answer real questions visitors have (SEO + trust).
 *   2. Emit FAQPage JSON-LD so Google (and AI overviews) can serve the
 *      answers directly as rich results.
 *
 * The Q&A source of truth is the translations file so all four
 * languages stay in sync. This page just renders whatever list the
 * translator returned and mirrors it into structured data.
 */
const FAQ: React.FC = () => {
  const { t, dir } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items: Array<{ q: string; a: string }> = t('faq.items') ?? [];

  useEffect(() => {
    document.title = `${t('faq.title')} | שיש כפר יאסיף - Shayish Kfar Yassif`;
  }, [t]);

  // Inject FAQPage schema. Removed on unmount so it doesn't leak into
  // other routes and confuse Google.
  useEffect(() => {
    if (!Array.isArray(items) || items.length === 0) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
    script.setAttribute('data-page', 'faq');
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [items]);

  const chevronRotationClass = (isOpen: boolean) => {
    if (isOpen) return 'rotate-180';
    return dir === 'rtl' ? '-rotate-90' : 'rotate-0';
  };

  return (
    <div className="pt-32 pb-20 bg-primary min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-16 border-b border-neutral-800 pb-8">
          <div className="inline-flex items-center gap-2 text-accent text-xs uppercase tracking-widest mb-4">
            <HelpCircle size={14} />
            <span>{t('faq.eyebrow')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-light mb-4">{t('faq.title')}</h1>
          <p className="text-muted font-light max-w-2xl">{t('faq.subtitle')}</p>
        </header>

        <div className="divide-y divide-neutral-800 border-t border-b border-neutral-800">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="w-full flex items-center justify-between text-start gap-6 py-6 md:py-8 group"
                >
                  <span className="text-lg md:text-xl font-serif text-light group-hover:text-accent transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-accent shrink-0 transition-transform duration-300 ${chevronRotationClass(isOpen)}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  hidden={!isOpen}
                  className="pb-8 pe-10 text-muted leading-relaxed font-light"
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fallback CTA — questions we didn't answer go straight to WhatsApp */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6 border-t border-neutral-800 pt-12">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted mb-2">{t('faq.still_asking')}</div>
            <p className="text-light text-lg font-serif max-w-xl">{t('faq.still_asking_desc')}</p>
          </div>
          <WhatsAppCTA variant="inline" />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
