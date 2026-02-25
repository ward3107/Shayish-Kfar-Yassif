import React, { useEffect } from 'react';
import { PROCESS_STEPS } from '../constants';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Process: React.FC = () => {
  const { t } = useLanguage();

  // Set page title (WCAG 2.4.2 - Unique descriptive page titles)
  useEffect(() => {
    document.title = `${t('process.title')} - The Process | שיש כפר יאסיף - Shayish Kfar Yassif`;
  }, []);

  return (
    <div className="pt-32 pb-20 bg-primary min-h-screen text-light transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24 max-w-3xl mx-auto">
           <h1 className="text-5xl md:text-7xl font-serif text-light mb-6">{t('process.title')}</h1>
           <p className="text-muted font-light text-lg">
            {t('process.subtitle')}
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((step, index) => (
                <div key={index} className="group p-10 border border-neutral-800 hover:border-accent transition-colors duration-500 bg-secondary relative">
                    <div className="text-6xl font-serif text-neutral-500 opacity-20 absolute top-4 right-6 group-hover:text-accent group-hover:opacity-40 transition-all">
                        0{index + 1}
                    </div>
                    <div className="mb-8 text-accent">
                        <step.Icon size={32} strokeWidth={1} />
                    </div>
                    <h3 className="text-2xl font-serif text-light mb-4">{step.title}</h3>
                    <p className="text-muted font-light leading-relaxed">{step.description}</p>
                </div>
            ))}
        </div>

        <div className="mt-32 text-center">
            <h2 className="text-3xl font-serif mb-6 text-light">{t('process.start_project')}</h2>
            <Link to="/contact">
                <Button size="lg" variant="gold">{t('process.book_consultation')}</Button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Process;