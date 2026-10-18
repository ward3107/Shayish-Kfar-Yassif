import React from 'react';
import { Heart, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelection, useSelections } from '../contexts/SelectionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { selectionCopy, selectionCountLabel } from '../lib/selectionCopy';
import './Selections.css';

export function SelectionHeart({ item, label, inline = false }: { item: string; label: string; inline?: boolean }) {
  const { selected, full, toggle } = useSelection(item);
  const { language } = useLanguage();
  const c = selectionCopy[language];
  return <button type="button" className={`selection-heart${inline ? ' selection-heart-inline' : ''}`} aria-pressed={selected} aria-label={`${selected ? c.remove : c.add}: ${label}`} title={full ? c.limit : selected ? c.remove : c.add} disabled={full} onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); toggle(); }}>
    <Heart size={21} fill={selected ? 'currentColor' : 'none'} aria-hidden="true" />
  </button>;
}

export function SelectionBar() {
  const { refs } = useSelections();
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const c = selectionCopy[language];
  if (!refs.length || pathname === '/favorites') return null;
  return <Link className="selection-bar" to="/favorites">
    <Heart size={21} fill="currentColor" aria-hidden="true" />
    <span><strong>{c.title}</strong><small aria-live="polite">{refs.length} {selectionCountLabel(language, refs.length)}</small></span>
    <span className="selection-bar-action">{c.review}<ArrowUpRight size={17} aria-hidden="true" /></span>
  </Link>;
}
