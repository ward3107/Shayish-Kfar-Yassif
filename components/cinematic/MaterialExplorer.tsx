import React, { useEffect, useId, useRef, useState } from 'react';
import { Layers3, RotateCcw, X } from 'lucide-react';
import type { Language } from '../../translations';
import { imgUrl } from '../../lib/galleryData';
import { retouchedPhoto } from '../../lib/retouchedPhotos';
import { cinematicCopy } from './content';
import { materialCopy, materialLabels, materialViews } from './materialBreakdown';
import './MaterialExplorer.css';

type Props = { project: number; initialView: number; language: Language; reduced: boolean; onClose: () => void };

export default function MaterialExplorer({ project, initialView, language, reduced, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState(initialView);
  const [exploded, setExploded] = useState(reduced);
  const [active, setActive] = useState<number | null>(null);
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const copy = materialCopy[language];
  const projectCopy = cinematicCopy[language].projects[project];
  const views = materialViews[project];
  const current = views[view];
  const publicId = `shayish/gallery/${current.photoId}`;
  const photo = retouchedPhoto(publicId)!;
  const ratio = photo.height / photo.width;
  const canvasHeight = 100 * ratio + 36;
  const source = imgUrl(publicId, 1200);

  useEffect(() => {
    const node = dialog.current!;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      node.close();
      document.body.style.overflow = overflow;
      opener?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    let secondFrame = 0;
    const frame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setExploded(true));
    });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(secondFrame); };
  }, []);

  const selectMaterial = (index: number) => {
    setExploded(true);
    setActive(value => value === index ? null : index);
  };

  return (
    <dialog ref={dialog} className="ch-material-dialog" aria-labelledby={`${instanceId}-title`} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="ch-explorer" data-motion={reduced ? 'off' : 'on'}>
        <header className="ch-explorer-header">
          <div><p>{projectCopy.title}</p><h2 id={`${instanceId}-title`}>{copy.title}</h2></div>
          <button className="ch-explorer-close" type="button" onClick={onClose} aria-label={copy.close} autoFocus><X size={22} /></button>
        </header>
        <div className="ch-explorer-layout">
          <div className="ch-explorer-view">
            <div className="ch-explorer-canvas" data-exploded={exploded} style={{ aspectRatio: `136 / ${canvasHeight}`, '--canvas-ratio': 136 / canvasHeight } as React.CSSProperties}>
              <svg viewBox={`-18 -18 136 ${canvasHeight}`} aria-hidden="true" focusable="false">
                <defs>
                  {current.layers.map((layer, index) => (
                    <mask key={index} id={`${instanceId}-${view}-${index}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100" style={{ maskType: 'luminance' }}>
                      {layer.paths.map((path, i) => <path key={`area-${i}`} d={path} fill="white" />)}
                      {layer.cutouts?.map((path, i) => <path key={`hole-${i}`} d={path} fill="black" />)}
                    </mask>
                  ))}
                </defs>
                <g transform={`scale(1 ${ratio})`}>
                  <image className="ch-explorer-context" href={source} width="100" height="100" preserveAspectRatio="none" />
                  {current.layers.map((layer, index) => (
                    <g key={index} className="ch-explorer-layer" data-muted={active !== null && active !== index} style={{ transform: `translate(${exploded ? layer.offset[0] : 0}px, ${exploded ? layer.offset[1] : 0}px)` }}>
                      <image href={source} width="100" height="100" preserveAspectRatio="none" mask={`url(#${instanceId}-${view}-${index})`} />
                      {layer.paths.map((path, i) => <path key={i} className="ch-explorer-outline" d={path} fill="none" stroke="currentColor" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />)}
                    </g>
                  ))}
                </g>
              </svg>
              {current.layers.map((layer, index) => {
                const [name, part] = materialLabels[layer.material][language];
                return <button key={index} type="button" className="ch-material-pin" aria-label={`${name} — ${part}`} aria-pressed={active === index} tabIndex={exploded ? 0 : -1} disabled={!exploded} onClick={() => selectMaterial(index)} style={{ left: `${(layer.anchor[0] + (exploded ? layer.offset[0] : 0) + 18) / 136 * 100}%`, top: `${((layer.anchor[1] + (exploded ? layer.offset[1] : 0)) * ratio + 18) / canvasHeight * 100}%` }}><strong>{name}</strong><span>{part}</span></button>;
              })}
            </div>
            <button className="ch-explorer-toggle" type="button" aria-pressed={exploded} onClick={() => { setExploded(value => !value); setActive(null); }}>
              {exploded ? <RotateCcw size={18} /> : <Layers3 size={18} />}{exploded ? copy.assemble : copy.explode}
            </button>
          </div>
          <aside className="ch-explorer-info">
            <p className="ch-explorer-hint">{copy.hint}</p>
            <div className="ch-material-list">
              {current.layers.map((layer, index) => {
                const [name, part] = materialLabels[layer.material][language];
                return <button key={index} type="button" aria-pressed={active === index} onClick={() => selectMaterial(index)}><span className={`ch-material-swatch ch-swatch-${layer.material}`} aria-hidden="true" /><span><strong>{name}</strong><small>{part}</small></span><span className="ch-material-select" aria-hidden="true">{active === index ? '−' : '+'}</span></button>;
              })}
            </div>
            <div className="ch-explorer-angles" role="group" aria-label={copy.angles}>
              {views.map((angle, index) => <button type="button" key={angle.photoId} aria-pressed={view === index} onClick={() => { setView(index); setActive(null); }}><img src={imgUrl(`shayish/gallery/${angle.photoId}`, 480)} width="120" height="90" alt="" /><span>{projectCopy.captions[index]}</span></button>)}
            </div>
          </aside>
        </div>
      </div>
    </dialog>
  );
}
