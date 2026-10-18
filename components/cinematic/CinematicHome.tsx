import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { CONTACT, whatsappLink } from '../../constants';
import { cinematicCopy, projectDetailImages, projectDetailPublicIds, projectImages, projectPublicIds } from './content';
import { useCinematicScroll } from './useCinematicScroll';
import { useSlabScroll } from './useSlabScroll';
import { imgSrcSet } from '../../lib/galleryData';
import { localPhoto, localPhotoSrcSet } from '../../lib/localPhotos';
import { homeSlabs, slabNamingCopy } from './slabs';
import { materialCopy } from './materialBreakdown';
import MaterialExplorer from './MaterialExplorer';
import InteractiveVase from './InteractiveVase';
import { SelectionHeart } from '../SelectionControls';
import { selectionCopy } from '../../lib/selectionCopy';
import './CinematicHome.css';

const slabSource = (name: string) => `/stone-slabs/edited/${name}.jpeg`;
const slabImage = (name: string) => localPhoto(slabSource(name));
const slabCopy = {
  he: { title: 'האבן במבט מלא.', intro: 'שלושה עשר לוחות, כל אחד עם תנועה וגוון משלו.', note: 'המחשות חזיתיות; אזורים שהוסתרו בצילום שוחזרו דיגיטלית.', slab: 'לוח', edited: 'הגדלת ההמחשה', jump: 'גלו את הלוחות', gesture: 'החליקו בחופשיות בין הלוחות · לחצו להגדלה' },
  ar: { title: 'الحجر بكامل تفاصيله.', intro: 'ثلاثة عشر لوحًا، لكل منها عروقه ولونه الخاص.', note: 'تصورات أمامية؛ أُعيد بناء الأجزاء المحجوبة رقميًا.', slab: 'لوح', edited: 'تكبير الصورة', jump: 'اكتشفوا الألواح', gesture: 'تصفحوا الألواح بالسحب بحرية · اضغطوا للتكبير' },
  en: { title: 'The whole stone.', intro: 'Thirteen slabs, each with its own movement and colour.', note: 'Front view visualizations; obscured areas were reconstructed digitally.', slab: 'Slab', edited: 'Enlarge view', jump: 'Explore the slabs', gesture: 'Scroll freely through the slabs · Click to enlarge' },
  ru: { title: 'Камень целиком.', intro: 'Тринадцать слэбов, каждый со своим рисунком и оттенком.', note: 'Фронтальные визуализации; скрытые участки восстановлены цифровым способом.', slab: 'Слэб', edited: 'Увеличить', jump: 'Смотреть слэбы', gesture: 'Листайте плиты свободно · Нажмите для увеличения' },
};

