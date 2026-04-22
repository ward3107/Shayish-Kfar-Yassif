import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';

const NotFound: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = '404 - Not Found | שיש כפר יאסיף - Shayish Kfar Yassif';
  }, []);

  return (
    <div className="pt-32 pb-20 bg-primary min-h-screen flex items-center justify-center text-light transition-colors duration-300">
      <div className="container mx-auto px-6 text-center">
        <div className="text-accent text-sm uppercase tracking-widest mb-6">404</div>
        <h1 className="text-5xl md:text-7xl font-serif text-light mb-6">
          {t('notFound.title')}
        </h1>
        <p className="text-muted font-light max-w-md mx-auto mb-12">
          {t('notFound.description')}
        </p>
        <Link to="/">
          <Button variant="gold" size="lg">
            {t('notFound.home')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
