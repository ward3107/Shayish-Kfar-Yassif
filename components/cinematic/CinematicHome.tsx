import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { CONTACT, whatsappLink } from '../../constants';
import { cinematicCopy, detailPositions, projectImages } from './content';
import { useCinematicScroll } from './useCinematicScroll';
import './CinematicHome.css';

export default function CinematicHome() {
  const { language, t, dir } = useLanguage();
  const c = cinematicCopy[language];
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [look,setLook] = useState(0);
  const [project,setProject] = useState(0);
  const [reduced,setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const chat = whatsappLink(t('whatsapp.default_message'));
  useCinematicScroll(root,reduced);
  useEffect(() => { document.title=t('meta.home_title'); },[t]);
  useEffect(() => {
    const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>setReduced(query.matches);
    query.addEventListener('change',change);
    return ()=>query.removeEventListener('change',change);
  },[]);
  const openProject=(index:number)=>{setProject(index);dialog.current?.showModal();};
  return (
    <div ref={root} className="cinematic-home" data-motion={reduced?'off':'on'} data-design="stone-to-space-static-saw" dir={dir}>
      <section className="ch-hero" aria-label={c.eyebrow}>
        <div className="ch-hero-stage">
          <div className="ch-finish"><img src={projectImages[0]} alt={c.projects[0].title} width="1200" height="1600" /></div>
          <div className="ch-cut"><img src="/cinematic/cutting-still.webp" alt={c.sawAlt} width="1672" height="941" fetchPriority="high" /></div>
          <div className="ch-shade" aria-hidden="true" />
          <div className="ch-intro"><p className="ch-eyebrow">{c.eyebrow}</p><h1>{c.start}</h1><p>{c.tagline}</p></div>
          <div className="ch-reveal"><p className="ch-eyebrow">{c.eyebrow}</p><h2>{c.reveal}</h2><p>{c.revealBody}</p><a className="ch-pill" href="#gallery">{c.selected} <span aria-hidden="true">+</span></a></div>
          <div className="ch-hero-bottom"><span dir="ltr">01 / STONE TO SPACE</span><span>{c.scroll}</span><a href="#gallery">{c.skip}</a></div>
          <div className="ch-track" aria-hidden="true"><i /></div>
        </div>
      </section>
      <div id="gallery" className="ch-section-label"><span>{c.selected}</span><span dir="ltr">SELECTED SPACES / 01—03</span></div>
      {c.projects.map((p,i)=>(
        <section key={i} className={`ch-project ch-tone-${i}`} aria-labelledby={`ch-title-${i}`}>
          <div className="ch-project-stage">
            <div className="ch-project-meta"><span><b dir="ltr">0{i+1}</b> / {p.category}</span><span className="ch-phase"><span>{c.room}</span><span>{c.detail}</span></span></div>
            <div className="ch-composition">
              <div className="ch-project-copy"><p className="ch-eyebrow">{p.title}</p><h2 id={`ch-title-${i}`}>{p.headline}</h2><p>{p.description}</p><button className="ch-text-button" onClick={()=>openProject(i)}>{c.full} +</button></div>
              <button className="ch-photo" onClick={()=>openProject(i)} aria-label={`${c.full}: ${p.title}`}><img src={projectImages[i]} alt={`${p.title} — ${p.category}`} loading="lazy" decoding="async" width="1200" height="1600" /><span>{p.title} <b aria-hidden="true">↗</b></span></button>
              <div className="ch-details" aria-label={c.detailNote}>
                <div><p className="ch-eyebrow">{c.detail}</p><h3>{p.detail}</h3></div>
                <div className="ch-detail-pair">{p.captions.map((caption,j)=><figure key={j}><div><img src={projectImages[i]} alt={caption} loading="lazy" style={{objectPosition:detailPositions[i][j],transformOrigin:detailPositions[i][j]}} /></div><figcaption>{caption}</figcaption></figure>)}</div>
                <small>{c.detailNote}</small>
              </div>
            </div>
            <div className="ch-track" aria-hidden="true"><i /></div>
          </div>
        </section>
      ))}
      <div className="ch-collection-link"><Link to="/gallery" className="ch-pill">{c.all} <span aria-hidden="true">↗</span></Link></div>
      <section className="ch-material" aria-labelledby="ch-material-title">
        <div className="ch-material-image"><img src={projectImages[look]} alt={c.projects[look].title} loading="lazy" width="1200" height="1600" /><span dir="ltr">0{look+1} / 03</span></div>
        <div className="ch-material-copy"><p className="ch-eyebrow">{c.material}</p><h2 id="ch-material-title">{c.materialTitle}</h2><p aria-live="polite">{c.lookDescriptions[look]}</p><div className="ch-looks" role="group" aria-label={c.material}>{c.looks.map((label,i)=><button key={i} aria-pressed={look===i} onClick={()=>setLook(i)}>{label}</button>)}</div><small>{c.real}</small></div>
      </section>
      <section className="ch-craft" aria-labelledby="ch-craft-title">
        <div><p className="ch-eyebrow">{c.craft}</p><h2 id="ch-craft-title">{c.craftTitle}</h2><p>{c.craftBody}</p><a className="ch-text-button" href="/catalog/shayish-kfar-yassif-catalog.pdf" target="_blank" rel="noopener noreferrer">{c.catalog} ↗</a></div>
        <div className="ch-steps">{c.steps.map(([title,body],i)=><details key={`${language}-${i}`} open={i===0}><summary><span dir="ltr">0{i+1}</span>{title}</summary><p>{body}</p></details>)}</div>
      </section>
      <section className="ch-contact" aria-labelledby="ch-contact-title"><img src={projectImages[2]} alt="" loading="lazy" /><div><p className="ch-eyebrow">{c.contactTag}</p><h2 id="ch-contact-title">{c.contactTitle}</h2><div className="ch-contact-row"><a className="ch-pill" href={chat} target="_blank" rel="noopener noreferrer">{c.chat} +</a><a href={`tel:${CONTACT.phoneTel}`} dir="ltr">{CONTACT.phoneDisplay}</a><p>{c.location}</p></div></div></section>
      <div className="ch-motion-control"><button type="button" aria-pressed={reduced} onClick={()=>setReduced(v=>!v)}>{reduced?c.enable:c.reduce}</button></div>
      <dialog ref={dialog} className="ch-dialog" aria-labelledby="ch-dialog-title" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}>
        <button className="ch-close" onClick={()=>dialog.current?.close()}>{c.close} ×</button>
        <div className="ch-dialog-content"><img src={projectImages[project]} alt={c.projects[project].title} /><div><p className="ch-eyebrow">{c.projects[project].category}</p><h2 id="ch-dialog-title">{c.projects[project].title}</h2><p>{c.projects[project].description}</p><a href={chat} className="ch-pill" target="_blank" rel="noopener noreferrer">{c.chat} +</a></div></div>
      </dialog>
    </div>
  );
}
