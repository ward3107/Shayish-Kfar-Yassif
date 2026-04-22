import React, { useState, useEffect } from 'react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

type FilterType = 'All' | 'Modern' | 'Classic' | 'Luxury';

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('All');
  const { t } = useLanguage();

  // Set page title (WCAG 2.4.2 - Unique descriptive page titles)
  useEffect(() => {
    document.title = `${t('gallery.title')} - Collections | שיש כפר יאסיף - Shayish Kfar Yassif`;
  }, []);

  const filteredProjects = filter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter);

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'All', label: t('gallery.filter_all') },
    { key: 'Modern', label: t('gallery.filter_modern') },
    { key: 'Classic', label: t('gallery.filter_classic') },
    { key: 'Luxury', label: t('gallery.filter_luxury') }
  ];

  return (
    <div className="pt-32 pb-20 bg-primary min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-neutral-800 pb-8">
          <div>
             <h1 className="text-5xl md:text-7xl font-serif text-light mb-4">{t('gallery.title')}</h1>
             <p className="text-muted font-light max-w-md">{t('gallery.subtitle')}</p>
          </div>

          {/* Filters */}
          <div className="flex gap-8 mt-8 md:mt-0" role="group" aria-label="Filter projects by category">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                aria-pressed={filter === option.key}
                className={`text-sm uppercase tracking-widest transition-all pb-1 border-b-2 ${
                  filter === option.key
                    ? 'text-light border-accent'
                    : 'text-muted border-transparent hover:text-light'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {filteredProjects.map((project, index) => (
            <article key={project.id} className={`group relative aspect-[3/4] overflow-hidden cursor-pointer ${index % 2 === 0 ? 'mt-0' : 'lg:mt-12'}`}>
              <img
                src={project.image}
                alt={`${project.title} - ${project.category} kitchen design. ${project.description}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>

              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-accent text-xs uppercase tracking-widest mb-1">{project.category}</div>
                <h3 className="text-2xl font-serif text-white">{project.title}</h3>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;