export default function CinematicHome() {
  const { language, t, dir } = useLanguage();
  const c = cinematicCopy[language];
  const s = slabCopy[language];
  const naming = slabNamingCopy[language];
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const slabDialog = useRef<HTMLDialogElement>(null);
  const [selectedSlab,setSelectedSlab] = useState(0);
  const selected = homeSlabs[selectedSlab];
  const [look,setLook] = useState(0);
  const [project,setProject] = useState(0);
  const [materialSelection,setMaterialSelection] = useState<{ project: number; view: number } | null>(null);
  const [reduced,setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const slabs = useSlabScroll(reduced);
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
    <div ref={root} className="cinematic-home" data-motion={reduced?'off':'on'} data-design="stone-texture-hero" dir={dir}>
      <section className="ch-hero" aria-label={c.eyebrow}>
        <div className="ch-hero-stage">
          <div className="ch-stone-next" aria-hidden="true"><picture><source media="(max-width:750px)" srcSet={localPhotoSrcSet("/cinematic/hero-copper-sculpture-mobile.webp") || localPhoto("/cinematic/hero-copper-sculpture-mobile.webp")} sizes="100vw" /><img src={localPhoto("/cinematic/hero-copper-sculpture.webp")} srcSet={localPhotoSrcSet("/cinematic/hero-copper-sculpture.webp")} sizes="100vw" alt="" width="1672" height="941" /></picture></div>
          <InteractiveVase language={language} reduced={reduced} />
          <div className="ch-shade" aria-hidden="true" />
          <div className="ch-intro"><p className="ch-eyebrow">{c.eyebrow}</p><h1>{c.start}</h1><p>{c.tagline}</p><div className="ch-hero-actions"><a className="ch-pill" href="#slabs">{s.jump} <span aria-hidden="true">+</span></a><a className="ch-text-button" href={chat} target="_blank" rel="noopener noreferrer">{c.chat}</a></div></div>
          <div className="ch-reveal"><p className="ch-eyebrow">{c.eyebrow}</p><h2>{c.reveal}</h2><p>{c.revealBody}</p><a className="ch-pill" href="#slabs">{s.jump} <span aria-hidden="true">+</span></a></div>
          <div className="ch-hero-bottom"><span dir="ltr">01 / STONE TO SPACE</span><span>{c.scroll}</span><a href="#gallery">{c.skip}</a></div>
          <div className="ch-track" aria-hidden="true"><i /></div>
          <div className="ch-hero-exit" aria-hidden="true" />
        </div>
      </section>
      <section id="slabs" className="ch-slabs" aria-labelledby="ch-slabs-title">
        <div className="ch-slabs-heading"><div><p className="ch-eyebrow">STONE / 01—13</p><h2 id="ch-slabs-title">{s.title}</h2><p>{s.intro}</p></div><small>{s.note}</small></div>
        <p className="ch-selection-hint">♡ {selectionCopy[language].hint}</p>
        <div className="ch-slabs-line" aria-hidden="true" />
        <div className="ch-slabs-arrival">
        <div ref={slabs.stage} className="ch-slabs-stage" data-dragging={slabs.dragging} tabIndex={0} onScroll={slabs.onScroll} onWheel={slabs.onWheel} onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();slabs.goTo(slabs.active+(event.key==='ArrowLeft'?(dir==='rtl'?1:-1):(dir==='rtl'?-1:1)));}}} onPointerDown={slabs.onPointerDown} onPointerMove={slabs.onPointerMove} onPointerUp={slabs.onPointerUp} onPointerCancel={slabs.onPointerCancel} aria-label={s.title} role="region">
          {homeSlabs.map((slab, i) => (
            <figure key={slab.id} className="ch-slab">
              <SelectionHeart item={`s:${slab.id}`} label={slab.name[language]} />
              <button type="button" onClick={()=>{if(!slabs.canOpen())return;setSelectedSlab(i);slabDialog.current?.showModal();}} aria-label={`${s.edited}: ${slab.name[language]} — ${s.slab} ${i+1}`}><img src={slabImage(slab.id)} srcSet={localPhotoSrcSet(slabSource(slab.id))} sizes="(min-width: 751px) 65vw, 88vw" alt={slab.name[language]} loading={Math.abs(i-slabs.active)<=2?'eager':'lazy'} decoding="async" draggable={false} width="1448" height="1086" /></button>
              <figcaption className="ch-slab-caption"><div><strong>{slab.name[language]}</strong>{language !== 'en' && <small><bdi dir="ltr">{slab.tradeName}</bdi></small>}</div><span dir="ltr">{String(i+1).padStart(2,'0')}</span></figcaption>
            </figure>
          ))}
        </div>
        <div className="ch-slabs-meta"><span>{s.gesture}</span><span dir="ltr" aria-live="polite">{String(slabs.active+1).padStart(2,'0')} / {homeSlabs.length}</span></div>
        <p className="ch-slab-naming-note">{naming.note}</p>
        </div>
      </section>
      <dialog ref={slabDialog} className="ch-slab-dialog" onClick={event=>{if(event.target===event.currentTarget)slabDialog.current?.close();}} aria-labelledby="ch-slab-name"><button type="button" className="ch-slab-close" onClick={()=>slabDialog.current?.close()} aria-label={c.close}>×</button><img src={slabImage(selected.id)} srcSet={localPhotoSrcSet(slabSource(selected.id))} sizes="95vw" alt={selected.name[language]} /><div className="ch-slab-caption"><SelectionHeart item={`s:${selected.id}`} label={selected.name[language]} inline /><div><strong id="ch-slab-name">{selected.name[language]}</strong>{language !== 'en' && <small><bdi dir="ltr">{selected.tradeName}</bdi></small>}</div><span dir="ltr">{String(selectedSlab+1).padStart(2,'0')}</span></div></dialog>
      <div id="gallery" className="ch-section-label"><span>{c.selected}</span><span dir="ltr">SELECTED SPACES / 01—03</span></div>
      {c.projects.map((p,i)=>(
        <section key={i} className={`ch-project ch-tone-${i}`} aria-labelledby={`ch-title-${i}`}>
          <div className="ch-project-stage">
            <div className="ch-project-meta"><span><b dir="ltr">0{i+1}</b> / {p.category}</span><span className="ch-phase"><span>{c.room}</span><span>{c.detail}</span></span></div>
            <div className="ch-composition">
              <div className="ch-project-copy"><p className="ch-eyebrow">{p.title}</p><h2 id={`ch-title-${i}`}>{p.headline}</h2><p>{p.description}</p><button className="ch-text-button" onClick={()=>openProject(i)}>{c.full} +</button></div>
              <div className="ch-photo"><SelectionHeart item={projectPublicIds[i]} label={p.title} /><button className="ch-photo-open" onClick={()=>openProject(i)} aria-label={`${c.full}: ${p.title}`}><img src={projectImages[i]} srcSet={imgSrcSet(projectPublicIds[i], [480, 800, 1200])} sizes="(min-width: 751px) 60vw, 100vw" alt={`${p.title} — ${p.category}`} loading="lazy" decoding="async" width="1200" height="1600" /><span className="ch-photo-caption">{p.title} <b aria-hidden="true">↗</b></span></button></div>
              <div className="ch-details" aria-label={c.detailNote}>
                <div><p className="ch-eyebrow">{c.detail}</p><h3>{p.detail}</h3></div>
                <div className="ch-detail-pair">{p.captions.map((caption,j)=><figure key={j}><SelectionHeart item={projectDetailPublicIds[i][j]} label={`${p.title} — ${caption}`} /><button type="button" onClick={()=>setMaterialSelection({project:i,view:j})} aria-haspopup="dialog" aria-label={`${materialCopy[language].open}: ${p.title} — ${caption}`}><img src={projectDetailImages[i][j]} srcSet={imgSrcSet(projectDetailPublicIds[i][j], [480, 800])} sizes="(min-width: 751px) 18vw, 24vw" alt={`${p.title} — ${caption}`} loading="lazy" decoding="async" /><span className="ch-detail-open" aria-hidden="true">+</span></button><figcaption>{caption}</figcaption></figure>)}</div>
                <small>{c.detailNote}</small>
              </div>
            </div>
            <div className="ch-track" aria-hidden="true"><i /></div>
          </div>
        </section>
      ))}
      <div className="ch-collection-link"><Link to="/gallery" className="ch-pill">{c.all} <span aria-hidden="true">↗</span></Link></div>
      <section className="ch-material" aria-labelledby="ch-material-title">
        <div className="ch-material-image"><SelectionHeart item={projectPublicIds[look]} label={c.projects[look].title} /><img src={projectImages[look]} srcSet={imgSrcSet(projectPublicIds[look], [480, 800, 1200])} sizes="(min-width: 751px) 50vw, 100vw" alt={c.projects[look].title} loading="lazy" width="1200" height="1600" /><span dir="ltr">0{look+1} / 03</span></div>
        <div className="ch-material-copy"><p className="ch-eyebrow">{c.material}</p><h2 id="ch-material-title">{c.materialTitle}</h2><p aria-live="polite">{c.lookDescriptions[look]}</p><div className="ch-looks" role="group" aria-label={c.material}>{c.looks.map((label,i)=><button key={i} aria-pressed={look===i} onClick={()=>setLook(i)}>{label}</button>)}</div><small>{c.real}</small></div>
      </section>
      <section className="ch-craft" style={{ '--craft-photo': `url("${localPhoto('/cinematic/cutting-still.webp')}")` } as React.CSSProperties} aria-labelledby="ch-craft-title">
        <div><p className="ch-eyebrow">{c.craft}</p><h2 id="ch-craft-title">{c.craftTitle}</h2><p>{c.craftBody}</p><a className="ch-text-button" href="/catalog/shayish-kfar-yassif-catalog-v2.pdf" target="_blank" rel="noopener noreferrer">{c.catalog} ↗</a></div>
        <div className="ch-steps">{c.steps.map(([title,body],i)=><details key={`${language}-${i}`} open={i===0}><summary><span dir="ltr">0{i+1}</span>{title}</summary><p>{body}</p></details>)}</div>
      </section>
      <section className="ch-contact" aria-labelledby="ch-contact-title"><img src={projectImages[2]} srcSet={imgSrcSet(projectPublicIds[2], [480, 800, 1200])} sizes="100vw" alt="" loading="lazy" /><div><p className="ch-eyebrow">{c.contactTag}</p><h2 id="ch-contact-title">{c.contactTitle}</h2><div className="ch-contact-row"><a className="ch-pill" href={chat} target="_blank" rel="noopener noreferrer">{c.chat} +</a><a href={`tel:${CONTACT.phoneTel}`} dir="ltr">{CONTACT.phoneDisplay}</a><p>{c.location}</p></div></div></section>
      <div className="ch-motion-control"><button type="button" aria-pressed={reduced} onClick={()=>setReduced(v=>!v)}>{reduced?c.enable:c.reduce}</button></div>
      {materialSelection && <MaterialExplorer project={materialSelection.project} initialView={materialSelection.view} language={language} reduced={reduced} onClose={()=>setMaterialSelection(null)} />}
      <dialog ref={dialog} className="ch-dialog" aria-labelledby="ch-dialog-title" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}>
        <button className="ch-close" onClick={()=>dialog.current?.close()}>{c.close} ×</button>
        <div className="ch-dialog-content"><img src={projectImages[project]} srcSet={imgSrcSet(projectPublicIds[project], [640, 960, 1200])} sizes="(min-width: 751px) 64vw, 100vw" alt={c.projects[project].title} /><div><p className="ch-eyebrow">{c.projects[project].category}</p><h2 id="ch-dialog-title">{c.projects[project].title}</h2><SelectionHeart item={projectPublicIds[project]} label={c.projects[project].title} inline /><p>{c.projects[project].description}</p><a href={chat} className="ch-pill" target="_blank" rel="noopener noreferrer">{c.chat} +</a></div></div>
      </dialog>
    </div>
  );
}
